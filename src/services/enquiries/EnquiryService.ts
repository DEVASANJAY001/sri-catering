import {
  CustomerEnquiryInput,
  Enquiry,
  EnquiryFilterOptions,
  EnquiryStatus,
} from '../../types/enquiry';

export interface DashboardStats {
  totalEnquiries: number;
  newEnquiries: number;
  contactedEnquiries: number;
  followUpEnquiries: number;
  quotationSentEnquiries: number;
  confirmedEnquiries: number;
  closedEnquiries: number;
  cancelledEnquiries: number;
  enquiriesByEventType: { [eventType: string]: number };
  enquiriesByStatus: { [status in EnquiryStatus]?: number };
  recentEnquiries: Enquiry[];
}

export interface EnquiryService {
  createEnquiry(input: CustomerEnquiryInput): Promise<Enquiry>;
  getEnquiries(filters?: EnquiryFilterOptions): Promise<Enquiry[]>;
  getEnquiryById(id: string): Promise<Enquiry | null>;
  updateEnquiryStatus(
    id: string,
    status: EnquiryStatus,
    adminUid: string,
    adminName: string
  ): Promise<Enquiry>;
  addInternalNote(
    id: string,
    noteText: string,
    adminUid: string,
    adminName: string
  ): Promise<Enquiry>;
  assignEnquiry(
    id: string,
    adminUid: string,
    adminName: string,
    updatedByAdminName: string,
    updatedByAdminUid?: string
  ): Promise<Enquiry>;
  archiveEnquiry(
    id: string,
    isArchived: boolean,
    adminUid: string,
    adminName: string
  ): Promise<Enquiry>;
  deleteEnquiry(
    id: string,
    adminUid: string,
    adminName: string
  ): Promise<boolean>;
  markAsViewed(
    id: string,
    adminUid: string,
    adminName: string
  ): Promise<Enquiry>;
  subscribeToEnquiries?(
    callback: (enquiries: Enquiry[]) => void
  ): () => void;
  getDashboardStats(): Promise<DashboardStats>;
  exportEnquiriesToCsv(filters?: EnquiryFilterOptions): Promise<string>;
}
