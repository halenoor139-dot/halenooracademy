# Hale Noor Online Quran Academy (هالة نور أكاديمية القرآن الكريم)

A modern, responsive, Islamic-themed website and complete, secure **Admin Dashboard** built for **Hale Noor Online Quran Academy**. Designed to convert visitors into students with interactive 1-on-1 trial booking, transparent multi-currency fee structures, and direct WhatsApp admissions integration.

---

## 🌟 Key Features

1. **Islamic Aesthetic & Brand Identity**:
   - Deep emerald green (`#064e3b`) & warm gold accents (`#d97706`).
   - Arabic calligraphy badges with Bismillah (`بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ`) and Hadith citations.
   - Arabic font support (`Amiri`) & clean modern typography (`Outfit`, `Plus Jakarta Sans`).

2. **Courses & Interactive Syllabi**:
   - **Noorani Qaida for Beginners & Kids**
   - **Quran Reading with Tajweed (Nazra)**
   - **Hifz-ul-Quran (Memorization)**
   - **Quran Translation & Tafseer (Tarjuma)**
   - **Islamic Studies, Namaz & Daily Duas**
   - **Quranic Arabic & Grammar Basics**
   - Interactive **"View Syllabus" Modal** with module breakdowns and milestones.

3. **3-Day Free Trial Registration & WhatsApp Automation**:
   - Comprehensive trial booking form (Student name, age, preferred course, Male/Female tutor preference, country/city, WhatsApp number, time slot).
   - Automatically logs every inquiry to Google Firebase Cloud Firestore (`trial_registrations`).
   - On submission, generates an automatic pre-filled WhatsApp message sent straight to the Academy Coordinator for instant confirmation.
   - Confirmation receipt modal with quick launch button.

4. **Interactive Multi-Currency Fee Structure & Calculator**:
   - Instant currency switcher: **USD ($)**, **GBP (£)**, **CAD (C$)**, **AUD (A$)**, **EUR (€)**, **PKR (Rs)**, **AED**, **SAR**.
   - Built-in **Interactive Tuition Calculator** with automatic **15% Family/Sibling Discount** calculation.

5. **Live Interactive Quran Audio Player**:
   - Play/pause recitation snippets of Surah Al-Fatihah, Ayat-ul-Kursi, and Surah Al-Ikhlas with animated audio soundwaves.

6. **Dedicated Pages**:
   - `index.html` - Full featured landing page with all conversion-focused sections.
   - `about.html` - Mission, vision, tutor screening standards, child safety guidelines.
   - `contact.html` - Direct WhatsApp connect, email inquiries, and contact form with Firebase Firestore logging.
   - `/admin` (`admin/index.html` or `admin.html`) - Full-featured Admin Dashboard.

---

## 🛡️ Professional Admin Dashboard (`/admin`)

The Admin Panel is a secure Single Page Application (SPA) providing complete management of the academy website without editing code manually.

### 📍 Access URL:
- Local: Open `admin/index.html` or `admin.html` in any browser.
- Deployed on Vercel: `https://halenooracademy.vercel.app/admin` (or `/admin.html`).

### 🔑 Admin Authentication & Security
- **Firebase Authentication**: Email and password authentication with automatic session persistence.
- **Route Protection**: Unauthenticated users or non-admin accounts cannot view or modify academy data.
- **Master Admin Setup**: Click *"Setup Master Admin Account"* on the login page with security passcode `halenoor2026` to initialize your master administrator credentials.
- **Firestore Security Rules**: Configured in `firestore.rules` (public read for curriculum/banners/reviews; public create-only for trial leads and contact messages; admin-only for everything else).
- **Firebase Storage Security Rules**: Configured in `storage.rules`.

### 📊 Dashboard Modules & Content Management
1. **Dashboard Overview**:
   - Dynamic real-time statistics: Total Students, Total Teachers, Total Courses, Active Enrollments, Pending Leads, Total Contact Messages.
   - Quick action shortcuts.
   - Recent trial registrations and contact messages preview.
2. **Courses Management**:
   - Add, Edit, Delete Quran courses.
   - Custom syllabus breakdown modules (step-by-step topics).
   - Fee rates (USD & PKR), duration, target audience, prerequisites.
   - Image upload or preset selection.
   - All changes sync dynamically with the public website `#courses` section and trial dropdown.
3. **Teachers & Faculty Management**:
   - Add, Edit, Delete teacher profiles.
   - Male / Female scholars categorization, qualifications, years of experience, languages.
   - Photo upload and availability toggle.
4. **Registered Students Management**:
   - Full student directory with parent details, age, enrolled course, assigned tutor, monthly fee, status (Active, Completed, Paused).
5. **Enrollment & Free Trial Leads Management**:
   - Real-time stream of all submissions from homepage trial booking form.
   - Status tracking: *New &rarr; Contacted &rarr; Trial Scheduled &rarr; Approved &rarr; Converted to Student &rarr; Rejected*.
   - Direct 1-click WhatsApp messaging to students.
   - Schedule Trial Class modal (assign tutor, trial date/time, Zoom meeting link).
   - 1-click Convert Lead to Registered Student.
6. **Homepage Slider Management**:
   - Add, edit, reorder, or delete carousel slides.
   - Visible/Active switch to enable or disable banners in real time.
7. **Photo Gallery Management**:
   - Upload photos, certificates, and campus milestones.
   - Categorize by Online Classes, Certificates, Hifz Program, etc.
8. **Parent Testimonials Management**:
   - Add, edit, delete reviews.
   - Star rating (1-5), reviewer name, student name, location.
   - Publish / unpublish toggle (published reviews show on public site).
9. **Contact Form Inquiries**:
   - View, search, and manage incoming messages from `contact.html`.
   - Read message details, mark read/unread, and 1-click reply via WhatsApp or Email.
10. **One-Click Initial Data Seeder**:
    - Built-in button in Settings and Sidebar: *"Seed Initial Website Data"*.
    - Automatically populates Firebase Firestore with all 6 authentic academy courses, 5 slider banners, 4 qualified teachers, and parent reviews.

---

## 🚀 How to Run & View the Website

You can open the website immediately without any server or installation:

1. Open File Explorer and navigate to:
   `c:\Users\LENOVO\Desktop\New folder`
2. Double-click on `index.html` to view the public website.
3. Double-click on `admin/index.html` or `admin.html` to access the Admin Panel.

---

## ⚙️ How to Customize Your Academy Details

Open `assets/js/main.js` and `admin/js/admin-config.js` to customize:
- **WhatsApp Number**: Change to your actual WhatsApp business number (e.g. `923208040672`).
- **Email Address**: `info@halenoorquran.com`.
- **Pricing Rates**: Adjust any monthly tuition numbers in the `PRICING_DATA` object.
