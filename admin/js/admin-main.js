/**
 * Hale Noor Quran Academy - Admin Panel Main Orchestration Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Auth
  if (typeof window.initAdminAuth === 'function') {
    window.initAdminAuth();
  }

  // Bind Navigation Links
  document.querySelectorAll('.sidebar-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      if (section) window.switchSection(section);
    });
  });

  // Mobile Drawer Toggles
  const hamburger = document.getElementById('admin-sidebar-toggle');
  const overlay = document.getElementById('mobile-sidebar-overlay');
  if (hamburger) hamburger.addEventListener('click', window.openMobileSidebar);
  if (overlay) overlay.addEventListener('click', window.closeMobileSidebar);

  // Setup Module Forms and Filter Listeners
  setupCourseEventListeners();
  setupTeacherEventListeners();
  setupStudentEventListeners();
  setupAdminUserEventListeners();
  setupCredentialsModalsEvents();
  setupEnrollmentEventListeners();
  setupSliderEventListeners();
  setupGalleryEventListeners();
  setupTestimonialEventListeners();
  setupMessageEventListeners();
  setupDatabaseSeederEventListener();
});

// Triggered when an authorized Admin logs in
window.onAdminAuthenticated = function(user) {
  startRealtimeListeners();
  loadInitialStats();
};

// -------------------------------------------------------------
// Realtime Data Subscription Hub
// -------------------------------------------------------------
function startRealtimeListeners() {
  const dbOps = window.adminDbOperations;
  if (!dbOps) return;

  // 1. Courses
  dbOps.listenToCourses(courses => {
    adminState.courses = courses;
    window.renderCoursesTable(courses);
    updateMetricsLive();
  });

  // 2. Teachers
  dbOps.listenToTeachers(teachers => {
    adminState.teachers = teachers;
    window.renderTeachersTable(teachers);
    updateMetricsLive();
  });

  // 3. Students
  dbOps.listenToStudents(students => {
    adminState.students = students;
    window.renderStudentsTable(students);
    window.renderOverview();
    updateMetricsLive();
  });

  // 4. Enrollments / Leads
  dbOps.listenToEnrollments(leads => {
    adminState.enrollments = leads;
    window.renderEnrollmentsTable(leads);
    window.renderOverview();
    updateMetricsLive();
  });

  // 5. Sliders
  dbOps.listenToSliders(sliders => {
    adminState.sliders = sliders;
    window.renderSlidersTable(sliders);
  });

  // 6. Gallery
  dbOps.listenToGallery(items => {
    adminState.gallery = items;
    window.renderGalleryGrid(items);
  });

  // 7. Testimonials
  dbOps.listenToTestimonials(reviews => {
    adminState.testimonials = reviews;
    window.renderTestimonialsTable(reviews);
  });

  // 8. Messages
  dbOps.listenToMessages(messages => {
    adminState.messages = messages;
    window.renderMessagesTable(messages);
    window.renderOverview();
    updateMetricsLive();
  });

  // 9. Admin Users & Roles
  dbOps.listenToAdmins(admins => {
    adminState.admins = admins;
    if (typeof window.renderAdminsTable === 'function') {
      window.renderAdminsTable(admins);
    }
    updateMetricsLive();
  });
}

async function loadInitialStats() {
  if (!window.adminDbOperations) return;
  const stats = await window.adminDbOperations.fetchDashboardStats();
  if (stats) {
    adminState.stats = stats;
    window.renderOverview();
  }
}

function updateMetricsLive() {
  const totalStudents = adminState.students.length;
  const totalTeachers = adminState.teachers.length;
  const totalCourses = adminState.courses.length;
  
  let activeEnroll = 0;
  let pendingEnroll = 0;
  adminState.enrollments.forEach(e => {
    const s = (e.status || 'New').toLowerCase();
    if (s === 'approved' || s === 'active' || s === 'scheduled' || s === 'converted') activeEnroll++;
    else if (s === 'new' || s === 'pending' || s === 'contacted') pendingEnroll++;
  });

  let unreadMsgs = 0;
  adminState.messages.forEach(m => {
    if ((m.status || 'Unread').toLowerCase() === 'unread') unreadMsgs++;
  });

  adminState.stats = {
    totalStudents,
    totalTeachers,
    totalCourses,
    activeEnrollments: activeEnroll,
    pendingEnrollments: pendingEnroll,
    totalMessages: adminState.messages.length,
    unreadMessages: unreadMsgs
  };

  window.renderOverview();
}

// -------------------------------------------------------------
// 1. COURSES MODULE LOGIC
// -------------------------------------------------------------
function setupCourseEventListeners() {
  const addBtn = document.getElementById('btn-add-course');
  const modal = document.getElementById('course-form-modal');
  const form = document.getElementById('course-edit-form');
  const searchInput = document.getElementById('search-courses');
  const categoryFilter = document.getElementById('filter-course-category');
  const addModuleBtn = document.getElementById('btn-add-syllabus-row');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      form.reset();
      document.getElementById('course-form-id').value = '';
      document.getElementById('course-modal-title').textContent = "Add New Quran Course";
      resetSyllabusModulesContainer();
      openModal('course-form-modal');
    });
  }

  if (addModuleBtn) {
    addModuleBtn.addEventListener('click', () => {
      addSyllabusRow('', '');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCourses);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterCourses);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('course-form-id').value;
      const title = document.getElementById('course-title').value.trim();
      const arabicTitle = document.getElementById('course-arabic-title').value.trim();
      const category = document.getElementById('course-category').value;
      const duration = document.getElementById('course-duration').value.trim();
      const targetAudience = document.getElementById('course-target').value.trim();
      const classesPerWeek = document.getElementById('course-classes-week').value.trim();
      const prerequisites = document.getElementById('course-prerequisites').value.trim();
      const feeUSD = Number(document.getElementById('course-fee-usd').value) || 45;
      const feePKR = Number(document.getElementById('course-fee-pkr').value) || 6000;
      const iconClass = document.getElementById('course-icon').value.trim() || 'fa-solid fa-book-open';
      const shortDescription = document.getElementById('course-short-desc').value.trim();
      const fullDescription = document.getElementById('course-full-desc').value.trim();
      const active = document.getElementById('course-active').checked;
      const featured = document.getElementById('course-featured').checked;

      // Extract Syllabus Modules
      const syllabusModules = [];
      document.querySelectorAll('.syllabus-row').forEach(row => {
        const lvl = row.querySelector('.syllabus-level-input')?.value.trim();
        const desc = row.querySelector('.syllabus-desc-input')?.value.trim();
        if (lvl || desc) {
          syllabusModules.push({ level: lvl || 'Module', desc: desc || '' });
        }
      });

      // Handle Image file or URL
      let imageUrl = document.getElementById('course-image-url').value.trim();
      const imageFile = document.getElementById('course-image-file').files[0];
      if (imageFile) {
        showToast("Uploading course image...", "info");
        try {
          imageUrl = await window.adminDbOperations.uploadImageFile(imageFile, "courses");
        } catch (err) {
          console.warn("Image upload issue:", err);
        }
      }

      const courseData = {
        title,
        arabicTitle,
        category,
        duration,
        targetAudience,
        classesPerWeek,
        prerequisites,
        feeUSD,
        feePKR,
        iconClass,
        imageUrl: imageUrl || "assets/images/1.jpeg",
        shortDescription,
        fullDescription,
        active,
        featured,
        syllabusModules: syllabusModules.length ? syllabusModules : [
          { level: "Module 1", desc: "Foundational reading and Makharij points." }
        ],
        includes: ["1-on-1 Certified Tutor", "Interactive Digital Qaida PDF", "Daily Tajweed Correction", "Certificate of Completion"]
      };

      try {
        if (id) {
          await window.adminDbOperations.updateCourse(id, courseData);
          showToast("Course updated successfully!", "success");
        } else {
          await window.adminDbOperations.addCourse(courseData);
          showToast("New Course created successfully!", "success");
        }
        closeModal('course-form-modal');
      } catch (err) {
        console.error("Course save error:", err);
        showToast(err.message || "Failed to save course.", "error");
      }
    });
  }
}

function resetSyllabusModulesContainer() {
  const container = document.getElementById('syllabus-modules-container');
  if (!container) return;
  container.innerHTML = '';
  addSyllabusRow('Module 1: Alphabets & Articulation', 'Basic letter recognition and articulation points.');
  addSyllabusRow('Module 2: Tajweed Application', 'Applying short vowels and connecting rules.');
}

function addSyllabusRow(levelVal = '', descVal = '') {
  const container = document.getElementById('syllabus-modules-container');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'syllabus-row flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200';
  row.innerHTML = `
    <input type="text" placeholder="e.g. Module 1: Basics" value="${levelVal}" class="syllabus-level-input w-full sm:w-1/3 p-2 rounded-lg border border-slate-300 text-xs font-bold focus:ring-1 focus:ring-emerald-600">
    <input type="text" placeholder="Topics covered in this module..." value="${descVal}" class="syllabus-desc-input flex-grow p-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-600">
    <button type="button" class="p-2 text-slate-400 hover:text-red-600 rounded-lg transition" onclick="this.closest('.syllabus-row').remove()" title="Remove module">
      <i class="fa-solid fa-trash-can text-xs"></i>
    </button>
  `;
  container.appendChild(row);
}

function editCourseModal(id) {
  const course = adminState.courses.find(c => c.id === id);
  if (!course) return;

  document.getElementById('course-form-id').value = course.id;
  document.getElementById('course-modal-title').textContent = `Edit Course: ${course.title}`;
  document.getElementById('course-title').value = course.title || '';
  document.getElementById('course-arabic-title').value = course.arabicTitle || '';
  document.getElementById('course-category').value = course.category || 'General';
  document.getElementById('course-duration').value = course.duration || '';
  document.getElementById('course-target').value = course.targetAudience || '';
  document.getElementById('course-classes-week').value = course.classesPerWeek || '';
  document.getElementById('course-prerequisites').value = course.prerequisites || '';
  document.getElementById('course-fee-usd').value = course.feeUSD || 45;
  document.getElementById('course-fee-pkr').value = course.feePKR || 6000;
  document.getElementById('course-icon').value = course.iconClass || 'fa-solid fa-book-open';
  document.getElementById('course-image-url').value = course.imageUrl || '';
  document.getElementById('course-short-desc').value = course.shortDescription || '';
  document.getElementById('course-full-desc').value = course.fullDescription || '';
  document.getElementById('course-active').checked = course.active !== undefined ? course.active : true;
  document.getElementById('course-featured').checked = course.featured || false;

  const container = document.getElementById('syllabus-modules-container');
  if (container) {
    container.innerHTML = '';
    const mods = course.syllabusModules || [];
    if (mods.length) {
      mods.forEach(m => addSyllabusRow(m.level, m.desc));
    } else {
      resetSyllabusModulesContainer();
    }
  }

  openModal('course-form-modal');
}

function deleteCourseConfirm(id, title) {
  confirmAction({
    title: "Delete Quran Course",
    message: `Are you sure you want to permanently delete course "${title}"? This will remove it from the public website curriculum.`,
    confirmText: "Yes, Delete Course",
    onConfirm: async () => {
      try {
        await window.adminDbOperations.deleteCourse(id, title);
        showToast("Course deleted successfully.", "success");
      } catch (err) {
        showToast(err.message || "Failed to delete course.", "error");
      }
    }
  });
}

function filterCourses() {
  const query = (document.getElementById('search-courses')?.value || '').toLowerCase();
  const category = document.getElementById('filter-course-category')?.value || 'all';

  const filtered = adminState.courses.filter(c => {
    const matchesQuery = (c.title || '').toLowerCase().includes(query) ||
                         (c.arabicTitle || '').toLowerCase().includes(query) ||
                         (c.shortDescription || '').toLowerCase().includes(query);
    const matchesCat = category === 'all' || (c.category || '').toLowerCase() === category.toLowerCase();
    return matchesQuery && matchesCat;
  });

  window.renderCoursesTable(filtered);
}

// -------------------------------------------------------------
// 2. TEACHERS MODULE LOGIC
// -------------------------------------------------------------
function setupTeacherEventListeners() {
  const addBtn = document.getElementById('btn-add-teacher');
  const form = document.getElementById('teacher-edit-form');
  const searchInput = document.getElementById('search-teachers');
  const genderFilter = document.getElementById('filter-teacher-gender');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      form.reset();
      document.getElementById('teacher-form-id').value = '';
      document.getElementById('teacher-modal-title').textContent = "Add New Teacher";
      const uEl = document.getElementById('teacher-username-input');
      const pEl = document.getElementById('teacher-password-input');
      if (uEl) uEl.value = 'teacher' + Math.floor(100 + Math.random() * 900);
      if (pEl) pEl.value = 'Teacher@' + Math.floor(1000 + Math.random() * 9000);
      openModal('teacher-form-modal');
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterTeachers);
  if (genderFilter) genderFilter.addEventListener('change', filterTeachers);

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('teacher-form-id').value;
      const name = document.getElementById('teacher-name').value.trim();
      const arabicTitle = document.getElementById('teacher-arabic-title').value.trim();
      const gender = document.getElementById('teacher-gender').value;
      const qualification = document.getElementById('teacher-qualification').value.trim();
      const experience = document.getElementById('teacher-experience').value.trim();
      const languages = document.getElementById('teacher-languages').value.trim();
      const specialization = document.getElementById('teacher-specialization').value.trim();
      const bio = document.getElementById('teacher-bio').value.trim();
      const rating = Number(document.getElementById('teacher-rating').value) || 5.0;
      const active = document.getElementById('teacher-active').checked;
      const whatsappNumber = document.getElementById('teacher-whatsapp-input')?.value.trim() || '';
      const email = document.getElementById('teacher-email-input')?.value.trim() || '';
      const username = document.getElementById('teacher-username-input')?.value.trim();
      const password = document.getElementById('teacher-password-input')?.value.trim();

      let imageUrl = document.getElementById('teacher-image-url').value.trim();
      const imageFile = document.getElementById('teacher-image-file').files[0];
      if (imageFile) {
        showToast("Uploading teacher picture...", "info");
        try {
          imageUrl = await window.adminDbOperations.uploadImageFile(imageFile, "teachers");
        } catch (err) {
          console.warn("Upload picture notice:", err);
        }
      }

      const teacherData = {
        name,
        arabicTitle,
        gender,
        qualification,
        experience,
        languages,
        specialization,
        bio,
        rating,
        active,
        whatsappNumber,
        email,
        username: username || ('t.' + name.toLowerCase().replace(/[^a-z0-9]/g, '')),
        imageUrl: imageUrl || "assets/images/logo.png"
      };
      if (password) {
        teacherData.password = password;
      }

      try {
        if (id) {
          await window.adminDbOperations.updateTeacher(id, teacherData);
          showToast("Teacher profile updated!", "success");
        } else {
          await window.adminDbOperations.addTeacher(teacherData);
          showToast("New teacher registered successfully!", "success");
        }
        closeModal('teacher-form-modal');
      } catch (err) {
        showToast(err.message || "Failed to save teacher.", "error");
      }
    });
  }
}

function editTeacherModal(id) {
  const t = adminState.teachers.find(item => item.id === id);
  if (!t) return;

  document.getElementById('teacher-form-id').value = t.id;
  document.getElementById('teacher-modal-title').textContent = `Edit Teacher: ${t.name}`;
  document.getElementById('teacher-name').value = t.name || '';
  document.getElementById('teacher-arabic-title').value = t.arabicTitle || '';
  document.getElementById('teacher-gender').value = t.gender || 'Male';
  document.getElementById('teacher-qualification').value = t.qualification || '';
  document.getElementById('teacher-experience').value = t.experience || '';
  document.getElementById('teacher-languages').value = t.languages || '';
  document.getElementById('teacher-specialization').value = t.specialization || '';
  document.getElementById('teacher-bio').value = t.bio || '';
  document.getElementById('teacher-rating').value = t.rating || 5.0;
  document.getElementById('teacher-image-url').value = t.imageUrl || '';
  document.getElementById('teacher-active').checked = t.active !== undefined ? t.active : true;

  const wEl = document.getElementById('teacher-whatsapp-input');
  const eEl = document.getElementById('teacher-email-input');
  const uEl = document.getElementById('teacher-username-input');
  const pEl = document.getElementById('teacher-password-input');
  if (wEl) wEl.value = t.whatsappNumber || '';
  if (eEl) eEl.value = t.email || '';
  if (uEl) uEl.value = t.username || ('t.' + t.name.toLowerCase().replace(/[^a-z0-9]/g, ''));
  if (pEl) pEl.value = t.password || '';

  openModal('teacher-form-modal');
}

function deleteTeacherConfirm(id, name) {
  confirmAction({
    title: "Delete Teacher Profile",
    message: `Are you sure you want to remove teacher "${name}" from academy faculty records?`,
    confirmText: "Yes, Delete Teacher",
    onConfirm: async () => {
      try {
        await window.adminDbOperations.deleteTeacher(id, name);
        showToast("Teacher profile removed.", "success");
      } catch (err) {
        showToast(err.message || "Failed to delete teacher.", "error");
      }
    }
  });
}

function filterTeachers() {
  const query = (document.getElementById('search-teachers')?.value || '').toLowerCase();
  const gender = document.getElementById('filter-teacher-gender')?.value || 'all';

  const filtered = adminState.teachers.filter(t => {
    const matchesQuery = (t.name || '').toLowerCase().includes(query) ||
                         (t.qualification || '').toLowerCase().includes(query) ||
                         (t.specialization || '').toLowerCase().includes(query);
    const matchesGender = gender === 'all' || (t.gender || '').toLowerCase() === gender.toLowerCase();
    return matchesQuery && matchesGender;
  });

  window.renderTeachersTable(filtered);
}

// -------------------------------------------------------------
// 3. STUDENTS MODULE LOGIC
// -------------------------------------------------------------
function setupStudentEventListeners() {
  const addBtn = document.getElementById('btn-add-student');
  const form = document.getElementById('student-edit-form');
  const searchInput = document.getElementById('search-students');
  const statusFilter = document.getElementById('filter-student-status');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      form.reset();
      document.getElementById('student-form-id').value = '';
      document.getElementById('student-modal-title').textContent = "Enroll New Student";
      const uEl = document.getElementById('student-username-input');
      const pEl = document.getElementById('student-password-input');
      if (uEl) uEl.value = 'student' + Math.floor(100 + Math.random() * 900);
      if (pEl) pEl.value = 'Quran@' + Math.floor(1000 + Math.random() * 9000);
      openModal('student-form-modal');
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterStudents);
  if (statusFilter) statusFilter.addEventListener('change', filterStudents);

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('student-form-id').value;
      const studentName = document.getElementById('student-name-input').value.trim();
      const parentName = document.getElementById('student-parent-input').value.trim();
      const age = document.getElementById('student-age-input').value.trim();
      const enrolledCourse = document.getElementById('student-course-input').value;
      const assignedTeacher = document.getElementById('student-teacher-input').value.trim();
      const whatsappNumber = document.getElementById('student-whatsapp-input')?.value.trim() || '';
      const email = document.getElementById('student-email-input')?.value.trim() || '';
      const country = document.getElementById('student-country-input')?.value.trim() || '';
      const timezone = document.getElementById('student-timezone-input')?.value.trim() || '';
      const classTiming = document.getElementById('student-timing-input')?.value.trim() || '';
      const monthlyFee = Number(document.getElementById('student-fee-input').value) || 45;
      const currency = document.getElementById('student-currency-input').value || 'USD';
      const status = document.getElementById('student-status-input').value;
      const notes = document.getElementById('student-notes-input').value.trim();
      const username = document.getElementById('student-username-input')?.value.trim();
      const password = document.getElementById('student-password-input')?.value.trim();

      const studentData = {
        studentName,
        parentName,
        age,
        enrolledCourse,
        assignedTeacher,
        whatsappNumber,
        email,
        country,
        timezone,
        classTiming,
        monthlyFee,
        currency,
        status,
        notes,
        username: username || studentName.toLowerCase().replace(/[^a-z0-9]/g, '')
      };
      if (password) {
        studentData.password = password;
      }

      try {
        if (id) {
          await window.adminDbOperations.updateStudent(id, studentData);
          showToast("Student profile updated!", "success");
        } else {
          await window.adminDbOperations.addStudent(studentData);
          showToast("Student enrolled successfully!", "success");
        }
        closeModal('student-form-modal');
      } catch (err) {
        showToast(err.message || "Failed to save student record.", "error");
      }
    });
  }
}

function editStudentModal(id) {
  const s = adminState.students.find(item => item.id === id);
  if (!s) return;

  document.getElementById('student-form-id').value = s.id;
  document.getElementById('student-modal-title').textContent = `Edit Student: ${s.studentName}`;
  document.getElementById('student-name-input').value = s.studentName || '';
  document.getElementById('student-parent-input').value = s.parentName || '';
  document.getElementById('student-age-input').value = s.age || '';
  document.getElementById('student-course-input').value = s.enrolledCourse || 'Noorani Qaida with Tajweed';
  document.getElementById('student-teacher-input').value = s.assignedTeacher || '';
  if (document.getElementById('student-whatsapp-input')) document.getElementById('student-whatsapp-input').value = s.whatsappNumber || '';
  if (document.getElementById('student-email-input')) document.getElementById('student-email-input').value = s.email || '';
  if (document.getElementById('student-country-input')) document.getElementById('student-country-input').value = s.country || '';
  if (document.getElementById('student-timezone-input')) document.getElementById('student-timezone-input').value = s.timezone || '';
  document.getElementById('student-timing-input').value = s.classTiming || '';
  document.getElementById('student-fee-input').value = s.monthlyFee || 45;
  document.getElementById('student-currency-input').value = s.currency || 'USD';
  document.getElementById('student-status-input').value = s.status || 'Active';
  document.getElementById('student-notes-input').value = s.notes || '';

  const uEl = document.getElementById('student-username-input');
  const pEl = document.getElementById('student-password-input');
  if (uEl) uEl.value = s.username || s.studentName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (pEl) pEl.value = s.password || '';

  openModal('student-form-modal');
}

function deleteStudentConfirm(id, name) {
  confirmAction({
    title: "Delete Student Record",
    message: `Are you sure you want to permanently delete record for student "${name}"?`,
    confirmText: "Yes, Delete Record",
    onConfirm: async () => {
      try {
        await window.adminDbOperations.deleteStudent(id, name);
        showToast("Student record removed.", "success");
      } catch (err) {
        showToast(err.message || "Failed to delete student.", "error");
      }
    }
  });
}

function filterStudents() {
  const query = (document.getElementById('search-students')?.value || '').toLowerCase();
  const status = document.getElementById('filter-student-status')?.value || 'all';

  const filtered = adminState.students.filter(s => {
    const matchesQuery = (s.studentName || '').toLowerCase().includes(query) ||
                         (s.parentName || '').toLowerCase().includes(query) ||
                         (s.whatsappNumber || '').includes(query) ||
                         (s.country || '').toLowerCase().includes(query);
    const matchesStatus = status === 'all' || (s.status || '').toLowerCase() === status.toLowerCase();
    return matchesQuery && matchesStatus;
  });

  window.renderStudentsTable(filtered);
}

// -------------------------------------------------------------
// 3B. ADMIN USERS & ROLES MODULE LOGIC
// -------------------------------------------------------------
function setupAdminUserEventListeners() {
  const addBtn = document.getElementById('btn-add-admin');
  const form = document.getElementById('admin-user-edit-form');
  const searchInput = document.getElementById('search-admins');
  const roleFilter = document.getElementById('filter-admin-role');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      form.reset();
      document.getElementById('admin-user-form-id').value = '';
      document.getElementById('admin-user-modal-title').textContent = "Add New Admin User";
      document.getElementById('admin-user-password').value = "Hale@" + Math.floor(1000 + Math.random() * 9000);
      openModal('admin-user-form-modal');
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterAdmins);
  if (roleFilter) roleFilter.addEventListener('change', filterAdmins);

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('admin-user-form-id').value;
      const displayName = document.getElementById('admin-user-name').value.trim();
      const email = document.getElementById('admin-user-email').value.trim().toLowerCase();
      const role = document.getElementById('admin-user-role').value;
      const status = document.getElementById('admin-user-status').value;
      const password = document.getElementById('admin-user-password').value.trim();
      const phone = document.getElementById('admin-user-phone').value.trim();
      const notes = document.getElementById('admin-user-notes').value.trim();

      const adminData = {
        displayName,
        email,
        role,
        status,
        phone,
        notes
      };
      if (password) {
        adminData.password = password;
      }

      try {
        if (id) {
          await window.adminDbOperations.updateAdminUser(id, adminData);
          showToast("Admin user updated successfully!", "success");
        } else {
          await window.adminDbOperations.addAdminUser(adminData);
          showToast(`Admin account created for ${email}!`, "success");
        }
        closeModal('admin-user-form-modal');
      } catch (err) {
        showToast(err.message || "Failed to save admin user.", "error");
      }
    });
  }
}

function editAdminModal(id) {
  const a = adminState.admins.find(item => item.id === id);
  if (!a) return;

  document.getElementById('admin-user-form-id').value = a.id;
  document.getElementById('admin-user-modal-title').textContent = `Edit Admin: ${a.displayName || a.email}`;
  document.getElementById('admin-user-name').value = a.displayName || '';
  document.getElementById('admin-user-email').value = a.email || '';
  document.getElementById('admin-user-role').value = a.role || 'Administrator';
  document.getElementById('admin-user-status').value = a.status || 'Active';
  document.getElementById('admin-user-password').value = '';
  document.getElementById('admin-user-phone').value = a.phone || '';
  document.getElementById('admin-user-notes').value = a.notes || '';

  openModal('admin-user-form-modal');
}

function deleteAdminConfirm(id, email) {
  confirmAction({
    title: "Revoke Admin Access",
    message: `Are you sure you want to remove administrator access for "${email}"? This user will no longer be able to log into the academy dashboard.`,
    confirmText: "Yes, Remove Admin",
    confirmClass: "bg-red-600 hover:bg-red-700",
    onConfirm: async () => {
      try {
        await window.adminDbOperations.deleteAdminUser(id, email);
        showToast("Admin user removed successfully.", "success");
      } catch (err) {
        showToast(err.message || "Failed to remove admin.", "error");
      }
    }
  });
}

function filterAdmins() {
  const query = (document.getElementById('search-admins')?.value || '').toLowerCase();
  const role = document.getElementById('filter-admin-role')?.value || 'all';

  const filtered = adminState.admins.filter(a => {
    const matchesQuery = (a.displayName || '').toLowerCase().includes(query) ||
                         (a.email || '').toLowerCase().includes(query) ||
                         (a.phone || '').toLowerCase().includes(query);
    const matchesRole = role === 'all' || (a.role || '').toLowerCase().includes(role.toLowerCase());
    return matchesQuery && matchesRole;
  });

  window.renderAdminsTable(filtered);
}

// -------------------------------------------------------------
// 3C. CREDENTIALS MODALS EVENT LISTENERS
// -------------------------------------------------------------
function setupCredentialsModalsEvents() {
  const studentCredForm = document.getElementById('student-credentials-form');
  if (studentCredForm) {
    studentCredForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('cred-student-id').value;
      const username = document.getElementById('cred-student-username').value.trim();
      const password = document.getElementById('cred-student-password').value.trim();

      if (!username || !password) {
        showToast("Please provide both username and password.", "error");
        return;
      }

      try {
        await window.adminDbOperations.updateStudentCredentials(id, { username, password });
        showToast("Student portal password updated!", "success");
        closeModal('student-credentials-modal');
      } catch (err) {
        showToast(err.message || "Failed to update credentials.", "error");
      }
    });
  }

  const teacherCredForm = document.getElementById('teacher-credentials-form');
  if (teacherCredForm) {
    teacherCredForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('cred-teacher-id').value;
      const username = document.getElementById('cred-teacher-username').value.trim();
      const password = document.getElementById('cred-teacher-password').value.trim();

      if (!username || !password) {
        showToast("Please provide both username and password.", "error");
        return;
      }

      try {
        await window.adminDbOperations.updateTeacherCredentials(id, { username, password });
        showToast("Teacher portal password updated!", "success");
        closeModal('teacher-credentials-modal');
      } catch (err) {
        showToast(err.message || "Failed to update credentials.", "error");
      }
    });
  }
}

// -------------------------------------------------------------
// 4. ENROLLMENT & FREE TRIAL LEADS MODULE
// -------------------------------------------------------------
function setupEnrollmentEventListeners() {
  const searchInput = document.getElementById('search-enrollments');
  const statusFilter = document.getElementById('filter-enrollment-status');
  const scheduleForm = document.getElementById('schedule-trial-form');
  const convertForm = document.getElementById('convert-student-form');

  if (searchInput) searchInput.addEventListener('input', filterEnrollments);
  if (statusFilter) statusFilter.addEventListener('change', filterEnrollments);

  if (scheduleForm) {
    scheduleForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('schedule-lead-id').value;
      const assignedTeacher = document.getElementById('schedule-teacher-select').value;
      const trialDate = document.getElementById('schedule-trial-date').value;
      const trialTime = document.getElementById('schedule-trial-time').value;
      const meetingLink = document.getElementById('schedule-meeting-link').value.trim();
      const adminNotes = document.getElementById('schedule-admin-notes').value.trim();

      try {
        await window.adminDbOperations.scheduleTrialClass(id, {
          assignedTeacher, trialDate, trialTime, meetingLink, adminNotes
        });
        showToast("Trial class scheduled successfully!", "success");
        closeModal('schedule-trial-modal');
      } catch (err) {
        showToast(err.message || "Failed to schedule trial.", "error");
      }
    });
  }

  if (convertForm) {
    convertForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const leadId = document.getElementById('convert-lead-id').value;
      const lead = adminState.enrollments.find(l => l.id === leadId);
      if (!lead) return;

      const assignedTeacher = document.getElementById('convert-teacher-select').value;
      const monthlyFee = Number(document.getElementById('convert-fee-input').value) || 45;
      const currency = document.getElementById('convert-currency-select').value || 'USD';
      const classTiming = document.getElementById('convert-timing-input').value.trim();

      try {
        await window.adminDbOperations.convertLeadToStudent(leadId, lead, {
          assignedTeacher, monthlyFee, currency, classTiming
        });
        showToast(`Lead successfully converted to Registered Student!`, "success");
        closeModal('convert-student-modal');
      } catch (err) {
        showToast(err.message || "Failed to convert lead.", "error");
      }
    });
  }
}

function viewEnrollmentDetail(id) {
  const lead = adminState.enrollments.find(l => l.id === id);
  if (!lead) return;

  const content = document.getElementById('lead-detail-modal-body');
  if (!content) return;

  const dateStr = lead.dateString ? new Date(lead.dateString).toLocaleString() : 'Recent';
  const waLink = `https://wa.me/${(lead.whatsappNumber || lead.whatsapp || '').replace(/[^0-9]/g, '')}`;

  content.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
        <div>
          <h3 class="text-xl font-extrabold text-emerald-950">${lead.studentName || lead.name || 'Student'}</h3>
          <p class="text-xs text-slate-500">Submitted: ${dateStr}</p>
        </div>
        <span class="badge-status badge-approved text-xs">${lead.status || 'New'}</span>
      </div>

      <div class="grid grid-cols-2 gap-4 text-xs">
        <div class="p-3 bg-slate-50 rounded-xl">
          <span class="text-slate-400 font-bold block mb-1">Parent / Guardian:</span>
          <span class="font-bold text-slate-800 text-sm">${lead.parentName || 'Not specified'}</span>
        </div>
        <div class="p-3 bg-slate-50 rounded-xl">
          <span class="text-slate-400 font-bold block mb-1">Student Age:</span>
          <span class="font-bold text-slate-800 text-sm">${lead.age || 'Not specified'} years</span>
        </div>
        <div class="p-3 bg-slate-50 rounded-xl">
          <span class="text-slate-400 font-bold block mb-1">Course Desired:</span>
          <span class="font-bold text-emerald-800 text-sm">${lead.course || 'Noorani Qaida'}</span>
        </div>
        <div class="p-3 bg-slate-50 rounded-xl">
          <span class="text-slate-400 font-bold block mb-1">Tutor Preference:</span>
          <span class="font-bold text-slate-800 text-sm">${lead.tutorGender || 'Any Tutor'}</span>
        </div>
        <div class="p-3 bg-slate-50 rounded-xl">
          <span class="text-slate-400 font-bold block mb-1">Country & City:</span>
          <span class="font-bold text-slate-800 text-sm">${lead.country || 'International'} ${lead.city ? `(${lead.city})` : ''}</span>
        </div>
        <div class="p-3 bg-slate-50 rounded-xl">
          <span class="text-slate-400 font-bold block mb-1">Preferred Slot:</span>
          <span class="font-bold text-slate-800 text-sm">${lead.preferredTime || 'Flexible'}</span>
        </div>
      </div>

      <div class="p-3 bg-slate-50 rounded-xl text-xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-slate-500">WhatsApp Contact:</span>
          <a href="${waLink}" target="_blank" class="font-bold text-emerald-700 hover:underline flex items-center gap-1.5">
            <i class="fa-brands fa-whatsapp text-emerald-500 text-sm"></i> ${lead.whatsappNumber || lead.whatsapp || 'N/A'}
          </a>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-slate-500">Email:</span>
          <span class="font-bold text-slate-800">${lead.email || 'None'}</span>
        </div>
      </div>

      ${lead.adminNotes ? `
        <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
          <span class="font-bold text-amber-900 block mb-1">Admin Notes:</span>
          <p class="text-slate-700">${lead.adminNotes}</p>
        </div>
      ` : ''}

      <div class="pt-4 border-t border-slate-200 flex flex-wrap gap-2 justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-500 font-bold">Update Status:</span>
          <select onchange="updateLeadStatusDirect('${lead.id}', this.value)" class="text-xs p-1.5 rounded-lg border border-slate-300 font-bold">
            <option value="New" ${lead.status === 'New' ? 'selected' : ''}>New</option>
            <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
            <option value="Scheduled" ${lead.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
            <option value="Approved" ${lead.status === 'Approved' ? 'selected' : ''}>Approved</option>
            <option value="Rejected" ${lead.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <a href="${waLink}" target="_blank" class="px-3 py-1.5 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center gap-1 shadow">
            <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
          </a>
          <button onclick="closeModal('lead-detail-modal')" class="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  `;

  openModal('lead-detail-modal');
}

async function updateLeadStatusDirect(id, newStatus) {
  try {
    await window.adminDbOperations.updateEnrollmentStatus(id, newStatus);
    showToast(`Lead marked as ${newStatus}`, "success");
  } catch (err) {
    showToast(err.message || "Failed to update status.", "error");
  }
}

function openScheduleTrialModal(id) {
  const lead = adminState.enrollments.find(l => l.id === id);
  if (!lead) return;

  document.getElementById('schedule-lead-id').value = lead.id;
  document.getElementById('schedule-lead-name').textContent = lead.studentName || lead.name || 'Student';
  
  // Populate Teachers dropdown
  const teacherSelect = document.getElementById('schedule-teacher-select');
  if (teacherSelect) {
    teacherSelect.innerHTML = adminState.teachers.map(t => `<option value="${t.name}">${t.name} (${t.gender})</option>`).join('');
    if (!adminState.teachers.length) {
      teacherSelect.innerHTML = `<option value="Senior Quran Qari">Senior Quran Qari</option><option value="Certified Female Hafiza">Certified Female Hafiza</option>`;
    }
  }

  openModal('schedule-trial-modal');
}

function openConvertStudentModal(id) {
  const lead = adminState.enrollments.find(l => l.id === id);
  if (!lead) return;

  document.getElementById('convert-lead-id').value = lead.id;
  document.getElementById('convert-lead-name').textContent = lead.studentName || lead.name || 'Student';

  // Populate Teachers dropdown
  const teacherSelect = document.getElementById('convert-teacher-select');
  if (teacherSelect) {
    teacherSelect.innerHTML = adminState.teachers.map(t => `<option value="${t.name}">${t.name}</option>`).join('');
    if (!adminState.teachers.length) {
      teacherSelect.innerHTML = `<option value="Senior Quran Qari">Senior Quran Qari</option>`;
    }
  }

  openModal('convert-student-modal');
}

function deleteEnrollmentConfirm(id) {
  confirmAction({
    title: "Delete Free Trial Lead",
    message: "Are you sure you want to remove this trial registration inquiry?",
    confirmText: "Yes, Delete Lead",
    onConfirm: async () => {
      try {
        await window.adminDbOperations.deleteEnrollment(id);
        showToast("Lead removed from list.", "success");
      } catch (err) {
        showToast(err.message || "Failed to delete lead.", "error");
      }
    }
  });
}

function filterEnrollments() {
  const query = (document.getElementById('search-enrollments')?.value || '').toLowerCase();
  const status = document.getElementById('filter-enrollment-status')?.value || 'all';

  const filtered = adminState.enrollments.filter(l => {
    const matchesQuery = (l.studentName || l.name || '').toLowerCase().includes(query) ||
                         (l.whatsappNumber || l.whatsapp || '').includes(query) ||
                         (l.course || '').toLowerCase().includes(query);
    const matchesStatus = status === 'all' || (l.status || '').toLowerCase() === status.toLowerCase();
    return matchesQuery && matchesStatus;
  });

  window.renderEnrollmentsTable(filtered);
}

// -------------------------------------------------------------
// 5. WEBSITE SLIDERS MODULE
// -------------------------------------------------------------
function setupSliderEventListeners() {
  const addBtn = document.getElementById('btn-add-slider');
  const form = document.getElementById('slider-edit-form');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      form.reset();
      document.getElementById('slider-form-id').value = '';
      document.getElementById('slider-modal-title').textContent = "Add Homepage Slider Banner";
      openModal('slider-form-modal');
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('slider-form-id').value;
      const title = document.getElementById('slider-title-input').value.trim();
      const subtitle = document.getElementById('slider-subtitle-input').value.trim();
      const badge = document.getElementById('slider-badge-input').value.trim() || 'Featured Program';
      const linkUrl = document.getElementById('slider-link-input').value.trim() || '#free-trial';
      const order = Number(document.getElementById('slider-order-input').value) || 1;
      const active = document.getElementById('slider-active-input').checked;

      let imageUrl = document.getElementById('slider-image-url-input').value.trim();
      const imageFile = document.getElementById('slider-image-file').files[0];
      if (imageFile) {
        showToast("Uploading banner image...", "info");
        try {
          imageUrl = await window.adminDbOperations.uploadImageFile(imageFile, "sliders");
        } catch (err) {
          console.warn("Banner upload notice:", err);
        }
      }

      const sliderData = {
        title,
        subtitle,
        badge,
        linkUrl,
        order,
        active,
        imageUrl: imageUrl || "assets/images/1.jpeg"
      };

      try {
        if (id) {
          await window.adminDbOperations.updateSlider(id, sliderData);
          showToast("Slider banner updated!", "success");
        } else {
          await window.adminDbOperations.addSlider(sliderData);
          showToast("New banner added to homepage carousel!", "success");
        }
        closeModal('slider-form-modal');
      } catch (err) {
        showToast(err.message || "Failed to save banner.", "error");
      }
    });
  }
}

function selectPresetSliderImage(assetPath) {
  const input = document.getElementById('slider-image-url-input');
  if (input) input.value = assetPath;
  showToast(`Selected preset banner: ${assetPath}`, "info");
}

function editSliderModal(id) {
  const s = adminState.sliders.find(item => item.id === id);
  if (!s) return;

  document.getElementById('slider-form-id').value = s.id;
  document.getElementById('slider-modal-title').textContent = `Edit Banner: ${s.title}`;
  document.getElementById('slider-title-input').value = s.title || '';
  document.getElementById('slider-subtitle-input').value = s.subtitle || '';
  document.getElementById('slider-badge-input').value = s.badge || '';
  document.getElementById('slider-link-input').value = s.linkUrl || '#free-trial';
  document.getElementById('slider-order-input').value = s.order || 1;
  document.getElementById('slider-image-url-input').value = s.imageUrl || '';
  document.getElementById('slider-active-input').checked = s.active !== undefined ? s.active : true;

  openModal('slider-form-modal');
}

async function toggleSliderActiveHandler(id, isActive) {
  try {
    await window.adminDbOperations.toggleSliderActive(id, isActive);
    showToast(`Banner ${isActive ? 'enabled' : 'disabled'} on homepage carousel.`, "info");
  } catch (err) {
    showToast(err.message || "Could not toggle slider.", "error");
  }
}

function deleteSliderConfirm(id, title) {
  confirmAction({
    title: "Delete Homepage Banner",
    message: `Are you sure you want to delete banner "${title}"?`,
    confirmText: "Yes, Delete Banner",
    onConfirm: async () => {
      try {
        await window.adminDbOperations.deleteSlider(id, title);
        showToast("Banner deleted.", "success");
      } catch (err) {
        showToast(err.message || "Failed to delete banner.", "error");
      }
    }
  });
}

// -------------------------------------------------------------
// 6. GALLERY MODULE
// -------------------------------------------------------------
function setupGalleryEventListeners() {
  const addBtn = document.getElementById('btn-add-gallery');
  const form = document.getElementById('gallery-edit-form');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      form.reset();
      document.getElementById('gallery-form-id').value = '';
      openModal('gallery-form-modal');
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('gallery-form-id').value;
      const title = document.getElementById('gallery-title-input').value.trim();
      const category = document.getElementById('gallery-category-input').value;
      const description = document.getElementById('gallery-desc-input').value.trim();

      let imageUrl = document.getElementById('gallery-image-url-input').value.trim();
      const imageFile = document.getElementById('gallery-image-file').files[0];
      if (imageFile) {
        showToast("Uploading gallery photo...", "info");
        try {
          imageUrl = await window.adminDbOperations.uploadImageFile(imageFile, "gallery");
        } catch (err) {
          console.warn("Gallery upload notice:", err);
        }
      }

      const itemData = {
        title,
        category,
        description,
        imageUrl: imageUrl || "assets/images/1.jpeg"
      };

      try {
        if (id) {
          await window.adminDbOperations.updateGalleryItem(id, itemData);
          showToast("Photo updated!", "success");
        } else {
          await window.adminDbOperations.addGalleryItem(itemData);
          showToast("Photo added to gallery!", "success");
        }
        closeModal('gallery-form-modal');
      } catch (err) {
        showToast(err.message || "Failed to save photo.", "error");
      }
    });
  }
}

function editGalleryModal(id) {
  const item = adminState.gallery.find(i => i.id === id);
  if (!item) return;

  document.getElementById('gallery-form-id').value = item.id;
  document.getElementById('gallery-title-input').value = item.title || '';
  document.getElementById('gallery-category-input').value = item.category || 'Online Classes';
  document.getElementById('gallery-desc-input').value = item.description || '';
  document.getElementById('gallery-image-url-input').value = item.imageUrl || '';

  openModal('gallery-form-modal');
}

function deleteGalleryConfirm(id, title) {
  confirmAction({
    title: "Delete Gallery Photo",
    message: `Are you sure you want to delete "${title}" from the gallery?`,
    confirmText: "Yes, Delete Photo",
    onConfirm: async () => {
      try {
        await window.adminDbOperations.deleteGalleryItem(id, title);
        showToast("Photo removed from gallery.", "success");
      } catch (err) {
        showToast(err.message || "Failed to delete photo.", "error");
      }
    }
  });
}

// -------------------------------------------------------------
// 7. TESTIMONIALS MODULE
// -------------------------------------------------------------
function setupTestimonialEventListeners() {
  const addBtn = document.getElementById('btn-add-testimonial');
  const form = document.getElementById('testimonial-edit-form');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      form.reset();
      document.getElementById('testimonial-form-id').value = '';
      openModal('testimonial-form-modal');
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('testimonial-form-id').value;
      const clientName = document.getElementById('testimonial-client-name').value.trim();
      const studentName = document.getElementById('testimonial-student-name').value.trim();
      const location = document.getElementById('testimonial-location').value.trim();
      const course = document.getElementById('testimonial-course').value.trim();
      const rating = Number(document.getElementById('testimonial-rating').value) || 5;
      const feedback = document.getElementById('testimonial-feedback').value.trim();
      const published = document.getElementById('testimonial-published').checked;

      const testData = {
        clientName,
        studentName,
        location,
        course,
        rating,
        feedback,
        published
      };

      try {
        if (id) {
          await window.adminDbOperations.updateTestimonial(id, testData);
          showToast("Testimonial updated!", "success");
        } else {
          await window.adminDbOperations.addTestimonial(testData);
          showToast("Testimonial added successfully!", "success");
        }
        closeModal('testimonial-form-modal');
      } catch (err) {
        showToast(err.message || "Failed to save testimonial.", "error");
      }
    });
  }
}

function editTestimonialModal(id) {
  const t = adminState.testimonials.find(item => item.id === id);
  if (!t) return;

  document.getElementById('testimonial-form-id').value = t.id;
  document.getElementById('testimonial-client-name').value = t.clientName || '';
  document.getElementById('testimonial-student-name').value = t.studentName || '';
  document.getElementById('testimonial-location').value = t.location || '';
  document.getElementById('testimonial-course').value = t.course || '';
  document.getElementById('testimonial-rating').value = t.rating || 5;
  document.getElementById('testimonial-feedback').value = t.feedback || '';
  document.getElementById('testimonial-published').checked = t.published !== undefined ? t.published : true;

  openModal('testimonial-form-modal');
}

async function toggleTestimonialPublishedHandler(id, isPublished) {
  try {
    await window.adminDbOperations.toggleTestimonialPublished(id, isPublished);
    showToast(`Testimonial ${isPublished ? 'published to' : 'hidden from'} public website.`, "info");
  } catch (err) {
    showToast(err.message || "Could not toggle testimonial.", "error");
  }
}

function deleteTestimonialConfirm(id, clientName) {
  confirmAction({
    title: "Delete Parent Testimonial",
    message: `Are you sure you want to delete review from "${clientName}"?`,
    confirmText: "Yes, Delete Review",
    onConfirm: async () => {
      try {
        await window.adminDbOperations.deleteTestimonial(id, clientName);
        showToast("Review deleted.", "success");
      } catch (err) {
        showToast(err.message || "Failed to delete testimonial.", "error");
      }
    }
  });
}

// -------------------------------------------------------------
// 8. CONTACT MESSAGES MODULE
// -------------------------------------------------------------
function setupMessageEventListeners() {
  const searchInput = document.getElementById('search-messages');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      const filtered = adminState.messages.filter(m => {
        return (m.fullName || '').toLowerCase().includes(q) ||
               (m.subject || '').toLowerCase().includes(q) ||
               (m.message || '').toLowerCase().includes(q) ||
               (m.whatsappNumber || m.phone || '').includes(q);
      });
      window.renderMessagesTable(filtered);
    });
  }
}

function viewMessageDetail(id) {
  const msg = adminState.messages.find(m => m.id === id);
  if (!msg) return;

  // Auto-mark as read
  if ((msg.status || 'Unread').toLowerCase() === 'unread') {
    window.adminDbOperations.updateMessageStatus(id, 'Read').catch(console.warn);
  }

  const dateStr = msg.dateString ? new Date(msg.dateString).toLocaleString() : 'Recent';
  const waLink = `https://wa.me/${(msg.whatsappNumber || msg.phone || '').replace(/[^0-9]/g, '')}`;
  const mailLink = `mailto:${msg.email || ''}?subject=${encodeURIComponent('Re: ' + (msg.subject || 'Hale Noor Quran Academy Inquiry'))}`;

  const body = document.getElementById('message-detail-modal-body');
  if (!body) return;

  body.innerHTML = `
    <div class="space-y-4">
      <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-bold text-slate-900">${msg.fullName || 'Anonymous'}</h3>
          <span class="text-xs text-slate-500">${dateStr}</span>
        </div>
        <div class="flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <a href="${waLink}" target="_blank" class="font-bold text-emerald-700 hover:underline flex items-center gap-1">
            <i class="fa-brands fa-whatsapp text-emerald-500"></i> ${msg.whatsappNumber || msg.phone || 'N/A'}
          </a>
          <a href="${mailLink}" class="text-slate-700 hover:underline flex items-center gap-1">
            <i class="fa-regular fa-envelope text-slate-400"></i> ${msg.email || 'No Email'}
          </a>
        </div>
      </div>

      <div class="p-4 bg-white rounded-2xl border border-slate-200">
        <span class="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">Subject:</span>
        <h4 class="font-bold text-slate-900 text-sm mb-3">${msg.subject || 'General Inquiry'}</h4>
        <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Message:</span>
        <p class="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">${msg.message || 'No content'}</p>
      </div>

      <div class="pt-3 border-t border-slate-200 flex flex-wrap gap-2 justify-between items-center">
        <div class="flex items-center gap-2">
          <a href="${waLink}" target="_blank" class="px-3 py-1.5 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center gap-1 shadow">
            <i class="fa-brands fa-whatsapp"></i> Reply on WhatsApp
          </a>
          ${msg.email ? `
            <a href="${mailLink}" class="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center gap-1">
              <i class="fa-regular fa-envelope"></i> Reply via Email
            </a>
          ` : ''}
        </div>
        <button onclick="closeModal('message-detail-modal')" class="px-4 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs">
          Close
        </button>
      </div>
    </div>
  `;

  openModal('message-detail-modal');
}

function deleteMessageConfirm(id) {
  confirmAction({
    title: "Delete Message",
    message: "Are you sure you want to delete this contact submission?",
    confirmText: "Yes, Delete",
    onConfirm: async () => {
      try {
        await window.adminDbOperations.deleteMessage(id);
        showToast("Message deleted.", "success");
      } catch (err) {
        showToast(err.message || "Failed to delete message.", "error");
      }
    }
  });
}

// -------------------------------------------------------------
// 9. DATABASE INITIAL SEEDER LOGIC
// -------------------------------------------------------------
function setupDatabaseSeederEventListener() {
  const seedBtns = document.querySelectorAll('.btn-seed-database');

  seedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      confirmAction({
        title: "Seed Website Initial Data",
        message: "This will populate Firebase Firestore with all 6 authentic academy courses, 5 homepage slider banners, 4 qualified scholars, and parent testimonials from your website. Proceed?",
        confirmText: "Yes, Seed Database",
        confirmClass: "bg-emerald-700 hover:bg-emerald-800",
        onConfirm: async () => {
          showToast("Seeding database... Please wait a few seconds.", "info", 5000);
          try {
            await window.adminDbOperations.seedInitialAcademyData();
            showToast("Success! All courses, sliders, scholars, and reviews seeded to Firebase!", "success", 6000);
          } catch (err) {
            console.error("Seeder error:", err);
            showToast(err.message || "Seeding failed.", "error");
          }
        }
      });
    });
  });
}

// Window Global Function Exports for Inline HTML Handlers
window.editCourseModal = editCourseModal;
window.deleteCourseConfirm = deleteCourseConfirm;
window.editTeacherModal = editTeacherModal;
window.deleteTeacherConfirm = deleteTeacherConfirm;
window.editStudentModal = editStudentModal;
window.deleteStudentConfirm = deleteStudentConfirm;
window.editAdminModal = editAdminModal;
window.deleteAdminConfirm = deleteAdminConfirm;
window.viewEnrollmentDetail = viewEnrollmentDetail;
window.openScheduleTrialModal = openScheduleTrialModal;
window.openConvertStudentModal = openConvertStudentModal;
window.deleteEnrollmentConfirm = deleteEnrollmentConfirm;
window.selectPresetSliderImage = selectPresetSliderImage;
window.editSliderModal = editSliderModal;
window.toggleSliderActiveHandler = toggleSliderActiveHandler;
window.deleteSliderConfirm = deleteSliderConfirm;
window.editGalleryModal = editGalleryModal;
window.deleteGalleryConfirm = deleteGalleryConfirm;
window.editTestimonialModal = editTestimonialModal;
window.toggleTestimonialPublishedHandler = toggleTestimonialPublishedHandler;
window.deleteTestimonialConfirm = deleteTestimonialConfirm;
window.viewMessageDetail = viewMessageDetail;
window.deleteMessageConfirm = deleteMessageConfirm;
window.updateLeadStatusDirect = updateLeadStatusDirect;
