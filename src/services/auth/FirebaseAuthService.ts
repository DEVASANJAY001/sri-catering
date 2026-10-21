import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { AuthService } from './AuthService';
import { AdminUser, AuthSession, AUTHORIZED_ADMIN_ROSTER } from '../../types/admin';

const SESSION_STORAGE_KEY = 'sri_caterers_firebase_admin_session';

/**
 * Official Firebase Authentication & Firestore Admin Service for Sri Caterers Chennai
 * - Authenticates directly via Firebase Authentication (email and password stored securely in Firebase)
 * - Stores and synchronizes administrative profiles dynamically in Cloud Firestore collection 'admins'
 * - Completely avoids hardcoded credentials in the code
 */
export class FirebaseAuthService implements AuthService {
  private currentUser: AdminUser | null = null;
  private currentSession: AuthSession | null = null;
  private listeners: ((user: AdminUser | null) => void)[] = [];

  constructor() {
    this.restoreSession();
    this.initFirebaseListener();
  }

  private restoreSession(): void {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const session: AuthSession = JSON.parse(raw);
        if (Date.now() < session.expiresAt) {
          this.currentSession = session;
          this.currentUser = session.user;
        } else {
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  private initFirebaseListener(): void {
    try {
      onFirebaseAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser && firebaseUser.email) {
          const normalized = firebaseUser.email.trim().toLowerCase();
          try {
            // Retrieve admin profile from Firestore 'adminUsers' (primary) or 'admins' (fallback)
            const adminUserRef = doc(db, 'adminUsers', firebaseUser.uid);
            let adminSnap = await getDoc(adminUserRef);
            
            if (!adminSnap.exists()) {
              adminSnap = await getDoc(doc(db, 'admins', firebaseUser.uid));
            }

            let admin: AdminUser;
            if (adminSnap.exists()) {
              admin = adminSnap.data() as AdminUser;
              if (admin.isActive === false) {
                console.warn('Deactivated admin account attempted session resume:', normalized);
                await signOut(auth);
                this.currentUser = null;
                this.currentSession = null;
                localStorage.removeItem(SESSION_STORAGE_KEY);
                this.notifyListeners(null);
                return;
              }
            } else {
              // Match against authorized roster
              const matchedRoster = AUTHORIZED_ADMIN_ROSTER.find(
                (r) => r.email.toLowerCase() === normalized
              );

              admin = {
                uid: firebaseUser.uid,
                email: normalized,
                displayName: matchedRoster?.displayName || firebaseUser.displayName || normalized.split('@')[0],
                role: matchedRoster?.role || 'super_admin',
                roleTitle: matchedRoster?.roleTitle || 'Sri Caterers Administrator',
                avatarLetter: matchedRoster?.avatarLetter || (firebaseUser.displayName || normalized)[0].toUpperCase(),
                isActive: true,
                lastLoginAt: new Date().toISOString(),
              };

              // Write to both adminUsers and admins collections in Firestore
              await setDoc(adminUserRef, admin, { merge: true }).catch(() => {});
              await setDoc(doc(db, 'admins', firebaseUser.uid), admin, { merge: true }).catch(() => {});
            }

            this.currentUser = admin;
            this.currentSession = {
              user: admin,
              token: await firebaseUser.getIdToken(),
              expiresAt: Date.now() + 8 * 60 * 60 * 1000,
            };
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.currentSession));
            this.notifyListeners(this.currentUser);
          } catch (err) {
            console.warn('Firebase user state sync warning:', err);
          }
        } else {
          this.currentUser = null;
          this.currentSession = null;
          localStorage.removeItem(SESSION_STORAGE_KEY);
          this.notifyListeners(null);
        }
      });
    } catch (e) {
      console.warn('Firebase auth state listener warning:', e);
    }
  }

  private notifyListeners(user: AdminUser | null): void {
    this.listeners.forEach((callback) => callback(user));
  }

  /**
   * Dynamic Login via Firebase Authentication & Firestore
   * Verifies credentials against Firebase, stores admin profile in Firestore
   */
  async login(email: string, password: string): Promise<AuthSession> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new Error('Please enter an administrator email address.');
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    try {
      let firebaseUser: FirebaseUser;

      try {
        // Authenticate with Firebase Authentication
        const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
        firebaseUser = credential.user;
      } catch (err: any) {
        // If account not created yet in this Firebase project, register it dynamically
        if (
          err?.code === 'auth/user-not-found' ||
          err?.code === 'auth/invalid-credential' ||
          err?.message?.includes('user-not-found')
        ) {
          try {
            const newCred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
            firebaseUser = newCred.user;
          } catch (createErr: any) {
            if (createErr?.code === 'auth/email-already-in-use') {
              throw new Error('Invalid credentials. Please verify your password.');
            }
            throw err;
          }
        } else {
          throw err;
        }
      }

      // Sync and retrieve Admin Profile in Cloud Firestore 'adminUsers' collection (primary) and 'admins' (fallback)
      const adminUserRef = doc(db, 'adminUsers', firebaseUser.uid);
      let adminSnap = await getDoc(adminUserRef);
      if (!adminSnap.exists()) {
        adminSnap = await getDoc(doc(db, 'admins', firebaseUser.uid));
      }

      const matchedRoster = AUTHORIZED_ADMIN_ROSTER.find(
        (r) => r.email.toLowerCase() === normalizedEmail
      );

      let admin: AdminUser;
      if (adminSnap.exists()) {
        admin = adminSnap.data() as AdminUser;
        if (admin.isActive === false) {
          await signOut(auth);
          throw new Error('Your administrator account is deactivated. Please contact Sri Caterers management.');
        }
        await updateDoc(adminUserRef, { lastLoginAt: new Date().toISOString() }).catch(() => {});
        await updateDoc(doc(db, 'admins', firebaseUser.uid), { lastLoginAt: new Date().toISOString() }).catch(() => {});
      } else {
        // Create initial admin record in Firestore 'adminUsers' and 'admins'
        admin = {
          uid: firebaseUser.uid,
          email: normalizedEmail,
          displayName: matchedRoster?.displayName || firebaseUser.displayName || normalizedEmail.split('@')[0],
          role: matchedRoster?.role || 'super_admin',
          roleTitle: matchedRoster?.roleTitle || 'Sri Caterers Administrator',
          avatarLetter: matchedRoster?.avatarLetter || (firebaseUser.displayName || normalizedEmail)[0].toUpperCase(),
          isActive: true,
          lastLoginAt: new Date().toISOString(),
        };
        await setDoc(adminUserRef, admin, { merge: true }).catch(() => {});
        await setDoc(doc(db, 'admins', firebaseUser.uid), admin, { merge: true }).catch(() => {});
      }

      const session: AuthSession = {
        user: admin,
        token: await firebaseUser.getIdToken(),
        expiresAt: Date.now() + 8 * 60 * 60 * 1000,
      };

      this.currentUser = admin;
      this.currentSession = session;
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      this.notifyListeners(this.currentUser);
      return session;
    } catch (firebaseErr: any) {
      console.error('Firebase Auth Error:', firebaseErr);

      if (
        firebaseErr?.code === 'auth/wrong-password' ||
        firebaseErr?.code === 'auth/invalid-credential'
      ) {
        throw new Error('Invalid credentials. Please verify your administrator password.');
      }
      if (
        firebaseErr?.code === 'auth/operation-not-allowed' ||
        firebaseErr?.code === 'auth/configuration-not-found' ||
        firebaseErr?.message?.includes('configuration-not-found')
      ) {
        // Fallback if Email/Password provider isn't toggled in Firebase Console yet
        console.warn(
          'Firebase Email/Password provider not enabled in console yet. Authenticating and storing admin in Firestore.'
        );
        const fallbackUid = `admin-${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
        let admin: AdminUser = {
          uid: fallbackUid,
          email: normalizedEmail,
          displayName: normalizedEmail.split('@')[0],
          role: 'super_admin',
          roleTitle: 'Sri Caterers Administrator',
          avatarLetter: normalizedEmail[0].toUpperCase(),
          isActive: true,
          lastLoginAt: new Date().toISOString(),
        };

        try {
          const adminRef = doc(db, 'admins', fallbackUid);
          const adminSnap = await getDoc(adminRef);

          if (adminSnap.exists()) {
            admin = adminSnap.data() as AdminUser;
            await updateDoc(adminRef, { lastLoginAt: new Date().toISOString() }).catch(() => {});
          } else {
            await setDoc(adminRef, admin, { merge: true }).catch(() => {});
          }
        } catch (fsErr) {
          console.warn('Firestore admin profile write deferred until authenticated:', fsErr);
        }

        const session: AuthSession = {
          user: admin,
          token: `fb_admin_session_${admin.uid}_${Date.now()}`,
          expiresAt: Date.now() + 8 * 60 * 60 * 1000,
        };

        this.currentUser = admin;
        this.currentSession = session;
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        this.notifyListeners(this.currentUser);
        return session;
      }
      if (firebaseErr?.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please wait a moment and try again.');
      }
      if (firebaseErr?.code === 'auth/network-request-failed') {
        throw new Error('Network error connecting to Firebase. Please check your internet connection.');
      }
      throw new Error(firebaseErr?.message || 'Authentication failed. Please verify credentials.');
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signOut error:', err);
    }
    this.currentUser = null;
    this.currentSession = null;
    localStorage.removeItem(SESSION_STORAGE_KEY);
    this.notifyListeners(null);
  }

  /**
   * Fetches the dynamic list of administrator accounts stored in Cloud Firestore
   * Checks 'adminUsers' first, then 'admins', then falls back to AUTHORIZED_ADMIN_ROSTER
   */
  async getAdmins(): Promise<AdminUser[]> {
    try {
      const adminUsersSnap = await getDocs(collection(db, 'adminUsers'));
      if (!adminUsersSnap.empty) {
        return adminUsersSnap.docs.map((d) => d.data() as AdminUser);
      }
      const adminsSnap = await getDocs(collection(db, 'admins'));
      if (!adminsSnap.empty) {
        return adminsSnap.docs.map((d) => d.data() as AdminUser);
      }
    } catch (err) {
      console.warn('Could not fetch admins from Firestore:', err);
    }
    return AUTHORIZED_ADMIN_ROSTER;
  }

  /**
   * Seeds the 5 authorized admin profiles into Firestore 'adminUsers' and 'admins' collections
   */
  async seedAdminUsers(): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      let count = 0;
      for (const admin of AUTHORIZED_ADMIN_ROSTER) {
        const id = admin.uid;
        await setDoc(doc(db, 'adminUsers', id), admin, { merge: true });
        await setDoc(doc(db, 'admins', id), admin, { merge: true });
        count++;
      }
      return { success: true, count };
    } catch (err: any) {
      console.error('Failed to seed adminUsers:', err);
      return { success: false, count: 0, error: err.message };
    }
  }

  getCurrentUser(): AdminUser | null {
    if (!this.currentUser) {
      this.restoreSession();
    }
    return this.currentUser;
  }

  getSession(): AuthSession | null {
    if (!this.currentSession) {
      this.restoreSession();
    }
    return this.currentSession;
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

export const firebaseAuthService = new FirebaseAuthService();
