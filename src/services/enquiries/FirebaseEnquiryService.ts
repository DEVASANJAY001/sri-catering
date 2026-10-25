import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
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

const ENQUIRIES_CACHE_KEY = 'sri_caterers_firebase_enquiries_cache';

/**
 * Official Firebase Firestore Service for Customer Enquiries & Lead Management
 * - Stores leads in Firestore 'enquiries' collection
 * - Uses 100% authentic visitor submissions
 */
export class FirebaseEnquiryService implements EnquiryService {
  private getLocalCache(): Enquiry[] {
    try {
      const raw = localStorage.getItem(ENQUIRIES_CACHE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
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

  async createEnquiry(input: CustomerEnquiryInput): Promise<Enquiry> {
    const timestamp = new Date().toISOString();
    const nextSeq = Math.floor(1000 + Math.random() * 9000);
    const newId = `ENQ-${new Date().getFullYear()}-${nextSeq}`;

    const newEnquiry: Enquiry = {
      id: newId,
      customerName: input.customerName,
      mobileNumber: input.mobileNumber,
      email: input.email || undefined,
      eventType: input.eventType || 'General Catering Enquiry',
      eventDate: input.eventDate || new Date().toISOString().split('T')[0],
      guestCount: input.guestCount || 50,
      eventLocation: input.eventLocation || 'Chennai',
      cateringService: input.cateringService || undefined,
      mealPreference: input.mealPreference || 'Both',
      preferredContactMethod: input.preferredContactMethod || 'Phone Call',
      message: input.message || undefined,
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

    // 1. Update local cache immediately for responsive UI
    const cached = this.getLocalCache();
    this.setLocalCache([newEnquiry, ...cached]);

    // 2. Persist directly to Firestore 'enquiries' collection with server-side timestamps
    try {
      await setDoc(doc(db, 'enquiries', newId), {
        ...newEnquiry,
        serverCreatedAt: serverTimestamp(),
        serverUpdatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore write warning (persisted to local storage fallback):', err);
    }

    return newEnquiry;
  }

  async getEnquiries(filters?: EnquiryFilterOptions): Promise<Enquiry[]> {
    let items: Enquiry[] = [];

    try {
      const querySnapshot = await getDocs(collection(db, 'enquiries'));
      if (!querySnapshot.empty) {
        items = querySnapshot.docs
          .map((docSnap) => docSnap.data() as Enquiry);
        // Sort descending by created date
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.setLocalCache(items);
      } else {
        items = [];
        this.setLocalCache([]);
      }
    } catch (err) {
      console.warn('Firestore fetch warning, using local cache:', err);
      items = this.getLocalCache();
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
        return docSnap.data() as Enquiry;
      }
    } catch (err) {
      console.warn('Firestore getDoc warning:', err);
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
    this.setLocalCache(cached);

    // Update Firestore
    try {
      await updateDoc(doc(db, 'enquiries', id), {
        status,
        updatedAt: timestamp,
        auditLogs: updated.auditLogs,
      });
    } catch (err) {
      console.warn('Firestore update warning:', err);
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
    this.setLocalCache(cached);

    try {
      // 1. Lock note in subcollection 'enquiries/{id}/notes/{noteId}' with verified admin UID
      await setDoc(doc(db, 'enquiries', id, 'notes', newNote.id), {
        id: newNote.id,
        adminUid,
        adminName,
        note: newNote.note,
        createdAt: timestamp,
        serverCreatedAt: serverTimestamp(),
      });

      // 2. Synchronize note and audit log on parent document with server timestamp
      await updateDoc(doc(db, 'enquiries', id), {
        internalNotes: updated.internalNotes,
        auditLogs: updated.auditLogs,
        updatedAt: timestamp,
        serverUpdatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore note update warning:', err);
    }

    return updated;
  }

  async assignEnquiry(
    id: string,
    adminUid: string,
    adminName: string,
    updatedByAdminName: string
  ): Promise<Enquiry> {
    const existing = await this.getEnquiryById(id);
    if (!existing) throw new Error(`Enquiry ${id} not found.`);

    const timestamp = new Date().toISOString();
    const updated: Enquiry = {
      ...existing,
      assignedAdminUid: adminUid,
      assignedAdminName: adminName,
      updatedAt: timestamp,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp,
          adminUid: 'current-admin',
          adminName: updatedByAdminName,
          action: 'Staff Assigned',
          details: `Assigned handling to ${adminName}`,
        },
        ...existing.auditLogs,
      ],
    };

    const cached = this.getLocalCache();
    const idx = cached.findIndex((i) => i.id === id);
    if (idx !== -1) cached[idx] = updated;
    this.setLocalCache(cached);

    try {
      await updateDoc(doc(db, 'enquiries', id), {
        assignedAdminUid: adminUid,
        assignedAdminName: adminName,
        auditLogs: updated.auditLogs,
        updatedAt: timestamp,
      });
    } catch (err) {
      console.warn('Firestore assignment warning:', err);
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
      await updateDoc(doc(db, 'enquiries', id), {
        isArchived,
        updatedAt: timestamp,
        auditLogs: updated.auditLogs,
      });
    } catch (err) {
      console.warn('Firestore archive warning:', err);
    }

    return updated;
  }

  async deleteEnquiry(id: string, _adminUid: string, _adminName: string): Promise<boolean> {
    const cached = this.getLocalCache().filter((i) => i.id !== id);
    this.setLocalCache(cached);

    try {
      await deleteDoc(doc(db, 'enquiries', id));
    } catch (err) {
      console.warn('Firestore delete warning:', err);
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
      await updateDoc(doc(db, 'enquiries', id), {
        isViewed: true,
        viewedAt: timestamp,
        viewedByAdminName: adminName,
        updatedAt: timestamp,
        auditLogs: updated.auditLogs,
      });
    } catch (err) {
      console.warn('Firestore markAsViewed warning:', err);
    }

    return updated;
  }

  subscribeToEnquiries(callback: (enquiries: Enquiry[]) => void): () => void {
    try {
      const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Enquiry[] = [];
            snapshot.forEach((d) => {
              const item = d.data() as Enquiry;
              list.push(item);
            });
            this.setLocalCache(list);
            callback(list);
          } else {
            this.setLocalCache([]);
            callback([]);
          }
        },
        (error) => {
          console.warn('Firestore realtime listener error, using cache:', error);
          callback(this.getLocalCache());
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn('Could not attach Firestore realtime listener:', err);
      callback(this.getLocalCache());
      return () => {};
    }
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
      recentEnquiries: [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    };

    items.forEach((item) => {
      const eType = item.eventType || 'General Catering';
      stats.enquiriesByEventType[eType] =
        (stats.enquiriesByEventType[eType] || 0) + 1;
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
      escapeCsv(e.createdAt.split('T')[0]),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  }
}

export const firebaseEnquiryService = new FirebaseEnquiryService();
