import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { DashboardStats, EnquiryService } from './EnquiryService';
import {
  CustomerEnquiryInput,
  Enquiry,
  EnquiryFilterOptions,
  EnquiryStatus,
  InternalNote,
} from '../../types/enquiry';
import { firebaseTrafficService } from '../analytics/FirebaseTrafficService';

const ENQUIRIES_CACHE_KEY = 'sri_caterers_firebase_enquiries_cache';

/**
 * Strips unsupported undefined values so Firestore setDoc / updateDoc never throws:
 * "Unsupported field value: undefined"
 */
export function cleanFirestoreData<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value.constructor && value.constructor.name === 'FieldValue')
    ) {
      result[key] = cleanFirestoreData(value);
    } else {
      result[key] = value;
    }
  }
  return result as Partial<T>;
}

/**
 * Normalizes Firestore document into standardized, type-safe Enquiry object
 */
export function normalizeEnquiryDoc(id: string, data: any): Enquiry {
  const getIsoString = (val: any): string => {
    if (!val) return new Date().toISOString();
    if (typeof val === 'string') return val;
    if (typeof val.toDate === 'function') {
      try {
        return val.toDate().toISOString();
      } catch {
        return new Date().toISOString();
      }
    }
    if (typeof val === 'object' && val.seconds) {
      return new Date(val.seconds * 1000).toISOString();
    }
    return new Date().toISOString();
  };

  const rawGuests = Number(data.guestCount);
  const validGuestCount = !isNaN(rawGuests) && rawGuests > 0 ? rawGuests : 0;
  const rawLocation = typeof data.eventLocation === 'string' ? data.eventLocation.trim() : '';

  return {
    id: data.id || id,
    customerName: data.customerName || 'Valued Customer',
    mobileNumber: data.mobileNumber || '',
    email: data.email?.trim() || undefined,
    eventType: data.eventType?.trim() || 'General Catering Enquiry',
    eventDate: data.eventDate?.trim() || '',
    guestCount: validGuestCount,
    eventLocation: rawLocation,
    cateringService: data.cateringService?.trim() || undefined,
    mealPreference: data.mealPreference || 'Both',
    preferredContactMethod: data.preferredContactMethod || 'Phone Call',
    message: data.message?.trim() || undefined,
    status: (data.status as EnquiryStatus) || 'New',
    isViewed: Boolean(data.isViewed),
    viewedAt: data.viewedAt ? getIsoString(data.viewedAt) : undefined,
    viewedByAdminName: data.viewedByAdminName,
    assignedAdminUid: data.assignedAdminUid,
    assignedAdminName: data.assignedAdminName,
    internalNotes: Array.isArray(data.internalNotes) ? data.internalNotes : [],
    auditLogs: Array.isArray(data.auditLogs) ? data.auditLogs : [],
    createdAt: getIsoString(data.createdAt || data.serverCreatedAt),
    updatedAt: getIsoString(data.updatedAt || data.serverUpdatedAt),
    isArchived: Boolean(data.isArchived),
  };
}

/**
 * Official Firebase Firestore Service for Customer Enquiries & Lead Management
 * - Collects leads from website public pages
 * - Stores reliably in Firestore 'enquiries' collection via Backend API + Direct SDK
 * - Provides real-time synchronization to the Admin Console
 */
export class FirebaseEnquiryService implements EnquiryService {
  private getLocalCache(): Enquiry[] {
    try {
      const raw = localStorage.getItem(ENQUIRIES_CACHE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => normalizeEnquiryDoc(item.id, item));
      }
      return [];
    } catch {
      return [];
    }
  }

  private setLocalCache(items: Enquiry[]): void {
    try {
      localStorage.setItem(ENQUIRIES_CACHE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota errors
    }
  }

  /**
   * Dual-engine enquiry submission:
   * 1. Submits to Backend API endpoint (/api/enquiries)
   * 2. Persists directly to Cloud Firestore collection 'enquiries'
   * 3. Syncs local cache and broadcasts real-time update
   */
  async createEnquiry(input: CustomerEnquiryInput): Promise<Enquiry> {
    const timestamp = new Date().toISOString();
    const nextSeq = Math.floor(1000 + Math.random() * 9000);
    const newId = `ENQ-${new Date().getFullYear()}-${nextSeq}`;

    const guestNum = input.guestCount && Number(input.guestCount) > 0 ? Number(input.guestCount) : 0;

    let newEnquiry: Enquiry = {
      id: newId,
      customerName: input.customerName.trim(),
      mobileNumber: input.mobileNumber.replace(/[^\d+]/g, '').trim(),
      email: input.email?.trim() || undefined,
      eventType: input.eventType?.trim() || 'General Catering Enquiry',
      eventDate: input.eventDate?.trim() || '',
      guestCount: guestNum,
      eventLocation: input.eventLocation?.trim() || '',
      cateringService: input.cateringService?.trim() || undefined,
      mealPreference: input.mealPreference || 'Both',
      preferredContactMethod: input.preferredContactMethod || 'Phone Call',
      message: input.message?.trim() || undefined,
      status: 'New',
      isViewed: false,
      internalNotes: [],
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp,
          adminUid: 'customer-portal',
          adminName: 'Customer Web Portal',
          action: 'Enquiry Submitted',
          details: `Submitted online by ${input.customerName}`,
        },
      ],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    let backendSuccess = false;

    // 1. Try Backend API endpoint
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.enquiry) {
          newEnquiry = normalizeEnquiryDoc(json.enquiryId || newId, json.enquiry);
          backendSuccess = true;
          console.log('[EnquiryService] Backend API successfully stored enquiry:', newEnquiry.id);
        }
      }
    } catch (apiErr) {
      console.warn('[EnquiryService] Backend API call notice (falling back to direct Firestore SDK):', apiErr);
    }

    // 2. Direct Firestore Client SDK Persist (Guarantees persistence even if API proxy bypassed)
    try {
      const firestorePayload = cleanFirestoreData({
        ...newEnquiry,
        serverCreatedAt: serverTimestamp(),
        serverUpdatedAt: serverTimestamp(),
      });

      await setDoc(doc(db, 'enquiries', newEnquiry.id), firestorePayload);
      console.log('[EnquiryService] Direct Firestore SDK successfully persisted enquiry:', newEnquiry.id);
      backendSuccess = true;
    } catch (firestoreErr) {
      console.warn('[EnquiryService] Direct Firestore write notice:', firestoreErr);
    }

    // 3. Update local cache immediately for instant UI responsiveness
    const cached = this.getLocalCache();
    const updatedCache = [newEnquiry, ...cached.filter((item) => item.id !== newEnquiry.id)];
    this.setLocalCache(updatedCache);

    // 4. Record real-time analytics event
    try {
      firebaseTrafficService.recordEvent('enquiry_submitted', `${newEnquiry.id} (${newEnquiry.eventType})`);
    } catch {
      // non-blocking
    }

    // 5. Dispatch browser custom event for instant cross-component synchronization
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sri_caterers_enquiry_submitted', { detail: newEnquiry })
      );
    }

    return newEnquiry;
  }

  async getEnquiries(filters?: EnquiryFilterOptions): Promise<Enquiry[]> {
    let items: Enquiry[] = [];

    // 1. Attempt reading from Cloud Firestore directly
    try {
      const querySnapshot = await getDocs(collection(db, 'enquiries'));
      if (!querySnapshot.empty) {
        items = querySnapshot.docs.map((docSnap) =>
          normalizeEnquiryDoc(docSnap.id, docSnap.data())
        );
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.setLocalCache(items);
      } else {
        // If empty Firestore, fallback to local cache if present
        const local = this.getLocalCache();
        items = local;
      }
    } catch (err) {
      console.warn('Firestore direct fetch notice, attempting Backend API endpoint:', err);
      // 2. Fallback to Backend API endpoint
      try {
        const res = await fetch('/api/enquiries');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.enquiries)) {
            items = json.enquiries.map((e: any) => normalizeEnquiryDoc(e.id, e));
            this.setLocalCache(items);
          } else {
            items = this.getLocalCache();
          }
        } else {
          items = this.getLocalCache();
        }
      } catch {
        items = this.getLocalCache();
      }
    }

    if (!filters) return items;

    // Apply Filters
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      items = items.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.customerName.toLowerCase().includes(q) ||
          i.mobileNumber.includes(q) ||
          (i.email && i.email.toLowerCase().includes(q)) ||
          (i.eventLocation && i.eventLocation.toLowerCase().includes(q))
      );
    }

    if (filters.status && filters.status !== 'All') {
      items = items.filter((i) => i.status === filters.status);
    }

    if (filters.eventType && filters.eventType !== 'All') {
      items = items.filter((i) => i.eventType === filters.eventType);
    }

    if (filters.assignedAdminUid && filters.assignedAdminUid !== 'All') {
      items = items.filter((i) => i.assignedAdminUid === filters.assignedAdminUid);
    }

    if (filters.dateFrom) {
      items = items.filter((i) => i.eventDate && i.eventDate >= (filters.dateFrom as string));
    }
    if (filters.dateTo) {
      items = items.filter((i) => i.eventDate && i.eventDate <= (filters.dateTo as string));
    }

    return items;
  }

  async getEnquiryById(id: string): Promise<Enquiry | null> {
    try {
      const docSnap = await getDoc(doc(db, 'enquiries', id));
      if (docSnap.exists()) {
        return normalizeEnquiryDoc(docSnap.id, docSnap.data());
      }
    } catch (err) {
      console.warn('Firestore getDoc notice:', err);
    }

    const cached = this.getLocalCache();
    return cached.find((i) => i.id === id) || null;
  }

  async updateEnquiryStatus(
    id: string,
    status: EnquiryStatus,
    adminUid: string,
    adminName: string
  ): Promise<Enquiry> {
    const existing = await this.getEnquiryById(id);
    if (!existing) throw new Error(`Enquiry ${id} not found.`);

    const timestamp = new Date().toISOString();
    const updated: Enquiry = {
      ...existing,
      status,
      updatedAt: timestamp,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp,
          adminUid,
          adminName,
          action: 'Status Changed',
          details: `Changed from "${existing.status}" to "${status}"`,
        },
        ...existing.auditLogs,
      ],
    };

    // Update local cache
    const cached = this.getLocalCache();
    const idx = cached.findIndex((i) => i.id === id);
    if (idx !== -1) cached[idx] = updated;
    else cached.unshift(updated);
    this.setLocalCache(cached);

    // Update Firestore
    try {
      await updateDoc(
        doc(db, 'enquiries', id),
        cleanFirestoreData({
          status,
          updatedAt: timestamp,
          auditLogs: updated.auditLogs,
          serverUpdatedAt: serverTimestamp(),
        })
      );
    } catch (err) {
      console.warn('Firestore update status notice:', err);
    }

    return updated;
  }

  async addInternalNote(
    id: string,
    noteText: string,
    adminUid: string,
    adminName: string
  ): Promise<Enquiry> {
    const existing = await this.getEnquiryById(id);
    if (!existing) throw new Error(`Enquiry ${id} not found.`);

    const timestamp = new Date().toISOString();
    const newNote: InternalNote = {
      id: `note-${Date.now()}`,
      adminUid,
      adminName,
      note: noteText.trim(),
      createdAt: timestamp,
    };

    const updated: Enquiry = {
      ...existing,
      updatedAt: timestamp,
      internalNotes: [newNote, ...existing.internalNotes],
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp,
          adminUid,
          adminName,
          action: 'Internal Note Added',
          details: `Added note: "${noteText.slice(0, 30)}..."`,
        },
        ...existing.auditLogs,
      ],
    };

    const cached = this.getLocalCache();
    const idx = cached.findIndex((i) => i.id === id);
    if (idx !== -1) cached[idx] = updated;
    else cached.unshift(updated);
    this.setLocalCache(cached);

    try {
      // 1. Lock note in subcollection 'enquiries/{id}/notes/{noteId}'
      await setDoc(
        doc(db, 'enquiries', id, 'notes', newNote.id),
        cleanFirestoreData({
          id: newNote.id,
          adminUid,
          adminName,
          note: newNote.note,
          createdAt: timestamp,
          serverCreatedAt: serverTimestamp(),
        })
      );

      // 2. Synchronize note and audit log on parent document
      await updateDoc(
        doc(db, 'enquiries', id),
        cleanFirestoreData({
          internalNotes: updated.internalNotes,
          auditLogs: updated.auditLogs,
          updatedAt: timestamp,
          serverUpdatedAt: serverTimestamp(),
        })
      );
    } catch (err) {
      console.warn('Firestore note update notice:', err);
    }

    return updated;
  }

  async assignEnquiry(
    id: string,
    adminUid: string,
    adminName: string,
    updatedByAdminName: string,
    updatedByAdminUid?: string
  ): Promise<Enquiry> {
    const existing = await this.getEnquiryById(id);
    if (!existing) throw new Error(`Enquiry ${id} not found.`);

    const timestamp = new Date().toISOString();
    const updated: Enquiry = {
      ...existing,
      assignedAdminUid: adminUid || undefined,
      assignedAdminName: adminName || undefined,
      updatedAt: timestamp,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp,
          adminUid: updatedByAdminUid || adminUid || 'admin',
          adminName: updatedByAdminName,
          action: 'Staff Assigned',
          details: adminName ? `Assigned handling to ${adminName}` : 'Unassigned enquiry handling',
        },
        ...existing.auditLogs,
      ],
    };

    const cached = this.getLocalCache();
    const idx = cached.findIndex((i) => i.id === id);
    if (idx !== -1) cached[idx] = updated;
    else cached.unshift(updated);
    this.setLocalCache(cached);

    try {
      await updateDoc(
        doc(db, 'enquiries', id),
        cleanFirestoreData({
          assignedAdminUid: adminUid || '',
          assignedAdminName: adminName || '',
          auditLogs: updated.auditLogs,
          updatedAt: timestamp,
          serverUpdatedAt: serverTimestamp(),
        })
      );
    } catch (err) {
      console.warn('Firestore assignment notice:', err);
    }

    return updated;
  }

  async archiveEnquiry(
    id: string,
    isArchived: boolean,
    adminUid: string,
    adminName: string
  ): Promise<Enquiry> {
    const existing = await this.getEnquiryById(id);
    if (!existing) throw new Error(`Enquiry ${id} not found.`);

    const timestamp = new Date().toISOString();
    const updated: Enquiry = {
      ...existing,
      isArchived,
      updatedAt: timestamp,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp,
          adminUid,
          adminName,
          action: isArchived ? 'Enquiry Archived' : 'Enquiry Restored',
          details: isArchived ? 'Moved to archived storage' : 'Restored to active workflow',
        },
        ...existing.auditLogs,
      ],
    };

    const cached = this.getLocalCache();
    const idx = cached.findIndex((i) => i.id === id);
    if (idx !== -1) cached[idx] = updated;
    this.setLocalCache(cached);

    try {
      await updateDoc(
        doc(db, 'enquiries', id),
        cleanFirestoreData({
          isArchived,
          updatedAt: timestamp,
          auditLogs: updated.auditLogs,
          serverUpdatedAt: serverTimestamp(),
        })
      );
    } catch (err) {
      console.warn('Firestore archive notice:', err);
    }

    return updated;
  }

  async deleteEnquiry(id: string, _adminUid: string, _adminName: string): Promise<boolean> {
    const cached = this.getLocalCache().filter((i) => i.id !== id);
    this.setLocalCache(cached);

    try {
      await deleteDoc(doc(db, 'enquiries', id));
    } catch (err) {
      console.warn('Firestore delete notice:', err);
    }

    return true;
  }

  async markAsViewed(id: string, adminUid: string, adminName: string): Promise<Enquiry> {
    const existing = await this.getEnquiryById(id);
    if (!existing) throw new Error(`Enquiry with ID ${id} not found.`);

    if (existing.isViewed) return existing;

    const timestamp = new Date().toISOString();
    const updated: Enquiry = {
      ...existing,
      isViewed: true,
      viewedAt: timestamp,
      viewedByAdminName: adminName,
      updatedAt: timestamp,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp,
          adminUid,
          adminName,
          action: 'Enquiry Viewed',
          details: `Viewed in admin console by ${adminName}`,
        },
        ...existing.auditLogs,
      ],
    };

    const cached = this.getLocalCache();
    const idx = cached.findIndex((i) => i.id === id);
    if (idx !== -1) cached[idx] = updated;
    this.setLocalCache(cached);

    try {
      await updateDoc(
        doc(db, 'enquiries', id),
        cleanFirestoreData({
          isViewed: true,
          viewedAt: timestamp,
          viewedByAdminName: adminName,
          updatedAt: timestamp,
          auditLogs: updated.auditLogs,
          serverUpdatedAt: serverTimestamp(),
        })
      );
    } catch (err) {
      console.warn('Firestore markAsViewed notice:', err);
    }

    return updated;
  }

  /**
   * Subscribes to live Firestore 'enquiries' collection updates
   * Also listens to internal window custom events for instant zero-latency UI updates
   */
  subscribeToEnquiries(callback: (enquiries: Enquiry[]) => void): () => void {
    let firestoreUnsubscribe = () => {};

    try {
      firestoreUnsubscribe = onSnapshot(
        collection(db, 'enquiries'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Enquiry[] = [];
            snapshot.forEach((d) => {
              list.push(normalizeEnquiryDoc(d.id, d.data()));
            });
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            this.setLocalCache(list);
            callback(list);
          } else {
            callback(this.getLocalCache());
          }
        },
        (error) => {
          console.warn('Firestore realtime listener notice, using cache:', error);
          callback(this.getLocalCache());
        }
      );
    } catch (err) {
      console.warn('Could not attach Firestore realtime listener:', err);
      callback(this.getLocalCache());
    }

    const localHandler = () => {
      this.getEnquiries().then((items) => callback(items));
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('sri_caterers_enquiry_submitted', localHandler);
    }

    return () => {
      firestoreUnsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('sri_caterers_enquiry_submitted', localHandler);
      }
    };
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const items = await this.getEnquiries();

    const stats: DashboardStats = {
      totalEnquiries: items.length,
      newEnquiries: items.filter((i) => i.status === 'New').length,
      contactedEnquiries: items.filter((i) => i.status === 'Contacted').length,
      followUpEnquiries: items.filter((i) => i.status === 'Follow-up Required').length,
      quotationSentEnquiries: items.filter((i) => i.status === 'Quotation Sent').length,
      confirmedEnquiries: items.filter((i) => i.status === 'Confirmed').length,
      closedEnquiries: items.filter((i) => i.status === 'Closed').length,
      cancelledEnquiries: items.filter((i) => i.status === 'Cancelled').length,
      enquiriesByEventType: {},
      enquiriesByStatus: {
        New: 0,
        Contacted: 0,
        'Follow-up Required': 0,
        'Quotation Sent': 0,
        Confirmed: 0,
        Closed: 0,
        Cancelled: 0,
      },
      recentEnquiries: [...items]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    };

    items.forEach((item) => {
      const eType = item.eventType || 'General Catering';
      stats.enquiriesByEventType[eType] = (stats.enquiriesByEventType[eType] || 0) + 1;
      if (stats.enquiriesByStatus[item.status] !== undefined) {
        stats.enquiriesByStatus[item.status] = (stats.enquiriesByStatus[item.status] || 0) + 1;
      }
    });

    return stats;
  }

  async exportEnquiriesToCsv(filters?: EnquiryFilterOptions): Promise<string> {
    const enquiries = await this.getEnquiries(filters);

    const headers = [
      'Enquiry ID',
      'Customer Name',
      'Mobile Number',
      'Email',
      'Event Type',
      'Event Date',
      'Guest Count',
      'Location',
      'Meal Preference',
      'Status',
      'Assigned Admin',
      'Created Date',
    ];

    const escapeCsv = (str: string | number | undefined) => {
      if (str === undefined || str === null) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = enquiries.map((e) => [
      escapeCsv(e.id),
      escapeCsv(e.customerName),
      escapeCsv(e.mobileNumber),
      escapeCsv(e.email || 'N/A'),
      escapeCsv(e.eventType),
      escapeCsv(e.eventDate),
      escapeCsv(e.guestCount),
      escapeCsv(e.eventLocation),
      escapeCsv(e.mealPreference || 'N/A'),
      escapeCsv(e.status),
      escapeCsv(e.assignedAdminName || 'Unassigned'),
      escapeCsv((e.createdAt || '').split('T')[0] || 'N/A'),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  }
}

export const firebaseEnquiryService = new FirebaseEnquiryService();
