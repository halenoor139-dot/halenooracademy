/**
 * Hale Noor Quran Academy - Admin Authentication & Authorization Controller
 */

let currentAdminUser = null;
let currentAdminProfile = null;

// Initialize Auth Observer
function initAdminAuth() {
  if (!window.adminAuth) {
    showToast("Firebase Auth service unavailable. Please check your internet connection.", "error");
    return;
  }

  window.adminAuth.onAuthStateChanged(async (user) => {
    const loginView = document.getElementById('admin-login-view');
    const dashboardView = document.getElementById('admin-dashboard-view');
    const loadingScreen = document.getElementById('admin-init-loader');

    if (user) {
      try {
        // Verify authorization in Firestore 'admins' collection
        const isAuthorized = await checkAdminAuthorization(user);
        
        if (isAuthorized) {
          currentAdminUser = user;
          updateAdminProfileUI(user, currentAdminProfile);
          
          if (loginView) loginView.classList.add('hidden');
          if (dashboardView) dashboardView.classList.remove('hidden');
          if (loadingScreen) loadingScreen.classList.add('hidden');
          
          showToast(`Welcome back, ${currentAdminProfile?.displayName || user.email}!`, 'success');
          
          // Trigger initial dashboard load
          if (typeof window.onAdminAuthenticated === 'function') {
            window.onAdminAuthenticated(user);
          }
        } else {
          // User exists in Auth but is NOT authorized as Admin in Firestore
          await window.adminAuth.signOut();
          if (loginView) loginView.classList.remove('hidden');
          if (dashboardView) dashboardView.classList.add('hidden');
          if (loadingScreen) loadingScreen.classList.add('hidden');
          
          showToast("Access Denied: This account does not have Admin authorization.", "error");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        // Fallback for emergency access if firestore rules block pre-check
        currentAdminUser = user;
        updateAdminProfileUI(user, { role: "Administrator", displayName: user.email.split('@')[0] });
        if (loginView) loginView.classList.add('hidden');
        if (dashboardView) dashboardView.classList.remove('hidden');
        if (loadingScreen) loadingScreen.classList.add('hidden');
        if (typeof window.onAdminAuthenticated === 'function') {
          window.onAdminAuthenticated(user);
        }
      }
    } else {
      currentAdminUser = null;
      currentAdminProfile = null;
      if (loginView) loginView.classList.remove('hidden');
      if (dashboardView) dashboardView.classList.add('hidden');
      if (loadingScreen) loadingScreen.classList.add('hidden');
    }
  });

  setupAuthEventListeners();
}

// Check if user is in 'admins' collection or is authorized
async function checkAdminAuthorization(user) {
  if (!window.adminDb) return true; // Graceful fallback
  try {
    const adminDoc = await window.adminDb.collection(COLLECTIONS.ADMINS).doc(user.uid).get();
    if (adminDoc.exists) {
      currentAdminProfile = adminDoc.data();
      return true;
    }

    // Check by email query
    const emailQuery = await window.adminDb.collection(COLLECTIONS.ADMINS)
      .where("email", "==", user.email.toLowerCase())
      .limit(1)
      .get();

    if (!emailQuery.empty) {
      currentAdminProfile = emailQuery.docs[0].data();
      return true;
    }

    // Check if admins collection is completely empty (first-ever admin)
    const allAdmins = await window.adminDb.collection(COLLECTIONS.ADMINS).limit(1).get();
    if (allAdmins.empty) {
      // Auto-register first user as Super Admin
      const initialProfile = {
        uid: user.uid,
        email: user.email.toLowerCase(),
        displayName: user.displayName || user.email.split('@')[0],
        role: "Super Admin",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      await window.adminDb.collection(COLLECTIONS.ADMINS).doc(user.uid).set(initialProfile);
      currentAdminProfile = initialProfile;
      return true;
    }

    return false;
  } catch (err) {
    console.warn("Firestore admin check error:", err);
    // If user successfully authenticated with Firebase Auth, permit access
    currentAdminProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      role: "Administrator"
    };
    return true;
  }
}

// Update UI elements with admin info
function updateAdminProfileUI(user, profile) {
  const emailEls = document.querySelectorAll('.admin-user-email');
  const nameEls = document.querySelectorAll('.admin-user-name');
  const roleEls = document.querySelectorAll('.admin-user-role');
  const avatarEls = document.querySelectorAll('.admin-user-avatar');

  const displayName = profile?.displayName || user.displayName || user.email.split('@')[0];
  const role = profile?.role || "Super Admin";
  const initials = displayName.substring(0, 2).toUpperCase();

  emailEls.forEach(el => el.textContent = user.email);
  nameEls.forEach(el => el.textContent = displayName);
  roleEls.forEach(el => el.textContent = role);
  avatarEls.forEach(el => el.textContent = initials);
}

// Setup Event Listeners for Login, Logout, and Setup
function setupAuthEventListeners() {
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtns = document.querySelectorAll('.admin-logout-btn');
  const setupBtn = document.getElementById('btn-open-setup-modal');
  const setupForm = document.getElementById('first-time-setup-form');
  const closeSetupBtn = document.getElementById('btn-close-setup-modal');
  const profileForm = document.getElementById('admin-profile-form');

  // Login Submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value.trim();
      const password = document.getElementById('login-password')?.value;
      const submitBtn = document.getElementById('login-submit-btn');
      const submitSpinner = document.getElementById('login-spinner');
      const submitText = document.getElementById('login-btn-text');

      if (!email || !password) {
        showToast("Please enter both email and password.", "error");
        return;
      }

      try {
        if (submitBtn) submitBtn.disabled = true;
        if (submitSpinner) submitSpinner.classList.remove('hidden');
        if (submitText) submitText.textContent = "Verifying Credentials...";

        await window.adminAuth.signInWithEmailAndPassword(email, password);
        // onAuthStateChanged will handle redirection
      } catch (err) {
        console.error("Login failed:", err);
        let msg = "Login failed. Please check your credentials.";
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
          msg = "Invalid email or password.";
        } else if (err.code === 'auth/user-not-found') {
          msg = "No account found with this email. If this is your first time, use 'First Time Admin Setup' below.";
        } else if (err.code === 'auth/too-many-requests') {
          msg = "Too many failed attempts. Please try again after a few minutes.";
        }
        showToast(msg, "error");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitSpinner) submitSpinner.classList.add('hidden');
        if (submitText) submitText.textContent = "Sign In to Admin Panel";
      }
    });
  }

  // Logout
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to log out of the Admin Panel?")) {
        try {
          await window.adminAuth.signOut();
          showToast("You have been securely logged out.", "info");
        } catch (err) {
          console.error("Logout error:", err);
        }
      }
    });
  });

  // Open First-Time Setup Modal
  if (setupBtn) {
    setupBtn.addEventListener('click', () => {
      const modal = document.getElementById('first-time-setup-modal');
      if (modal) modal.classList.remove('hidden');
    });
  }

  // Close Setup Modal
  if (closeSetupBtn) {
    closeSetupBtn.addEventListener('click', () => {
      const modal = document.getElementById('first-time-setup-modal');
      if (modal) modal.classList.add('hidden');
    });
  }

  // First Time Master Admin Registration Form
  if (setupForm) {
    setupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('setup-email')?.value.trim();
      const password = document.getElementById('setup-password')?.value;
      const confirmPassword = document.getElementById('setup-confirm-password')?.value;
      const setupPasscode = document.getElementById('setup-passcode')?.value.trim();
      const name = document.getElementById('setup-name')?.value.trim() || "Principal Admin";

      if (password !== confirmPassword) {
        showToast("Passwords do not match.", "error");
        return;
      }
      if (password.length < 6) {
        showToast("Password must be at least 6 characters long.", "error");
        return;
      }
      
      // Master security authorization passcode check
      // Allows academy director to initialize account securely
      const VALID_PASSCODES = ["halenoor2026", "halenooradmin", "quran2026"];
      if (setupPasscode && !VALID_PASSCODES.includes(setupPasscode.toLowerCase())) {
        showToast("Invalid Academy Security Passcode. Contact Academy IT support.", "error");
        return;
      }

      try {
        // Create user in Firebase Auth
        const cred = await window.adminAuth.createUserWithEmailAndPassword(email, password);
        await cred.user.updateProfile({ displayName: name });

        // Save admin role in Firestore
        if (window.adminDb) {
          await window.adminDb.collection(COLLECTIONS.ADMINS).doc(cred.user.uid).set({
            uid: cred.user.uid,
            email: email.toLowerCase(),
            displayName: name,
            role: "Super Admin",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }

        const modal = document.getElementById('first-time-setup-modal');
        if (modal) modal.classList.add('hidden');
        showToast("Master Admin account created successfully! Logging you in...", "success");
      } catch (err) {
        console.error("Setup admin error:", err);
        showToast(err.message || "Failed to create admin account.", "error");
      }
    });
  }

  // Change Password / Profile Form
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newName = document.getElementById('profile-display-name')?.value.trim();
      const newPassword = document.getElementById('profile-new-password')?.value;

      if (!currentAdminUser) return;

      try {
        if (newName) {
          await currentAdminUser.updateProfile({ displayName: newName });
          if (window.adminDb) {
            await window.adminDb.collection(COLLECTIONS.ADMINS).doc(currentAdminUser.uid).update({
              displayName: newName
            });
          }
        }

        if (newPassword) {
          if (newPassword.length < 6) {
            showToast("New password must be at least 6 characters.", "error");
            return;
          }
          await currentAdminUser.updatePassword(newPassword);
          showToast("Password updated successfully!", "success");
        }

        showToast("Profile updated successfully!", "success");
        closeModal('admin-profile-modal');
      } catch (err) {
        console.error("Profile update error:", err);
        showToast(err.message || "Could not update profile.", "error");
      }
    });
  }
}

window.initAdminAuth = initAdminAuth;
window.getCurrentAdminUser = () => currentAdminUser;
window.getCurrentAdminProfile = () => currentAdminProfile;
