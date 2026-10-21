import { AuthService } from './AuthService';
import { mockAuthService } from './MockAuthService';
import { firebaseAuthService } from './FirebaseAuthService';
import { isFirebaseConfigured } from '../../config/firebase';

// Automatically use Firebase backend now that credentials are configured
const useFirebase = import.meta.env.VITE_USE_FIREBASE !== 'false' && isFirebaseConfigured;

export const authService: AuthService = useFirebase 
  ? firebaseAuthService 
  : mockAuthService;

export * from './AuthService';
export * from './MockAuthService';
export * from './FirebaseAuthService';
