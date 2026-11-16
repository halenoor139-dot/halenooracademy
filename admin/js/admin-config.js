/**
 * Hale Noor Quran Academy - Admin Panel Firebase Configuration & Services
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBDtFOR5YeiKWcdvPbh16GXIqH1Gm7OnDA",
  authDomain: "halenoor-quran-academy-a9659.firebaseapp.com",
  projectId: "halenoor-quran-academy-a9659",
  storageBucket: "halenoor-quran-academy-a9659.firebasestorage.app",
  messagingSenderId: "922119643132",
  appId: "1:922119643132:web:280a810c962b19a1231c79"
};

// Initialize Firebase App
let firebaseApp = null;
let adminAuth = null;
let adminDb = null;
let adminStorage = null;

try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    } else {
      firebaseApp = firebase.app();
    }
    adminAuth = firebase.auth();
    adminDb = firebase.firestore();
    try {
      adminStorage = firebase.storage();
    } catch (stErr) {
      console.warn("Firebase Storage init note:", stErr);
    }
    console.log("Firebase services initialized successfully for Admin Dashboard.");
  }
} catch (e) {
  console.error("Firebase initialization failed:", e);
}

// Firestore Collections Constants
const COLLECTIONS = {
  ADMINS: 'admins',
  COURSES: 'courses',
  TEACHERS: 'teachers',
  STUDENTS: 'students',
  ENROLLMENTS: 'trial_registrations',
  SLIDERS: 'sliders',
  GALLERY: 'gallery',
  TESTIMONIALS: 'testimonials',
  MESSAGES: 'contact_messages',
  ACTIVITY_LOGS: 'admin_activity_logs'
};

// Academy Default Contact Config
const ACADEMY_INFO = {
  name: "Hale Noor Online Quran Academy",
  arabicName: "هالة نور أكاديمية القرآن الكريم",
  whatsappNumber: "923208040672",
  email: "info@halenoorquran.com",
  portalUrl: "https://halenooracademy.vercel.app"
};

window.FIREBASE_CONFIG = FIREBASE_CONFIG;
window.adminAuth = adminAuth;
window.adminDb = adminDb;
window.adminStorage = adminStorage;
window.COLLECTIONS = COLLECTIONS;
window.ACADEMY_INFO = ACADEMY_INFO;
