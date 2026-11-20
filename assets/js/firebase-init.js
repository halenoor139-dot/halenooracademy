/**
 * Halenoor Quran Academy - Firebase Initialization & Public Site Sync Connector
 */
const firebaseConfig = {
  apiKey: "AIzaSyAstTv0oIK0t1K5AqiszwCgk_Gp35FUv60",
  authDomain: "halenoor-quran-academy-382f9.firebaseapp.com",
  projectId: "halenoor-quran-academy-382f9",
  storageBucket: "halenoor-quran-academy-382f9.firebasestorage.app",
  messagingSenderId: "979848909887",
  appId: "1:979848909887:web:70b0e65b0787683efbd48a"
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
      studentName: leadData.name || leadData.studentName || "",
      parentName: leadData.parentName || leadData.guardianName || "",
      age: leadData.age || "",
      course: leadData.course || "Noorani Qaida",
      tutorGender: leadData.tutorGender || leadData.tutorType || "Any",
      whatsappNumber: leadData.whatsapp || leadData.phone || "",
      email: leadData.email || "",
      country: leadData.country || "International",
      city: leadData.city || "",
      timezone: leadData.timezone || "",
      preferredTime: leadData.preferredTime || leadData.timing || "Flexible",
      notes: leadData.notes || "",
      status: "New",
      source: "Home Page Free Trial Form",
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
      fullName: contactData.fullName || contactData.name || "",
      email: contactData.email || "",
      whatsappNumber: contactData.phone || contactData.whatsapp || "",
      phone: contactData.phone || contactData.whatsapp || "",
      subject: contactData.subject || "General Inquiry",
      message: contactData.message || "",
      status: "Unread",
      submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
      dateString: new Date().toISOString()
    };
    const ref = await halenoorDb.collection("contact_messages").add(docData);
    console.log("Contact inquiry saved to Firestore. ID:", ref.id);
    return ref.id;
  } catch (err) {
    console.error("Firestore contact save error:", err);
    return null;
  }
}

// Public fetch helpers for dynamic website rendering
async function fetchPublicCourses() {
  if (!halenoorDb) return null;
  try {
    const snap = await halenoorDb.collection("courses")
      .where("active", "==", true)
      .get();
    if (snap.empty) return null;
    const courses = [];
    snap.forEach(doc => courses.push({ id: doc.id, ...doc.data() }));
    return courses;
  } catch (err) {
    console.warn("Could not fetch dynamic courses from Firestore:", err);
    return null;
  }
}

async function fetchPublicSliders() {
  if (!halenoorDb) return null;
  try {
    const snap = await halenoorDb.collection("sliders")
      .where("active", "==", true)
      .orderBy("order", "asc")
      .get();
    if (snap.empty) return null;
    const sliders = [];
    snap.forEach(doc => sliders.push({ id: doc.id, ...doc.data() }));
    return sliders;
  } catch (err) {
    console.warn("Could not fetch dynamic sliders from Firestore, fallback query:", err);
    try {
      const snap = await halenoorDb.collection("sliders").get();
      if (snap.empty) return null;
      const sliders = [];
      snap.forEach(doc => {
        const d = doc.data();
        if (d.active !== false) sliders.push({ id: doc.id, ...d });
      });
      sliders.sort((a, b) => (Number(a.order) || 1) - (Number(b.order) || 1));
      return sliders;
    } catch (e2) {
      return null;
    }
  }
}

async function fetchPublicTestimonials() {
  if (!halenoorDb) return null;
  try {
    const snap = await halenoorDb.collection("testimonials")
      .where("published", "==", true)
      .get();
    if (snap.empty) return null;
    const items = [];
    snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    return items;
  } catch (err) {
    console.warn("Could not fetch testimonials from Firestore:", err);
    return null;
  }
}

async function fetchPublicTeachers() {
  if (!halenoorDb) return null;
  try {
    const snap = await halenoorDb.collection("teachers")
      .where("active", "==", true)
      .get();
    if (snap.empty) return null;
    const items = [];
    snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    return items;
  } catch (err) {
    console.warn("Could not fetch teachers from Firestore:", err);
    return null;
  }
}

async function fetchPublicGallery() {
  if (!halenoorDb) return null;
  try {
    const snap = await halenoorDb.collection("gallery").get();
    if (snap.empty) return null;
    const items = [];
    snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    return items;
  } catch (err) {
    console.warn("Could not fetch gallery from Firestore:", err);
    return null;
  }
}

window.saveTrialToFirestore = saveTrialToFirestore;
window.saveContactToFirestore = saveContactToFirestore;
window.fetchPublicCourses = fetchPublicCourses;
window.fetchPublicSliders = fetchPublicSliders;
window.fetchPublicTestimonials = fetchPublicTestimonials;
window.fetchPublicTeachers = fetchPublicTeachers;
window.fetchPublicGallery = fetchPublicGallery;
window.halenoorDb = halenoorDb;
