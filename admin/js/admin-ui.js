/**
 * Hale Noor Quran Academy - Admin UI Components, State & Rendering Controller
 */

// Current Active Admin Tab
let currentSection = 'overview';

// In-Memory Cached State
const adminState = {
  stats: null,
  admins: [],
  courses: [],
  teachers: [],
  students: [],
  enrollments: [],
  sliders: [],
  gallery: [],
  testimonials: [],
  messages: []
};

// -------------------------------------------------------------
// Toast Notifications
// -------------------------------------------------------------
function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'admin-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `admin-toast admin-toast-${type}`;

  let icon = 'fa-solid fa-circle-info';
  if (type === 'success') icon = 'fa-solid fa-circle-check text-emerald-300';
  else if (type === 'error') icon = 'fa-solid fa-circle-exclamation text-red-300';
  else if (type === 'warning') icon = 'fa-solid fa-triangle-exclamation text-amber-300';

  toast.innerHTML = `
    <i class="${icon} text-lg shrink-0"></i>
    <span class="flex-grow">${message}</span>
    <button class="text-white/60 hover:text-white ml-2 text-sm" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// -------------------------------------------------------------
// Modal Dialogs Controller
// -------------------------------------------------------------
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Generic Confirmation Modal
function confirmAction({ title, message, confirmText = "Confirm", confirmClass = "bg-red-600 hover:bg-red-700", onConfirm }) {
  const modal = document.getElementById('confirm-modal');
  if (!modal) {
    if (confirm(message)) onConfirm();
    return;
  }

  document.getElementById('confirm-modal-title').textContent = title || "Confirm Action";
  document.getElementById('confirm-modal-message').textContent = message || "Are you sure you want to proceed?";
  
  const confirmBtn = document.getElementById('confirm-modal-btn');
  confirmBtn.className = `px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow transition ${confirmClass}`;
  confirmBtn.textContent = confirmText;

  // Replace onclick handler cleanly
  confirmBtn.onclick = () => {
    closeModal('confirm-modal');
    onConfirm();
  };

  openModal('confirm-modal');
}

// -------------------------------------------------------------
// Section Navigation Switcher
// -------------------------------------------------------------
function switchSection(sectionId) {
  currentSection = sectionId;

  // Hide all sections
  document.querySelectorAll('.admin-section-pane').forEach(pane => {
    pane.classList.add('hidden');
  });

  // Show target section
  const targetPane = document.getElementById(`section-${sectionId}`);
  if (targetPane) {
    targetPane.classList.remove('hidden');
  }

  // Update sidebar active classes
  document.querySelectorAll('.sidebar-nav-link').forEach(link => {
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update Header Title
  const titles = {
    overview: "Dashboard Overview",
    courses: "Courses Management",
    teachers: "Teachers & Scholars",
    students: "Student Management",
    roles: "Admin Users & Roles Management",
    enrollments: "Enrollments & Free Trial Leads",
    sliders: "Homepage Sliders & Banners",
    gallery: "Photo Gallery Management",
    testimonials: "Parent Testimonials & Reviews",
    messages: "Contact Form Submissions",
    settings: "Academy & Admin Settings"
  };

  const headerTitle = document.getElementById('admin-header-title');
  if (headerTitle) {
    headerTitle.textContent = titles[sectionId] || "Admin Dashboard";
  }

  // Close mobile sidebar if open
  closeMobileSidebar();
}

function openMobileSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('mobile-sidebar-overlay');
  if (sidebar) sidebar.classList.remove('-translate-x-full');
  if (overlay) overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('mobile-sidebar-overlay');
  if (sidebar && window.innerWidth < 1024) {
    sidebar.classList.add('-translate-x-full');
  }
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

// -------------------------------------------------------------
// UI RENDERING ROUTINES
// -------------------------------------------------------------

// 1. Overview Render
function renderOverview() {
  const stats = adminState.stats;
  if (!stats) return;

  const statStudents = document.getElementById('stat-total-students');
  const statTeachers = document.getElementById('stat-total-teachers');
  const statCourses = document.getElementById('stat-total-courses');
  const statActiveEnroll = document.getElementById('stat-active-enrollments');
  const statPendingEnroll = document.getElementById('stat-pending-enrollments');
  const statMessages = document.getElementById('stat-total-messages');

  if (statStudents) statStudents.textContent = stats.totalStudents;
  if (statTeachers) statTeachers.textContent = stats.totalTeachers;
  if (statCourses) statCourses.textContent = stats.totalCourses;
  if (statActiveEnroll) statActiveEnroll.textContent = stats.activeEnrollments;
  if (statPendingEnroll) statPendingEnroll.textContent = stats.pendingEnrollments;
  if (statMessages) {
    statMessages.textContent = `${stats.totalMessages} (${stats.unreadMessages} New)`;
  }

  // Render recent registered students preview in overview
  renderOverviewRecentStudents();
  // Render recent enrollments table preview in overview
  renderOverviewRecentEnrollments();
  // Render recent messages preview in overview
  renderOverviewRecentMessages();
}

function renderOverviewRecentStudents() {
  const container = document.getElementById('overview-recent-students');
  const countBadge = document.getElementById('overview-students-count');
  if (countBadge && adminState.students) {
    countBadge.textContent = `${adminState.students.length} Enrolled`;
  }
  if (!container) return;

  const students = (adminState.students || []).slice(0, 5);
  if (!students.length) {
    container.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-6 text-slate-400">
          No registered students found yet. 
          <button onclick="switchSection('students'); document.getElementById('btn-add-student').click();" class="text-emerald-700 hover:underline font-bold ml-1">
            + Enroll First Student
          </button>
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = students.map(s => {
    let badge = 'badge-active';
    if (s.status === 'Completed') badge = 'badge-completed';
    else if (s.status === 'Suspended' || s.status === 'Paused') badge = 'badge-rejected';

    const waLink = `https://wa.me/${(s.whatsappNumber || '').replace(/[^0-9]/g, '')}`;

    return `
      <tr>
        <td>
          <div class="font-bold text-slate-900">${s.studentName || 'Student'}</div>
          <div class="text-[11px] text-slate-500">Parent: ${s.parentName || 'N/A'} (Age: ${s.age || 'N/A'})</div>
        </td>
        <td class="text-xs font-semibold text-slate-800">${s.enrolledCourse || 'Noorani Qaida'}</td>
        <td class="text-xs font-semibold text-slate-700">${s.assignedTeacher || 'Unassigned'}</td>
        <td>
          <a href="${waLink}" target="_blank" class="text-emerald-700 hover:text-emerald-900 font-semibold text-xs flex items-center gap-1">
            <i class="fa-brands fa-whatsapp text-emerald-500"></i> ${s.whatsappNumber || 'N/A'}
          </a>
        </td>
        <td class="text-xs text-slate-600">${s.country || 'International'}</td>
        <td><span class="badge-status ${badge}">${s.status || 'Active'}</span></td>
        <td class="text-right">
          <button onclick="editStudentModal('${s.id}')" class="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-bold px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1" title="Edit Student">
            <i class="fa-solid fa-pen-to-square text-[10px]"></i> Edit
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderOverviewRecentEnrollments() {
  const container = document.getElementById('overview-recent-leads');
  if (!container) return;

  const recent = adminState.enrollments.slice(0, 5);
  if (!recent.length) {
    container.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-400">No trial registration requests yet.</td></tr>`;
    return;
  }

  container.innerHTML = recent.map(lead => {
    const status = lead.status || 'New';
    let badgeClass = 'badge-new';
    if (status === 'Approved' || status === 'Active') badgeClass = 'badge-approved';
    else if (status === 'Scheduled') badgeClass = 'badge-scheduled';
    else if (status === 'Rejected') badgeClass = 'badge-rejected';
    else if (status === 'Converted') badgeClass = 'badge-converted';

    const waLink = `https://wa.me/${(lead.whatsappNumber || '').replace(/[^0-9]/g, '')}`;

    return `
      <tr>
        <td class="font-bold text-slate-900">${lead.studentName || 'Student'}</td>
        <td>${lead.course || 'Noorani Qaida'}</td>
        <td>
          <a href="${waLink}" target="_blank" class="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1">
            <i class="fa-brands fa-whatsapp text-emerald-500"></i> ${lead.whatsappNumber || 'N/A'}
          </a>
        </td>
        <td><span class="badge-status ${badgeClass}">${status}</span></td>
        <td class="text-right">
          <button onclick="viewEnrollmentDetail('${lead.id}')" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-lg transition">
            View
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderOverviewRecentMessages() {
  const container = document.getElementById('overview-recent-messages');
  if (!container) return;

  const recent = adminState.messages.slice(0, 5);
  if (!recent.length) {
    container.innerHTML = `<tr><td colspan="4" class="text-center py-6 text-slate-400">No contact submissions yet.</td></tr>`;
    return;
  }

  container.innerHTML = recent.map(msg => {
    const isUnread = (msg.status || 'Unread').toLowerCase() === 'unread';
    return `
      <tr class="${isUnread ? 'bg-amber-50/50' : ''}">
        <td class="font-bold text-slate-900">${msg.fullName || 'Anonymous'}</td>
        <td class="truncate max-w-[180px]">${msg.subject || 'Inquiry'}</td>
        <td>
          <span class="badge-status ${isUnread ? 'badge-new' : 'badge-approved'}">
            ${msg.status || 'Unread'}
          </span>
        </td>
        <td class="text-right">
          <button onclick="viewMessageDetail('${msg.id}')" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-lg transition">
            Read
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 2. Courses Render
function renderCoursesTable(courses = adminState.courses) {
  const tbody = document.getElementById('courses-table-body');
  const countBadge = document.getElementById('courses-count-badge');
  if (countBadge) countBadge.textContent = `${courses.length} Courses`;
  if (!tbody) return;

  if (!courses.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-12">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
            <i class="fa-solid fa-book-quran"></i>
          </div>
          <p class="font-bold text-slate-700">No courses in database yet.</p>
          <p class="text-xs text-slate-500 mt-1">Click "Add Course" above or use the "Seed Website Data" tool to populate.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = courses.map(course => {
    return `
      <tr>
        <td>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg font-bold shrink-0">
              <i class="${course.iconClass || 'fa-solid fa-book-open'}"></i>
            </div>
            <div>
              <div class="font-bold text-slate-900 flex items-center gap-2">
                ${course.title}
                ${course.featured ? '<span class="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Featured</span>' : ''}
              </div>
              <div class="font-arabic text-xs text-emerald-800 font-bold">${course.arabicTitle || ''}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
            ${course.category || 'General'}
          </span>
        </td>
        <td>${course.duration || '2-4 Months'}</td>
        <td class="font-bold text-emerald-800">$${course.feeUSD || 45}/mo</td>
        <td>
          <span class="badge-status ${course.active ? 'badge-active' : 'badge-inactive'}">
            ${course.active ? 'Active' : 'Draft'}
          </span>
        </td>
        <td class="text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="editCourseModal('${course.id}')" class="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-emerald-700 transition" title="Edit Course">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteCourseConfirm('${course.id}', '${course.title}')" class="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition" title="Delete Course">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 3. Teachers Render
function renderTeachersTable(teachers = adminState.teachers) {
  const tbody = document.getElementById('teachers-table-body');
  const countBadge = document.getElementById('teachers-count-badge');
  if (countBadge) countBadge.textContent = `${teachers.length} Teachers`;
  if (!tbody) return;

  if (!teachers.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-12">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
            <i class="fa-solid fa-chalkboard-user"></i>
          </div>
          <p class="font-bold text-slate-700">No teachers found in database.</p>
          <p class="text-xs text-slate-500 mt-1">Click "Add Teacher" above to register faculty profiles.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = teachers.map(t => {
    const username = t.username || t.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hasPassword = !!t.password;

    return `
      <tr>
        <td>
          <div class="flex items-center gap-3">
            <img src="${t.imageUrl || 'assets/images/logo.png'}" alt="${t.name}" class="w-10 h-10 rounded-full object-cover border border-amber-300 shrink-0">
            <div>
              <div class="font-bold text-slate-900">${t.name}</div>
              <div class="font-arabic text-xs text-emerald-800 font-bold">${t.arabicTitle || ''}</div>
              <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold" title="Portal Username">
                  <i class="fa-solid fa-user-lock text-[9px]"></i> ${username}
                </span>
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${hasPassword ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'} font-mono text-[10px] font-bold" title="Portal Password Status">
                  <i class="fa-solid fa-key text-[9px]"></i> ${hasPassword ? 'Password Set' : 'No Password'}
                </span>
              </div>
            </div>
          </div>
        </td>
        <td>
          <span class="px-2 py-0.5 rounded text-xs font-semibold ${t.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}">
            ${t.gender || 'Male'}
          </span>
        </td>
        <td class="text-xs max-w-[200px] truncate" title="${t.qualification || ''}">
          ${t.qualification || 'Certified Scholar'}
        </td>
        <td class="text-xs">${t.experience || '5+ Years'}</td>
        <td>
          <span class="badge-status ${t.active ? 'badge-active' : 'badge-inactive'}">
            ${t.active ? 'Available' : 'Unavailable'}
          </span>
        </td>
        <td class="text-right">
          <div class="flex items-center justify-end gap-1">
            <button onclick="openTeacherCredentialsModal('${t.id}')" class="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition" title="Set / Reset Portal Password">
              <i class="fa-solid fa-key"></i>
            </button>
            <button onclick="previewTeacherProfile('${t.id}')" class="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition" title="View Teacher Profile">
              <i class="fa-solid fa-id-badge"></i>
            </button>
            <button onclick="editTeacherModal('${t.id}')" class="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-emerald-700 transition" title="Edit Teacher">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteTeacherConfirm('${t.id}', '${t.name}')" class="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition" title="Delete Teacher">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 4. Students Render
function renderStudentsTable(students = adminState.students) {
  const tbody = document.getElementById('students-table-body');
  const countBadge = document.getElementById('students-count-badge');
  if (countBadge) countBadge.textContent = `${students.length} Students`;
  if (!tbody) return;

  if (!students.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-12">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
            <i class="fa-solid fa-user-graduate"></i>
          </div>
          <p class="font-bold text-slate-700">No registered students yet.</p>
          <p class="text-xs text-slate-500 mt-1">Convert a trial lead to student, or click "Add Student" above.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = students.map(s => {
    let badge = 'badge-active';
    if (s.status === 'Completed') badge = 'badge-completed';
    else if (s.status === 'Suspended' || s.status === 'Paused') badge = 'badge-rejected';

    const waLink = `https://wa.me/${(s.whatsappNumber || '').replace(/[^0-9]/g, '')}`;
    const username = s.username || s.studentName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hasPassword = !!s.password;

    return `
      <tr>
        <td>
          <div class="font-bold text-slate-900">${s.studentName}</div>
          <div class="text-xs text-slate-500">Parent: ${s.parentName || 'N/A'} (Age: ${s.age || 'N/A'})</div>
          <div class="flex items-center gap-1.5 mt-1 flex-wrap">
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold" title="Portal Username">
              <i class="fa-solid fa-user-lock text-[9px]"></i> ${username}
            </span>
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${hasPassword ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'} font-mono text-[10px] font-bold" title="Portal Password Status">
              <i class="fa-solid fa-key text-[9px]"></i> ${hasPassword ? 'Password Set' : 'No Password'}
            </span>
          </div>
        </td>
        <td>${s.enrolledCourse || 'Noorani Qaida'}</td>
        <td class="text-xs font-semibold text-slate-700">${s.assignedTeacher || 'Unassigned'}</td>
        <td>
          <a href="${waLink}" target="_blank" class="text-emerald-700 hover:text-emerald-900 font-semibold text-xs flex items-center gap-1">
            <i class="fa-brands fa-whatsapp text-emerald-500"></i> ${s.whatsappNumber || 'N/A'}
          </a>
        </td>
        <td class="text-xs">${s.country || 'International'}</td>
        <td><span class="badge-status ${badge}">${s.status || 'Active'}</span></td>
        <td class="text-right">
          <div class="flex items-center justify-end gap-1">
            <button onclick="openStudentCredentialsModal('${s.id}')" class="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition" title="Set / Reset Portal Password">
              <i class="fa-solid fa-key"></i>
            </button>
            <button onclick="previewStudentProfile('${s.id}')" class="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition" title="View Student Profile">
              <i class="fa-solid fa-id-badge"></i>
            </button>
            <button onclick="shareStudentCredentialsWhatsApp('${s.id}')" class="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition" title="Send Login via WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
            </button>
            <button onclick="editStudentModal('${s.id}')" class="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-emerald-700 transition" title="Edit Student">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteStudentConfirm('${s.id}', '${s.studentName}')" class="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition" title="Delete Student">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 5. Enrollments & Free Trial Leads Render
function renderEnrollmentsTable(leads = adminState.enrollments) {
  const tbody = document.getElementById('enrollments-table-body');
  const countBadge = document.getElementById('enrollments-count-badge');
  if (countBadge) countBadge.textContent = `${leads.length} Leads`;
  if (!tbody) return;

  if (!leads.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-12">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
            <i class="fa-solid fa-calendar-check"></i>
          </div>
          <p class="font-bold text-slate-700">No free trial registration requests logged yet.</p>
          <p class="text-xs text-slate-500 mt-1">When students submit the form on the public website, leads appear here in real time.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = leads.map(l => {
    const status = l.status || 'New';
    let badgeClass = 'badge-new';
    if (status === 'Approved' || status === 'Active') badgeClass = 'badge-approved';
    else if (status === 'Scheduled') badgeClass = 'badge-scheduled';
    else if (status === 'Rejected') badgeClass = 'badge-rejected';
    else if (status === 'Converted') badgeClass = 'badge-converted';

    const waText = encodeURIComponent(`Assalamu Alaikum ${l.studentName || ''}! This is Hale Noor Quran Academy regarding your 3-Day Free Trial registration.`);
    const waLink = `https://wa.me/${(l.whatsappNumber || '').replace(/[^0-9]/g, '')}?text=${waText}`;

    const dateStr = l.dateString ? new Date(l.dateString).toLocaleDateString() : 'Recent';

    return `
      <tr>
        <td>
          <div class="font-bold text-slate-900">${l.studentName || l.name || 'Student'}</div>
          <div class="text-xs text-slate-500">${l.parentName ? `Parent: ${l.parentName}` : ''} (${l.country || 'Global'})</div>
        </td>
        <td>
          <div class="font-semibold text-slate-800 text-xs">${l.course || 'Noorani Qaida'}</div>
          <div class="text-[11px] text-emerald-700 font-medium">${l.tutorGender || 'Any Tutor'}</div>
        </td>
        <td>
          <a href="${waLink}" target="_blank" class="text-emerald-700 hover:text-emerald-900 font-bold text-xs flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
            <i class="fa-brands fa-whatsapp text-emerald-600 text-sm"></i> ${l.whatsappNumber || l.whatsapp || 'N/A'}
          </a>
        </td>
        <td class="text-xs">${l.preferredTime || 'Evening'}</td>
        <td class="text-xs text-slate-500">${dateStr}</td>
        <td><span class="badge-status ${badgeClass}">${status}</span></td>
        <td class="text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="viewEnrollmentDetail('${l.id}')" class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition" title="View Full Lead Details">
              Details
            </button>
            <button onclick="openScheduleTrialModal('${l.id}')" class="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition" title="Schedule Trial Class">
              Schedule
            </button>
            <button onclick="openConvertStudentModal('${l.id}')" class="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition" title="Convert to Active Enrolled Student">
              Convert
            </button>
            <button onclick="deleteEnrollmentConfirm('${l.id}')" class="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition" title="Delete Lead">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 6. Sliders Render
function renderSlidersTable(sliders = adminState.sliders) {
  const tbody = document.getElementById('sliders-table-body');
  const countBadge = document.getElementById('sliders-count-badge');
  if (countBadge) countBadge.textContent = `${sliders.length} Banners`;
  if (!tbody) return;

  if (!sliders.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-12">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
            <i class="fa-solid fa-images"></i>
          </div>
          <p class="font-bold text-slate-700">No slider banners in database.</p>
          <p class="text-xs text-slate-500 mt-1">Click "Add Banner" to upload homepage banners, or seed initial banners.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = sliders.map(s => {
    return `
      <tr>
        <td class="font-bold text-center text-slate-600 w-12">${s.order || 1}</td>
        <td>
          <img src="${s.imageUrl || 'assets/images/1.jpeg'}" alt="${s.title}" class="w-20 h-12 rounded-lg object-cover border border-slate-200">
        </td>
        <td>
          <div class="font-bold text-slate-900">${s.title}</div>
          <div class="text-xs text-slate-500 truncate max-w-[280px]">${s.subtitle || ''}</div>
        </td>
        <td>
          <span class="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            ${s.badge || 'Featured'}
          </span>
        </td>
        <td>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" ${s.active ? 'checked' : ''} onchange="toggleSliderActiveHandler('${s.id}', this.checked)" class="sr-only peer">
            <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </td>
        <td class="text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="editSliderModal('${s.id}')" class="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-emerald-700 transition" title="Edit Banner">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteSliderConfirm('${s.id}', '${s.title}')" class="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition" title="Delete Banner">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 7. Gallery Render
function renderGalleryGrid(items = adminState.gallery) {
  const container = document.getElementById('gallery-items-grid');
  const countBadge = document.getElementById('gallery-count-badge');
  if (countBadge) countBadge.textContent = `${items.length} Photos`;
  if (!container) return;

  if (!items.length) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200">
        <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
          <i class="fa-solid fa-photo-film"></i>
        </div>
        <p class="font-bold text-slate-700">No gallery photos uploaded yet.</p>
        <p class="text-xs text-slate-500 mt-1">Upload event photos, class recordings, or certificate ceremonies.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => {
    return `
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group">
        <div class="relative aspect-video bg-slate-900 overflow-hidden">
          <img src="${item.imageUrl || 'assets/images/1.jpeg'}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
          <span class="absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-950/70 text-amber-300 backdrop-blur-sm">
            ${item.category || 'General'}
          </span>
        </div>
        <div class="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-slate-900 text-sm mb-1">${item.title}</h4>
            <p class="text-xs text-slate-500 line-clamp-2">${item.description || ''}</p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-[11px] text-slate-400">Hale Noor</span>
            <div class="flex items-center gap-1">
              <button onclick="editGalleryModal('${item.id}')" class="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-emerald-700 transition" title="Edit">
                <i class="fa-solid fa-pen-to-square text-xs"></i>
              </button>
              <button onclick="deleteGalleryConfirm('${item.id}', '${item.title}')" class="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition" title="Delete">
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 8. Testimonials Render
function renderTestimonialsTable(reviews = adminState.testimonials) {
  const tbody = document.getElementById('testimonials-table-body');
  const countBadge = document.getElementById('testimonials-count-badge');
  if (countBadge) countBadge.textContent = `${reviews.length} Reviews`;
  if (!tbody) return;

  if (!reviews.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-12">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
            <i class="fa-solid fa-star"></i>
          </div>
          <p class="font-bold text-slate-700">No parent reviews in database.</p>
          <p class="text-xs text-slate-500 mt-1">Click "Add Testimonial" to post reviews from student families.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = reviews.map(t => {
    const stars = Array(Number(t.rating) || 5).fill('<i class="fa-solid fa-star text-amber-400 text-xs"></i>').join('');
    return `
      <tr>
        <td>
          <div class="font-bold text-slate-900">${t.clientName}</div>
          <div class="text-xs text-slate-500">${t.location || 'Global'}</div>
        </td>
        <td>
          <div class="text-xs font-semibold text-slate-700">${t.studentName || 'Student'}</div>
          <div class="text-[11px] text-emerald-800">${t.course || 'Quran'}</div>
        </td>
        <td><div class="flex items-center gap-0.5">${stars}</div></td>
        <td class="text-xs max-w-[260px] truncate" title="${t.feedback || ''}">
          "${t.feedback || ''}"
        </td>
        <td>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" ${t.published ? 'checked' : ''} onchange="toggleTestimonialPublishedHandler('${t.id}', this.checked)" class="sr-only peer">
            <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </td>
        <td class="text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="editTestimonialModal('${t.id}')" class="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-emerald-700 transition" title="Edit Review">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteTestimonialConfirm('${t.id}', '${t.clientName}')" class="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition" title="Delete Review">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 9. Contact Messages Render
function renderMessagesTable(messages = adminState.messages) {
  const tbody = document.getElementById('messages-table-body');
  const countBadge = document.getElementById('messages-count-badge');
  if (countBadge) countBadge.textContent = `${messages.length} Inquiries`;
  if (!tbody) return;

  if (!messages.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-12">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
            <i class="fa-solid fa-envelope-open-text"></i>
          </div>
          <p class="font-bold text-slate-700">No contact messages received yet.</p>
          <p class="text-xs text-slate-500 mt-1">Messages sent through contact.html will show up here automatically.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = messages.map(m => {
    const isUnread = (m.status || 'Unread').toLowerCase() === 'unread';
    const dateStr = m.dateString ? new Date(m.dateString).toLocaleDateString() : 'Recent';
    const waLink = `https://wa.me/${(m.whatsappNumber || m.phone || '').replace(/[^0-9]/g, '')}`;

    return `
      <tr class="${isUnread ? 'bg-amber-50/40' : ''}">
        <td>
          <div class="font-bold text-slate-900">${m.fullName || 'Anonymous'}</div>
          <div class="text-xs text-slate-500">${m.email || 'No Email'}</div>
        </td>
        <td>
          <a href="${waLink}" target="_blank" class="text-emerald-700 hover:text-emerald-900 font-semibold text-xs flex items-center gap-1">
            <i class="fa-brands fa-whatsapp text-emerald-500"></i> ${m.whatsappNumber || m.phone || 'N/A'}
          </a>
        </td>
        <td class="font-semibold text-xs text-slate-800">${m.subject || 'General Inquiry'}</td>
        <td class="text-xs text-slate-500 max-w-[200px] truncate" title="${m.message || ''}">
          ${m.message || ''}
        </td>
        <td>
          <span class="badge-status ${isUnread ? 'badge-new' : 'badge-approved'}">
            ${m.status || 'Unread'}
          </span>
        </td>
        <td class="text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="viewMessageDetail('${m.id}')" class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition" title="Read Message">
              Read
            </button>
            <button onclick="deleteMessageConfirm('${m.id}')" class="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition" title="Delete Message">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// -------------------------------------------------------------
// 9. Admin Users & Roles Render
// -------------------------------------------------------------
function renderAdminsTable(admins = adminState.admins) {
  const tbody = document.getElementById('admins-table-body');
  const countBadge = document.getElementById('admins-count-badge');
  const statTotal = document.getElementById('stat-total-admins');
  const statSuper = document.getElementById('stat-super-admins');
  const statStaff = document.getElementById('stat-staff-admins');

  if (countBadge) countBadge.textContent = `${admins.length} Admins`;
  if (statTotal) statTotal.textContent = admins.length;
  if (statSuper) {
    const superCount = admins.filter(a => (a.role || '').toLowerCase().includes('super')).length;
    statSuper.textContent = superCount;
  }
  if (statStaff) {
    const staffCount = admins.filter(a => !(a.role || '').toLowerCase().includes('super')).length;
    statStaff.textContent = staffCount;
  }

  if (!tbody) return;

  if (!admins.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-12">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
            <i class="fa-solid fa-users-gear"></i>
          </div>
          <p class="font-bold text-slate-700">No admin users found.</p>
          <p class="text-xs text-slate-500 mt-1">Click "Add Admin User" above to create an administrator account.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = admins.map(a => {
    const role = a.role || 'Administrator';
    let roleBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    let roleIcon = 'fa-user-shield';
    let perms = 'Students, Teachers, Leads & Content';

    if (role.toLowerCase().includes('super')) {
      roleBadge = 'bg-amber-100 text-amber-900 border-amber-300 font-black';
      roleIcon = 'fa-crown text-amber-600';
      perms = 'Full Master Access & Security Control';
    } else if (role.toLowerCase().includes('coordinator')) {
      roleBadge = 'bg-blue-100 text-blue-800 border-blue-200';
      roleIcon = 'fa-graduation-cap text-blue-600';
      perms = 'Student & Teacher Scheduling & Progress';
    } else if (role.toLowerCase().includes('staff') || role.toLowerCase().includes('moderator')) {
      roleBadge = 'bg-slate-100 text-slate-700 border-slate-300';
      roleIcon = 'fa-pen-ruler text-slate-500';
      perms = 'Website Reviews, Sliders & Inquiries';
    }

    const initials = (a.displayName || a.email || 'Admin').substring(0, 2).toUpperCase();
    const isCurrent = currentAdminUser && (a.id === currentAdminUser.uid || a.email === currentAdminUser.email);

    return `
      <tr class="${isCurrent ? 'bg-amber-50/40' : ''}">
        <td>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-emerald-900 text-amber-300 flex items-center justify-center font-bold text-sm shadow-sm shrink-0 border border-amber-400/50">
              ${initials}
            </div>
            <div>
              <div class="font-bold text-slate-900 flex items-center gap-1.5">
                ${a.displayName || a.email.split('@')[0]}
                ${isCurrent ? '<span class="text-[10px] px-1.5 py-0.2 bg-emerald-800 text-white font-extrabold rounded">YOU</span>' : ''}
              </div>
              <div class="text-xs text-slate-500 flex items-center gap-1">
                <i class="fa-solid fa-envelope text-[10px]"></i> ${a.email}
              </div>
            </div>
          </div>
        </td>
        <td>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${roleBadge}">
            <i class="fa-solid ${roleIcon}"></i> ${role}
          </span>
        </td>
        <td>
          <span class="text-xs text-slate-600 font-medium">${perms}</span>
        </td>
        <td>
          <span class="badge-status ${a.status === 'Inactive' ? 'badge-inactive' : 'badge-active'}">
            ${a.status || 'Active'}
          </span>
        </td>
        <td class="text-xs text-slate-500">
          ${a.phone ? `<div><i class="fa-brands fa-whatsapp text-emerald-600"></i> ${a.phone}</div>` : ''}
          ${a.notes ? `<div class="text-[11px] text-slate-400 truncate max-w-[150px]">${a.notes}</div>` : '<span class="text-slate-400">-</span>'}
        </td>
        <td class="text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="editAdminModal('${a.id}')" class="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-emerald-700 transition" title="Edit Admin Role & Info">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            ${!isCurrent ? `
              <button onclick="deleteAdminConfirm('${a.id}', '${a.email}')" class="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition" title="Remove Admin Access">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// -------------------------------------------------------------
// CREDENTIALS & PROFILE HELPERS (STUDENT, TEACHER & ADMIN)
// -------------------------------------------------------------
function generateRandomPassword(length = 8) {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

function copyInputVal(id) {
  const el = document.getElementById(id);
  if (!el || !el.value) return;
  navigator.clipboard.writeText(el.value).then(() => {
    showToast("Copied to clipboard: " + el.value, "success");
  }).catch(() => {
    showToast("Copy manually: " + el.value, "info");
  });
}

function copyAdminPasswordInput() {
  copyInputVal('admin-user-password');
}

function generateAdminRandomPassword() {
  const pwd = "Hale@" + Math.floor(1000 + Math.random() * 9000);
  const el = document.getElementById('admin-user-password');
  if (el) {
    el.value = pwd;
    showToast("Generated new password: " + pwd, "info");
  }
}

function generateStudentPasswordAuto() {
  const nameEl = document.getElementById('student-name-input');
  const userEl = document.getElementById('student-username-input');
  const passEl = document.getElementById('student-password-input');
  
  if (nameEl && userEl && !userEl.value) {
    const raw = (nameEl.value || 'student').toLowerCase().replace(/[^a-z0-9]/g, '');
    userEl.value = raw + Math.floor(10 + Math.random() * 90);
  }
  if (passEl) {
    passEl.value = "Quran@" + Math.floor(1000 + Math.random() * 9000);
    showToast("Auto-generated student credentials!", "info");
  }
}

function generateTeacherPasswordAuto() {
  const nameEl = document.getElementById('teacher-name');
  const userEl = document.getElementById('teacher-username-input');
  const passEl = document.getElementById('teacher-password-input');

  if (nameEl && userEl && !userEl.value) {
    const raw = (nameEl.value || 'teacher').toLowerCase().replace(/[^a-z0-9]/g, '');
    userEl.value = 't.' + raw;
  }
  if (passEl) {
    passEl.value = "Teacher@" + Math.floor(1000 + Math.random() * 9000);
    showToast("Auto-generated teacher credentials!", "info");
  }
}

// Student Credentials Quick Modal
function openStudentCredentialsModal(id) {
  const s = adminState.students.find(item => item.id === id);
  if (!s) return;

  const defaultUser = s.username || s.studentName.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(10 + Math.random() * 90);
  const currentPass = s.password || '';

  document.getElementById('cred-student-id').value = s.id;
  document.getElementById('cred-student-name').textContent = s.studentName;
  document.getElementById('cred-student-course').textContent = s.enrolledCourse || 'Noorani Qaida';
  document.getElementById('cred-student-username').value = defaultUser;
  document.getElementById('cred-student-password').value = currentPass || ("Quran@" + Math.floor(1000 + Math.random() * 9000));
  
  openModal('student-credentials-modal');
}

// Teacher Credentials Quick Modal
function openTeacherCredentialsModal(id) {
  const t = adminState.teachers.find(item => item.id === id);
  if (!t) return;

  const defaultUser = t.username || ('t.' + t.name.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const currentPass = t.password || '';

  document.getElementById('cred-teacher-id').value = t.id;
  document.getElementById('cred-teacher-name').textContent = t.name;
  document.getElementById('cred-teacher-title').textContent = t.arabicTitle || t.qualification || 'Certified Scholar';
  document.getElementById('cred-teacher-username').value = defaultUser;
  document.getElementById('cred-teacher-password').value = currentPass || ("Teacher@" + Math.floor(1000 + Math.random() * 9000));
  
  openModal('teacher-credentials-modal');
}

// Preview Student Profile Modal
function previewStudentProfile(id) {
  const s = adminState.students.find(item => item.id === id);
  if (!s) return;

  const container = document.getElementById('student-profile-preview-body');
  if (!container) return;

  const username = s.username || s.studentName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const pass = s.password || 'Not set';
  const wa = s.whatsappNumber || 'N/A';
  const waLink = `https://wa.me/${wa.replace(/[^0-9]/g, '')}`;

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center gap-4 bg-emerald-950 text-white p-4 rounded-2xl border border-amber-400/40">
        <div class="w-16 h-16 rounded-full bg-emerald-800 text-amber-300 font-black text-2xl flex items-center justify-center border-2 border-amber-400 shrink-0">
          ${s.studentName.substring(0, 2).toUpperCase()}
        </div>
        <div class="flex-grow">
          <div class="flex items-center gap-2">
            <h4 class="text-lg font-black text-white">${s.studentName}</h4>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-emerald-950 uppercase">Student</span>
          </div>
          <p class="text-xs text-emerald-200">Enrolled: <span class="font-bold text-amber-300">${s.enrolledCourse || 'Noorani Qaida'}</span></p>
          <p class="text-xs text-slate-300">Tutor: <span class="font-semibold text-white">${s.assignedTeacher || 'Unassigned'}</span></p>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-slate-400 block text-[10px] font-bold uppercase">Portal Username</span>
          <span class="font-bold text-slate-900 font-mono text-sm">${username}</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-slate-400 block text-[10px] font-bold uppercase">Portal Password</span>
          <span class="font-bold text-emerald-800 font-mono text-sm">${pass}</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-slate-400 block text-[10px] font-bold uppercase">Parent / Guardian</span>
          <span class="font-bold text-slate-900">${s.parentName || 'N/A'} (Age: ${s.age || 'N/A'})</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-slate-400 block text-[10px] font-bold uppercase">WhatsApp / Contact</span>
          <a href="${waLink}" target="_blank" class="font-bold text-emerald-700 hover:underline flex items-center gap-1">
            <i class="fa-brands fa-whatsapp text-emerald-500"></i> ${wa}
          </a>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-slate-400 block text-[10px] font-bold uppercase">Class Timing</span>
          <span class="font-bold text-slate-900">${s.classTiming || 'Flexible'} (${s.timezone || 'Local'})</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-slate-400 block text-[10px] font-bold uppercase">Tuition Fee</span>
          <span class="font-bold text-slate-900">${s.currency || 'USD'} ${s.monthlyFee || 45} / month</span>
        </div>
      </div>

      ${s.notes ? `
        <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
          <span class="font-bold text-amber-900 block mb-0.5">Teacher / Academic Notes:</span>
          <p class="text-slate-700">${s.notes}</p>
        </div>
      ` : ''}

      <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button onclick="shareStudentCredentialsWhatsApp('${s.id}')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition">
          <i class="fa-brands fa-whatsapp"></i> Send Login via WhatsApp
        </button>
        <a href="portal.html?student=${s.id}" target="_blank" class="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Student Portal View
        </a>
      </div>
    </div>
  `;

  openModal('student-profile-preview-modal');
}

// Preview Teacher Profile Modal
function previewTeacherProfile(id) {
  const t = adminState.teachers.find(item => item.id === id);
  if (!t) return;

  const container = document.getElementById('teacher-profile-preview-body');
  if (!container) return;

  const username = t.username || ('t.' + t.name.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const pass = t.password || 'Not set';

  // Find students assigned to this teacher
  const assigned = (adminState.students || []).filter(s => 
    s.assignedTeacher && s.assignedTeacher.toLowerCase().includes(t.name.toLowerCase().split(' ')[0])
  );

  container.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center gap-4 bg-emerald-950 text-white p-4 rounded-2xl border border-amber-400/40">
        <img src="${t.imageUrl || 'assets/images/logo.png'}" alt="${t.name}" class="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shrink-0">
        <div class="flex-grow">
          <div class="flex items-center gap-2">
            <h4 class="text-lg font-black text-white">${t.name}</h4>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-emerald-950 uppercase">Scholar</span>
          </div>
          <p class="font-arabic text-amber-300 text-sm">${t.arabicTitle || ''}</p>
          <p class="text-xs text-emerald-200">Experience: <span class="font-semibold text-white">${t.experience || '5+ Years'}</span> &bull; Rating: <span class="font-bold text-amber-300">★ ${t.rating || '5.0'}</span></p>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-slate-400 block text-[10px] font-bold uppercase">Portal Username</span>
          <span class="font-bold text-slate-900 font-mono text-sm">${username}</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span class="text-slate-400 block text-[10px] font-bold uppercase">Portal Password</span>
          <span class="font-bold text-emerald-800 font-mono text-sm">${pass}</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
          <span class="text-slate-400 block text-[10px] font-bold uppercase">Degrees &amp; Certifications</span>
          <span class="font-bold text-slate-900">${t.qualification || 'Certified Islamic Scholar'}</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
          <span class="text-slate-400 block text-[10px] font-bold uppercase">Specializations &amp; Languages</span>
          <span class="font-bold text-slate-900">${t.specialization || 'Tajweed, Noorani Qaida'} &bull; ${t.languages || 'English, Urdu, Arabic'}</span>
        </div>
      </div>

      <div class="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
        <span class="font-bold text-emerald-950 block mb-1">Assigned Students (${assigned.length}):</span>
        ${assigned.length ? `
          <ul class="space-y-1 text-slate-700">
            ${assigned.map(st => `
              <li class="flex items-center justify-between border-b border-emerald-100 pb-1">
                <span class="font-bold">${st.studentName} (${st.enrolledCourse || 'Course'})</span>
                <span class="text-emerald-800 font-mono text-[11px]">${st.classTiming || 'Flexible'}</span>
              </li>
            `).join('')}
          </ul>
        ` : '<p class="text-slate-500 italic">No students currently assigned to this teacher.</p>'}
      </div>

      <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button onclick="shareTeacherCredentialsWhatsApp('${t.id}')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition">
          <i class="fa-brands fa-whatsapp"></i> Send Login via WhatsApp
        </button>
        <a href="portal.html?teacher=${t.id}" target="_blank" class="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Teacher Portal View
        </a>
      </div>
    </div>
  `;

  openModal('teacher-profile-preview-modal');
}

// WhatsApp Share for Student
function shareStudentCredentialsWhatsApp(id) {
  const s = adminState.students.find(item => item.id === id);
  if (!s) return;

  const username = s.username || s.studentName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const pass = s.password || 'Quran@2026';
  const cleanPhone = (s.whatsappNumber || '').replace(/[^0-9]/g, '');

  const portalUrl = window.location.origin ? (window.location.origin + '/portal.html') : 'https://halenooracademy.vercel.app/portal.html';

  const msg = `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
Assalam-o-Alaikum!

Welcome to *Hale Noor Online Quran Academy*.
Aapke bache (*${s.studentName}*) ka Student Portal login account tayyar hai:

🔗 *Portal Website:* ${portalUrl}
👤 *Username:* ${username}
🔑 *Password:* ${pass}
📚 *Course:* ${s.enrolledCourse || 'Noorani Qaida with Tajweed'}
👨‍🏫 *Assigned Tutor:* ${s.assignedTeacher || 'Assigned Tutor'}
⏰ *Class Timing:* ${s.classTiming || 'To be confirmed'}

Aap is link se login karke class timing, syllabus progress aur fees status dekh sakte hain.
JazakAllah Khair!`;

  const waUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/?text=${encodeURIComponent(msg)}`;

  window.open(waUrl, '_blank');
}

// WhatsApp Share for Teacher
function shareTeacherCredentialsWhatsApp(id) {
  const t = adminState.teachers.find(item => item.id === id);
  if (!t) return;

  const username = t.username || ('t.' + t.name.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const pass = t.password || 'Teacher@2026';
  const portalUrl = window.location.origin ? (window.location.origin + '/portal.html') : 'https://halenooracademy.vercel.app/portal.html';

  const msg = `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
Assalam-o-Alaikum Respected *${t.name}*!

Aapka *Hale Noor Quran Academy* Teacher Portal login credentials ye hain:

🔗 *Teacher Portal:* ${portalUrl}
👤 *Username:* ${username}
🔑 *Password:* ${pass}

Aap login karke apne assigned students ki list, unke timings aur syllabus schedule dekh sakte hain.
JazakAllah Khair!`;

  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

// Export functions to window
window.adminState = adminState;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.confirmAction = confirmAction;
window.switchSection = switchSection;
window.openMobileSidebar = openMobileSidebar;
window.closeMobileSidebar = closeMobileSidebar;
window.renderOverview = renderOverview;
window.renderOverviewRecentStudents = renderOverviewRecentStudents;
window.renderCoursesTable = renderCoursesTable;
window.renderTeachersTable = renderTeachersTable;
window.renderStudentsTable = renderStudentsTable;
window.renderAdminsTable = renderAdminsTable;
window.renderEnrollmentsTable = renderEnrollmentsTable;
window.renderSlidersTable = renderSlidersTable;
window.renderGalleryGrid = renderGalleryGrid;
window.renderTestimonialsTable = renderTestimonialsTable;
window.renderMessagesTable = renderMessagesTable;

// Credentials & Modals
window.copyInputVal = copyInputVal;
window.copyAdminPasswordInput = copyAdminPasswordInput;
window.generateRandomPassword = generateRandomPassword;
window.generateStudentPasswordAuto = generateStudentPasswordAuto;
window.generateTeacherPasswordAuto = generateTeacherPasswordAuto;
window.generateAdminRandomPassword = generateAdminRandomPassword;
window.openStudentCredentialsModal = openStudentCredentialsModal;
window.openTeacherCredentialsModal = openTeacherCredentialsModal;
window.previewStudentProfile = previewStudentProfile;
window.previewTeacherProfile = previewTeacherProfile;
window.shareStudentCredentialsWhatsApp = shareStudentCredentialsWhatsApp;
window.shareTeacherCredentialsWhatsApp = shareTeacherCredentialsWhatsApp;
