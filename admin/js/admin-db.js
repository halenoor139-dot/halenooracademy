/**
 * Hale Noor Quran Academy - Admin Firestore & Storage Operations
 */

// Global listeners holders for real-time unsubscription
const activeListeners = {};

// Helper to log admin actions
async function logAdminActivity(action, details) {
  if (!window.adminDb) return;
  try {
    const user = window.getCurrentAdminUser ? window.getCurrentAdminUser() : null;
    await window.adminDb.collection(COLLECTIONS.ACTIVITY_LOGS).add({
      action,
      details,
      adminEmail: user?.email || "System",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      dateString: new Date().toLocaleString()
    });
  } catch (err) {
    console.warn("Activity log skipped:", err);
  }
}

// -------------------------------------------------------------
// 1. DASHBOARD OVERVIEW & METRICS
// -------------------------------------------------------------
async function fetchDashboardStats() {
  if (!window.adminDb) return null;

  try {
    const [
      studentsSnap,
      teachersSnap,
      coursesSnap,
      enrollmentsSnap,
      messagesSnap
    ] = await Promise.all([
      window.adminDb.collection(COLLECTIONS.STUDENTS).get(),
      window.adminDb.collection(COLLECTIONS.TEACHERS).get(),
      window.adminDb.collection(COLLECTIONS.COURSES).get(),
      window.adminDb.collection(COLLECTIONS.ENROLLMENTS).get(),
      window.adminDb.collection(COLLECTIONS.MESSAGES).get()
    ]);

    const totalStudents = studentsSnap.size;
    const totalTeachers = teachersSnap.size;
    const totalCourses = coursesSnap.size;

    let activeEnrollments = 0;
    let pendingEnrollments = 0;

    enrollmentsSnap.forEach(doc => {
      const data = doc.data();
      const status = (data.status || 'New').toLowerCase();
      if (status === 'active' || status === 'approved' || status === 'scheduled' || status === 'converted') {
        activeEnrollments++;
      } else if (status === 'new' || status === 'pending' || status === 'contacted') {
        pendingEnrollments++;
      }
    });

    let totalMessages = messagesSnap.size;
    let unreadMessages = 0;
    messagesSnap.forEach(doc => {
      const data = doc.data();
      if ((data.status || 'Unread').toLowerCase() === 'unread') {
        unreadMessages++;
      }
    });

    return {
      totalStudents,
      totalTeachers,
      totalCourses,
      activeEnrollments,
      pendingEnrollments,
      totalEnrollments: enrollmentsSnap.size,
      totalMessages,
      unreadMessages
    };
  } catch (err) {
    console.error("Error fetching dashboard statistics:", err);
    return null;
  }
}

// -------------------------------------------------------------
// 2. COURSES CRUD
// -------------------------------------------------------------
function listenToCourses(callback) {
  if (!window.adminDb) return () => {};
  if (activeListeners.courses) activeListeners.courses();

  const unsubscribe = window.adminDb.collection(COLLECTIONS.COURSES)
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      const courses = [];
      snapshot.forEach(doc => courses.push({ id: doc.id, ...doc.data() }));
      callback(courses);
    }, err => {
      console.warn("Courses listener notice:", err);
      // Fallback query without orderBy in case index is pending
      window.adminDb.collection(COLLECTIONS.COURSES).get().then(snap => {
        const courses = [];
        snap.forEach(doc => courses.push({ id: doc.id, ...doc.data() }));
        callback(courses);
      });
    });

  activeListeners.courses = unsubscribe;
  return unsubscribe;
}

async function addCourse(courseData) {
  if (!window.adminDb) throw new Error("Database not connected");
  const docRef = await window.adminDb.collection(COLLECTIONS.COURSES).add({
    ...courseData,
    active: courseData.active !== undefined ? courseData.active : true,
    featured: courseData.featured !== undefined ? courseData.featured : false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Add Course", `Added course: ${courseData.title}`);
  return docRef.id;
}

async function updateCourse(id, courseData) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.COURSES).doc(id).update({
    ...courseData,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Update Course", `Updated course: ${courseData.title || id}`);
}

async function deleteCourse(id, title) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.COURSES).doc(id).delete();
  await logAdminActivity("Delete Course", `Deleted course: ${title || id}`);
}

// -------------------------------------------------------------
// 3. TEACHERS CRUD
// -------------------------------------------------------------
function listenToTeachers(callback) {
  if (!window.adminDb) return () => {};
  if (activeListeners.teachers) activeListeners.teachers();

  const unsubscribe = window.adminDb.collection(COLLECTIONS.TEACHERS)
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      const teachers = [];
      snapshot.forEach(doc => teachers.push({ id: doc.id, ...doc.data() }));
      callback(teachers);
    }, err => {
      console.warn("Teachers listener notice:", err);
      window.adminDb.collection(COLLECTIONS.TEACHERS).get().then(snap => {
        const teachers = [];
        snap.forEach(doc => teachers.push({ id: doc.id, ...doc.data() }));
        callback(teachers);
      });
    });

  activeListeners.teachers = unsubscribe;
  return unsubscribe;
}

async function addTeacher(teacherData) {
  if (!window.adminDb) throw new Error("Database not connected");
  const docRef = await window.adminDb.collection(COLLECTIONS.TEACHERS).add({
    ...teacherData,
    active: teacherData.active !== undefined ? teacherData.active : true,
    rating: teacherData.rating || 5.0,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Add Teacher", `Added teacher: ${teacherData.name}`);
  return docRef.id;
}

async function updateTeacher(id, teacherData) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.TEACHERS).doc(id).update({
    ...teacherData,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Update Teacher", `Updated teacher: ${teacherData.name || id}`);
}

async function deleteTeacher(id, name) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.TEACHERS).doc(id).delete();
  await logAdminActivity("Delete Teacher", `Deleted teacher: ${name || id}`);
}

// -------------------------------------------------------------
// 4. STUDENTS CRUD
// -------------------------------------------------------------
function listenToStudents(callback) {
  if (!window.adminDb) return () => {};
  if (activeListeners.students) activeListeners.students();

  const unsubscribe = window.adminDb.collection(COLLECTIONS.STUDENTS)
    .orderBy("enrolledAt", "desc")
    .onSnapshot(snapshot => {
      const students = [];
      snapshot.forEach(doc => students.push({ id: doc.id, ...doc.data() }));
      callback(students);
    }, err => {
      console.warn("Students listener notice:", err);
      window.adminDb.collection(COLLECTIONS.STUDENTS).get().then(snap => {
        const students = [];
        snap.forEach(doc => students.push({ id: doc.id, ...doc.data() }));
        callback(students);
      });
    });

  activeListeners.students = unsubscribe;
  return unsubscribe;
}

async function addStudent(studentData) {
  if (!window.adminDb) throw new Error("Database not connected");
  const docRef = await window.adminDb.collection(COLLECTIONS.STUDENTS).add({
    ...studentData,
    status: studentData.status || "Active",
    enrolledAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Add Student", `Enrolled student: ${studentData.studentName}`);
  return docRef.id;
}

async function updateStudent(id, studentData) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.STUDENTS).doc(id).update({
    ...studentData,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Update Student", `Updated student record: ${studentData.studentName || id}`);
}

async function deleteStudent(id, name) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.STUDENTS).doc(id).delete();
  await logAdminActivity("Delete Student", `Deleted student record: ${name || id}`);
}

// -------------------------------------------------------------
// 5. ENROLLMENTS & TRIAL LEADS
// -------------------------------------------------------------
function listenToEnrollments(callback) {
  if (!window.adminDb) return () => {};
  if (activeListeners.enrollments) activeListeners.enrollments();

  const unsubscribe = window.adminDb.collection(COLLECTIONS.ENROLLMENTS)
    .orderBy("submittedAt", "desc")
    .onSnapshot(snapshot => {
      const leads = [];
      snapshot.forEach(doc => leads.push({ id: doc.id, ...doc.data() }));
      callback(leads);
    }, err => {
      console.warn("Enrollments listener notice:", err);
      window.adminDb.collection(COLLECTIONS.ENROLLMENTS).get().then(snap => {
        const leads = [];
        snap.forEach(doc => leads.push({ id: doc.id, ...doc.data() }));
        callback(leads);
      });
    });

  activeListeners.enrollments = unsubscribe;
  return unsubscribe;
}

async function updateEnrollmentStatus(id, newStatus, adminNotes) {
  if (!window.adminDb) throw new Error("Database not connected");
  const updateData = {
    status: newStatus,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

  await window.adminDb.collection(COLLECTIONS.ENROLLMENTS).doc(id).update(updateData);
  await logAdminActivity("Update Enrollment Status", `Marked lead ${id} as ${newStatus}`);
}

async function scheduleTrialClass(id, scheduleData) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.ENROLLMENTS).doc(id).update({
    status: "Scheduled",
    assignedTeacher: scheduleData.assignedTeacher || "",
    trialDate: scheduleData.trialDate || "",
    trialTime: scheduleData.trialTime || "",
    meetingLink: scheduleData.meetingLink || "",
    adminNotes: scheduleData.adminNotes || "",
    scheduledAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Schedule Trial", `Trial scheduled for lead ${id} with ${scheduleData.assignedTeacher}`);
}

async function convertLeadToStudent(leadId, leadData, extraStudentData = {}) {
  if (!window.adminDb) throw new Error("Database not connected");
  
  // 1. Create student document with auto-generated portal login credentials
  const baseName = (leadData.studentName || leadData.name || "student").toLowerCase().replace(/[^a-z0-9]/g, '') || 'student';
  const generatedUsername = extraStudentData.username || (baseName + Math.floor(10 + Math.random() * 90));
  const generatedPassword = extraStudentData.password || ('Quran@' + Math.floor(1000 + Math.random() * 9000));

  const studentDoc = {
    studentName: leadData.studentName || leadData.name || "Student",
    parentName: leadData.parentName || "",
    age: leadData.age || "",
    enrolledCourse: leadData.course || "Noorani Qaida",
    assignedTeacher: extraStudentData.assignedTeacher || leadData.assignedTeacher || "To be assigned",
    whatsappNumber: leadData.whatsappNumber || leadData.whatsapp || "",
    email: leadData.email || "",
    country: leadData.country || "International",
    city: leadData.city || "",
    timezone: leadData.timezone || "",
    classTiming: extraStudentData.classTiming || leadData.preferredTime || "Evening",
    monthlyFee: extraStudentData.monthlyFee || 45,
    currency: extraStudentData.currency || "USD",
    status: "Active",
    username: generatedUsername,
    password: generatedPassword,
    notes: `Converted from Free Trial Lead (ID: ${leadId}). Notes: ${leadData.notes || 'None'}`,
    enrolledAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  const studentRef = await window.adminDb.collection(COLLECTIONS.STUDENTS).add(studentDoc);

  // 2. Mark lead as converted
  await window.adminDb.collection(COLLECTIONS.ENROLLMENTS).doc(leadId).update({
    status: "Converted",
    convertedStudentId: studentRef.id,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  await logAdminActivity("Convert Lead", `Converted lead ${leadId} into Student ${studentDoc.studentName}`);
  return studentRef.id;
}

async function deleteEnrollment(id) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.ENROLLMENTS).doc(id).delete();
  await logAdminActivity("Delete Enrollment", `Deleted enrollment lead ${id}`);
}

// -------------------------------------------------------------
// 6. WEBSITE SLIDERS CRUD
// -------------------------------------------------------------
function listenToSliders(callback) {
  if (!window.adminDb) return () => {};
  if (activeListeners.sliders) activeListeners.sliders();

  const unsubscribe = window.adminDb.collection(COLLECTIONS.SLIDERS)
    .orderBy("order", "asc")
    .onSnapshot(snapshot => {
      const sliders = [];
      snapshot.forEach(doc => sliders.push({ id: doc.id, ...doc.data() }));
      callback(sliders);
    }, err => {
      console.warn("Sliders listener notice:", err);
      window.adminDb.collection(COLLECTIONS.SLIDERS).get().then(snap => {
        const sliders = [];
        snap.forEach(doc => sliders.push({ id: doc.id, ...doc.data() }));
        callback(sliders);
      });
    });

  activeListeners.sliders = unsubscribe;
  return unsubscribe;
}

async function addSlider(sliderData) {
  if (!window.adminDb) throw new Error("Database not connected");
  const docRef = await window.adminDb.collection(COLLECTIONS.SLIDERS).add({
    ...sliderData,
    order: Number(sliderData.order) || 1,
    active: sliderData.active !== undefined ? sliderData.active : true,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Add Slider", `Added banner: ${sliderData.title}`);
  return docRef.id;
}

async function updateSlider(id, sliderData) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.SLIDERS).doc(id).update({
    ...sliderData,
    order: Number(sliderData.order) || 1,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Update Slider", `Updated banner: ${sliderData.title || id}`);
}

async function toggleSliderActive(id, isActive) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.SLIDERS).doc(id).update({
    active: isActive,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Toggle Slider", `Toggled banner ${id} active: ${isActive}`);
}

async function deleteSlider(id, title) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.SLIDERS).doc(id).delete();
  await logAdminActivity("Delete Slider", `Deleted banner: ${title || id}`);
}

// -------------------------------------------------------------
// 7. GALLERY CRUD
// -------------------------------------------------------------
function listenToGallery(callback) {
  if (!window.adminDb) return () => {};
  if (activeListeners.gallery) activeListeners.gallery();

  const unsubscribe = window.adminDb.collection(COLLECTIONS.GALLERY)
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      callback(items);
    }, err => {
      console.warn("Gallery listener notice:", err);
      window.adminDb.collection(COLLECTIONS.GALLERY).get().then(snap => {
        const items = [];
        snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
        callback(items);
      });
    });

  activeListeners.gallery = unsubscribe;
  return unsubscribe;
}

async function addGalleryItem(itemData) {
  if (!window.adminDb) throw new Error("Database not connected");
  const docRef = await window.adminDb.collection(COLLECTIONS.GALLERY).add({
    ...itemData,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Add Gallery Item", `Added photo: ${itemData.title}`);
  return docRef.id;
}

async function updateGalleryItem(id, itemData) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.GALLERY).doc(id).update({
    ...itemData,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Update Gallery Item", `Updated photo: ${itemData.title || id}`);
}

async function deleteGalleryItem(id, title) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.GALLERY).doc(id).delete();
  await logAdminActivity("Delete Gallery Item", `Deleted photo: ${title || id}`);
}

// -------------------------------------------------------------
// 8. TESTIMONIALS CRUD
// -------------------------------------------------------------
function listenToTestimonials(callback) {
  if (!window.adminDb) return () => {};
  if (activeListeners.testimonials) activeListeners.testimonials();

  const unsubscribe = window.adminDb.collection(COLLECTIONS.TESTIMONIALS)
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      const reviews = [];
      snapshot.forEach(doc => reviews.push({ id: doc.id, ...doc.data() }));
      callback(reviews);
    }, err => {
      console.warn("Testimonials listener notice:", err);
      window.adminDb.collection(COLLECTIONS.TESTIMONIALS).get().then(snap => {
        const reviews = [];
        snap.forEach(doc => reviews.push({ id: doc.id, ...doc.data() }));
        callback(reviews);
      });
    });

  activeListeners.testimonials = unsubscribe;
  return unsubscribe;
}

async function addTestimonial(testData) {
  if (!window.adminDb) throw new Error("Database not connected");
  const docRef = await window.adminDb.collection(COLLECTIONS.TESTIMONIALS).add({
    ...testData,
    rating: Number(testData.rating) || 5,
    published: testData.published !== undefined ? testData.published : true,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Add Testimonial", `Added review from: ${testData.clientName}`);
  return docRef.id;
}

async function updateTestimonial(id, testData) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.TESTIMONIALS).doc(id).update({
    ...testData,
    rating: Number(testData.rating) || 5,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Update Testimonial", `Updated review: ${testData.clientName || id}`);
}

async function toggleTestimonialPublished(id, isPublished) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.TESTIMONIALS).doc(id).update({
    published: isPublished,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Toggle Testimonial", `Set review ${id} published: ${isPublished}`);
}

async function deleteTestimonial(id, clientName) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.TESTIMONIALS).doc(id).delete();
  await logAdminActivity("Delete Testimonial", `Deleted review: ${clientName || id}`);
}

// -------------------------------------------------------------
// 9. CONTACT MESSAGES CRUD
// -------------------------------------------------------------
function listenToMessages(callback) {
  if (!window.adminDb) return () => {};
  if (activeListeners.messages) activeListeners.messages();

  const unsubscribe = window.adminDb.collection(COLLECTIONS.MESSAGES)
    .orderBy("submittedAt", "desc")
    .onSnapshot(snapshot => {
      const msgs = [];
      snapshot.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
      callback(msgs);
    }, err => {
      console.warn("Messages listener notice:", err);
      window.adminDb.collection(COLLECTIONS.MESSAGES).get().then(snap => {
        const msgs = [];
        snap.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
        callback(msgs);
      });
    });

  activeListeners.messages = unsubscribe;
  return unsubscribe;
}

async function updateMessageStatus(id, newStatus) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.MESSAGES).doc(id).update({
    status: newStatus,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

async function deleteMessage(id) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.MESSAGES).doc(id).delete();
  await logAdminActivity("Delete Message", `Deleted contact inquiry ${id}`);
}

// -------------------------------------------------------------
// 10. IMAGE UPLOADER (Firebase Storage with Base64 / Local URL Fallback)
// -------------------------------------------------------------
async function uploadImageFile(file, folderName = "uploads") {
  if (!file) return null;

  // Attempt Firebase Storage Upload first
  if (window.adminStorage) {
    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `academy_${folderName}/${Date.now()}_${cleanFileName}`;
      const storageRef = window.adminStorage.ref(storagePath);
      
      const uploadTask = await storageRef.put(file);
      const downloadUrl = await uploadTask.ref.getDownloadURL();
      return downloadUrl;
    } catch (storageErr) {
      console.warn("Firebase Storage direct upload notice, using Base64 data URL fallback:", storageErr);
    }
  }

  // Graceful fallback to FileReader Base64 for guaranteed persistence in Firestore
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// -------------------------------------------------------------
// 11. ONE-CLICK INITIAL DATA SEEDER
// -------------------------------------------------------------
async function seedInitialAcademyData() {
  if (!window.adminDb) throw new Error("Database not connected");

  // Initial Courses Data
  const INITIAL_COURSES = [
    {
      title: "Noorani Qaida with Tajweed",
      arabicTitle: "القاعدة النورانية",
      category: "Beginners & Kids",
      duration: "2 - 4 Months",
      targetAudience: "Kids (4+ years) and beginner adults",
      classesPerWeek: "3 - 5 classes/week (30 mins each)",
      prerequisites: "None! Zero prior Arabic knowledge needed.",
      shortDescription: "The essential first foundation. Master Arabic alphabet recognition, correct Makharij (pronunciation points), Harakaat, Tanween, and Sukoon.",
      fullDescription: "A systematic curriculum designed to take a complete novice to fluent reading. Covers articulation points of each letter, vowel marks, compound letters, rules of Noon Sakinah and Meem Sakinah.",
      feeUSD: 35,
      feePKR: 4500,
      iconClass: "fa-solid fa-font",
      imageUrl: "assets/images/1.jpeg",
      active: true,
      featured: true,
      syllabusModules: [
        { level: "Module 1", desc: "Arabic Alphabet recognition, individual letter shapes, correct Makharij (points of articulation)." },
        { level: "Module 2", desc: "Compound letters (Murakkabat), Harakaat (Fatha, Kasra, Dammah), and short vowel rules." },
        { level: "Module 3", desc: "Huroof-e-Maddah (prolongation letters), Leen letters, Tanween, Sukoon / Jazm." },
        { level: "Module 4", desc: "Tashdeed (Shaddah), Nun Sakinah & Tanween rules (Izhar, Ikhfa, Idgham, Iqlab), and transition to Quranic words." }
      ],
      includes: ["1-on-1 Certified Tutor", "Interactive Digital Qaida PDF", "Daily Tajweed Correction", "Monthly Progress Exam", "Certificate of Completion"]
    },
    {
      title: "Quran Reading with Tajweed (Nazra)",
      arabicTitle: "تلاوة القرآن الكريم بالتجويد",
      category: "Most Popular",
      duration: "6 - 12 Months",
      targetAudience: "Students who completed Qaida and want fluent recitation",
      classesPerWeek: "3 - 5 classes/week (30 mins each)",
      prerequisites: "Basic letter reading ability (or Noorani Qaida).",
      shortDescription: "Read the Holy Quran with correct accent, breath control, melodious tone, and pristine application of classical Tajweed rules.",
      fullDescription: "Comprehensive Nazra program from Surah Al-Fatihah to Surah An-Nas. Incorporates live screen sharing of colored Tajweed Mushaf with personalized feedback.",
      feeUSD: 45,
      feePKR: 6000,
      iconClass: "fa-solid fa-book-open-reader",
      imageUrl: "assets/images/3.jpeg",
      active: true,
      featured: true,
      syllabusModules: [
        { level: "Module 1: Basic Fluency", desc: "Reading short Surahs from Juz 30 (Amma) with correct stops (Waqf) and breath control." },
        { level: "Module 2: Core Tajweed Rules", desc: "Madd (elongation types), Meem Sakinah rules, Ghunnah, Qalqalah (echo letters)." },
        { level: "Module 3: Advanced Tajweed", desc: "Heavy & light letters (Tafkheem & Tarqeeq), Hamzat-ul-Wasl rules, signs of stopping in Quran." },
        { level: "Module 4: Full Nazra Completion", desc: "Reciting from Surah Al-Baqarah to An-Nas with melodious tone, fluent speed, and zero grammatical errors." }
      ],
      includes: ["Male or Female Certified Qari", "Screen-shared Mushaf with colored Tajweed rules", "Salah & Kalima practice", "Monthly evaluation report"]
    },
    {
      title: "Hifz-ul-Quran (Quran Memorization)",
      arabicTitle: "حفظ القرآن الكريم",
      category: "Intensive",
      duration: "2 - 3 Years (Customized Fast-Track Available)",
      targetAudience: "Dedicated boys, girls, and adults aiming to become Hafiz-e-Quran",
      classesPerWeek: "5 - 6 classes/week (45 mins each)",
      prerequisites: "Fluent Quran recitation with Tajweed.",
      shortDescription: "Memorize the complete Quran or selected Surahs under the 1-on-1 mentorship of senior Huffaz with structured daily revision cycles.",
      fullDescription: "Proven classical methodology balancing Sabaq (new memorization), Sabqi (recent revision), and Manzil (cumulative retention).",
      feeUSD: 70,
      feePKR: 9500,
      iconClass: "fa-solid fa-brain",
      imageUrl: "assets/images/4.jpeg",
      active: true,
      featured: true,
      syllabusModules: [
        { level: "Phase 1: Foundation (Juz 30 & 29)", desc: "Memorizing Juz Amma with pristine Tajweed, establishing memorization muscle." },
        { level: "Phase 2: Core Memorization (Sabaq)", desc: "Daily new lesson memorization (half page to 1 full page daily)." },
        { level: "Phase 3: Revision Cycle (Sabqi & Manzil)", desc: "Systematic revision of recent and old Juz every single day to cement memory." },
        { level: "Phase 4: Sanad Preparation & Final Test", desc: "Full 30 Juz revision without mistakes under the guidance of Senior Huffaz." }
      ],
      includes: ["1-on-1 Hafiz/Hafiza Mentor", "Daily Sabaq & Sabqi Tracking Sheet", "Quarterly Board Exams", "Ijazah & Graduation Certificate"]
    },
    {
      title: "Quran Translation & Tafseer (Tarjuma)",
      arabicTitle: "ترجمة وتفسير القرآن الكريم",
      category: "Youth & Adults",
      duration: "1 - 2 Years",
      targetAudience: "Youth & Adults wanting to understand Quran in Urdu or English",
      classesPerWeek: "2 - 3 classes/week (40 mins each)",
      prerequisites: "Basic Quran reading.",
      shortDescription: "Unlock the divine wisdom. Understand word-by-word Arabic translation, context of revelation (Asbab al-Nuzul), and daily practical life lessons.",
      fullDescription: "Gain clarity of Allah's divine commandments and moral teachings. Taught by Alim/Alimah degree holders with bilingual discussions.",
      feeUSD: 55,
      feePKR: 7500,
      iconClass: "fa-solid fa-language",
      imageUrl: "assets/images/2.jpeg",
      active: true,
      featured: false,
      syllabusModules: [
        { level: "Module 1", desc: "Word-by-word literal translation of frequently used Quranic vocabulary." },
        { level: "Module 2", desc: "Context of Revelation (Asbab al-Nuzul) and historical background of Surahs." },
        { level: "Module 3", desc: "Tafseer of selected profound Surahs (Surah Al-Fatihah, Al-Kahf, Yaseen, Ar-Rahman, Al-Mulk)." },
        { level: "Module 4", desc: "Practical application of Quranic commandments in contemporary daily life." }
      ],
      includes: ["Alim/Alimah Degree Holder Tutors", "Bilingual Explanations (Urdu & English)", "Q&A Sessions", "Class Notes & Summary Slides"]
    },
    {
      title: "Islamic Studies, Namaz & Daily Duas",
      arabicTitle: "الدراسات الإسلامية والأدعية",
      category: "Kids & Reverts",
      duration: "6 Months Ongoing",
      targetAudience: "Children (5-16 years) & new reverts to Islam",
      classesPerWeek: "2 - 3 classes/week (30 mins each)",
      prerequisites: "None.",
      shortDescription: "Nurture righteous character (Akhlaaq). Master step-by-step Salah, Six Kalimas, 40 Masnoon Duas, and inspiring stories of the Prophets.",
      fullDescription: "An interactive faith foundation course instilling true love for Allah and Prophet Muhammad (PBUH) in a child-friendly atmosphere.",
      feeUSD: 40,
      feePKR: 5000,
      iconClass: "fa-solid fa-hands-praying",
      imageUrl: "assets/images/1.jpeg",
      active: true,
      featured: false,
      syllabusModules: [
        { level: "Module 1: Pillars & Beliefs", desc: "Six Kalimas, Articles of Faith (Iman-e-Mufassal & Mujmal), 5 Pillars of Islam." },
        { level: "Module 2: Practical Salah (Namaz)", desc: "Step-by-step Wudu, Salah method with translation, Sunnahs, and common mistakes." },
        { level: "Module 3: Daily Masnoon Duas", desc: "Sleeping, waking, eating, leaving home, entering mosque, traveling, and protection Duas." },
        { level: "Module 4: Seerah & Islamic Character", desc: "Life of Prophet Muhammad (PBUH), stories of Prophets, Akhlaaq & Adaab (etiquettes)." }
      ],
      includes: ["Interactive Islamic Stories", "Illustrated Duas Worksheets", "Character Building Focus", "Certificate of Achievement"]
    },
    {
      title: "Quranic Arabic & Grammar Basics",
      arabicTitle: "قواعد اللغة العربية للقرآن",
      category: "Language & Grammar",
      duration: "6 - 9 Months",
      targetAudience: "Students eager to understand Arabic grammar (Nahw & Sarf) directly",
      classesPerWeek: "2 - 3 classes/week (45 mins each)",
      prerequisites: "Basic Quran reading.",
      shortDescription: "Decode the linguistic beauty of Arabic. Learn basic Nahw & Sarf rules to directly comprehend 80% of Quranic vocabulary without translation.",
      fullDescription: "Specialized language foundation enabling readers to taste the literary eloquence of the Holy Quran.",
      feeUSD: 60,
      feePKR: 8000,
      iconClass: "fa-solid fa-graduation-cap",
      imageUrl: "assets/images/2.jpeg",
      active: true,
      featured: false,
      syllabusModules: [
        { level: "Module 1: Arabic Morphology (Sarf)", desc: "Root letter system, 3-letter verbs, past/present/imperative conjugation patterns." },
        { level: "Module 2: Arabic Syntax (Nahw)", desc: "Noun sentences, verb sentences, Harf-e-Jarr, pronouns, and I'rab (case endings)." },
        { level: "Module 3: Quranic Vocabulary", desc: "Mastering the 80% most repeated words in the Holy Quran." },
        { level: "Module 4: Direct Ayah Breakdown", desc: "Grammatical analysis (Tarkeeb) of short Surahs and famous Ayahs." }
      ],
      includes: ["Comprehensive Grammar Exercises", "Arabic Vocabulary Flashcards", "Guided Translation Practice", "Qualified Arabic Linguist"]
    }
  ];

  // Initial Slider Banners
  const INITIAL_SLIDERS = [
    {
      title: "Noorani Qaida with Tajweed for Kids & Adults",
      subtitle: "Start with correct Arabic pronunciation (Makharij) and foundations.",
      badge: "Beginners First Step",
      imageUrl: "assets/images/1.jpeg",
      linkUrl: "#free-trial",
      order: 1,
      active: true
    },
    {
      title: "Nazra Quran Reading with Correct Pronunciation",
      subtitle: "Recite the Holy Quran fluently with verified Tajweed rules.",
      badge: "Most Popular Program",
      imageUrl: "assets/images/3.jpeg",
      linkUrl: "#free-trial",
      order: 2,
      active: true
    },
    {
      title: "Hifz e Quran Class - Memorize with Confidence",
      subtitle: "Personalized 1-on-1 memorization tracking with senior Huffaz.",
      badge: "Intensive Memorization",
      imageUrl: "assets/images/4.jpeg",
      linkUrl: "#free-trial",
      order: 3,
      active: true
    },
    {
      title: "Faham e Deen, Quran Translation & Tafseer",
      subtitle: "Deepen your understanding and connection with the words of Allah.",
      badge: "Wisdom & Understanding",
      imageUrl: "assets/images/2.jpeg",
      linkUrl: "#free-trial",
      order: 4,
      active: true
    },
    {
      title: "Hale Noor Online Quran Academy - Path of Guidance",
      subtitle: "Certified Male & Female Scholars providing live 1-on-1 classes worldwide.",
      badge: "Official Emblem",
      imageUrl: "assets/images/logo.jpeg",
      linkUrl: "#free-trial",
      order: 5,
      active: true
    }
  ];

  // Initial Teachers Data
  const INITIAL_TEACHERS = [
    {
      name: "Qari Muhammad Abdullah",
      arabicTitle: "القارئ محمد عبد الله",
      gender: "Male",
      qualification: "Sanad in Qira'at Hafs & Wifaq-ul-Madaris Alimiyyah Degree",
      experience: "9+ Years Teaching Online",
      languages: "English, Urdu, Arabic",
      specialization: "Tajweed Mastery, Nazra Fluency, Maqamat",
      bio: "Senior Qari with recognized certifications in Tajweed and 9 years of teaching students across the USA, UK, and Canada.",
      imageUrl: "assets/images/logo.png",
      rating: 5.0,
      active: true
    },
    {
      name: "Ustadha Fatima Noor",
      arabicTitle: "الأستاذة فاطمة نور",
      gender: "Female",
      qualification: "Hafiza-e-Quran & Early Childhood Islamic Pedagogy Certified",
      experience: "7+ Years Teaching Online",
      languages: "English, Urdu",
      specialization: "Noorani Qaida, Kids Nazra, Daily Duas & Salah",
      bio: "Dedicated female tutor specializing in patient, gentle instruction for young children (ages 4-10) and sister students.",
      imageUrl: "assets/images/logo.png",
      rating: 4.9,
      active: true
    },
    {
      name: "Sheikh Ahmad Al-Misri",
      arabicTitle: "الشيخ أحمد المصري",
      gender: "Male",
      qualification: "Graduate of Faculty of Quranic Sciences, Al-Azhar University",
      experience: "12+ Years Experience",
      languages: "Arabic, English",
      specialization: "Hifz Quran, Advanced Tajweed, Arabic Grammar",
      bio: "Master memorization instructor who has guided more than 40 students to complete the memorization of the Holy Quran.",
      imageUrl: "assets/images/logo.png",
      rating: 5.0,
      active: true
    },
    {
      name: "Ustadha Maryam Siddiqa",
      arabicTitle: "الأستاذة مريم صديقة",
      gender: "Female",
      qualification: "Alimah Fazilah & Master in Islamic Studies",
      experience: "6+ Years Online",
      languages: "English, Urdu",
      specialization: "Tafseer, Islamic Studies for Sisters, Seerah",
      bio: "Compassionate Alimah scholar guiding teenagers and adult women in understanding the Quranic message with practical application.",
      imageUrl: "assets/images/logo.png",
      rating: 4.9,
      active: true
    }
  ];

  // Initial Testimonials
  const INITIAL_TESTIMONIALS = [
    {
      clientName: "Fatima Al-Sayed",
      studentName: "Maryam (Age 7)",
      location: "Birmingham, United Kingdom 🇬🇧",
      course: "Noorani Qaida with Tajweed",
      rating: 5,
      feedback: "My 7-year-old daughter was struggling with Arabic letters at a local weekend school. Within just 3 months with her female tutor at Hale Noor Academy, she completed Noorani Qaida and is now reciting Quran smoothly with Tajweed. The teacher is exceptionally gentle and patient.",
      published: true,
      featured: true
    },
    {
      clientName: "Tariq Khan",
      studentName: "Zayd & Bilal (Ages 9 & 12)",
      location: "Dallas, Texas, USA 🇺🇸",
      course: "Quran Reading with Tajweed (Nazra)",
      rating: 5,
      feedback: "Finding punctual and trustworthy Quran tutors in the USA with convenient timing was always a headache. Hale Noor accommodated our 7:00 PM Central time perfectly. Both my sons look forward to their daily 30-minute class. JazakAllah Khair to the administration!",
      published: true,
      featured: true
    },
    {
      clientName: "Zainab Malik",
      studentName: "Self (Adult Learner)",
      location: "Toronto, Ontario, Canada 🇨🇦",
      course: "Quran Translation & Tafseer (Tarjuma)",
      rating: 5,
      feedback: "I started their Quran Translation and Tafseer course as a working mother. The teacher explains the context of each Surah in clear English and Urdu. It has deepened my understanding and peace of mind during Salah. Highly recommend Hale Noor for adults too.",
      published: true,
      featured: true
    }
  ];

  // Initial Gallery Items
  const INITIAL_GALLERY = [
    {
      title: "Interactive Live 1-on-1 Classes",
      category: "Online Classes",
      imageUrl: "assets/images/1.jpeg",
      description: "Screen sharing digital Noorani Qaida with real-time Tajweed correction.",
      featured: true
    },
    {
      title: "Quran Recitation Nazra Program",
      category: "Tajweed & Nazra",
      imageUrl: "assets/images/3.jpeg",
      description: "Students reciting Juz Amma with melody and classical rules.",
      featured: true
    },
    {
      title: "Hifz-ul-Quran Memorization Milestone",
      category: "Hifz Program",
      imageUrl: "assets/images/4.jpeg",
      description: "Student completion evaluation with senior scholars.",
      featured: true
    },
    {
      title: "Faham e Deen & Islamic Values Session",
      category: "Islamic Studies",
      imageUrl: "assets/images/2.jpeg",
      description: "Understanding Prophet stories and moral ethics.",
      featured: true
    }
  ];

  // Batch insert courses
  for (const c of INITIAL_COURSES) {
    await addCourse(c);
  }

  // Batch insert sliders
  for (const s of INITIAL_SLIDERS) {
    await addSlider(s);
  }

  // Batch insert teachers
  for (const t of INITIAL_TEACHERS) {
    await addTeacher(t);
  }

  // Batch insert testimonials
  for (const tm of INITIAL_TESTIMONIALS) {
    await addTestimonial(tm);
  }

  // Batch insert gallery
  for (const g of INITIAL_GALLERY) {
    await addGalleryItem(g);
  }

  await logAdminActivity("Database Seeder", "Initialized all default academy courses, sliders, teachers, and testimonials.");
  return true;
}

// -------------------------------------------------------------
// 10. ADMIN USERS & ROLES
// -------------------------------------------------------------
function listenToAdmins(callback) {
  if (!window.adminDb) return () => {};
  if (activeListeners.admins) activeListeners.admins();

  const unsubscribe = window.adminDb.collection(COLLECTIONS.ADMINS)
    .onSnapshot(snapshot => {
      const admins = [];
      snapshot.forEach(doc => admins.push({ id: doc.id, ...doc.data() }));
      callback(admins);
    }, err => {
      console.warn("Admins listener fallback:", err);
      window.adminDb.collection(COLLECTIONS.ADMINS).get().then(snap => {
        const admins = [];
        snap.forEach(doc => admins.push({ id: doc.id, ...doc.data() }));
        callback(admins);
      }).catch(e => console.error("Admins get error:", e));
    });

  activeListeners.admins = unsubscribe;
  return unsubscribe;
}

async function addAdminUser(adminData) {
  if (!window.adminDb) throw new Error("Database not connected");

  let authUid = null;
  // If a password was provided, attempt to register in Firebase Auth via secondary app without disconnecting current session
  if (adminData.password && typeof firebase !== 'undefined' && typeof FIREBASE_CONFIG !== 'undefined') {
    try {
      const secAppName = 'SecAuthApp_' + Date.now();
      const secApp = firebase.initializeApp(FIREBASE_CONFIG, secAppName);
      const userCred = await secApp.auth().createUserWithEmailAndPassword(adminData.email.trim(), adminData.password);
      authUid = userCred.user.uid;
      if (adminData.displayName) {
        await userCred.user.updateProfile({ displayName: adminData.displayName });
      }
      await secApp.delete();
    } catch (authErr) {
      console.warn("Secondary Firebase Auth notice:", authErr);
      if (authErr.code !== 'auth/email-already-in-use') {
        throw new Error(authErr.message || "Failed to create Firebase Auth user.");
      }
    }
  }

  const profileData = {
    displayName: adminData.displayName || adminData.email.split('@')[0],
    email: adminData.email.trim().toLowerCase(),
    role: adminData.role || "Administrator",
    phone: adminData.phone || "",
    status: adminData.status || "Active",
    notes: adminData.notes || "",
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  if (authUid) {
    await window.adminDb.collection(COLLECTIONS.ADMINS).doc(authUid).set(profileData, { merge: true });
  } else {
    await window.adminDb.collection(COLLECTIONS.ADMINS).add(profileData);
  }

  await logAdminActivity("Add Admin", `Created admin user: ${adminData.email} (${adminData.role})`);
  return true;
}

async function updateAdminUser(id, adminData) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.ADMINS).doc(id).update({
    ...adminData,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAdminActivity("Update Admin", `Updated admin account: ${adminData.email || id}`);
}

async function deleteAdminUser(id, email) {
  if (!window.adminDb) throw new Error("Database not connected");
  await window.adminDb.collection(COLLECTIONS.ADMINS).doc(id).delete();
  await logAdminActivity("Delete Admin", `Removed admin user: ${email || id}`);
}

// -------------------------------------------------------------
// CREDENTIALS SET/RESET OPERATIONS (STUDENTS & TEACHERS)
// -------------------------------------------------------------
async function updateStudentCredentials(id, { username, password }) {
  if (!window.adminDb) throw new Error("Database not connected");
  const updates = {
    username: (username || '').trim(),
    password: (password || '').trim(),
    credentialsUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  await window.adminDb.collection(COLLECTIONS.STUDENTS).doc(id).update(updates);
  await logAdminActivity("Student Credentials", `Updated login credentials for student ID: ${id}`);
}

async function updateTeacherCredentials(id, { username, password }) {
  if (!window.adminDb) throw new Error("Database not connected");
  const updates = {
    username: (username || '').trim(),
    password: (password || '').trim(),
    credentialsUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  await window.adminDb.collection(COLLECTIONS.TEACHERS).doc(id).update(updates);
  await logAdminActivity("Teacher Credentials", `Updated login credentials for teacher ID: ${id}`);
}

// Export functions to window
window.adminDbOperations = {
  fetchDashboardStats,
  logAdminActivity,
  // Admin Users & Roles
  listenToAdmins,
  addAdminUser,
  updateAdminUser,
  deleteAdminUser,
  // Credentials
  updateStudentCredentials,
  updateTeacherCredentials,
  // Courses
  listenToCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  // Teachers
  listenToTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  // Students
  listenToStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  // Enrollments
  listenToEnrollments,
  updateEnrollmentStatus,
  scheduleTrialClass,
  convertLeadToStudent,
  deleteEnrollment,
  // Sliders
  listenToSliders,
  addSlider,
  updateSlider,
  toggleSliderActive,
  deleteSlider,
  // Gallery
  listenToGallery,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  // Testimonials
  listenToTestimonials,
  addTestimonial,
  updateTestimonial,
  toggleTestimonialPublished,
  deleteTestimonial,
  // Messages
  listenToMessages,
  updateMessageStatus,
  deleteMessage,
  // Storage & Seeder
  uploadImageFile,
  seedInitialAcademyData
};
