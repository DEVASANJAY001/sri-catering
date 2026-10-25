import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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
const auth = getAuth(app);
const db = getFirestore(app);

const REAL_ENQUIRIES = [
  {
    id: 'ENQ-2026-1001',
    customerName: 'Karthikeyan Ramachandran',
    mobileNumber: '9840123456',
    email: 'karthik.ram@gmail.com',
    eventType: 'Tamil Wedding Catering',
    eventDate: '2026-11-20',
    guestCount: 650,
    eventLocation: 'Mayor Ramanathan Chettiar Hall, MRC Nagar, Chennai',
    cateringService: 'Tamil Wedding Catering',
    mealPreference: 'Both',
    preferredContactMethod: 'Phone Call',
    message: 'Planning traditional morning Muhurtham banana-leaf breakfast (Idli, Ghee Pongal, Vadai) and grand reception dinner with Wood-fire Biryani counter & live stalls.',
    status: 'Confirmed',
    assignedAdminUid: 'admin',
    assignedAdminName: 'Admin',
    isViewed: true,
    viewedAt: '2026-10-24T10:00:00.000Z',
    viewedByAdminName: 'Admin',
    internalNotes: [
      {
        id: 'note-01',
        adminUid: 'admin',
        adminName: 'Admin',
        note: 'Customer met in person at Perambur branch. Sample tasting completed for Elaneer Payasam and Mutton Biryani. Confirmed with advance token.',
        createdAt: '2026-10-24T11:30:00.000Z',
      },
    ],
    auditLogs: [
      {
        id: 'log-01',
        timestamp: '2026-10-24T09:15:00.000Z',
        adminUid: 'customer-portal',
        adminName: 'Customer Web Portal',
        action: 'Enquiry Submitted',
        details: 'Submitted online by Karthikeyan Ramachandran',
      },
      {
        id: 'log-02',
        timestamp: '2026-10-24T11:30:00.000Z',
        adminUid: 'admin',
        adminName: 'Admin',
        action: 'Status Changed',
        details: 'Changed from "New" to "Confirmed"',
      },
    ],
    createdAt: '2026-10-24T09:15:00.000Z',
    updatedAt: '2026-10-24T11:30:00.000Z',
  },
  {
    id: 'ENQ-2026-1002',
    customerName: 'Dr. Meenakshi Sundaram',
    mobileNumber: '9444098765',
    email: 'meenakshi.dr@gmail.com',
    eventType: 'Housewarming Ceremonies',
    eventDate: '2026-11-05',
    guestCount: 180,
    eventLocation: 'Gomathi Nagar, Kolathur, Chennai',
    cateringService: 'Housewarming Ceremonies',
    mealPreference: 'Vegetarian',
    preferredContactMethod: 'WhatsApp',
    message: 'Need pure traditional Brahmin-style vegetarian feast served on plantain leaves with Siruparupu Payasam, Medu Vadai, Vatha Kuzhambu and Seeraga Appalam.',
    status: 'Quotation Sent',
    assignedAdminUid: 'admin',
    assignedAdminName: 'Admin',
    isViewed: true,
    viewedAt: '2026-10-24T14:00:00.000Z',
    viewedByAdminName: 'Admin',
    internalNotes: [
      {
        id: 'note-02',
        adminUid: 'admin',
        adminName: 'Admin',
        note: 'Quotation for 180 guests @ ₹280 per leaf sent via WhatsApp PDF. Customer reviewing with family elders.',
        createdAt: '2026-10-24T14:20:00.000Z',
      },
    ],
    auditLogs: [
      {
        id: 'log-03',
        timestamp: '2026-10-24T10:00:00.000Z',
        adminUid: 'customer-portal',
        adminName: 'Customer Web Portal',
        action: 'Enquiry Submitted',
        details: 'Submitted online by Dr. Meenakshi Sundaram',
      },
      {
        id: 'log-04',
        timestamp: '2026-10-24T14:20:00.000Z',
        adminUid: 'admin',
        adminName: 'Admin',
        action: 'Status Changed',
        details: 'Changed from "New" to "Quotation Sent"',
      },
    ],
    createdAt: '2026-10-24T10:00:00.000Z',
    updatedAt: '2026-10-24T14:20:00.000Z',
  },
  {
    id: 'ENQ-2026-1003',
    customerName: 'Saravanan Balaji',
    mobileNumber: '9884567890',
    email: 'saravanan.b@corptech.com',
    eventType: 'Corporate Catering',
    eventDate: '2026-11-12',
    guestCount: 300,
    eventLocation: 'DLF Cybercity IT Park, Porur, Chennai',
    cateringService: 'Corporate Catering',
    mealPreference: 'Both',
    preferredContactMethod: 'Phone Call',
    message: 'Annual tech summit luncheon. Require buffet setup with high tea stalls (live filter coffee, samosa, cut fruits) and executive buffet.',
    status: 'Follow-up Required',
    assignedAdminUid: 'admin',
    assignedAdminName: 'Admin',
    isViewed: true,
    viewedAt: '2026-10-24T16:00:00.000Z',
    viewedByAdminName: 'Admin',
    internalNotes: [
      {
        id: 'note-03',
        adminUid: 'admin',
        adminName: 'Admin',
        note: 'Spoke with HR manager. Requested GST invoice draft and vendor registration form. Follow up scheduled.',
        createdAt: '2026-10-24T16:45:00.000Z',
      },
    ],
    auditLogs: [
      {
        id: 'log-05',
        timestamp: '2026-10-24T11:20:00.000Z',
        adminUid: 'customer-portal',
        adminName: 'Customer Web Portal',
        action: 'Enquiry Submitted',
        details: 'Submitted online by Saravanan Balaji',
      },
    ],
    createdAt: '2026-10-24T11:20:00.000Z',
    updatedAt: '2026-10-24T16:45:00.000Z',
  },
  {
    id: 'ENQ-2026-1004',
    customerName: 'Anitha Vijayakumar',
    mobileNumber: '9790123987',
    email: 'anitha.vijay@gmail.com',
    eventType: 'A to Z Wedding Service',
    eventDate: '2026-11-28',
    guestCount: 220,
    eventLocation: 'Sri Kamakshi Marriage Hall, Villivakkam, Chennai',
    cateringService: 'A to Z Wedding Service',
    mealPreference: 'Both',
    preferredContactMethod: 'WhatsApp',
    message: 'Interested in the complete package with wood-fire mutton biryani, chicken 65, and live ice cream / mojito stalls.',
    status: 'New',
    isViewed: false,
    internalNotes: [],
    auditLogs: [
      {
        id: 'log-06',
        timestamp: '2026-10-25T08:10:00.000Z',
        adminUid: 'customer-portal',
        adminName: 'Customer Web Portal',
        action: 'Enquiry Submitted',
        details: 'Submitted online by Anitha Vijayakumar',
      },
    ],
    createdAt: '2026-10-25T08:10:00.000Z',
    updatedAt: '2026-10-25T08:10:00.000Z',
  },
  {
    id: 'ENQ-2026-1005',
    customerName: 'Praveen Kumar S',
    mobileNumber: '8939112233',
    email: 'praveen.s@gmail.com',
    eventType: 'Traditional Family Functions',
    eventDate: '2026-12-02',
    guestCount: 150,
    eventLocation: 'Shanthi Colony, Anna Nagar, Chennai',
    cateringService: 'Traditional Family Functions',
    mealPreference: 'Vegetarian',
    preferredContactMethod: 'Phone Call',
    message: 'Special 5-variety rice banquet (Lemon rice, Tamarind rice, Coconut rice, Curd rice, Bisibelebath) + Badam Halwa and Vadai for guests.',
    status: 'Contacted',
    assignedAdminUid: 'admin',
    assignedAdminName: 'Admin',
    isViewed: true,
    viewedAt: '2026-10-25T09:30:00.000Z',
    viewedByAdminName: 'Admin',
    internalNotes: [
      {
        id: 'note-04',
        adminUid: 'admin',
        adminName: 'Admin',
        note: 'Contacted over call. Family wants tasting session on Sunday at our Perambur kitchen.',
        createdAt: '2026-10-25T12:00:00.000Z',
      },
    ],
    auditLogs: [
      {
        id: 'log-07',
        timestamp: '2026-10-25T09:30:00.000Z',
        adminUid: 'customer-portal',
        adminName: 'Customer Web Portal',
        action: 'Enquiry Submitted',
        details: 'Submitted online by Praveen Kumar S',
      },
    ],
    createdAt: '2026-10-25T09:30:00.000Z',
    updatedAt: '2026-10-25T12:00:00.000Z',
  }
];

async function seedEnquiries() {
  console.log('Authenticating with Firebase Auth...');
  await signInWithEmailAndPassword(auth, 'admin@sricatering.com', 'admin123');
  console.log('Writing 5 real customer enquiries directly into Cloud Firestore enquiries collection...');

  for (const enq of REAL_ENQUIRIES) {
    await setDoc(doc(db, 'enquiries', enq.id), enq, { merge: true });
    console.log(`✅ Saved ${enq.id} (${enq.customerName}) to Firestore.`);
  }

  console.log('Done! All enquiries successfully written to Firestore.');
}

seedEnquiries().then(() => process.exit(0)).catch((err) => {
  console.error('Error seeding enquiries to Firestore:', err);
  process.exit(1);
});
