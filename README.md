# Halenoor Quran Academy (ہالہ نور آن لائن قران اکیڈمی)

A modern, responsive, high-converting online Quran Academy website designed with an authentic Islamic aesthetic (Emerald Green & Warm Gold palette), full mobile responsiveness, interactive trial registration, direct WhatsApp admissions desk integration, and an Admissions Coordinator Dashboard.

---

## 🌟 Key Features

1. **Brand Identity & Graphics:**
   - Custom SVG Logo for Halenoor Quran Academy with crescent moon, glowing star, and holy Quran book.
   - Dual versions: Full-color logo (`images/logo.svg`) and inverted white logo (`images/logo-white.svg`).
   - Islamic Calligraphy Bismillah header (`images/bismillah.svg`).
   - Geometric 8-point Islamic star arabesque background pattern (`images/pattern.svg`).

2. **Complete Multi-Page Architecture:**
   - **`index.html`**: The complete flagship landing page with Hero section, live booking widget, daily Quran Ayah reciter, 6 featured courses, tutor standards, transparent fee table, parent reviews, FAQ accordion, and floating WhatsApp button.
   - **`courses.html`**: Detailed curriculum breakdown for Noorani Qaida, Quran with Tajweed, Hifz Memorization, Tafseer, Islamic Studies for Kids, and Sisters Special Program.
   - **`about.html`**: Academy vision, 5-stage tutor screening process, and educational values.
   - **`pricing.html`**: Fee plans with an interactive real-time multi-currency converter (USD, GBP, CAD, AUD, EUR, PKR) and sibling discount calculator.
   - **`contact.html`**: Direct contact desk with email, WhatsApp, and inquiry forms.
   - **`trial.html`**: High-conversion landing page dedicated specifically to booking 3-Day Free Trial classes.
   - **`admin.html`**: Admissions Desk & Student Leads Dashboard with real-time statistics, status tracker (New, Contacted, Trial Scheduled, Enrolled), 1-click WhatsApp messaging, search filters, and CSV/Excel export.
   - **`privacy.html`**: Child protection and student privacy policy.
   - **`terms.html`**: Academic guidelines, attendance rules, and fee policies.

3. **Interactive Functionality (`js/main.js`):**
   - **Dynamic Currency Switcher**: Toggles pricing between USD ($), GBP (£), CAD (CA$), AUD (AU$), EUR (€), and PKR (Rs).
   - **Instant WhatsApp Lead Redirection**: Whenever a student or parent fills any trial or contact form, it formats all their details into a clean WhatsApp message and opens WhatsApp directly to confirm with the academy coordinator.
   - **Interactive Quran Ayah & Audio Player**: Visitors can listen to authentic Quran recitation (Mishary Rashid Alafasy EveryAyah stream) directly on the website.
   - **Global Free Trial Modal**: Accessible from any page or course card.
   - **FAQ Accordion**: Smooth expand/collapse answers.
   - **Local Lead Storage**: Registrations are saved in `localStorage` and viewable in `admin.html`.

---

## 🚀 How to Open the Website (ویب سائٹ کیسے چلائیں)

No server installation, Node.js, or complex build steps are required!

1. Open folder: `C:\Users\LENOVO\Desktop\acadmy website`
2. Double-click **`index.html`** to view the website in Chrome, Edge, Firefox, or any browser.
3. Open **`admin.html`** to view received student trial inquiries and manage admissions.

---

## ⚙️ How to Customize Your WhatsApp & Phone Number (واٹس ایپ نمبر تبدیل کرنے کا طریقہ)

Open `js/main.js` in any text editor and update the top configuration block:

```javascript
const ACADEMY_CONFIG = {
  academyName: "Halenoor Quran Academy",
  whatsappNumber: "923001234567", // <-- Put your WhatsApp number here (Country code without '+' or spaces)
  displayPhone: "+92 300 1234567", // <-- Display format
  email: "admissions@halenoor.com"
};
```

---

## 🎨 Color Palette

- **Emerald Green Primary**: `#044e39`, `#065f46`, `#022c22`
- **Luminous Gold Accent**: `#f59e0b`, `#d97706`, `#fbbf24`
- **Soft Cream & White**: `#faf8f5`, `#ffffff`
