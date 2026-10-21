/**
 * Admin account definitions and authorization types
 * Prepared for 5 distinct admin identities as required
 */

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'operations_admin' | 'head_chef' | 'client_relations' | 'logistics_admin';
  roleTitle: string;
  avatarLetter: string;
  isActive: boolean;
  lastLoginAt?: string;
}

export interface AuthSession {
  user: AdminUser;
  token: string;
  expiresAt: number;
}

/**
 * 5 distinct authorized admin accounts specification
 * Uses placeholder emails ADMIN_EMAIL_1 through ADMIN_EMAIL_5 as mandated
 */
export const AUTHORIZED_ADMIN_ROSTER: AdminUser[] = [
  {
    uid: 'admin-01',
    email: 'srinivasan@sricatering.davns.com',
    displayName: 'Srinivasan R (Proprietor)',
    role: 'super_admin',
    roleTitle: 'Managing Director & Proprietor',
    avatarLetter: 'S',
    isActive: true
  },
  {
    uid: 'admin-02',
    email: 'operations@sricatering.davns.com',
    displayName: 'Catering Operations Lead',
    role: 'operations_admin',
    roleTitle: 'General Catering Operations Manager',
    avatarLetter: 'O',
    isActive: true
  },
  {
    uid: 'admin-03',
    email: 'chef@sricatering.davns.com',
    displayName: 'Master Chef & Menu Director',
    role: 'head_chef',
    roleTitle: 'Executive Chef & Kitchen Standards',
    avatarLetter: 'C',
    isActive: true
  },
  {
    uid: 'admin-04',
    email: 'relations@sricatering.davns.com',
    displayName: 'Customer Relations Specialist',
    role: 'client_relations',
    roleTitle: 'Customer Bookings & Quotations',
    avatarLetter: 'R',
    isActive: true
  },
  {
    uid: 'admin-05',
    email: 'logistics@sricatering.davns.com',
    displayName: 'Event Stalls & Logistics Manager',
    role: 'logistics_admin',
    roleTitle: 'On-Site Stalls & Supply Logistics',
    avatarLetter: 'L',
    isActive: true
  }
];
