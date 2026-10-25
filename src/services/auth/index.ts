import { AuthService } from './AuthService';
import { firebaseAuthService } from './FirebaseAuthService';

// Connected 100% to live Firebase Authentication & Firestore
export const authService: AuthService = firebaseAuthService;

export * from './AuthService';
export * from './FirebaseAuthService';
