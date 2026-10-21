import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

/**
 * Official Firebase Backend Configuration for Sri Caterers Chennai
 * Connected project: sricatering-64043
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCgXnOMCUgB3ueZ4-2r7wkFiViedT1ggnU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sricatering-64043.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sricatering-64043",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sricatering-64043.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "457075611743",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:457075611743:web:faf919e03830b2f352a3ea",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-78NNKP42D9"
};

// Initialize Firebase App instance singleton
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);

// Initialize Cloud Firestore Database
export const db: Firestore = getFirestore(app);

// Initialize Firebase Analytics safely (only in browser environment when supported)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics not supported in current environment
    });
}

export const isFirebaseConfigured = true;
