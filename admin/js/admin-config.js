/**
 * Hale Noor Quran Academy - Admin Panel Firebase Configuration & Services
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAsTVOoIKOtIK5AqiszWCpK_Gp35FUV60",
  authDomain: "halenoor-quran-academy-382f9.firebaseapp.com",
  projectId: "halenoor-quran-academy-382f9",
  storageBucket: "halenoor-quran-academy-382f9.firebasestorage.app",
  messagingSenderId: "979848989887",
  appId: "1:979848989887:web:70bc0e65b0787683efbd48a"
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
