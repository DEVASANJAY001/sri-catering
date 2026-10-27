/**
 * Official Backend API Service for Sri Caterers Chennai
 * Handles:
 * - POST /api/enquiries: Validates customer payload, sanitizes data, saves to Cloud Firestore
 * - GET /api/enquiries: Reads enquiries from Cloud Firestore
 * - GET /api/health: Health check and Firebase connection status
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCgXnOMCUgB3ueZ4-2r7wkFiViedT1ggnU",
  authDomain: "sricatering-64043.firebaseapp.com",
  projectId: "sricatering-64043",
  storageBucket: "sricatering-64043.firebasestorage.app",
  messagingSenderId: "457075611743",
  appId: "1:457075611743:web:faf919e03830b2f352a3ea",
  measurementId: "G-78NNKP42D9"
};

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function ensureAdminAuth() {
  if (!auth.currentUser) {
    try {
      await signInWithEmailAndPassword(auth, 'admin@sricatering.com', 'admin123');
    } catch (e: any) {
      console.warn('Backend admin auth notice:', e.message);
    }
  }
}

export function cleanFirestoreData<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value.constructor && value.constructor.name === 'FieldValue')
    ) {
      result[key] = cleanFirestoreData(value);
    } else {
      result[key] = value;
    }
  }
  return result as Partial<T>;
}

export interface BackendEnquiryPayload {
  customerName: string;
  mobileNumber: string;
  email?: string;
  eventType?: string;
  eventDate?: string;
  guestCount?: number;
  eventLocation?: string;
  cateringService?: string;
  mealPreference?: string;
  preferredContactMethod?: string;
  message?: string;
}

export async function handleCreateEnquiry(payload: BackendEnquiryPayload) {
  // 1. Validation
  const name = (payload.customerName || '').trim();
  const phone = (payload.mobileNumber || '').replace(/[^\d+]/g, '').trim();

  if (!name || name.length < 2) {
    throw new Error('Customer name must be at least 2 characters long.');
  }

  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    throw new Error('Please provide a valid 10-digit mobile number.');
  }

  // 2. Generate unique enquiry reference ID
  const timestamp = new Date().toISOString();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const enquiryId = `ENQ-${new Date().getFullYear()}-${randomSuffix}`;

  const rawGuestNum = Number(payload.guestCount);
  const guestNum = !isNaN(rawGuestNum) && rawGuestNum > 0 ? rawGuestNum : 0;

  // 3. Assemble complete Enquiry record
  const record: Record<string, any> = {
    id: enquiryId,
    customerName: name,
    mobileNumber: digitsOnly,
    email: payload.email?.trim() || '',
    eventType: payload.eventType?.trim() || 'General Catering Enquiry',
    eventDate: payload.eventDate?.trim() || '',
    guestCount: guestNum,
    eventLocation: payload.eventLocation?.trim() || '',
    cateringService: payload.cateringService?.trim() || '',
    mealPreference: payload.mealPreference || 'Both',
    preferredContactMethod: payload.preferredContactMethod || 'Phone Call',
    message: payload.message?.trim() || '',
    status: 'New',
    isViewed: false,
    internalNotes: [],
    auditLogs: [
      {
        id: `log-${Date.now()}`,
        timestamp,
        adminUid: 'customer-portal',
        adminName: 'Customer Web Portal',
        action: 'Enquiry Submitted',
        details: `Online enquiry received from ${name} (${digitsOnly})`,
      },
    ],
    createdAt: timestamp,
    updatedAt: timestamp,
    serverCreatedAt: serverTimestamp(),
    serverUpdatedAt: serverTimestamp(),
  };

  const sanitized = cleanFirestoreData(record);

  // 4. Save to Cloud Firestore
  await setDoc(doc(db, 'enquiries', enquiryId), sanitized);

  console.log(`[Backend API] Stored enquiry ${enquiryId} for ${name} in Firebase Firestore`);

  return {
    success: true,
    enquiryId,
    enquiry: {
      ...record,
      serverCreatedAt: timestamp,
      serverUpdatedAt: timestamp,
    },
    message: 'Your catering enquiry has been successfully registered with Sri Caterers!',
  };
}

export async function handleGetEnquiries() {
  await ensureAdminAuth();
  const snapshot = await getDocs(collection(db, 'enquiries'));
  const list: any[] = [];
  snapshot.forEach((d) => {
    const data = d.data();
    list.push({
      ...data,
      id: data.id || d.id,
    });
  });

  list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  return {
    success: true,
    count: list.length,
    enquiries: list,
  };
}
