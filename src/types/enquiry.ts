/**
 * Types and interfaces for customer catering enquiries and admin management
 */

export type EnquiryStatus = 
  | 'New'
  | 'Contacted'
  | 'Follow-up Required'
  | 'Quotation Sent'
  | 'Confirmed'
  | 'Closed'
  | 'Cancelled';

export type MealPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Both';
export type PreferredContactMethod = 'Phone Call' | 'WhatsApp' | 'Email';

export interface InternalNote {
  id: string;
  adminUid: string;
  adminName: string;
  note: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminUid: string;
  adminName: string;
  action: string;
  details?: string;
}

export interface CustomerEnquiryInput {
  customerName: string;
  mobileNumber: string;
  email?: string;
  eventType?: string;
  eventDate?: string;
  guestCount?: number;
  eventLocation?: string;
  cateringService?: string;
  mealPreference?: MealPreference;
  preferredContactMethod?: PreferredContactMethod;
  message?: string;
}

export interface Enquiry {
  id: string;
  customerName: string;
  mobileNumber: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  eventLocation: string;
  preferredContactMethod: PreferredContactMethod;
  email?: string;
  cateringService?: string;
  mealPreference?: MealPreference;
  message?: string;
  status: EnquiryStatus;
  isViewed?: boolean;
  viewedAt?: string;
  viewedByAdminName?: string;
  assignedAdminUid?: string;
  assignedAdminName?: string;
  internalNotes: InternalNote[];
  auditLogs: AuditLogEntry[];
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}

export interface EnquiryFilterOptions {
  searchQuery?: string;
  status?: EnquiryStatus | 'All';
  eventType?: string | 'All';
  dateFrom?: string;
  dateTo?: string;
  assignedAdminUid?: string | 'All';
}
