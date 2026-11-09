/**
 * Halenoor Quran Academy - Main Interactive Script
 * Provides: Currency Converter, WhatsApp Form Generator, Trial Modal, Audio Reciter, FAQ Accordion
 */

// Global Configuration
const ACADEMY_CONFIG = {
  academyName: "Halenoor Quran Academy",
  whatsappNumber: "923208040672", // Academy WhatsApp (without + or spaces for api.whatsapp.com)
  displayPhone: "+92 320 8040672",
  email: "admissions@halenoor.com",
  currencyRates: {
    USD: { symbol: "$", prefix: true, plans: { d2: 32, d3: 45, d5: 65, hifz: 85 } },
    GBP: { symbol: "£", prefix: true, plans: { d2: 26, d3: 38, d5: 55, hifz: 70 } },
    CAD: { symbol: "CA$", prefix: true, plans: { d2: 42, d3: 60, d5: 88, hifz: 115 } },
    AUD: { symbol: "AU$", prefix: true, plans: { d2: 48, d3: 68, d5: 98, hifz: 128 } },
    EUR: { symbol: "€", prefix: true, plans: { d2: 30, d3: 42, d5: 60, hifz: 80 } },
    PKR: { symbol: "Rs ", prefix: true, plans: { d2: 6500, d3: 9000, d5: 13500, hifz: 17500 } }
  }
};

// State
let currentCurrency = "USD";
let currentLanguage = localStorage.getItem("halenoor_lang") || "en";

// Quran Verses for Daily Reciter Widget
const QURAN_VERSES = [
  {
    surah: "Surah Al-Baqarah (2:255)",
    name: "Ayat-ul-Kursi (آية الكرسي)",
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
    english: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep.",
    urdu: "اللہ ہی وہ ہستی ہے جس کے سوا کوئی عبادت کے لائق نہیں، وہ زندہ ہے اور سب کو سنبھالنے والا ہے۔",
    audio: "https://everyayah.com/data/Alafasy_128kbps/002255.mp3"
  },
  {
    surah: "Surah Ar-Rahman (55:1-4)",
    name: "The Most Merciful (الرحمن)",
    arabic: "الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ ۝ خَلَقَ الْإِنسَانَ ۝ عَلَّمَهُ الْبَيَانَ",
    english: "The Most Merciful. Taught the Quran. Created man. Taught him eloquent speech.",
    urdu: "نہایت مہربان خدا نے قرآن سکھایا، اسی نے انسان کو پیدا کیا اور بولنا سکھایا۔",
    audio: "https://everyayah.com/data/Alafasy_128kbps/055001.mp3"
  },
  {
    surah: "Surah Al-Alaq (96:1)",
    name: "The Clot (العلق)",
    arabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    english: "Read in the name of your Lord who created.",
    urdu: "پڑھیے اپنے رب کے نام سے جس نے پیدا فرمایا۔",
    audio: "https://everyayah.com/data/Alafasy_128kbps/096001.mp3"
  },
  {
    surah: "Surah Ad-Duha (93:1-3)",
    name: "The Morning Brightness (الضحى)",
    arabic: "وَالضُّحَىٰ ۝ وَاللَّيْلِ إِذَا سَجَىٰ ۝ مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
    english: "By the morning brightness. And by the night when it covers. Your Lord has not taken leave of you, nor has He detested.",
    urdu: "قسم ہے چاشت کے وقت کی، اور رات کی جب چھا جائے، آپ کے رب نے نہ آپ کو چھوڑا ہے اور نہ بیزار ہوا۔",
    audio: "https://everyayah.com/data/Alafasy_128kbps/093001.mp3"
  }
];

let currentVerseIndex = 0;
let audioElement = null;
let isAudioPlaying = false;

// DOM Initialization
document.addEventListener("DOMContentLoaded", () => {
  setupLanguageSwitcher();
  setupMobileMenu();
  setupCurrencySwitcher();
  setupTrialModal();
  setupFaqAccordion();
  setupQuranAudioPlayer();
  setupTrialForms();
  setupSmoothScroll();
});

// Bilingual Language Switcher (English & Urdu)
function setupLanguageSwitcher() {
  const langButtons = document.querySelectorAll(".lang-btn, .lang-toggle-btn");

  // Apply saved or default language immediately
  applyLanguage(currentLanguage);

  langButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute("data-lang");
      if (targetLang) {
        currentLanguage = targetLang;
        try {
          localStorage.setItem("halenoor_lang", targetLang);
        } catch (err) {
          console.warn("Storage restricted", err);
        }
        applyLanguage(targetLang);
      }
    });
  });
}

function applyLanguage(lang) {
  currentLanguage = lang;
  const isUrdu = lang === "ur";

  // Set document attributes
  document.documentElement.lang = isUrdu ? "ur" : "en";
  document.documentElement.dir = isUrdu ? "rtl" : "ltr";

  // Toggle body class for typography
  if (isUrdu) {
    document.body.classList.add("lang-ur");
  } else {
    document.body.classList.remove("lang-ur");
  }

  // Update active state on all toggle buttons
  document.querySelectorAll(".lang-btn, .lang-toggle-btn").forEach(btn => {
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Apply dictionary translations
  if (typeof ACADEMY_TRANSLATIONS !== "undefined" && ACADEMY_TRANSLATIONS[lang]) {
    const dict = ACADEMY_TRANSLATIONS[lang];

    // Inner HTML translation
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // Placeholders
    document.querySelectorAll("[data-i18n-ph]").forEach(el => {
      const key = el.getAttribute("data-i18n-ph");
      if (dict[key] !== undefined) {
        el.placeholder = dict[key];
      }
    });

    // Option tags
    document.querySelectorAll("option[data-i18n]").forEach(opt => {
      const key = opt.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        opt.textContent = dict[key];
      }
    });
  }
}

window.applyLanguage = applyLanguage;

// Mobile Navigation Toggle
function setupMobileMenu() {
  const toggleBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNavDrawer");
  const closeBtn = document.getElementById("mobileMenuClose");

  if (!toggleBtn || !mobileNav) return;

  const toggle = () => {
    mobileNav.classList.toggle("hidden");
    document.body.classList.toggle("overflow-hidden");
  };

  toggleBtn.addEventListener("click", toggle);
  if (closeBtn) closeBtn.addEventListener("click", toggle);

  // Close when clicking nav links
  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    });
  });
}

// Currency Switcher Logic
function setupCurrencySwitcher() {
  const currencyBtns = document.querySelectorAll(".currency-btn");
  if (!currencyBtns.length) return;

  const updatePricing = (curr) => {
    currentCurrency = curr;
    const rateData = ACADEMY_CONFIG.currencyRates[curr];
    if (!rateData) return;

    // Update active button visual
    currencyBtns.forEach(btn => {
      if (btn.dataset.currency === curr) {
        btn.classList.add("bg-amber-500", "text-white", "shadow-md");
        btn.classList.remove("bg-slate-100", "text-slate-700", "hover:bg-slate-200");
      } else {
        btn.classList.remove("bg-amber-500", "text-white", "shadow-md");
        btn.classList.add("bg-slate-100", "text-slate-700", "hover:bg-slate-200");
      }
    });

    // Update prices on the page
    document.querySelectorAll("[data-plan-price]").forEach(el => {
      const planKey = el.dataset.planPrice;
      const price = rateData.plans[planKey];
      if (price !== undefined) {
        el.textContent = `${rateData.symbol}${price.toLocaleString()}`;
      }
    });

    // Update currency labels
    document.querySelectorAll(".currency-label").forEach(el => {
      el.textContent = curr;
    });
  };

  currencyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      updatePricing(btn.dataset.currency);
    });
  });
}

// Free Trial Modal
function setupTrialModal() {
  const modal = document.getElementById("trialModal");
  if (!modal) return;

  const openButtons = document.querySelectorAll(".open-trial-modal");
  const closeButtons = modal.querySelectorAll(".close-trial-modal");
  const courseInput = modal.querySelector("#modalCourseSelect");

  const openModal = (courseName = "") => {
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    if (courseInput && courseName) {
      courseInput.value = courseName;
    }
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  openButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const course = btn.getAttribute("data-course") || "";
      openModal(course);
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener("click", closeModal);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  window.openTrialModalWithCourse = openModal;
}

// Quran Audio Player Widget
function setupQuranAudioPlayer() {
  const playBtn = document.getElementById("playVerseBtn");
  const nextBtn = document.getElementById("nextVerseBtn");
  const titleEl = document.getElementById("verseTitle");
  const surahEl = document.getElementById("verseSurah");
  const arabicEl = document.getElementById("verseArabic");
  const engEl = document.getElementById("verseEng");
  const urduEl = document.getElementById("verseUrdu");
  const playIcon = document.getElementById("playVerseIcon");

  if (!playBtn || !arabicEl) return;

  audioElement = new Audio(QURAN_VERSES[currentVerseIndex].audio);

  const renderVerse = () => {
    const item = QURAN_VERSES[currentVerseIndex];
    if (titleEl) titleEl.textContent = item.name;
    if (surahEl) surahEl.textContent = item.surah;
    if (arabicEl) arabicEl.textContent = item.arabic;
    if (engEl) engEl.textContent = `"${item.english}"`;
    if (urduEl) urduEl.textContent = item.urdu;

    if (audioElement) {
      audioElement.pause();
      audioElement = new Audio(item.audio);
      audioElement.addEventListener("ended", () => {
        isAudioPlaying = false;
        if (playIcon) playIcon.className = "fa-solid fa-play";
      });
      if (isAudioPlaying) {
        audioElement.play().catch(e => console.log("Audio autoplay restricted:", e));
      }
    }
  };

  playBtn.addEventListener("click", () => {
    if (!audioElement) return;

    if (isAudioPlaying) {
      audioElement.pause();
      isAudioPlaying = false;
      if (playIcon) playIcon.className = "fa-solid fa-play";
    } else {
      audioElement.play().then(() => {
        isAudioPlaying = true;
        if (playIcon) playIcon.className = "fa-solid fa-pause";
      }).catch(err => {
        console.warn("Playback error:", err);
      });
    }
  });

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentVerseIndex = (currentVerseIndex + 1) % QURAN_VERSES.length;
      renderVerse();
    });
  }

  renderVerse();
}

// Accordion (FAQ)
function setupFaqAccordion() {
  const items = document.querySelectorAll(".accordion-item");
  if (!items.length) return;

  items.forEach(item => {
    const header = item.querySelector(".accordion-header");
    if (!header) return;

    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all
      items.forEach(i => {
        i.classList.remove("active");
        const c = i.querySelector(".accordion-content");
        if (c) c.style.maxHeight = null;
      });

      // Toggle current
      if (!isActive) {
        item.classList.add("active");
        const content = item.querySelector(".accordion-content");
        if (content) {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      }
    });
  });
}

// Handle Form Submissions & WhatsApp Redirection
function setupTrialForms() {
  const forms = document.querySelectorAll(".trial-form-submit");

  forms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const studentName = formData.get("studentName") || "Student";
      const guardianName = formData.get("guardianName") || "";
      const phone = formData.get("phone") || "";
      const email = formData.get("email") || "";
      const country = formData.get("country") || "International";
      const course = formData.get("course") || "Quran Reading with Tajweed";
      const tutorType = formData.get("tutorType") || "Any Qualified Tutor";
      const timing = formData.get("timing") || "Flexible";
      const notes = formData.get("notes") || "None";

      // Save locally
      try {
        const lead = {
          date: new Date().toISOString(),
          studentName,
          guardianName,
          phone,
          email,
          country,
          course,
          tutorType,
          timing,
          notes
        };
        const prevLeads = JSON.parse(localStorage.getItem("halenoor_leads") || "[]");
        prevLeads.unshift(lead);
        localStorage.setItem("halenoor_leads", JSON.stringify(prevLeads.slice(0, 50)));
      } catch (err) {
        console.error(err);
      }

      // Celebrate with confetti if library loaded
      if (typeof confetti === "function") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Format WhatsApp Message
      const waText = 
`*Assalam-o-Alaikum! Free Trial Registration*
*Academy:* ${ACADEMY_CONFIG.academyName}
----------------------------------------
*Student Name:* ${studentName}
${guardianName ? `*Parent/Guardian:* ${guardianName}\n` : ""}` +
`*Course:* ${course}
*Tutor Preference:* ${tutorType}
*Preferred Time:* ${timing}
*Country:* ${country}
*Phone/WhatsApp:* ${phone}
${email ? `*Email:* ${email}\n` : ""}` +
`*Additional Note:* ${notes}
----------------------------------------
_Please schedule our 3-Day Free Trial class. JazakAllah Khair!_`;

      const encodedMsg = encodeURIComponent(waText);
      const waUrl = `https://api.whatsapp.com/send?phone=${ACADEMY_CONFIG.whatsappNumber}&text=${encodedMsg}`;

      // Show Success Dialog / Redirect
      showConfirmationModal(studentName, course, waUrl);
    });
  });
}

function showConfirmationModal(name, course, waUrl) {
  // If modal exists, update or create floating toast
  const existingSuccess = document.getElementById("successModal");
  if (existingSuccess) {
    existingSuccess.remove();
  }

  const successHtml = `
    <div id="successModal" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md animate-fade-in">
      <div class="bg-white rounded-3xl max-w-lg w-full p-8 text-center shadow-2xl border border-amber-300 relative">
        <div class="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl shadow-inner">
          <i class="fa-solid fa-check"></i>
        </div>
        <span class="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
          Registration Received!
        </span>
        <h3 class="text-2xl font-black text-slate-800 mb-2">JazakAllah Khair, ${name}!</h3>
        <p class="text-slate-600 text-sm mb-6 leading-relaxed">
          Your request for <strong class="text-emerald-800 font-semibold">${course}</strong> has been registered. Our Academic Coordinator will contact you within 2 hours to confirm class timings.
        </p>

        <div class="bg-emerald-50 rounded-2xl p-4 mb-6 border border-emerald-100 text-left">
          <p class="text-xs font-bold text-emerald-900 uppercase tracking-wide mb-1 flex items-center gap-2">
            <i class="fa-brands fa-whatsapp text-emerald-600 text-base"></i> Instant Class Confirmation:
          </p>
          <p class="text-xs text-slate-600">
            For fastest response, connect directly with our supervisor on WhatsApp with your pre-filled trial details.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <a href="${waUrl}" target="_blank" class="flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition">
            <i class="fa-brands fa-whatsapp text-lg"></i>
            Open in WhatsApp
          </a>
          <button onclick="document.getElementById('successModal').remove()" class="py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition">
            Close
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", successHtml);
}

// Smooth scrolling for anchor links
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
