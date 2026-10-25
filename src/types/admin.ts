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
 * Authorized admin roster is managed dynamically in Cloud Firestore
 */
export const AUTHORIZED_ADMIN_ROSTER: AdminUser[] = [];
