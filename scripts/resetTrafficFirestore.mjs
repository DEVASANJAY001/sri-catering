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

async function resetTraffic() {
  console.log('Resetting Firestore analytics/traffic to authentic clean state (0 fake data)...');
  const today = new Date().toISOString().split('T')[0];
  const cleanTraffic = {
    totalVisits: 0,
    todayVisits: 0,
    todayDate: today,
    activeNow: 1,
    pageViews: {},
    deviceBreakdown: {
      mobile: 0,
      desktop: 0,
      tablet: 0
    },
    conversions: {
      whatsappClicks: 0,
      callClicks: 0,
      enquirySubmissions: 0
    },
    recentVisitors: [],
    lastUpdatedAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'analytics', 'traffic'), cleanTraffic);
  console.log('✅ Successfully reset analytics/traffic in Firestore to 0 fake data!');
}

resetTraffic().then(() => process.exit(0)).catch((err) => {
  console.error('Error resetting traffic:', err);
  process.exit(1);
});
