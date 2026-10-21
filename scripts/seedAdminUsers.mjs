/**
 * Firebase Admin User Provisioning Script for Sri Caterers Chennai
 * Project: sricatering-64043
 *
 * Seeds the 5 distinct administrator accounts into Firestore 'adminUsers' & 'admins' collections
 * and provides instructions for Firebase Authentication Console.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCgXnOMCUgB3ueZ4-2r7wkFiViedT1ggnU",
  authDomain: "sricatering-64043.firebaseapp.com",
  projectId: "sricatering-64043",
  storageBucket: "sricatering-64043.firebasestorage.app",
  messagingSenderId: "457075611743",
  appId: "1:457075611743:web:faf919e03830b2f352a3ea",
  measurementId: "G-78NNKP42D9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const AUTHORIZED_ADMIN_ROSTER = [
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

async function seed() {
  console.log('🚀 Seeding 5 Administrator accounts into Firestore collections: adminUsers and admins...');
  
  for (const admin of AUTHORIZED_ADMIN_ROSTER) {
    console.log(`Writing profile for ${admin.displayName} (${admin.email})...`);
    await setDoc(doc(db, 'adminUsers', admin.uid), admin, { merge: true });
    await setDoc(doc(db, 'admins', admin.uid), admin, { merge: true });
  }

  console.log('✅ Successfully seeded all 5 administrative profiles into Cloud Firestore!');
  console.log('\n--- 5 Firebase Authentication Accounts to create in Firebase Console ---');
  AUTHORIZED_ADMIN_ROSTER.forEach((admin, i) => {
    console.log(`${i + 1}. Email: ${admin.email}`);
    console.log(`   Name:  ${admin.displayName}`);
    console.log(`   Role:  ${admin.roleTitle} (${admin.role})`);
  });
  console.log('--------------------------------------------------------------------------\n');
}

seed().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
