/**
 * Hale Noor Online Quran Academy - Interactive Scripts
 * Provides currency switching, fee calculator, syllabus modals,
 * free trial form handling with WhatsApp integration, and audio recitation.
 */

// Global Academy Configuration
const ACADEMY_CONFIG = {
  name: "Hale Noor Online Quran Academy",
  arabicName: "هالة نور أكاديمية القرآن الكريم",
  whatsappNumber: "923208040672", // Academy official WhatsApp (replace with client's actual number)
  email: "info@halenoorquran.com",
  admissionsEmail: "admissions@halenoorquran.com",
  phoneDisplay: "+92 320 8040672"
};

// Pricing Data across currencies
const PRICING_DATA = {
  USD: { symbol: "$", rates: { basic: 35, standard: 45, regular: 55, intensive: 70, weekend: 38 } },
  GBP: { symbol: "£", rates: { basic: 28, standard: 36, regular: 45, intensive: 55, weekend: 30 } },
  CAD: { symbol: "C$", rates: { basic: 45, standard: 60, regular: 75, intensive: 95, weekend: 50 } },
  AUD: { symbol: "A$", rates: { basic: 50, standard: 65, regular: 80, intensive: 105, weekend: 55 } },
  EUR: { symbol: "€", rates: { basic: 32, standard: 42, regular: 50, intensive: 65, weekend: 35 } },
  PKR: { symbol: "Rs ", rates: { basic: 4500, standard: 6000, regular: 7500, intensive: 9500, weekend: 5000 } },
  AED: { symbol: "AED ", rates: { basic: 130, standard: 165, regular: 200, intensive: 250, weekend: 140 } },
  SAR: { symbol: "SAR ", rates: { basic: 130, standard: 165, regular: 200, intensive: 250, weekend: 140 } }
};

let currentCurrency = 'USD';

// Course Syllabus Details for Modal
const COURSE_SYLLABI = {
  qaida: {
    title: "Noorani Qaida for Beginners & Kids",
    arabicTitle: "القاعدة النورانية",
    duration: "2 - 4 Months (based on student pace)",
    target: "Kids (4+ years) and beginner adults",
    classesPerWeek: "3 - 5 classes/week (30 mins each)",
    levels: [
      { level: "Module 1", desc: "Arabic Alphabet recognition, individual letter shapes, correct Makharij (points of articulation)." },
      { level: "Module 2", desc: "Compound letters (Murakkabat), Harakaat (Fatha, Kasra, Dammah), and short vowel rules." },
      { level: "Module 3", desc: "Huroof-e-Maddah (prolongation letters), Leen letters, Tanween, Sukoon / Jazm." },
      { level: "Module 4", desc: "Tashdeed (Shaddah), Nun Sakinah & Tanween rules (Izhar, Ikhfa, Idgham, Iqlab), and transition to Quranic words." }
    ],
    prerequisites: "None! Zero prior Arabic knowledge needed.",
    includes: ["1-on-1 Certified Tutor", "Interactive Digital Qaida PDF", "Daily Tajweed Correction", "Monthly Progress Exam", "Certificate of Completion"]
  },
  nazra: {
    title: "Quran Reading with Tajweed (Nazra)",
    arabicTitle: "تلاوة القرآن الكريم بالتجويد",
    duration: "6 - 12 Months",
    target: "Students who completed Qaida and want fluent recitation",
    classesPerWeek: "3 - 5 classes/week (30 mins each)",
    levels: [
      { level: "Module 1: Basic Fluency", desc: "Reading short Surahs from Juz 30 (Amma) with correct stops (Waqf) and breath control." },
      { level: "Module 2: Core Tajweed Rules", desc: "Madd (elongation types), Meem Sakinah rules, Ghunnah, Qalqalah (echo letters)." },
      { level: "Module 3: Advanced Tajweed", desc: "Heavy & light letters (Tafkheem & Tarqeeq), Hamzat-ul-Wasl rules, signs of stopping in Quran." },
      { level: "Module 4: Full Nazra Completion", desc: "Reciting from Surah Al-Baqarah to An-Nas with melodious tone, fluent speed, and zero grammatical errors." }
    ],
    prerequisites: "Basic letter reading ability (or Noorani Qaida).",
    includes: ["Male or Female Certified Qari", "Screen-shared Mushaf with colored Tajweed rules", "Salah & Kalima practice", "Monthly evaluation report"]
  },
  hifz: {
    title: "Hifz-ul-Quran (Quran Memorization)",
    arabicTitle: "حفظ القرآن الكريم",
    duration: "2 - 3 Years (Customized Fast-Track Available)",
    target: "Dedicated boys, girls, and adults aiming to become Hafiz-e-Quran",
    classesPerWeek: "5 - 6 classes/week (45 mins each)",
    levels: [
      { level: "Phase 1: Foundation (Juz 30 & 29)", desc: "Memorizing Juz Amma with pristine Tajweed, establishing memorization muscle." },
      { level: "Phase 2: Core Memorization (Sabaq)", desc: "Daily new lesson memorization (half page to 1 full page daily)." },
      { level: "Phase 3: Revision Cycle (Sabqi & Manzil)", desc: "Systematic revision of recent and old Juz every single day to cement memory." },
      { level: "Phase 4: Sanad Preparation & Final Test", desc: "Full 30 Juz revision without mistakes under the guidance of Senior Huffaz." }
    ],
    prerequisites: "Fluent Quran recitation with Tajweed.",
    includes: ["1-on-1 Hafiz/Hafiza Mentor", "Daily Sabaq & Sabqi Tracking Sheet", "Quarterly Board Exams", "Ijazah & Graduation Certificate"]
  },
  translation: {
    title: "Quran Translation & Tafseer (Tarjuma)",
    arabicTitle: "ترجمة وتفسير القرآن الكريم",
    duration: "1 - 2 Years",
    target: "Youth & Adults wanting to understand Quran in Urdu or English",
    classesPerWeek: "2 - 3 classes/week (40 mins each)",
    levels: [
      { level: "Module 1", desc: "Word-by-word literal translation of frequently used Quranic vocabulary." },
      { level: "Module 2", desc: "Context of Revelation (Asbab al-Nuzul) and historical background of Surahs." },
      { level: "Module 3", desc: "Tafseer of selected profound Surahs (Surah Al-Fatihah, Al-Kahf, Yaseen, Ar-Rahman, Al-Mulk)." },
      { level: "Module 4", desc: "Practical application of Quranic commandments in contemporary daily life." }
    ],
    prerequisites: "Basic Quran reading.",
    includes: ["Alim/Alimah Degree Holder Tutors", "Bilingual Explanations (Urdu & English)", "Q&A Sessions", "Class Notes & Summary Slides"]
  },
  islamic_studies: {
    title: "Islamic Studies, Namaz & Daily Duas",
    arabicTitle: "الدراسات الإسلامية والأدعية",
    duration: "6 Months Ongoing",
    target: "Children (5-16 years) & new reverts to Islam",
    classesPerWeek: "2 - 3 classes/week (30 mins each)",
    levels: [
      { level: "Module 1: Pillars & Beliefs", desc: "Six Kalimas, Articles of Faith (Iman-e-Mufassal & Mujmal), 5 Pillars of Islam." },
      { level: "Module 2: Practical Salah (Namaz)", desc: "Step-by-step Wudu, Salah method with translation, Sunnahs, and common mistakes." },
      { level: "Module 3: Daily Masnoon Duas", desc: "Sleeping, waking, eating, leaving home, entering mosque, traveling, and protection Duas." },
      { level: "Module 4: Seerah & Islamic Character", desc: "Life of Prophet Muhammad (PBUH), stories of Prophets, Akhlaaq & Adaab (etiquettes)." }
    ],
    prerequisites: "None.",
    includes: ["Interactive Islamic Stories", "Illustrated Duas Worksheets", "Character Building Focus", "Certificate of Achievement"]
  },
  arabic_lang: {
    title: "Quranic Arabic & Grammar Basics",
    arabicTitle: "قواعد اللغة العربية للقرآن",
    duration: "6 - 9 Months",
    target: "Students eager to understand Arabic grammar (Nahw & Sarf) directly",
    classesPerWeek: "2 - 3 classes/week (45 mins each)",
    levels: [
      { level: "Module 1: Arabic Morphology (Sarf)", desc: "Root letter system, 3-letter verbs, past/present/imperative conjugation patterns." },
      { level: "Module 2: Arabic Syntax (Nahw)", desc: "Noun sentences, verb sentences, Harf-e-Jarr, pronouns, and I'rab (case endings)." },
      { level: "Module 3: Quranic Vocabulary", desc: "Mastering the 80% most repeated words in the Holy Quran." },
      { level: "Module 4: Direct Ayah Breakdown", desc: "Grammatical analysis (Tarkeeb) of short Surahs and famous Ayahs." }
    ],
    prerequisites: "Basic Quran reading.",
    includes: ["Comprehensive Grammar Exercises", "Arabic Vocabulary Flashcards", "Guided Translation Practice", "Qualified Arabic Linguist"]
  }
};

// Quran Recitations Audio Data
const QURAN_RECITATIONS = [
  {
    title: "Surah Al-Fatihah (The Opening)",
    arabic: "سُورَةُ الْفَاتِحَةِ",
    reciter: "Mishary Rashid Alafasy",
    audioUrl: "https://server8.mp3quran.net/afs/001.mp3",
    verses: "7 Verses • Makki",
    meaning: "The indispensable opening chapter of the Holy Quran, recited in every unit of prayer."
  },
  {
    title: "Ayat-ul-Kursi (The Throne Verse)",
    arabic: "آيَةُ الْكُرْسِيِّ",
    reciter: "Mishary Rashid Alafasy",
    audioUrl: "https://server8.mp3quran.net/afs/002.mp3", // Starts Al-Baqarah
    verses: "Surah Al-Baqarah, Ayah 255",
    meaning: "The greatest verse in the Quran, declaring the Supreme Sovereignty, Eternal Life, and Knowledge of Allah."
  },
  {
    title: "Surah Al-Ikhlas (The Sincerity)",
    arabic: "سُورَةُ الإِخْلَاصِ",
    reciter: "Mishary Rashid Alafasy",
    audioUrl: "https://server8.mp3quran.net/afs/112.mp3",
    verses: "4 Verses • Makki",
    meaning: "Equivalent to one-third of the Quran in spiritual reward, affirming the absolute Oneness of Allah (Tawheed)."
  }
];

// Initialize on DOM load
function initHaleNoorApp() {
  initNightVisionTheme();
  initLanguageSwitcher();
  setupFeaturedSlider();
  initCurrencySwitcher();
  initFeeCalculator();
  initFreeTrialForm();
  initAudioPlayer();
  initMobileMenu();
  initFAQAccordion();
  initSmoothScroll();
  initFirebasePublicSync();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHaleNoorApp);
} else {
  initHaleNoorApp();
}

// 1. Currency Switcher
function initCurrencySwitcher() {
  const currencySelects = document.querySelectorAll('.currency-selector');
  currencySelects.forEach(select => {
    select.value = currentCurrency;
    select.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      // Sync all currency select elements on page
      currencySelects.forEach(s => s.value = currentCurrency);
      updatePricingDisplay();
      updateCalculator();
    });
  });
  updatePricingDisplay();
}

function updatePricingDisplay() {
  const curr = PRICING_DATA[currentCurrency] || PRICING_DATA.USD;
  
  document.querySelectorAll('[data-plan-rate]').forEach(el => {
    const planKey = el.getAttribute('data-plan-rate');
    if (curr.rates[planKey] !== undefined) {
      el.textContent = `${curr.symbol}${curr.rates[planKey].toLocaleString()}`;
    }
  });

  document.querySelectorAll('.current-currency-symbol').forEach(el => {
    el.textContent = curr.symbol;
  });
}

// 2. Interactive Fee Calculator
function initFeeCalculator() {
  const studentsSelect = document.getElementById('calc-students');
  const frequencySelect = document.getElementById('calc-frequency');
  const durationSelect = document.getElementById('calc-duration');

  if (studentsSelect && frequencySelect) {
    studentsSelect.addEventListener('change', updateCalculator);
    frequencySelect.addEventListener('change', updateCalculator);
    if (durationSelect) durationSelect.addEventListener('change', updateCalculator);
    updateCalculator();
  }
}

function updateCalculator() {
  const studentsEl = document.getElementById('calc-students');
  const freqEl = document.getElementById('calc-frequency');
  const totalDisplay = document.getElementById('calc-total-display');
  const discountNotice = document.getElementById('calc-discount-notice');
  const classesPerMonth = document.getElementById('calc-classes-count');

  if (!studentsEl || !freqEl || !totalDisplay) return;

  const numStudents = parseInt(studentsEl.value) || 1;
  const freq = freqEl.value; // 'basic' (2 days), 'standard' (3 days), 'regular' (4 days), 'intensive' (5 days), 'weekend'
  
  const curr = PRICING_DATA[currentCurrency] || PRICING_DATA.USD;
  const baseRate = curr.rates[freq] || curr.rates.standard;

  // Monthly classes estimation
  let monthlyClasses = 12;
  if (freq === 'basic' || freq === 'weekend') monthlyClasses = 8;
  else if (freq === 'standard') monthlyClasses = 12;
  else if (freq === 'regular') monthlyClasses = 16;
  else if (freq === 'intensive') monthlyClasses = 20;

  if (classesPerMonth) {
    classesPerMonth.textContent = `${monthlyClasses * numStudents} Live 1-on-1 Classes / Month`;
  }

  // Calculate with Sibling Discount: 1st student full price, additional students get 15% discount
  let totalPrice = baseRate;
  if (numStudents > 1) {
    const discountedRatePerExtra = baseRate * 0.85;
    totalPrice = baseRate + ((numStudents - 1) * discountedRatePerExtra);
    if (discountNotice) {
      discountNotice.classList.remove('hidden');
      discountNotice.textContent = `🎉 15% Family Sibling Discount applied for ${numStudents - 1} student(s)!`;
    }
  } else {
    if (discountNotice) discountNotice.classList.add('hidden');
  }

  totalDisplay.textContent = `${curr.symbol}${Math.round(totalPrice).toLocaleString()}`;
}

// 3. Free Trial Registration Form Handling & WhatsApp Hook
function initFreeTrialForm() {
  const trialForm = document.getElementById('free-trial-form');
  if (!trialForm) return;

  // Pre-fill country code and timezone if available
  try {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzField = document.getElementById('student-timezone');
    if (tzField && !tzField.value) {
      tzField.value = userTimezone || "UTC";
    }
  } catch (err) {
    // Graceful fallback
  }

  trialForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get input values
    const name = document.getElementById('student-name')?.value.trim();
    const parentName = document.getElementById('parent-name')?.value.trim();
    const age = document.getElementById('student-age')?.value.trim();
    const course = document.getElementById('student-course')?.value || "Noorani Qaida";
    const tutorGender = document.querySelector('input[name="tutor-gender"]:checked')?.value || "Female Tutor Preferred";
    const country = document.getElementById('student-country')?.value.trim() || "USA / International";
    const city = document.getElementById('student-city')?.value?.trim() || "";
    const timezone = document.getElementById('student-timezone')?.value?.trim() || "";
    const whatsapp = document.getElementById('student-whatsapp')?.value.trim();
    const email = document.getElementById('student-email')?.value.trim();
    const preferredTime = document.getElementById('preferred-time')?.value || "Evening Slot";
    const notes = document.getElementById('student-notes')?.value.trim() || "None";

    if (!name || !whatsapp) {
      alert("Please fill in Student's Name and WhatsApp contact number.");
      return;
    }

    // Prepare WhatsApp Message text
    const messageLines = [
      `*Assalamu Alaikum! New Free Trial Registration*`,
      `*Academy:* Hale Noor Online Quran Academy`,
      `---------------------------------`,
      `*Student Name:* ${name}`,
      parentName ? `*Guardian/Parent:* ${parentName}` : null,
      age ? `*Age:* ${age} years` : null,
      `*Selected Course:* ${course}`,
      `*Preferred Tutor:* ${tutorGender}`,
      `*Country / Time Zone:* ${country}`,
      `*WhatsApp:* ${whatsapp}`,
      email ? `*Email:* ${email}` : null,
      `*Preferred Time:* ${preferredTime}`,
      notes !== "None" ? `*Special Notes:* ${notes}` : null,
      `---------------------------------`,
      `Please confirm my 3-Day Free Trial class timing. JazakAllah Khair!`
    ].filter(Boolean);

    const waText = encodeURIComponent(messageLines.join('\n'));
    const waUrl = `https://api.whatsapp.com/send?phone=${ACADEMY_CONFIG.whatsappNumber}&text=${waText}`;

    // Store in localStorage for reference
    try {
      const submissions = JSON.parse(localStorage.getItem('halenoor_trial_submissions') || '[]');
      submissions.push({
        date: new Date().toISOString(),
        name, parentName, course, tutorGender, whatsapp, email
      });
      localStorage.setItem('halenoor_trial_submissions', JSON.stringify(submissions));

      // Save automatically to Firebase Cloud Firestore
      if (typeof window.saveTrialToFirestore === "function") {
        await window.saveTrialToFirestore({
          name, parentName, age, course, tutorGender, whatsapp, email,
          country: country || "",
          city: city || "",
          timezone: timezone || "",
          preferredTime: preferredTime || "",
          notes: notes !== "None" ? notes : ""
        });
      }
    } catch (err) {
      console.warn("Trial submission notice:", err);
    }

    // Open Success Modal with Action Buttons
    showSuccessModal(name, course, tutorGender, waUrl);
  });

  // Handle Quick Hero and Page trial forms (.trial-form-submit)
  const quickTrialForms = document.querySelectorAll('.trial-form-submit');
  quickTrialForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = (formData.get('studentName') || form.querySelector('input[name="studentName"]')?.value || '').trim();
      const parentName = (formData.get('guardianName') || form.querySelector('input[name="guardianName"]')?.value || '').trim();
      const whatsapp = (formData.get('phone') || form.querySelector('input[name="phone"]')?.value || '').trim();
      const country = (formData.get('country') || form.querySelector('input[name="country"]')?.value || 'International').trim();
      const course = formData.get('course') || form.querySelector('select[name="course"]')?.value || 'Quran Reading with Tajweed';
      const tutorGender = formData.get('tutorType') || form.querySelector('select[name="tutorType"]')?.value || 'Female Tutor Preferred';
      const preferredTime = formData.get('timing') || 'Evening';

      if (!name || !whatsapp) {
        alert("Please enter Student Name and WhatsApp Number.");
        return;
      }

      const messageLines = [
        `*Assalamu Alaikum! New Free Trial Registration*`,
        `*Academy:* Hale Noor Online Quran Academy`,
        `---------------------------------`,
        `*Student Name:* ${name}`,
        parentName ? `*Guardian/Parent:* ${parentName}` : null,
        `*Selected Course:* ${course}`,
        `*Preferred Tutor:* ${tutorGender}`,
        `*Country / Location:* ${country}`,
        `*WhatsApp:* ${whatsapp}`,
        `*Preferred Time:* ${preferredTime}`,
        `---------------------------------`,
        `Please confirm my 3-Day Free Trial class timing. JazakAllah Khair!`
      ].filter(Boolean);

      const waText = encodeURIComponent(messageLines.join('\n'));
      const waUrl = `https://api.whatsapp.com/send?phone=${ACADEMY_CONFIG.whatsappNumber}&text=${waText}`;

      try {
        const submissions = JSON.parse(localStorage.getItem('halenoor_trial_submissions') || '[]');
        submissions.push({ date: new Date().toISOString(), name, parentName, course, tutorGender, whatsapp });
        localStorage.setItem('halenoor_trial_submissions', JSON.stringify(submissions));

        if (typeof window.saveTrialToFirestore === "function") {
          await window.saveTrialToFirestore({
            name, parentName, course, tutorGender, whatsapp, country, preferredTime
          });
        }
      } catch (err) {
        console.warn("Trial submit error:", err);
      }

      showSuccessModal(name, course, tutorGender, waUrl);
    });
  });
}

// Global Hero Tab Switcher (Trial Form <-> Quran Player)
window.switchHeroTab = function(tab) {
  const trialBox = document.getElementById('hero-trial-box');
  const playerBox = document.getElementById('hero-player-box');
  const trialBtn = document.getElementById('tab-trial-btn');
  const playerBtn = document.getElementById('tab-player-btn');

  if (!trialBox || !playerBox) return;

  if (tab === 'trial') {
    trialBox.classList.remove('hidden');
    playerBox.classList.add('hidden');
    if (trialBtn) {
      trialBtn.className = "flex-1 py-2 px-3 rounded-lg text-xs font-black transition bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 shadow";
    }
    if (playerBtn) {
      playerBtn.className = "flex-1 py-2 px-3 rounded-lg text-xs font-bold text-slate-600 hover:text-emerald-950 transition";
    }
  } else {
    playerBox.classList.remove('hidden');
    trialBox.classList.add('hidden');
    if (playerBtn) {
      playerBtn.className = "flex-1 py-2 px-3 rounded-lg text-xs font-black transition bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 shadow";
    }
    if (trialBtn) {
      trialBtn.className = "flex-1 py-2 px-3 rounded-lg text-xs font-bold text-slate-600 hover:text-emerald-950 transition";
    }
  }
};

function showSuccessModal(name, course, tutorGender, waUrl) {
  const modal = document.getElementById('success-modal');
  if (!modal) {
    // If no modal in DOM, redirect directly to WhatsApp
    window.open(waUrl, '_blank');
    return;
  }

  const namePlaceholder = document.getElementById('modal-student-name');
  const coursePlaceholder = document.getElementById('modal-course-name');
  const waBtn = document.getElementById('modal-whatsapp-btn');

  if (namePlaceholder) namePlaceholder.textContent = name;
  if (coursePlaceholder) coursePlaceholder.textContent = `${course} (${tutorGender})`;
  if (waBtn) waBtn.href = waUrl;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

// 4. Course Syllabus Modal Viewer
function openSyllabusModal(courseKey) {
  const data = COURSE_SYLLABI[courseKey];
  if (!data) return;

  const modal = document.getElementById('syllabus-modal');
  if (!modal) return;

  document.getElementById('syllabus-title').textContent = data.title;
  document.getElementById('syllabus-arabic-title').textContent = data.arabicTitle;
  document.getElementById('syllabus-duration').textContent = data.duration;
  document.getElementById('syllabus-target').textContent = data.target;
  document.getElementById('syllabus-classes').textContent = data.classesPerWeek;
  document.getElementById('syllabus-prereq').textContent = data.prerequisites;

  // Populate Modules
  const modulesContainer = document.getElementById('syllabus-modules');
  modulesContainer.innerHTML = '';
  data.levels.forEach(mod => {
    const item = document.createElement('div');
    item.className = 'p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100';
    item.innerHTML = `
      <div class="font-bold text-emerald-950 flex items-center gap-2">
        <span class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-semibold">✓</span>
        ${mod.level}
      </div>
      <p class="text-sm text-slate-600 mt-1 pl-8">${mod.desc}</p>
    `;
    modulesContainer.appendChild(item);
  });

  // Populate Key Features / Includes
  const includesContainer = document.getElementById('syllabus-includes');
  includesContainer.innerHTML = '';
  data.includes.forEach(inc => {
    const li = document.createElement('li');
    li.className = 'flex items-center gap-2 text-sm text-slate-700';
    li.innerHTML = `<i class="fa-solid fa-star text-amber-500 text-xs"></i> <span>${inc}</span>`;
    includesContainer.appendChild(li);
  });

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeSyllabusModal() {
  const modal = document.getElementById('syllabus-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

// 5. Quran Audio Recitation Widget
let currentAudio = null;
let currentTrackIndex = 0;

function initAudioPlayer() {
  const playBtn = document.getElementById('audio-play-btn');
  const prevBtn = document.getElementById('audio-prev-btn');
  const nextBtn = document.getElementById('audio-next-btn');

  if (!playBtn) return;

  currentAudio = new Audio(QURAN_RECITATIONS[currentTrackIndex].audioUrl);
  updateAudioTrackUI();

  playBtn.addEventListener('click', toggleAudioPlay);
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex - 1 + QURAN_RECITATIONS.length) % QURAN_RECITATIONS.length;
      switchAudioTrack(currentTrackIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex + 1) % QURAN_RECITATIONS.length;
      switchAudioTrack(currentTrackIndex);
    });
  }

  currentAudio.addEventListener('ended', () => {
    const icon = playBtn.querySelector('i');
    const soundWave = document.getElementById('audio-sound-wave');
    if (icon) {
      icon.className = 'fa-solid fa-play ml-1';
    }
    if (soundWave) {
      soundWave.classList.add('opacity-0');
    }
  });
}

function switchAudioTrack(index) {
  if (!currentAudio) return;
  const wasPlaying = !currentAudio.paused;
  currentAudio.pause();
  currentAudio.src = QURAN_RECITATIONS[index].audioUrl;
  updateAudioTrackUI();
  
  const playBtn = document.getElementById('audio-play-btn');
  const soundWave = document.getElementById('audio-sound-wave');
  const icon = playBtn ? playBtn.querySelector('i') : null;

  if (wasPlaying) {
    currentAudio.play().then(() => {
      if (icon) icon.className = 'fa-solid fa-pause';
      if (soundWave) soundWave.classList.remove('opacity-0');
    }).catch(() => {
      if (icon) icon.className = 'fa-solid fa-play ml-1';
      if (soundWave) soundWave.classList.add('opacity-0');
    });
  } else {
    if (icon) icon.className = 'fa-solid fa-play ml-1';
    if (soundWave) soundWave.classList.add('opacity-0');
  }
}

function toggleAudioPlay() {
  const playBtn = document.getElementById('audio-play-btn');
  const soundWave = document.getElementById('audio-sound-wave');
  if (!playBtn || !currentAudio) return;

  const icon = playBtn.querySelector('i');

  if (currentAudio.paused) {
    currentAudio.play().then(() => {
      if (icon) icon.className = 'fa-solid fa-pause';
      if (soundWave) soundWave.classList.remove('opacity-0');
    }).catch(err => {
      console.warn("Audio play blocked or unavailable:", err);
    });
  } else {
    currentAudio.pause();
    if (icon) icon.className = 'fa-solid fa-play ml-1';
    if (soundWave) soundWave.classList.add('opacity-0');
  }
}

function updateAudioTrackUI() {
  const track = QURAN_RECITATIONS[currentTrackIndex];
  const titleEl = document.getElementById('audio-title');
  const arabicEl = document.getElementById('audio-arabic');
  const reciterEl = document.getElementById('audio-reciter');
  const versesEl = document.getElementById('audio-verses');

  if (titleEl) titleEl.textContent = track.title;
  if (arabicEl) arabicEl.textContent = track.arabic;
  if (reciterEl) reciterEl.textContent = `Recited by: ${track.reciter}`;
  if (versesEl) versesEl.textContent = track.verses;
}

// 6. Mobile Menu Drawer
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-backdrop');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.remove('translate-x-full');
    if (backdrop) backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.add('translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// 7. FAQ Accordion
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        const otherContent = otherItem.querySelector('.faq-content');
        const otherIcon = otherItem.querySelector('.faq-icon');
        if (otherContent) otherContent.classList.add('hidden');
        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
      });

      // Toggle current
      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

// 8. Smooth Scrolling for Internal Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Quick prefill helper for Free Trial Course selection
function prefillTrialCourse(courseName) {
  const courseSelect = document.getElementById('student-course');
  if (courseSelect) {
    for (let i = 0; i < courseSelect.options.length; i++) {
      if (courseSelect.options[i].text.toLowerCase().includes(courseName.toLowerCase())) {
        courseSelect.selectedIndex = i;
        break;
      }
    }
  }
  const trialSection = document.getElementById('free-trial');
  if (trialSection) {
    trialSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// 9. Day Mode / Night Vision Theme Controller
function initNightVisionTheme() {
  const root = document.documentElement;
  const STORAGE_KEY = 'halenoor_theme';

  function isDark() {
    return root.classList.contains('dark');
  }

  function setMode(dark) {
    root.classList.add('theme-transitioning');
    if (dark) {
      root.classList.add('dark');
      try { localStorage.setItem(STORAGE_KEY, 'dark'); } catch (e) {}
    } else {
      root.classList.remove('dark');
      try { localStorage.setItem(STORAGE_KEY, 'light'); } catch (e) {}
    }

    updateToggleButtons(dark);

    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 350);
  }

  function toggleMode() {
    setMode(!isDark());
  }

  // Expose globally
  window.setThemeMode = setMode;
  window.toggleThemeMode = toggleMode;

  function updateToggleButtons(darkActive) {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      const dayEl = btn.querySelector('.theme-mode-day');
      const nightEl = btn.querySelector('.theme-mode-night');
      if (dayEl && nightEl) {
        if (darkActive) {
          dayEl.classList.remove('active-mode');
          nightEl.classList.add('active-mode');
        } else {
          dayEl.classList.add('active-mode');
          nightEl.classList.remove('active-mode');
        }
      }

      const iconSpan = btn.querySelector('.theme-icon-container');
      const textSpan = btn.querySelector('.theme-text');
      const mobileTextSpan = btn.querySelector('.mobile-theme-text');

      if (darkActive) {
        if (iconSpan && !nightEl) iconSpan.innerHTML = '<i class="fa-solid fa-sun text-amber-400"></i>';
        if (textSpan && !nightEl) textSpan.textContent = 'Day Mode';
        if (mobileTextSpan) mobileTextSpan.textContent = 'Day Mode ☀️';
      } else {
        if (iconSpan && !nightEl) iconSpan.innerHTML = '<i class="fa-solid fa-moon text-amber-500"></i>';
        if (textSpan && !nightEl) textSpan.textContent = 'Night Mode';
        if (mobileTextSpan) mobileTextSpan.textContent = 'Night Mode 🌙';
      }
    });

    document.querySelectorAll('.floating-theme-toggle').forEach(btn => {
      const iconSpan = btn.querySelector('.theme-icon-container');
      const textSpan = btn.querySelector('.floating-theme-text') || btn.querySelector('.theme-text');
      const isUr = (document.documentElement.getAttribute('lang') === 'ur');

      if (darkActive) {
        if (iconSpan) iconSpan.innerHTML = '<i class="fa-solid fa-sun text-amber-400"></i>';
        if (textSpan) textSpan.textContent = isUr ? 'ڈے موڈ ☀️' : 'Day Mode ☀️';
      } else {
        if (iconSpan) iconSpan.innerHTML = '<i class="fa-solid fa-moon text-amber-500"></i>';
        if (textSpan) textSpan.textContent = isUr ? 'نائٹ موڈ 🌙' : 'Night Mode 🌙';
      }
    });
  }

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    if (btn._hasThemeListener) return;
    btn._hasThemeListener = true;

    const dayEl = btn.querySelector('.theme-mode-day');
    const nightEl = btn.querySelector('.theme-mode-night');

    if (dayEl && nightEl) {
      dayEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMode(false);
      });
      nightEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMode(true);
      });
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMode();
      });
    } else {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMode();
      });
    }
  });

  document.querySelectorAll('.floating-theme-toggle').forEach(btn => {
    if (btn._hasThemeListener) return;
    btn._hasThemeListener = true;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMode();
    });
  });

  // Sync initial state
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === 'dark') {
    root.classList.add('dark');
  } else if (savedTheme === 'light') {
    root.classList.remove('dark');
  }
  updateToggleButtons(isDark());
}

// ========================================================
// 10. English & Urdu Bilingual Translation System
// ========================================================
const TRANSLATIONS = {
  en: {
    // Top bar
    "top_announcement": "New Admissions",
    "top_announcement_text": "Start Your <strong>3-Day Free Trial</strong> Today! Male & Female Certified Tutors Available.",
    "top_call": "Call: 0320 8040672",
    "top_whatsapp": "WhatsApp: +92 320 8040672",
    "top_currency": "Currency:",

    // Day / Night Switcher
    "theme_day": "Day",
    "theme_night": "Night",
    "theme_day_title": "Switch to Day Light Mode",
    "theme_night_title": "Switch to Night Vision (Dark Mode)",
    "floating_night_text": "Night Mode 🌙",
    "floating_day_text": "Day Mode ☀️",

    // Navigation
    "nav_courses": "Courses",
    "nav_why_us": "Why Choose Us",
    "nav_pricing": "Fee Plans",
    "nav_calculator": "Fee Calculator",
    "nav_faqs": "FAQs",
    "nav_contact": "Contact",
    "nav_admin_portal": "Admin Portal",
    "nav_book_trial": "Book Free Trial",

    // Hero Section
    "hadith_quote": "\"The best among you are those who learn the Quran and teach it.\" — Sahih Bukhari",
    "hero_badge": "Worldwide Certified Online Quran Tutoring",
    "hero_title_1": "Learn the Holy Quran Online with",
    "hero_title_tajweed": "Tajweed",
    "hero_title_2": "from the Comfort of Your Home",
    "hero_desc": "Personalized 1-on-1 Live Interactive Classes for kids and adults. Guided by certified Male & dedicated Female Quran Tutors. Designed for families in the USA, UK, Canada, Australia, Europe, Gulf, and Pakistan.",
    "hero_btn_trial": "Book 3 Days Free Trial",
    "hero_btn_whatsapp": "WhatsApp Admission Desk",
    "hero_stat_students": "Active Students",
    "hero_stat_female": "Tutors Available",
    "hero_stat_timings": "Flexible Timings",
    "hero_stat_trial": "3-Day Trial Class",
    "hero_tab_trial": "Book 3 Days Free Trial",
    "hero_tab_player": "Quran Player",
    "hero_card_tag": "100% Free Trial",
    "hero_card_title": "Book 3 Days Free Trial",
    "hero_card_sub": "Take 3 live 1-on-1 trial classes with certified tutors before paying any fee.",
    
    // Quick Trial Form in Hero
    "form_lbl_name": "Student's Full Name *",
    "form_ph_name": "e.g. Ibrahim / Ayesha Khan",
    "form_lbl_phone": "WhatsApp / Phone *",
    "form_ph_phone": "+92 320 8040672",
    "form_lbl_country": "Country / City *",
    "form_ph_country": "USA, UK, Pakistan...",
    "form_lbl_course": "Select Course *",
    "course_opt_1": "Noorani Qaida (Beginners & Kids)",
    "course_opt_2": "Quran Reading with Tajweed",
    "course_opt_3": "Hifz-ul-Quran (Memorization)",
    "course_opt_4": "Quran Translation & Tafseer",
    "course_opt_5": "Islamic Studies & Daily Duas",
    "course_opt_6": "Quranic Arabic & Grammar",
    "form_lbl_tutor": "Tutor Preference",
    "tutor_opt_female": "🧕 Female Quran Tutor",
    "tutor_opt_male": "🧔 Male Tutor (Hafiz / Scholar)",
    "tutor_opt_any": "Any Qualified Tutor",
    "form_btn_submit_short": "Book 3 Days Free Trial Now",
    "form_guar_card": "No Credit Card",
    "form_guar_cancel": "Cancel Anytime",
    "form_guar_free": "100% Free",

    // Featured Programs Slider
    "slider_badge": "Featured Course Programs",
    "slider_heading": "Explore Our Specialized Classes",
    "slider_sub": "1-on-1 personalized Quran & Islamic studies with certified tutors • 3 Days Free Trial",
    "slider_btn_trial": "Book Free Trial for Selected Course",
    "slider_btn_whatsapp": "WhatsApp Coordinator: 0320 8040672",

    // About Section
    "about_badge": "About Hale Noor",
    "about_card_title": "Path of Guidance",
    "about_card_sub": "Illuminating Hearts with Quranic Light",
    "about_card_feat1_title": "Certified Qaris & Huffaz",
    "about_card_feat1_desc": "Sanad holders from recognized Islamic boards",
    "about_card_feat2_title": "Kids-Friendly Pedagogy",
    "about_card_feat2_desc": "Patient, nurturing, and engaging teaching",
    "about_welcome": "Welcome to Hale Noor Quran Academy",
    "about_heading": "Empowering Muslim Families Worldwide to Connect with the Words of Allah",
    "about_p1": "At Hale Noor Online Quran Academy (ہالہ نور آن لائن اکیڈمی), our sacred mission is to provide accessible, high-standard Quranic education to children, youth, and adults across the globe. Living in non-Muslim countries often makes it difficult to find qualified, fluent, and caring Quran teachers. We bridge this distance directly into your living room through secure, live, one-on-one sessions.",
    "about_p2": "Whether your child is starting their first Arabic letters in Noorani Qaida, seeking melodious fluency in Tajweed, embarking on the noble journey of Hifz, or an adult wanting to understand Quran with translation and Tafseer — our certified faculty guides you at your own pace.",
    "about_f1_title": "100% 1-on-1 Focused Classes",
    "about_f1_desc": "No group chaos. Complete teacher attention on your child.",
    "about_f2_title": "Female Tutors for Sisters & Girls",
    "about_f2_desc": "Dedicated female teachers for a safe & comfortable environment.",
    "about_f3_title": "Monthly Performance Reports",
    "about_f3_desc": "Track Makharij, revision pace, and Tajweed accuracy.",
    "about_f4_title": "Flexible Rescheduling",
    "about_f4_desc": "Makeup classes available if you need to travel or miss a slot.",
    "about_btn_courses": "Explore All Courses",
    "about_btn_story": "Read Full Academy Story",

    // Courses Section
    "courses_badge": "Curriculum & Courses",
    "courses_heading": "Comprehensive Quranic Courses for All Ages",
    "courses_sub": "Structured step-by-step learning path from basic Arabic letters to advanced Tajweed, Hifz, and Tafseer. Click \"View Syllabus\" for module breakdowns.",
    "course_btn_syllabus": "View Syllabus",
    "course_btn_trial": "Enroll Free Trial",
    "course_1_title": "Noorani Qaida with Tajweed",
    "course_1_desc": "The essential first foundation. Master Arabic alphabet recognition, correct Makharij (pronunciation points), Harakaat, Tanween, and Sukoon.",
    "course_2_title": "Quran Reading with Tajweed (Nazra)",
    "course_2_desc": "Fluent recitation of the Holy Quran from Surah Al-Fatihah to An-Nas with rules of Madd, Waqf (stopping signs), Ghunnah, and Qalqalah.",
    "course_3_title": "Hifz-ul-Quran (Memorization)",
    "course_3_desc": "Systematic daily memorization under the guidance of experienced Huffaz. Includes Sabaq (new lesson), Sabqi (recent Juz), and Manzil (old revision).",
    "course_4_title": "Quran Translation & Tafseer",
    "course_4_desc": "Understand the Divine Message directly. Word-by-word Urdu/English translation, context of revelations (Shan-e-Nuzool), and practical life lessons.",
    "course_5_title": "Islamic Studies, Namaz & Duas",
    "course_5_desc": "Step-by-step practical Salah (Namaz), 6 Kalimas, daily Masnoon Duas, Seerah of Prophet Muhammad (PBUH), and Islamic manners (Adaab).",
    "course_6_title": "Quranic Arabic & Grammar",
    "course_6_desc": "Learn Arabic morphology (Sarf) and syntax (Nahw) tailored specifically to unlock the grammatical beauty and meaning of the Quranic text.",

    // Why Choose Us
    "why_badge": "Our Distinctions",
    "why_heading": "Why Parents Choose Hale Noor Online Academy",
    "why_sub": "We combine authentic Islamic traditional teaching with modern digital pedagogy to make Quran learning joyful and effective for your children.",
    "why_1_title": "1-on-1 Individual Attention",
    "why_1_desc": "Every session is private. The teacher's complete focus is 100% on your child's articulation, eliminating distractions and ensuring rapid learning.",
    "why_2_title": "Certified Female Tutors",
    "why_2_desc": "We have dedicated, qualified Hafizas and Alimahs available for female students and younger children for maximum comfort, modesty, and peace of mind.",
    "why_3_title": "24/7 Timezone Flexibility",
    "why_3_desc": "Whether you are in New York, London, Toronto, Sydney, Dubai, or Karachi, select class timings that suit your child's after-school or weekend schedule.",
    "why_4_title": "Monthly Progress Exams",
    "why_4_desc": "Stay updated with monthly parent-teacher reviews, detailed progress reports on Tajweed mastery, and certificates upon course completion.",
    "why_5_title": "Modern Interactive Tools",
    "why_5_desc": "Classes are conducted via Zoom or Google Meet with high-definition digital Mushaf screen sharing, audio recording for revision, and digital whiteboards.",
    "why_6_title": "3 Days Free Trial • Zero Risk",
    "why_6_desc": "Experience 3 full days of 1-on-1 classes completely free without any credit card or advance fee. Enroll only when you are 100% satisfied.",

    // How It Works
    "how_badge": "Simple Enrollment",
    "how_heading": "How to Get Started in 4 Easy Steps",
    "how_1_title": "Fill Trial Form",
    "how_1_desc": "Fill the 1-minute free trial form below with student age and preferred class time.",
    "how_2_title": "Confirm Schedule",
    "how_2_desc": "Our coordinator connects with you on WhatsApp to confirm your preferred tutor & slot.",
    "how_3_title": "Take 3 Free Classes",
    "how_3_desc": "Join the 1-on-1 live Zoom class. Meet the teacher and experience our caring teaching style.",
    "how_4_title": "Continue Regular Plan",
    "how_4_desc": "If completely satisfied, choose your monthly plan and begin your child's blessed journey.",

    // Pricing Section
    "pricing_badge": "Affordable Fee Structure",
    "pricing_heading": "Transparent Monthly Tuition Plans",
    "pricing_sub": "Choose the frequency that best fits your family's routine. Family & Sibling discount of 15% OFF automatically available!",
    "currency_picker_lbl": "Select Currency:",
    "plan_1_title": "Basic Plan",
    "plan_1_sub": "Ideal for busy students or Quran revision",
    "plan_2_title": "Standard Plan",
    "plan_2_sub": "Recommended for Qaida & Nazra learning",
    "plan_3_title": "Regular Plan",
    "plan_3_sub": "For fast reading fluency & Tajweed mastery",
    "plan_4_title": "Intensive Plan",
    "plan_4_sub": "Dedicated daily memorization & revision",
    "plan_btn_trial": "Start Free Trial",
    "plan_btn_rec": "Book 3 Days Free Trial",

    // Calculator Section
    "calc_badge": "Instant Fee Calculator",
    "calc_heading": "Calculate Fee for Multiple Children or Custom Days",
    "calc_sub": "Get an instant quote with automatic 15% Sibling Discount for 2nd and subsequent children.",
    "calc_lbl_students": "Number of Students:",
    "calc_lbl_freq": "Classes Frequency:",
    "calc_lbl_est": "Estimated Monthly Total:",
    "calc_discount_pill": "🎉 15% Family Sibling Discount applied!",
    "calc_btn_book": "Book Free Trial with this Schedule",

    // Testimonials
    "reviews_badge": "Parent Reviews",
    "reviews_heading": "What Parents Around the World Say About Hale Noor",
    "reviews_sub": "Alhamdulillah, we have helped hundreds of children and adult learners build a lifelong connection with the Holy Quran.",

    // Free Trial Form Section
    "trial_badge": "100% Free • No Obligation",
    "trial_heading": "Book Your 3-Day Free Trial Class",
    "trial_sub": "Fill out the details below. Our admissions team will reach out to you via WhatsApp / Email to confirm your preferred teacher and time slot.",
    "form_lbl_name_full": "Student's Full Name *",
    "form_lbl_guardian": "Parent / Guardian Name",
    "form_lbl_age": "Student Age / Grade",
    "form_lbl_course_full": "Select Desired Course *",
    "form_lbl_tutor_pref": "Tutor Preference *",
    "form_lbl_whatsapp": "WhatsApp Number (with Country Code) *",
    "form_lbl_email": "Email Address",
    "form_lbl_country_city": "Country & City",
    "form_lbl_time_slot": "Preferred Class Timing Slot",
    "form_lbl_notes": "Additional Notes / Student Background",
    "form_btn_submit_main": "Submit & Schedule 3 Days Free Trial",
    "form_privacy_note": "🔒 We respect your privacy. No spam, no credit card required, instant WhatsApp confirmation.",

    // FAQs
    "faqs_badge": "Got Questions?",
    "faqs_heading": "Frequently Asked Questions (FAQs)",
    "faqs_sub": "Everything you need to know about our tutors, software, and learning process.",

    // Footer
    "footer_desc": "Dedicated to spreading the authentic knowledge and recitation of the Holy Quran worldwide through qualified male and female tutors with Tajweed excellence.",
    "footer_nav_title": "Quick Navigation",
    "footer_courses_title": "Our Courses",
    "footer_desk_title": "Admissions Desk",
    "footer_copyright": "© 2026 Hale Noor Online Quran Academy. All Rights Reserved."
  },
  ur: {
    // Top bar
    "top_announcement": "نئے داخلے جاری ہیں",
    "top_announcement_text": "آج ہی <strong>3 روزہ مفت ٹرائل</strong> حاصل کریں! مستند مرد و خواتین اساتذہ دستیاب ہیں۔",
    "top_call": "رابطہ: 0320 8040672",
    "top_whatsapp": "واٹس ایپ: +92 320 8040672",
    "top_currency": "کرنسی:",

    // Day / Night Switcher
    "theme_day": "دن",
    "theme_night": "رات",
    "theme_day_title": "ڈے لائٹ موڈ آن کریں",
    "theme_night_title": "نائٹ موڈ (ڈارک موڈ) آن کریں",
    "floating_night_text": "نائٹ موڈ 🌙",
    "floating_day_text": "ڈے موڈ ☀️",

    // Navigation
    "nav_courses": "کورسز",
    "nav_why_us": "ہماری خصوصیات",
    "nav_pricing": "فیس پلانز",
    "nav_calculator": "فیس کیلکولیٹر",
    "nav_faqs": "عام سوالات",
    "nav_contact": "رابطہ کریں",
    "nav_admin_portal": "ایڈمن پورٹل",
    "nav_book_trial": "مفت ٹرائل لیں",

    // Hero Section
    "hadith_quote": "”تم میں سے بہترین وہ شخص ہے جو قرآن سیکھے اور دوسروں کو سکھائے۔“ — صحیح بخاری",
    "hero_badge": "عالمی معیار کی مستند آن لائن قرآنی تعلیم",
    "hero_title_1": "گھر بیٹھے تجوید و ترتیل کے ساتھ",
    "hero_title_tajweed": "تجوید",
    "hero_title_2": "قرآن مجید کی باقاعدہ تعلیم حاصل کریں",
    "hero_desc": "بچوں اور بڑوں کے لیے باصلاحیت اور مستند مرد و خواتین اساتذہ۔ آپ کے وقت اور سہولت کے مطابق ون آن ون لائیو انٹرایکٹو کلاسز۔ امریکہ، برطانیہ، کینیڈا، آسٹریلیا، یورپ، خلیجی ممالک اور پاکستان کے لیے خصوصی نظام۔",
    "hero_btn_trial": "3 روزہ مفت ٹرائل بک کریں",
    "hero_btn_whatsapp": "واٹس ایپ پر رابطہ کریں",
    "hero_stat_students": "زیرِ تعلیم طلباء",
    "hero_stat_female": "خواتین معلمات دستیاب",
    "hero_stat_timings": "24/7 اوقات کی سہولت",
    "hero_stat_trial": "3 روزہ مفت ٹرائل",
    "hero_tab_trial": "3 روزہ مفت ٹرائل بک کریں",
    "hero_tab_player": "قرآن پلیئر",
    "hero_card_tag": "100٪ مفت ٹرائل",
    "hero_card_title": "3 روزہ مفت ٹرائل کلاس",
    "hero_card_sub": "بغیر کسی فیس کے مستند اساتذہ سے 3 لائیو کلاسز لے کر خود اطمینان کریں۔",

    // Quick Trial Form in Hero
    "form_lbl_name": "طالب علم کا مکمل نام *",
    "form_ph_name": "مثلاً: ابراہیم / عائشہ خان",
    "form_lbl_phone": "واٹس ایپ / فون نمبر *",
    "form_ph_phone": "+92 320 8040672",
    "form_lbl_country": "ملک و شہر *",
    "form_ph_country": "پاکستان، برطانیہ، امریکہ...",
    "form_lbl_course": "مطلوبہ کورس منتخب کریں *",
    "course_opt_1": "نورانی قاعدہ (بچوں اور نوآموزوں کے لیے)",
    "course_opt_2": "ناظرہ قرآن بمع تجوید",
    "course_opt_3": "حفظ القرآن الکریم",
    "course_opt_4": "ترجمہ و تفسیر قرآن",
    "course_opt_5": "اسلامک اسٹڈیز و مسنون دعائیں",
    "course_opt_6": "قرآنی عربی و گرامر",
    "form_lbl_tutor": "استاد کا انتخاب",
    "tutor_opt_female": "🧕 معلمہ (خاتون قاریہ)",
    "tutor_opt_male": "🧔 معلم (قاری / حافظ صاحب)",
    "tutor_opt_any": "کوئی بھی مستند استاد",
    "form_btn_submit_short": "ابھی 3 روزہ مفت ٹرائل شروع کریں",
    "form_guar_card": "کریڈٹ کارڈ کی ضرورت نہیں",
    "form_guar_cancel": "جب چاہیں کینسل کریں",
    "form_guar_free": "100٪ مفت",

    // Featured Programs Slider
    "slider_badge": "ہمارے نمایاں کورسز",
    "slider_heading": "ہمارے خصوصی تعلیمی پروگرامز",
    "slider_sub": "مستند اساتذہ کے ساتھ انفرادی قرآنی و اسلامی تعلیم • 3 روزہ مفت ٹرائل",
    "slider_btn_trial": "منتخب کورس کے لیے مفت ٹرائل حاصل کریں",
    "slider_btn_whatsapp": "واٹس ایپ کوآرڈینیٹر: 0320 8040672",

    // About Section
    "about_badge": "ہالہ نور اکیڈمی کا تعارف",
    "about_card_title": "صراطِ مستقیم کی راہنمائی",
    "about_card_sub": "قرآنی نور سے دلوں کو منور کرنا",
    "about_card_feat1_title": "مستند قراء و حفاظ کرام",
    "about_card_feat1_desc": "وفاق المدارس سے باضابطہ سند یافتہ اساتذہ",
    "about_card_feat2_title": "بچوں کے لیے شفیق و آسان طریقہ تدریس",
    "about_card_feat2_desc": "انتہائی محبت اور صبر و تحمل کے ساتھ رہنمائی",
    "about_welcome": "ہالہ نور آن لائن قرآن اکیڈمی میں خوش آمدید",
    "about_heading": "دنیا بھر کے مسلمان خاندانوں کو کلامِ الٰہی سے جوڑنے کا باوقار مشن",
    "about_p1": "ہالہ نور آن لائن قرآن اکیڈمی کا بنیادی مقصد پوری دنیا میں مقیم مسلمان بچوں، نوجوانوں اور بڑوں کو گھر بیٹھے اعلیٰ ترین معیار کی قرآنی تعلیم فراہم کرنا ہے۔ بالخصوص غیر مسلم ممالک میں مقیم خاندانوں کے لیے لائیو اور محفوظ ون آن ون کلاسز کے ذریعے یہ دوری ہم نے ختم کر دی ہے۔",
    "about_p2": "چاہے آپ کا بچہ نورانی قاعدے سے حروف کی شناخت سیکھ رہا ہو، تجوید کے ساتھ ناظرہ پڑھنا چاہتا ہو، حفظِ قرآن کا ارادہ ہو یا ترجمہ و تفسیر کا شوق — ہمارے مستند اساتذہ آپ کی سہولت کے مطابق رہنمائی کریں گے۔",
    "about_f1_title": "100٪ انفرادی کلاسز",
    "about_f1_desc": "بغیر کسی شور کے استاد کی مکمل توجہ صرف آپ کے بچے پر۔",
    "about_f2_title": "خواتین و بچیوں کے لیے معلمات",
    "about_f2_desc": "انتہائی پردے اور آرام دہ ماحول میں خواتین اساتذہ سے تعلیم۔",
    "about_f3_title": "ماہانہ تعلیمی رپورٹ",
    "about_f3_desc": "مخارج کی درستی، دہرائی اور تجوید کی کارکردگی پر نظر رکھیں۔",
    "about_f4_title": "کلاس کے اوقات کی تبدیلی کی سہولت",
    "about_f4_desc": "سفر یا مجبوری کی صورت میں متبادل کلاس کی فراہمی۔",
    "about_btn_courses": "تمام کورسز دیکھیں",
    "about_btn_story": "اکیڈمی کے بارے میں مزید جانیں",

    // Courses Section
    "courses_badge": "ہمارا جامع نصاب",
    "courses_heading": "ہر عمر کے لیے جامع قرآنی کورسز",
    "courses_sub": "حروف کی بنیادی شناخت سے لے کر اعلیٰ درجے کی تجوید، حفظ اور تفسیر تک مرحلہ وار نصاب۔ نصاب کی تفصیلات کے لیے بٹن دبائیں۔",
    "course_btn_syllabus": "نصاب دیکھیں",
    "course_btn_trial": "مفت ٹرائل لیں",
    "course_1_title": "نورانی قاعدہ بمع تجوید",
    "course_1_desc": "بنیادی بنیاد۔ عربی حروف کی شناخت، درست مخارج، حرکات، تنوین اور سکون کی مکمل مشق۔",
    "course_2_title": "ناظرہ قرآن مجید بمع تجوید",
    "course_2_desc": "سورۃ الفاتحہ سے الناس تک رواں تلاوت، مد، وقف کے احکام، غنہ اور قلقلہ کے مکمل قواعد۔",
    "course_3_title": "حفظ القرآن الکریم کا خصوصی کورس",
    "course_3_desc": "روزانہ کا سبق، سبقی اور منزل کی باقاعدہ دہرائی کے ساتھ تجربہ کار حفاظ کرام کی نگرانی میں حفظ۔",
    "course_4_title": "ترجمہ و تفسیر قرآن مجید",
    "course_4_desc": "کلام الٰہی کی براہ راست تفہیم۔ لفظ بہ لفظ اردو اور انگریزی ترجمہ اور احکام کی وضاحت۔",
    "course_5_title": "اسلامک اسٹڈیز، نماز اور مسنون دعائیں",
    "course_5_desc": "عملی نماز، 6 کلمات، روزمرہ کی مسنون دعائیں، سیرت النبی ﷺ اور بنیادی اسلامی آداب کی تربیت۔",
    "course_6_title": "قرآنی عربی اور گرامر",
    "course_6_desc": "عربی صرف و نحو کے ذریعے قرآنی الفاظ کے معانی اور بناوٹ کو گہرائی سے سمجھنے کا کورس۔",

    // Why Choose Us
    "why_badge": "ہماری خصوصیات",
    "why_heading": "والدین ہالہ نور اکیڈمی کا انتخاب کیوں کرتے ہیں؟",
    "why_sub": "ہم اسلامی روایات اور جدید تعلیمی طریقوں کا حسین امتزاج پیش کرتے ہیں تاکہ بچوں کے لیے قرآن سیکھنا آسان اور پرلطف بنے۔",
    "why_1_title": "1-on-1 خصوصی انفرادی توجہ",
    "why_1_desc": "ہر کلاس نجی اور انفرادی ہوتی ہے۔ استاد کی پوری توجہ آپ کے بچے پر ہوتی ہے جس سے رفتار اور فہم میں تیزی آتی ہے۔",
    "why_2_title": "سند یافتہ خواتین معلمات",
    "why_2_desc": "بہنوں اور چھوٹے بچوں کے لیے پردے دار، باحجاب اور سند یافتہ عالمات و قاریات دستیاب ہیں۔",
    "why_3_title": "24/7 اوقات کی مکمل سہولت",
    "why_3_desc": "نیویارک، لندن، ٹورنٹو، سڈنی، دبئی یا کراچی — آپ کے اسکول یا کام کے اوقات کے مطابق کلاس شیڈول کی جاتی ہے۔",
    "why_4_title": "ماہانہ ٹیسٹ اور پروگریس رپورٹ",
    "why_4_desc": "والدین کے ساتھ باقاعدہ ماہانہ رابطہ اور تجوید کی کارکردگی پر تفصیلی رپورٹس اور اسناد۔",
    "why_5_title": "جدید انٹرایکٹو تدریسی ذرائع",
    "why_5_desc": "زوم یا گوگل میٹ کے ذریعے ایچ ڈی ڈیجیٹل مصحف، آڈیو دہرائی اور اسکرین شیئرنگ کی جدید سہولیات۔",
    "why_6_title": "3 روزہ مفت ٹرائل • بغیر کسی خطرے کے",
    "why_6_desc": "بغیر کسی ایڈوانس فیس یا کریڈٹ کارڈ کے 3 دن مکمل کلاسز لیں اور 100٪ اطمینان کے بعد ہی فیصلہ کریں۔",

    // How It Works
    "how_badge": "آسان داخلہ",
    "how_heading": "داخلے کا 4 آسان مراحل میں طریقہ کار",
    "how_1_title": "ٹرائل فارم پُر کریں",
    "how_1_desc": "نیچے دیا گیا 1 منٹ کا مفت فارم طالب علم کی عمر اور مطلوبہ وقت کے ساتھ جمع کروائیں۔",
    "how_2_title": "وقت کی تصدیق",
    "how_2_desc": "ہمارا کوآرڈینیٹر واٹس ایپ پر رابطہ کر کے آپ کے مطلوبہ استاد اور وقت کی تصدیق کرے گا۔",
    "how_3_title": "3 مفت کلاسز لیں",
    "how_3_desc": "لائیو ون آن ون زوم کلاس میں شرکت کریں، استاد سے ملیں اور تدریس کا معیار خود دیکھیں۔",
    "how_4_title": "باقاعدہ داخلہ جاری رکھیں",
    "how_4_desc": "مکمل اطمینان کی صورت میں ماہانہ فیس کا انتخاب کریں اور بچے کا مبارک سفر شروع کریں۔",

    // Pricing Section
    "pricing_badge": "مناسب فیس پلانز",
    "pricing_heading": "انتہائی شفاف اور آسان فیس پلانز",
    "pricing_sub": "اپنی فیملی کے معمول کے مطابق مناسب پلان منتخب کریں۔ ایک سے زائد بچوں پر 15٪ رعایت خودکار طور پر شامل ہے!",
    "currency_picker_lbl": "کرنسی منتخب کریں:",
    "plan_1_title": "بیسک پلان",
    "plan_1_sub": "ہلکی رفتار یا دہرائی کے لیے بہترین",
    "plan_2_title": "اسٹینڈرڈ پلان",
    "plan_2_sub": "قاعدہ اور ناظرہ کے لیے سب سے زیادہ مقبول",
    "plan_3_title": "ریگولر پلان",
    "plan_3_sub": "روانی اور تجوید میں تیزی کے لیے",
    "plan_4_title": "انٹینسیو (حفظ) پلان",
    "plan_4_sub": "روزانہ حفظ اور باقاعدہ دہرائی کے لیے",
    "plan_btn_trial": "مفت ٹرائل شروع کریں",
    "plan_btn_rec": "3 روزہ مفت ٹرائل بک کریں",

    // Calculator Section
    "calc_badge": "فوری فیس کیلکولیٹر",
    "calc_heading": "ایک سے زائد بچوں یا مختلف دنوں کے لیے فیس معلوم کریں",
    "calc_sub": "دوسرے اور بعد کے بچوں پر خودکار 15٪ فیملی ڈسکاؤنٹ کے ساتھ فوری فیس کا تخمینہ حاصل کریں۔",
    "calc_lbl_students": "طلباء کی تعداد:",
    "calc_lbl_freq": "ہفتہ وار کلاسز:",
    "calc_lbl_est": "ماہانہ متوقع فیس:",
    "calc_discount_pill": "🎉 ایک سے زائد بچوں پر 15٪ فیملی ڈسکاؤنٹ شامل ہے!",
    "calc_btn_book": "اس شیڈول کے ساتھ مفت ٹرائل بک کریں",

    // Testimonials
    "reviews_badge": "والدین کے تاثرات",
    "reviews_heading": "دنیا بھر کے والدین کا ہالہ نور اکیڈمی کے بارے میں کیا کہنا ہے؟",
    "reviews_sub": "الحمدللہ، ہم نے سینکڑوں بچوں اور بڑوں کو قرآن مجید کے ساتھ مضبوط روحانی تعلق جوڑنے میں مدد کی ہے۔",

    // Free Trial Form Section
    "trial_badge": "100٪ مفت • کوئی پابندی نہیں",
    "trial_heading": "اپنی 3 روزہ مفت ٹرائل کلاس ابھی بک کریں",
    "trial_sub": "نیچے دی گئی تفصیلات درج کریں۔ ہماری ٹیم آپ کے مطلوبہ استاد اور کلاس کے وقت کی تصدیق کے لیے واٹس ایپ / ای میل پر رابطہ کرے گی۔",
    "form_lbl_name_full": "طالب علم کا مکمل نام *",
    "form_lbl_guardian": "والد یا سرپرست کا نام",
    "form_lbl_age": "طالب علم کی عمر / کلاس",
    "form_lbl_course_full": "مطلوبہ کورس منتخب کریں *",
    "form_lbl_tutor_pref": "استاد کا انتخاب *",
    "form_lbl_whatsapp": "واٹس ایپ نمبر (ملکی کوڈ کے ساتھ) *",
    "form_lbl_email": "ای میل ایڈریس",
    "form_lbl_country_city": "رہائشی ملک و شہر",
    "form_lbl_time_slot": "کلاس کا مناسب وقت",
    "form_lbl_notes": "کوئی خاص ہدایت یا قرآن کا سابقہ علم",
    "form_btn_submit_main": "درخواست بھیجیں اور 3 روزہ مفت ٹرائل شیڈول کریں",
    "form_privacy_note": "🔒 آپ کی رازداری محفوظ ہے۔ کوئی اسپام نہیں، کوئی کریڈٹ کارڈ درکار نہیں، فوری واٹس ایپ تصدیق۔",

    // FAQs
    "faqs_badge": "عام سوالات",
    "faqs_heading": "اکثر پوچھے جانے والے سوالات و جوابات",
    "faqs_sub": "ہمارے اساتذہ، طریقہ کار اور کلاسز کے متعلق وہ تمام باتیں جو آپ جاننا چاہتے ہیں۔",

    // Footer
    "footer_desc": "دنیا بھر کے مسلمانوں کے لیے گھر بیٹھے معیاری اور مستند قرآن کی تعلیم کا باوقار ادارہ۔ سند یافتہ قراء و معلمات کے ساتھ تجوید کی تکمیل۔",
    "footer_nav_title": "فوری لنکس",
    "footer_courses_title": "ہمارے کورسز",
    "footer_desk_title": "ایڈمشن ڈیسک",
    "footer_copyright": "© 2026 ہالہ نور آن لائن قرآن اکیڈمی۔ جملہ حقوق محفوظ ہیں۔"
  }
};

function initLanguageSwitcher() {
  const STORAGE_KEY = 'halenoor_lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

  function applyLanguage(lang) {
    currentLang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    const isUr = (lang === 'ur');
    const root = document.documentElement;

    root.setAttribute('lang', lang);
    root.setAttribute('dir', isUr ? 'rtl' : 'ltr');
    if (isUr) {
      root.classList.add('lang-ur');
    } else {
      root.classList.remove('lang-ur');
    }

    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        const val = dict[key];
        const icon = el.querySelector('i, svg');
        if (icon && !val.includes('<')) {
          const iconHtml = icon.outerHTML;
          el.innerHTML = iconHtml + ' ' + val;
        } else if (val.includes('<')) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.classList.add('active-lang');
      } else {
        btn.classList.remove('active-lang');
      }
    });

    // Update floating theme text when language changes
    const floatingText = document.querySelector('.floating-theme-text');
    if (floatingText) {
      const isDark = root.classList.contains('dark');
      if (isDark) {
        floatingText.textContent = isUr ? (dict.floating_day_text || 'ڈے موڈ ☀️') : 'Day Mode ☀️';
      } else {
        floatingText.textContent = isUr ? (dict.floating_night_text || 'نائٹ موڈ 🌙') : 'Night Mode 🌙';
      }
    }
  }

  // Expose globally
  window.setLanguage = applyLanguage;

  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn._hasLangListener) return;
    btn._hasLangListener = true;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang');
      applyLanguage(targetLang);
    });
  });

  applyLanguage(currentLang);
}

// Featured Courses Image Slider Controller
function setupFeaturedSlider() {
  const sliderWrap = document.getElementById('halenoor-slider-wrap');
  if (!sliderWrap) return;

  const slides = sliderWrap.querySelectorAll('.slider-slide');
  const dots = sliderWrap.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('slider-prev-btn');
  const nextBtn = document.getElementById('slider-next-btn');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoPlayTimer = null;
  const slideInterval = 4500; // 4.5 seconds per slide

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.remove('opacity-0', 'pointer-events-none');
        slide.classList.add('opacity-100');
      } else {
        slide.classList.remove('opacity-100');
        slide.classList.add('opacity-0', 'pointer-events-none');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.remove('w-2.5', 'bg-slate-300', 'bg-slate-700');
        dot.classList.add('w-8', 'bg-amber-400');
      } else {
        dot.classList.remove('w-8', 'bg-amber-400');
        dot.classList.add('w-2.5', 'bg-slate-300');
      }
    });
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, slideInterval);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
      startAutoPlay();
    });
  });

  // Pause on hover
  sliderWrap.addEventListener('mouseenter', stopAutoPlay);
  sliderWrap.addEventListener('mouseleave', startAutoPlay);

  // Touch Swipe Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  sliderWrap.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  sliderWrap.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    startAutoPlay();
  }, { passive: true });

  // Initialize
  showSlide(0);
  startAutoPlay();
}


// =============================================================
// 10. REAL-TIME FIREBASE SYNC WITH PUBLIC WEBSITE
// =============================================================
async function initFirebasePublicSync() {
  // Sync Sliders
  syncDynamicSliders();
  // Sync Courses
  syncDynamicCourses();
  // Sync Testimonials
  syncDynamicTestimonials();
  // Sync Teachers
  syncDynamicTeachers();
  // Sync Gallery
  syncDynamicGallery();

  // Listen for real-time updates if halenoorDb is available
  if (window.halenoorDb) {
    try {
      window.halenoorDb.collection("courses").onSnapshot(() => syncDynamicCourses(), () => {});
      window.halenoorDb.collection("sliders").onSnapshot(() => syncDynamicSliders(), () => {});
      window.halenoorDb.collection("testimonials").onSnapshot(() => syncDynamicTestimonials(), () => {});
    } catch (e) {
      console.warn("Real-time listener notice:", e);
    }
  }
}

// 1. Dynamic Sliders
async function syncDynamicSliders() {
  if (typeof window.fetchPublicSliders !== 'function') return;
  const sliders = await window.fetchPublicSliders();
  if (!sliders || !sliders.length) return;

  const track = document.getElementById('slider-track');
  const dotsContainer = document.getElementById('slider-dots');
  if (!track || !dotsContainer) return;

  track.innerHTML = sliders.map((s, idx) => `
    <div class="slider-slide absolute inset-0 ${idx === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-700 ease-in-out flex items-center justify-center bg-black" data-slide-index="${idx}">
      <img src="${s.imageUrl || 'assets/images/1.jpeg'}" alt="${s.title}" class="w-full h-full object-contain sm:object-cover">
    </div>
  `).join('');

  dotsContainer.innerHTML = sliders.map((_, idx) => `
    <button class="slider-dot ${idx === 0 ? 'w-8 bg-amber-400' : 'w-2.5 bg-slate-300 hover:bg-amber-300'} h-2.5 rounded-full transition-all duration-300" data-dot-index="${idx}" aria-label="Go to Slide ${idx + 1}"></button>
  `).join('');

  // Re-initialize slider carousel
  setupFeaturedSlider();
}

// 2. Dynamic Courses
async function syncDynamicCourses() {
  if (typeof window.fetchPublicCourses !== 'function') return;
  const courses = await window.fetchPublicCourses();
  if (!courses || !courses.length) return;

  // Update COURSE_SYLLABI dictionary so syllabus modal works for all dynamic courses
  courses.forEach(c => {
    COURSE_SYLLABI[c.id] = {
      title: c.title,
      arabicTitle: c.arabicTitle || '',
      duration: c.duration || '2 - 4 Months',
      target: c.targetAudience || 'Students of all ages',
      classesPerWeek: c.classesPerWeek || '3 - 5 classes/week (30 mins each)',
      levels: c.syllabusModules && c.syllabusModules.length ? c.syllabusModules : [
        { level: "Module 1", desc: c.shortDescription || "Foundational concepts and practice." }
      ],
      prerequisites: c.prerequisites || 'None! Zero prior Arabic knowledge needed.',
      includes: c.includes || ["1-on-1 Certified Tutor", "Interactive Digital Qaida PDF", "Daily Tajweed Correction", "Certificate of Completion"]
    };
  });

  const coursesSection = document.getElementById('courses');
  if (!coursesSection) return;
  const grid = coursesSection.querySelector('.grid');
  if (!grid) return;

  grid.innerHTML = courses.map(course => {
    return `
      <div class="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between islamic-card group">
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold group-hover:bg-emerald-600 group-hover:text-white transition">
              <i class="${course.iconClass || 'fa-solid fa-book-open'}"></i>
            </span>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              ${course.category || 'Specialized'}
            </span>
          </div>

          <div class="font-arabic text-right text-emerald-800 text-lg font-bold">${course.arabicTitle || ''}</div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">${course.title}</h3>
          <p class="text-sm text-slate-600 mb-5 leading-relaxed">
            ${course.shortDescription || 'Learn with certified scholars in private 1-on-1 live interactive sessions.'}
          </p>

          <ul class="space-y-2 mb-6 text-xs text-slate-600">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> ${course.duration || 'Flexible Learning Pace'}</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> ${course.classesPerWeek || '3 - 5 classes/week (30 mins)'}</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Certified Male &amp; Female Scholars</li>
          </ul>
        </div>

        <div class="pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
          <button onclick="openSyllabusModal('${course.id}')" class="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline transition">
            <i class="fa-regular fa-file-lines mr-1"></i> View Syllabus
          </button>
          <button onclick="prefillTrialCourse('${course.title.replace(/'/g, "\\'")}')" class="px-4 py-2 rounded-lg bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition">
            Enroll Free Trial
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Update Free Trial course dropdown options
  const select = document.getElementById('student-course');
  if (select) {
    const currentVal = select.value;
    select.innerHTML = courses.map(c => `<option value="${c.title}">${c.title}</option>`).join('');
    if (currentVal) select.value = currentVal;
  }
}

// 3. Dynamic Testimonials
async function syncDynamicTestimonials() {
  if (typeof window.fetchPublicTestimonials !== 'function') return;
  const testimonials = await window.fetchPublicTestimonials();
  if (!testimonials || !testimonials.length) return;

  const testSection = document.querySelector('section.py-20.bg-white:has(.fa-star)');
  if (!testSection) return;
  const grid = testSection.querySelector('.grid');
  if (!grid) return;

  grid.innerHTML = testimonials.map(t => {
    const stars = Array(Number(t.rating) || 5).fill('<i class="fa-solid fa-star"></i>').join('');
    const initials = (t.clientName || 'P').substring(0, 2).toUpperCase();

    return `
      <div class="bg-stone-50 rounded-2xl p-7 border border-stone-200 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-1 text-amber-400 text-sm mb-4">
            ${stars}
          </div>
          <p class="text-sm text-slate-700 leading-relaxed italic mb-6">
            "${t.feedback}"
          </p>
        </div>
        <div class="flex items-center gap-3 pt-4 border-t border-stone-200/80">
          <div class="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
            ${initials}
          </div>
          <div>
            <h5 class="text-sm font-bold text-slate-900">${t.clientName}</h5>
            <p class="text-xs text-slate-500">${t.location || 'Parent / Student'}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 4. Dynamic Teachers Showcase
async function syncDynamicTeachers() {
  if (typeof window.fetchPublicTeachers !== 'function') return;
  const teachers = await window.fetchPublicTeachers();
  if (!teachers || !teachers.length) return;

  const container = document.getElementById('teachers-showcase-container');
  if (!container) return;

  container.innerHTML = teachers.map(t => `
    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
      <img src="${t.imageUrl || 'assets/images/logo.png'}" alt="${t.name}" class="w-20 h-20 rounded-full object-cover border-2 border-amber-400 shadow-md mb-3">
      <h4 class="font-bold text-slate-900 text-base">${t.name}</h4>
      <div class="font-arabic text-emerald-800 text-sm font-bold">${t.arabicTitle || ''}</div>
      <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${t.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'} my-2">
        ${t.gender === 'Female' ? 'Female Quran Tutor' : 'Male Scholar & Qari'}
      </span>
      <p class="text-xs text-slate-600 line-clamp-2 mb-3">${t.qualification || ''}</p>
      <div class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
        ${t.experience || 'Experienced Tutor'}
      </div>
    </div>
  `).join('');
}

// 5. Dynamic Gallery Showcase
async function syncDynamicGallery() {
  if (typeof window.fetchPublicGallery !== 'function') return;
  const items = await window.fetchPublicGallery();
  if (!items || !items.length) return;

  const container = document.getElementById('gallery-showcase-container');
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
      <div class="aspect-video bg-black overflow-hidden relative">
        <img src="${item.imageUrl || 'assets/images/1.jpeg'}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
        <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/70 text-amber-300 backdrop-blur-sm">
          ${item.category || 'Academy'}
        </span>
      </div>
      <div class="p-3.5">
        <h5 class="font-bold text-slate-900 text-xs truncate">${item.title}</h5>
        <p class="text-[11px] text-slate-500 truncate mt-0.5">${item.description || ''}</p>
      </div>
    </div>
  `).join('');
}
