import { AuthService } from './AuthService';
import { AdminUser, AuthSession, AUTHORIZED_ADMIN_ROSTER } from '../../types/admin';

const SESSION_STORAGE_KEY = 'sri_caterers_dev_admin_session';

/**
 * Development-only Mock Authentication Service
 * Strictly for Phase 1 local development and UI testing.
 * NOT for production use. In Phase 2, this will be replaced with FirebaseAuthService.
 */
export class MockAuthService implements AuthService {
  private listeners: ((user: AdminUser | null) => void)[] = [];

  constructor() {
    // Check if session has expired on initialization
    this.cleanExpiredSession();
  }

  private cleanExpiredSession(): void {
    const session = this.getSession();
    if (session && Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      this.notifyListeners(null);
    }
  }

  private notifyListeners(user: AdminUser | null): void {
    this.listeners.forEach((callback) => callback(user));
  }

  async login(email: string, password: string): Promise<AuthSession> {
    // Simulate real network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const normalizedEmail = email.trim().toLowerCase();

    // Match against any of the 5 authorized admin roster records
    const admin = AUTHORIZED_ADMIN_ROSTER.find((a) => {
      return (
        a.email.toLowerCase() === normalizedEmail ||
        `${a.uid}@sricaterers.in` === normalizedEmail ||
        `admin${a.uid.split('-')[1]}@sricaterers.in` === normalizedEmail
      );
    });

    if (!admin) {
      throw new Error(
        `Access denied. Identifier "${email}" is not in the list of 5 authorized admin identities. (Development Mode)`
      );
    }

    // For development convenience, accept 'admin123' or any 6+ char password
    if (password.length < 6) {
      throw new Error('Development password must be at least 6 characters.');
    }

    const session: AuthSession = {
      user: {
        ...admin,
        lastLoginAt: new Date().toISOString(),
      },
      token: `mock_jwt_token_${admin.uid}_${Date.now()}`,
      // 8 hours session expiry
      expiresAt: Date.now() + 8 * 60 * 60 * 1000,
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    this.notifyListeners(session.user);
    return session;
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    localStorage.removeItem(SESSION_STORAGE_KEY);
    this.notifyListeners(null);
  }

  getCurrentUser(): AdminUser | null {
    const session = this.getSession();
    return session ? session.user : null;
  }

  getSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const session: AuthSession = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }
      return session;
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  onAuthStateChanged(callback: (user: AdminUser | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.getCurrentUser());
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }
}

export const mockAuthService = new MockAuthService();
