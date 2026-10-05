/**
 * Aura Commerce - Customer Authentication View
 * Handles Customer Login and Multi-step Customer Signup with Fake OTP in Browser Pop-up.
 * URL: #/login and #/signup
 */

const AuthView = {
  currentSignupStep: 1, // 1: Info entry, 2: OTP verification
  generatedOtp: '',
  signupPhone: '',

  renderLogin() {
    const appMain = document.getElementById('app-main');
    if (!appMain) return;

    appMain.innerHTML = `
      <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div class="max-w-md w-full glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden animate-slide-down">
          
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <h2 class="text-2xl font-bold text-white tracking-tight">Customer Sign In</h2>
            <p class="text-xs text-slate-400 mt-1">Welcome back. Enter your credentials to manage orders & spending limits.</p>
          </div>

          <!-- Form -->
          <form id="customer-login-form" onsubmit="AuthView.handleLoginSubmit(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input 
                type="email" 
                id="login-email" 
                required 
                placeholder="alex@example.com" 
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input 
                type="password" 
                id="login-password" 
                required 
                placeholder="••••••••" 
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button 
              type="submit" 
              class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
            >
              Sign In to Aura
            </button>
          </form>

          <!-- Quick Fill Demo Button for Evaluator -->
          <div class="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Demo Customer Credentials:</span>
            <button 
              type="button" 
              onclick="AuthView.fillDemoCustomer()" 
              class="text-indigo-400 hover:text-indigo-300 font-semibold underline"
            >
              Auto-fill Demo
            </button>
          </div>

          <!-- Switch to Signup -->
          <div class="mt-6 text-center text-xs text-slate-400">
            Don't have an account? 
            <a href="#/signup" class="text-indigo-400 hover:text-indigo-300 font-semibold underline">
              Create account with Fake OTP ➔
            </a>
          </div>

        </div>
      </div>
    `;
  },

  fillDemoCustomer() {
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    if (emailInput && passInput) {
      emailInput.value = 'alex@example.com';
      passInput.value = 'password123';
      window.auraUI.showToast("Demo customer credentials loaded!", "info");
    }
  },

  handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const customer = window.auraStore.customerLogin(email, password);
      window.auraUI.showToast(`Welcome back, ${customer.name}!`, "success");
      window.auraRouter.navigate('/');
    } catch (err) {
      window.auraUI.showToast(err.message, "error");
    }
  },

  // --- SIGNUP WITH FAKE OTP ---

  renderSignup() {
    const appMain = document.getElementById('app-main');
    if (!appMain) return;

    this.currentSignupStep = 1;

    appMain.innerHTML = `
      <div class="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div class="max-w-lg w-full glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden animate-slide-down">
          
          <!-- Stepper Progress Header -->
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div>
              <span class="text-xs font-mono font-semibold text-indigo-400 tracking-wider uppercase">Customer Registration</span>
              <h2 class="text-2xl font-bold text-white tracking-tight">Create Account</h2>
            </div>
            <div class="flex items-center gap-2">
              <div id="step-badge-1" class="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-indigo-600/40">
                1
              </div>
              <div class="w-6 h-0.5 bg-slate-700"></div>
              <div id="step-badge-2" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center border border-slate-700">
                2
              </div>
            </div>
          </div>

          <!-- Dynamic Container for Step 1 or Step 2 -->
          <div id="signup-step-container">
            ${this.getStep1Html()}
          </div>

          <!-- Footer Link -->
          <div class="mt-6 text-center text-xs text-slate-400">
            Already have an account? 
            <a href="#/login" class="text-indigo-400 hover:text-indigo-300 font-semibold underline">
              Sign In instead
            </a>
          </div>

        </div>
      </div>
    `;
  },

  getStep1Html() {
    return `
      <form id="signup-step1-form" onsubmit="AuthView.handleStep1Submit(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
          <input 
            type="text" 
            id="signup-name" 
            required 
            placeholder="Sarah Jenkins" 
            class="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
          <input 
            type="email" 
            id="signup-email" 
            required 
            placeholder="sarah@example.com" 
            class="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Phone Number (For Fake OTP Pop-up)</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-medium text-slate-400">US +1</span>
            <input 
              type="tel" 
              id="signup-phone" 
              required 
              placeholder="(555) 019-8234" 
              class="w-full pl-16 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <p class="text-[11px] text-indigo-300/80 mt-1">
            ✨ You will receive a simulated OTP code via a stylish browser pop-up.
          </p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Create Password</label>
          <input 
            type="password" 
            id="signup-password" 
            required 
            minlength="6" 
            placeholder="Minimum 6 characters" 
            class="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button 
          type="submit" 
          class="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
        >
          <span>Send OTP & Continue</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </form>
    `;
  },

  handleStep1Submit(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;

    try {
      const result = window.auraStore.startCustomerSignup(name, email, phone, password);
      this.generatedOtp = result.otp;
      this.signupPhone = phone;

      // 1. Trigger the Fake OTP Browser Pop-up Simulator
      window.auraUI.showFakeOtpPopup(result.otp, phone, (code) => {
        this.fillOtpInputs(code);
      });

      // 2. Also trigger a native browser pop-up as requested
      setTimeout(() => {
        alert(`[AURA SECURITY VERIFICATION]\n\nYour 6-Digit Fake OTP Code is: ${result.otp}\n(Enter this code to complete signup)`);
      }, 500);

      // Transition to Step 2
      this.renderStep2();

    } catch (err) {
      window.auraUI.showToast(err.message, "error");
    }
  },

  renderStep2() {
    this.currentSignupStep = 2;

    // Update stepper badges
    const b1 = document.getElementById('step-badge-1');
    const b2 = document.getElementById('step-badge-2');
    if (b1 && b2) {
      b1.className = 'w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center';
      b1.innerHTML = '✓';
      b2.className = 'w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-indigo-600/40';
    }

    const container = document.getElementById('signup-step-container');
    if (!container) return;

    container.innerHTML = `
      <div class="text-center animate-fade-in">
        <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
          <svg class="w-7 h-7 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
        </div>
        <h3 class="text-lg font-bold text-white">Enter 6-Digit OTP Code</h3>
        <p class="text-xs text-slate-400 mt-1">
          A pop-up alert was sent to <strong class="text-indigo-300 font-mono">${this.signupPhone}</strong>. Check your browser pop-up banner above.
        </p>

        <!-- 6 OTP Input Boxes -->
        <div class="flex items-center justify-center gap-2 sm:gap-3 my-6">
          <input type="text" maxlength="1" id="otp-1" class="otp-input" autofocus oninput="AuthView.onOtpInput(this, 1)" onkeydown="AuthView.onOtpKeyDown(event, 1)" />
          <input type="text" maxlength="1" id="otp-2" class="otp-input" oninput="AuthView.onOtpInput(this, 2)" onkeydown="AuthView.onOtpKeyDown(event, 2)" />
          <input type="text" maxlength="1" id="otp-3" class="otp-input" oninput="AuthView.onOtpInput(this, 3)" onkeydown="AuthView.onOtpKeyDown(event, 3)" />
          <input type="text" maxlength="1" id="otp-4" class="otp-input" oninput="AuthView.onOtpInput(this, 4)" onkeydown="AuthView.onOtpKeyDown(event, 4)" />
          <input type="text" maxlength="1" id="otp-5" class="otp-input" oninput="AuthView.onOtpInput(this, 5)" onkeydown="AuthView.onOtpKeyDown(event, 5)" />
          <input type="text" maxlength="1" id="otp-6" class="otp-input" oninput="AuthView.onOtpInput(this, 6)" onkeydown="AuthView.onOtpKeyDown(event, 6)" />
        </div>

        <!-- Quick Demo Helper Action -->
        <div class="mb-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <button 
            type="button" 
            onclick="AuthView.autoPasteCurrentOtp()" 
            class="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-semibold"
          >
            ⚡ One-Click Auto-Fill Code (${this.generatedOtp})
          </button>
          <button 
            type="button" 
            onclick="AuthView.resendOtp()" 
            class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            Resend Pop-up OTP
          </button>
        </div>

        <button 
          id="btn-verify-otp" 
          onclick="AuthView.handleVerifyOtp()" 
          class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>Verify & Complete Registration</span>
        </button>

        <button 
          onclick="AuthView.renderSignup()" 
          class="mt-4 text-xs text-slate-400 hover:text-white"
        >
          ← Change phone or email
        </button>
      </div>
    `;

    setTimeout(() => {
      const first = document.getElementById('otp-1');
      if (first) first.focus();
    }, 100);
  },

  onOtpInput(element, index) {
    if (element.value.length === 1 && index < 6) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  },

  onOtpKeyDown(e, index) {
    if (e.key === 'Backspace' && !e.target.value && index > 1) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) {
        prev.focus();
        prev.value = '';
      }
    }
  },

  fillOtpInputs(code) {
    if (!code || code.length !== 6) return;
    for (let i = 1; i <= 6; i++) {
      const box = document.getElementById(`otp-${i}`);
      if (box) box.value = code.charAt(i - 1);
    }
    const last = document.getElementById('otp-6');
    if (last) last.focus();
  },

  autoPasteCurrentOtp() {
    this.fillOtpInputs(this.generatedOtp);
    window.auraUI.showToast("OTP inserted!", "success");
  },

  resendOtp() {
    const pending = window.auraStore.getPendingSignup();
    if (!pending) return;

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    pending.otp = newOtp;
    pending.expiresAt = Date.now() + 5 * 60 * 1000;
    sessionStorage.setItem('aura_pending_signup', JSON.stringify(pending));

    this.generatedOtp = newOtp;
    window.auraUI.showFakeOtpPopup(newOtp, pending.phone, (code) => {
      this.fillOtpInputs(code);
    });
    alert(`[AURA OTP POP-UP]\nNew OTP Code: ${newOtp}`);
    window.auraUI.showToast("New OTP pop-up triggered!", "info");
  },

  handleVerifyOtp() {
    let enteredCode = '';
    for (let i = 1; i <= 6; i++) {
      const box = document.getElementById(`otp-${i}`);
      enteredCode += box ? box.value : '';
    }

    if (enteredCode.length !== 6) {
      window.auraUI.showToast("Please enter all 6 digits of the OTP code.", "warning");
      return;
    }

    try {
      const newCustomer = window.auraStore.verifyAndCompleteSignup(enteredCode);
      window.auraUI.showToast(`🎉 Registration complete! Welcome to Aura, ${newCustomer.name}!`, "success", 5000);
      
      // Navigate to Limit page to let customer adjust their initial spending limit!
      window.auraRouter.navigate('/limit');
    } catch (err) {
      window.auraUI.showToast(err.message, "error");
    }
  }
};

window.AuthView = AuthView;
