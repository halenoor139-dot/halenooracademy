/**
 * Hale Noor Online Quran Academy - Interactive Scripts
 * Provides currency switching, fee calculator, syllabus modals,
 * free trial form handling with WhatsApp integration, and audio recitation.
 */

// Global Academy Configuration
const ACADEMY_CONFIG = {
  name: "Hale Noor Online Quran Academy",
  arabicName: "هالة نور أكاديمية القرآن الكريم",
  whatsappNumber: "923123456789", // Academy official WhatsApp (replace with client's actual number)
  email: "info@halenoorquran.com",
  admissionsEmail: "admissions@halenoorquran.com",
  phoneDisplay: "+92 312 3456789"
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
document.addEventListener('DOMContentLoaded', () => {
  initNightVisionTheme();
  initCurrencySwitcher();
  initFeeCalculator();
  initFreeTrialForm();
  initAudioPlayer();
  initMobileMenu();
  initFAQAccordion();
  initSmoothScroll();
});

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

  trialForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get input values
    const name = document.getElementById('student-name')?.value.trim();
    const parentName = document.getElementById('parent-name')?.value.trim();
    const age = document.getElementById('student-age')?.value.trim();
    const course = document.getElementById('student-course')?.value || "Noorani Qaida";
    const tutorGender = document.querySelector('input[name="tutor-gender"]:checked')?.value || "Female Tutor Preferred";
    const country = document.getElementById('student-country')?.value.trim() || "USA / International";
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
    } catch (err) {}

    // Open Success Modal with Action Buttons
    showSuccessModal(name, course, tutorGender, waUrl);
  });
}

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

// 9. Night Vision / Dark Theme Controller
function initNightVisionTheme() {
  const root = document.documentElement;
  const STORAGE_KEY = 'halenoor_theme';

  function isDark() {
    return root.classList.contains('dark');
  }

  function updateToggleButtons(darkActive) {
    const toggles = document.querySelectorAll('.theme-toggle-btn, .floating-theme-toggle');
    toggles.forEach(btn => {
      btn.setAttribute('aria-pressed', darkActive ? 'true' : 'false');
      btn.setAttribute('title', darkActive ? 'Switch to Day Light Mode' : 'Switch to Night Vision (Dark Mode)');
      
      const iconSpan = btn.querySelector('.theme-icon-container');
      const textSpan = btn.querySelector('.theme-text');
      const mobileTextSpan = btn.querySelector('.mobile-theme-text');

      if (darkActive) {
        if (iconSpan) {
          iconSpan.innerHTML = '<i class="fa-solid fa-sun text-amber-400"></i>';
        }
        if (textSpan) {
          textSpan.textContent = 'Day Mode';
        }
        if (mobileTextSpan) {
          mobileTextSpan.textContent = 'Day Mode ☀️';
        }
      } else {
        if (iconSpan) {
          iconSpan.innerHTML = '<i class="fa-solid fa-moon text-amber-500"></i>';
        }
        if (textSpan) {
          textSpan.textContent = 'Night Vision';
        }
        if (mobileTextSpan) {
          mobileTextSpan.textContent = 'Night Vision 🌙';
        }
      }
    });
  }

  function toggleNightVision() {
    // Add smooth transition class
    root.classList.add('theme-transitioning');

    const willBeDark = !isDark();
    if (willBeDark) {
      root.classList.add('dark');
      try { localStorage.setItem(STORAGE_KEY, 'dark'); } catch (e) {}
    } else {
      root.classList.remove('dark');
      try { localStorage.setItem(STORAGE_KEY, 'light'); } catch (e) {}
    }

    updateToggleButtons(willBeDark);

    // Remove transition helper after animation finishes
    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 350);
  }

  // Bind all theme toggles
  const toggles = document.querySelectorAll('.theme-toggle-btn, .floating-theme-toggle');
  toggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleNightVision();
    });
  });

  // Sync initial UI state based on current class
  updateToggleButtons(isDark());
}
