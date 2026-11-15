/**
 * Halenoor Quran Academy - Firebase Initialization & Firestore Connector
 */
const firebaseConfig = {
  apiKey: "AIzaSyBDtFOR5YeiKWcdvPbh16GXIqH1Gm7OnDA",
  authDomain: "halenoor-quran-academy-a9659.firebaseapp.com",
  projectId: "halenoor-quran-academy-a9659",
  storageBucket: "halenoor-quran-academy-a9659.firebasestorage.app",
  messagingSenderId: "922119643132",
  appId: "1:922119643132:web:280a810c962b19a1231c79"
};

let halenoorDb = null;

try {
  if (typeof firebase !== "undefined" && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    halenoorDb = firebase.firestore();
    console.log("Hale Noor Firebase Firestore connected successfully.");
  } else if (typeof firebase !== "undefined" && firebase.apps.length) {
    halenoorDb = firebase.firestore();
  }
} catch (e) {
  console.warn("Firebase initialization notice:", e);
}

// Global helper to save a trial registration lead
async function saveTrialToFirestore(leadData) {
  if (!halenoorDb) {
    console.warn("Firestore not initialized, fallback to localStorage.");
    return null;
  }
  try {
    const docData = {
      studentName: leadData.studentName || "",
      guardianName: leadData.guardianName || "",
      phone: leadData.phone || "",
      email: leadData.email || "",
      country: leadData.country || "International",
      course: leadData.course || "Quran Reading with Tajweed",
      tutorType: leadData.tutorType || "Any Qualified Tutor",
      timing: leadData.timing || "Flexible",
      notes: leadData.notes || "",
      status: leadData.status || "New",
      source: leadData.source || window.location.pathname,
      submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
      dateString: new Date().toISOString()
    };
    const ref = await halenoorDb.collection("trial_registrations").add(docData);
    console.log("Student trial lead saved to Firestore. ID:", ref.id);
    return ref.id;
  } catch (err) {
    console.error("Firestore save error:", err);
    return null;
  }
}

// Global helper to save contact message
async function saveContactToFirestore(contactData) {
  if (!halenoorDb) return null;
  try {
    const docData = {
      fullName: contactData.fullName || "",
      email: contactData.email || "",
      phone: contactData.phone || "",
      subject: contactData.subject || "General Inquiry",
      message: contactData.message || "",
      submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
      dateString: new Date().toISOString()
    };
    const ref = await halenoorDb.collection("contact_messages").add(docData);
    return ref.id;
  } catch (err) {
    console.error("Firestore contact save error:", err);
    return null;
  }
}

window.saveTrialToFirestore = saveTrialToFirestore;
window.saveContactToFirestore = saveContactToFirestore;
window.halenoorDb = halenoorDb;
