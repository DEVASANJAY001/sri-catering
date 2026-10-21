import { AdminUser, AuthSession } from '../../types/admin';

export interface AuthService {
  login(email: string, password: string): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentUser(): AdminUser | null;
  getSession(): AuthSession | null;
  isAuthenticated(): boolean;
  onAuthStateChanged(callback: (user: AdminUser | null) => void): () => void;
  getAdmins?(): Promise<AdminUser[]>;
}
