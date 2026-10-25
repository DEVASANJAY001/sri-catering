import { DashboardStats, EnquiryService } from './EnquiryService';
import {
  CustomerEnquiryInput,
  Enquiry,
  EnquiryFilterOptions,
  EnquiryStatus,
  InternalNote,
} from '../../types/enquiry';
const ENQUIRIES_STORAGE_KEY = 'sri_caterers_enquiries_store';

export class MockEnquiryService implements EnquiryService {
  private getStoredEnquiries(): Enquiry[] {
    try {
      const raw = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
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

  private saveStoredEnquiries(items: Enquiry[]): void {
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(items));
  }

  async createEnquiry(input: CustomerEnquiryInput): Promise<Enquiry> {
    await new Promise((r) => setTimeout(r, 400)); // simulated latency

    const items = this.getStoredEnquiries();
    const timestamp = new Date().toISOString();
    const nextSeq = 1000 + items.length + 1;
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

    const updated = [newEnquiry, ...items];
    this.saveStoredEnquiries(updated);
    return newEnquiry;
  }

  async getEnquiries(filters?: EnquiryFilterOptions): Promise<Enquiry[]> {
    await new Promise((r) => setTimeout(r, 200));
    let items = this.getStoredEnquiries();

    if (!filters) return items;

    // Search query
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

    // Status filter
    if (filters.status && filters.status !== 'All') {
      items = items.filter((i) => i.status === filters.status);
    }

    // Event type filter
    if (filters.eventType && filters.eventType !== 'All') {
      items = items.filter((i) => i.eventType === filters.eventType);
    }

    // Admin filter
    if (filters.assignedAdminUid && filters.assignedAdminUid !== 'All') {
      items = items.filter((i) => i.assignedAdminUid === filters.assignedAdminUid);
    }

    // Date range filter
    if (filters.dateFrom) {
      items = items.filter((i) => i.eventDate && i.eventDate >= (filters.dateFrom as string));
    }
    if (filters.dateTo) {
      items = items.filter((i) => i.eventDate && i.eventDate <= (filters.dateTo as string));
    }

    return items;
  }

  async getEnquiryById(id: string): Promise<Enquiry | null> {
    await new Promise((r) => setTimeout(r, 150));
    const items = this.getStoredEnquiries();
    return items.find((i) => i.id === id) || null;
  }

  async updateEnquiryStatus(
    id: string,
    status: EnquiryStatus,
    adminUid: string,
    adminName: string
  ): Promise<Enquiry> {
    await new Promise((r) => setTimeout(r, 250));
    const items = this.getStoredEnquiries();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error(`Enquiry ${id} not found.`);

    const existing = items[index];
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

    items[index] = updated;
    this.saveStoredEnquiries(items);
    return updated;
  }

  async addInternalNote(
    id: string,
    noteText: string,
    adminUid: string,
    adminName: string
  ): Promise<Enquiry> {
    await new Promise((r) => setTimeout(r, 200));
    const items = this.getStoredEnquiries();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error(`Enquiry ${id} not found.`);

    const existing = items[index];
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
          details: `Added private admin note: "${noteText.slice(0, 30)}..."`,
        },
        ...existing.auditLogs,
      ],
    };

    items[index] = updated;
    this.saveStoredEnquiries(items);
    return updated;
  }

  async assignEnquiry(
    id: string,
    adminUid: string,
    adminName: string,
    updatedByAdminName: string
  ): Promise<Enquiry> {
    await new Promise((r) => setTimeout(r, 200));
    const items = this.getStoredEnquiries();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error(`Enquiry ${id} not found.`);

    const existing = items[index];
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
          adminUid,
          adminName: updatedByAdminName,
          action: 'Assigned Officer Changed',
          details: `Assigned to ${adminName}`,
        },
        ...existing.auditLogs,
      ],
    };

    items[index] = updated;
    this.saveStoredEnquiries(items);
    return updated;
  }

  async archiveEnquiry(
    id: string,
    isArchived: boolean,
    adminUid: string,
    adminName: string
  ): Promise<Enquiry> {
    const items = this.getStoredEnquiries();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error(`Enquiry ${id} not found.`);

    const existing = items[index];
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
        },
        ...existing.auditLogs,
      ],
    };

    items[index] = updated;
    this.saveStoredEnquiries(items);
    return updated;
  }

  async deleteEnquiry(
    id: string,
    _adminUid: string,
    _adminName: string
  ): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 200));
    const items = this.getStoredEnquiries();
    const filtered = items.filter((i) => i.id !== id);
    this.saveStoredEnquiries(filtered);
    return true;
  }

  async markAsViewed(id: string, adminUid: string, adminName: string): Promise<Enquiry> {
    await new Promise((r) => setTimeout(r, 100));
    const items = this.getStoredEnquiries();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error(`Enquiry with ID ${id} not found.`);

    if (items[idx].isViewed) return items[idx];

    const timestamp = new Date().toISOString();
    const updated: Enquiry = {
      ...items[idx],
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
        ...items[idx].auditLogs,
      ],
    };

    items[idx] = updated;
    this.saveStoredEnquiries(items);
    return updated;
  }

  subscribeToEnquiries(callback: (enquiries: Enquiry[]) => void): () => void {
    callback(this.getStoredEnquiries());
    return () => {};
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const items = this.getStoredEnquiries();

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
      // by event type
      const eType = item.eventType || 'General Catering';
      stats.enquiriesByEventType[eType] =
        (stats.enquiriesByEventType[eType] || 0) + 1;
      // by status
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

export const mockEnquiryService = new MockEnquiryService();
