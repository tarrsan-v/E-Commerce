/**
 * Aura Commerce - UI Components & Overlay Managers
 * Renders dynamic Navbars, Toast Alerts, Cart Drawer, and Fake OTP Browser Popups.
 */

class UIManager {
  constructor() {
    this.toastContainer = null;
    this.activeModal = null;
  }

  init() {
    // Inject Toast Container
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
      this.toastContainer = container;
    } else {
      this.toastContainer = document.getElementById('toast-container');
    }

    // Subscribe to store updates to keep limit indicator and cart counter synced
    window.auraStore.subscribe((event) => {
      this.updateNavbarBadges();
      if (event === 'cart') {
        this.renderCartDrawerContent();
      }
    });
  }

  // --- TOAST NOTIFICATIONS ---

  showToast(message, type = 'info', duration = 3500) {
    const toast = document.createElement('div');
    toast.className = `toast px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 animate-slide-down pointer-events-auto backdrop-blur-xl ${
      type === 'success'
        ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100 glow-emerald'
        : type === 'warning'
        ? 'bg-amber-950/90 border-amber-500/40 text-amber-100'
        : type === 'error'
        ? 'bg-rose-950/90 border-rose-500/50 text-rose-100 glow-rose'
        : 'bg-indigo-950/90 border-indigo-500/40 text-indigo-100 glow-indigo'
    }`;

    const iconSvg = {
      success: `<svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
      warning: `<svg class="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
      error: `<svg class="w-5 h-5 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
      info: `<svg class="w-5 h-5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    }[type];

    toast.innerHTML = `
      ${iconSvg}
      <div class="text-sm font-medium flex-1">${message}</div>
      <button class="text-white/60 hover:text-white p-1" onclick="this.parentElement.remove()">✕</button>
    `;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }

  // --- FAKE OTP BROWSER POP-UP SIMULATOR ---

  showFakeOtpPopup(otpCode, phoneOrEmail, onAutoFillCallback) {
    // 1. Play subtle audio tone using Web Audio API
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // Audio might be muted or blocked by browser policy
    }

    // 2. Remove any previous popup banner
    const existing = document.getElementById('fake-otp-banner');
    if (existing) existing.remove();

    // 3. Create High-Fidelity OS / Browser Push Notification Banner
    const banner = document.createElement('div');
    banner.id = 'fake-otp-banner';
    banner.className = 'fixed top-5 left-1/2 -translate-x-1/2 z-[10000] w-[92%] max-w-md push-banner rounded-2xl p-4 shadow-2xl border border-indigo-500/50 animate-slide-down text-white';
    banner.innerHTML = `
      <div class="flex items-start gap-3.5">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between text-xs text-indigo-300 font-semibold uppercase tracking-wider mb-1">
            <span>Aura Security Gateway</span>
            <span class="text-slate-400 lowercase">just now</span>
          </div>
          <p class="text-sm font-semibold text-slate-100">
            One-Time Password (OTP)
          </p>
          <p class="text-xs text-slate-300 mt-0.5">
            Your verification code for <span class="text-indigo-300 font-mono">${phoneOrEmail}</span> is:
          </p>
          <div class="my-2.5 inline-flex items-center gap-2 bg-slate-900/90 border border-indigo-500/40 px-3.5 py-1.5 rounded-lg">
            <span class="font-mono text-2xl font-bold tracking-widest text-indigo-300 select-all">${otpCode}</span>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <button id="btn-autofill-otp" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-md transition-all">
              ⚡ One-Tap Auto Fill
            </button>
            <button id="btn-browser-alert-otp" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-all">
              🔔 Open Native Alert
            </button>
            <button onclick="this.closest('#fake-otp-banner').remove()" class="ml-auto text-xs text-slate-400 hover:text-slate-200 px-2 py-1">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Auto-fill button event
    document.getElementById('btn-autofill-otp').addEventListener('click', () => {
      if (onAutoFillCallback) onAutoFillCallback(otpCode);
      this.showToast("OTP Auto-filled successfully!", "success");
      banner.remove();
    });

    // Native browser alert button (directly fulfills user prompt for browser pop ups)
    document.getElementById('btn-browser-alert-otp').addEventListener('click', () => {
      alert(`[AURA SECURITY POPUP]\n\nYour Fake Signup OTP is: ${otpCode}\nValid for 5 minutes.`);
    });

    // Auto dismiss after 20 seconds
    setTimeout(() => {
      if (banner.parentElement) {
        banner.style.opacity = '0';
        banner.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => banner.remove(), 400);
      }
    }, 20000);
  }

  // --- DYNAMIC NAVBAR RENDERING ---

  renderNavbar(currentPath) {
    const navContainer = document.getElementById('app-navbar');
    if (!navContainer) return;

    const isAdminRoute = currentPath.startsWith('/admin');

    if (isAdminRoute) {
      this.renderAdminNavbar(navContainer, currentPath);
    } else {
      this.renderCustomerNavbar(navContainer, currentPath);
    }

    this.updateNavbarBadges();
  }

  renderCustomerNavbar(container, currentPath) {
    const customer = window.auraStore.getCurrentCustomer();
    const cartCount = window.auraStore.getCart().reduce((sum, item) => sum + item.quantity, 0);

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo & Brand -->
          <div class="flex items-center gap-8">
            <a href="#/" class="flex items-center gap-3 group">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <span class="font-extrabold text-white text-xl tracking-tighter">A</span>
              </div>
              <div>
                <span class="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  AURA <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">Luxe</span>
                </span>
                <span class="block text-[11px] text-slate-400 font-medium -mt-0.5 tracking-wider">CURATED DESIGN</span>
              </div>
            </a>

            <!-- Navigation Links -->
            <nav class="hidden md:flex items-center gap-1 text-sm font-medium">
              <a href="#/" class="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all ${currentPath === '/' ? 'text-indigo-400 bg-indigo-500/10 font-semibold' : ''}">
                Catalog
              </a>
              <a href="#/limit" class="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 ${currentPath === '/limit' ? 'text-indigo-400 bg-indigo-500/10 font-semibold' : ''}">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Spend Limit
              </a>
              <a href="#/orders" class="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all ${currentPath === '/orders' ? 'text-indigo-400 bg-indigo-500/10 font-semibold' : ''}">
                Orders & Ledger
              </a>
            </nav>
          </div>

          <!-- Live Spending Limit Pill Indicator -->
          <div id="nav-limit-pill" class="hidden lg:flex items-center">
            <!-- Injected via updateNavbarBadges() -->
          </div>

          <!-- Right Action Center -->
          <div class="flex items-center gap-3">

            <!-- Cart Trigger Button -->
            <button id="nav-cart-btn" onclick="window.auraUI.toggleCartDrawer(true)" class="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 hover:text-white transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <span id="nav-cart-count" class="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-indigo-600 text-[11px] font-bold text-white flex items-center justify-center shadow-lg shadow-indigo-600/50">
                ${cartCount}
              </span>
            </button>

            <!-- Customer Auth / Profile -->
            ${customer ? `
              <div class="relative group">
                <button class="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl bg-slate-800/90 border border-slate-700 text-sm font-medium text-slate-200 hover:border-slate-600 transition-all">
                  <span class="max-w-[100px] truncate text-xs font-semibold text-slate-200">${customer.name.split(' ')[0]}</span>
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
                    ${customer.name.charAt(0)}
                  </div>
                </button>
                <div class="absolute right-0 mt-2 w-52 glass-modal rounded-xl shadow-2xl border border-slate-800 py-1.5 hidden group-hover:block animate-fade-in z-50">
                  <div class="px-4 py-2 border-b border-slate-800/80">
                    <p class="text-xs text-slate-400">Signed in as</p>
                    <p class="text-sm font-semibold text-white truncate">${customer.email}</p>
                  </div>
                  <a href="#/limit" class="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60">
                    <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Manage Spending Limit
                  </a>
                  <a href="#/orders" class="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60">
                    <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    Order History
                  </a>
                  <div class="border-t border-slate-800/80 my-1"></div>
                  <button onclick="window.auraStore.logoutCustomer(); window.auraUI.showToast('Logged out successfully', 'info'); window.auraRouter.navigate('/');" class="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Log Out
                  </button>
                </div>
              </div>
            ` : `
              <div class="flex items-center gap-2">
                <a href="#/login" class="text-xs sm:text-sm font-semibold px-3 py-2 text-slate-300 hover:text-white transition-colors">
                  Sign In
                </a>
                <a href="#/signup" class="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-md shadow-indigo-600/30 transition-all">
                  Sign Up
                </a>
              </div>
            `}
          </div>

        </div>
      </div>
    `;
  }

  renderAdminNavbar(container, currentPath) {
    const admin = window.auraStore.getCurrentAdmin();

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-950/70 border-b border-indigo-500/20">
        <div class="flex items-center justify-between h-20">
          
          <!-- Admin Brand Header -->
          <div class="flex items-center gap-6">
            <a href="#/admin/dashboard" class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xl font-bold tracking-tight text-white">AURA CORE</span>
                  <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 uppercase">
                    Admin Portal
                  </span>
                </div>
                <span class="text-xs text-slate-400 font-mono">URL: #/admin/*</span>
              </div>
            </a>

            <!-- Admin Navigation -->
            <nav class="hidden md:flex items-center gap-2 ml-4 text-sm font-medium">
              <a href="#/admin/dashboard" class="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all ${currentPath === '/admin/dashboard' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : ''}">
                Dashboard & KPIs
              </a>
              <a href="#/admin/products" class="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all ${currentPath === '/admin/products' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : ''}">
                Inventory & Products
              </a>
            </nav>
          </div>

          <!-- Admin Right Actions -->
          <div class="flex items-center gap-3">
            <a href="#/" class="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              <span>Back to Storefront (Customer URL)</span>
            </a>

            ${admin ? `
              <div class="flex items-center gap-3">
                <span class="hidden sm:inline text-xs font-medium text-slate-300">${admin.name}</span>
                <button onclick="window.auraStore.logoutAdmin(); window.auraUI.showToast('Admin logged out', 'info'); window.auraRouter.navigate('/admin/login');" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-all">
                  Sign Out Admin
                </button>
              </div>
            ` : `
              <a href="#/admin/login" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md">
                Admin Login
              </a>
            `}
          </div>

        </div>
      </div>
    `;
  }

  // --- UPDATE NAVBAR LIVE LIMIT BADGE ---

  updateNavbarBadges() {
    // 1. Cart Count
    const cartCountEl = document.getElementById('nav-cart-count');
    if (cartCountEl) {
      const count = window.auraStore.getCart().reduce((sum, item) => sum + item.quantity, 0);
      cartCountEl.textContent = count;
      cartCountEl.style.display = count > 0 ? 'flex' : 'none';
    }

    // 2. Limit Pill
    const limitPill = document.getElementById('nav-limit-pill');
    if (!limitPill) return;

    const cartSubtotal = window.auraStore.getCartSubtotal();
    const limitCheck = window.auraStore.checkSpendingLimit(cartSubtotal);

    if (!limitCheck.enabled) {
      limitPill.innerHTML = `
        <a href="#/limit" class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 hover:border-slate-600 transition-all">
          <span class="w-2 h-2 rounded-full bg-slate-500"></span>
          <span>Set Spend Limit</span>
        </a>
      `;
      return;
    }

    const { limitAmount, newTotal, percent, exceeded, overBy, daysLeft } = limitCheck;
    const isWarning = percent >= 80 && !exceeded;

    const badgeColor = exceeded 
      ? 'border-rose-500/50 bg-rose-950/40 text-rose-300 glow-rose' 
      : isWarning 
      ? 'border-amber-500/50 bg-amber-950/40 text-amber-300' 
      : 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300';

    const barColor = exceeded 
      ? 'bg-rose-500' 
      : isWarning 
      ? 'bg-amber-400' 
      : 'bg-emerald-400';

    limitPill.innerHTML = `
      <a href="#/limit" title="Active Spending Limit: $${newTotal.toFixed(0)} of $${limitAmount.toFixed(0)} used (${daysLeft}d remaining). Click to modify." class="flex items-center gap-2.5 px-3 py-1.5 rounded-full border ${badgeColor} transition-all cursor-pointer group">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full ${barColor} ${exceeded ? 'animate-ping' : ''}"></span>
          <span class="text-xs font-semibold font-mono">
            ${exceeded ? `Limit Exceeded (+$${overBy.toFixed(0)})` : `$${newTotal.toFixed(0)} / $${limitAmount.toFixed(0)} Limit`}
          </span>
        </div>
        <div class="w-14 h-2 rounded-full bg-slate-800 overflow-hidden border border-white/10 hidden xl:block">
          <div class="h-full ${barColor} transition-all duration-500" style="width: ${Math.min(100, percent)}%"></div>
        </div>
        <span class="text-[10px] text-slate-400 hidden xl:inline">(${daysLeft}d left)</span>
      </a>
    `;
  }

  // --- CART DRAWER TOGGLE & RENDERING ---

  toggleCartDrawer(open) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (!drawer || !overlay) return;

    if (open) {
      this.renderCartDrawerContent();
      overlay.classList.remove('hidden');
      setTimeout(() => {
        overlay.classList.remove('opacity-0');
        drawer.classList.remove('translate-x-full');
      }, 10);
    } else {
      drawer.classList.add('translate-x-full');
      overlay.classList.add('opacity-0');
      setTimeout(() => {
        overlay.classList.add('hidden');
      }, 300);
    }
  }

  renderCartDrawerContent() {
    const container = document.getElementById('cart-drawer-items');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    const limitWarningEl = document.getElementById('cart-drawer-limit-status');
    const checkoutBtn = document.getElementById('cart-drawer-checkout-btn');
    if (!container) return;

    const cart = window.auraStore.getCart();
    const subtotal = window.auraStore.getCartSubtotal();
    const limitCheck = window.auraStore.checkSpendingLimit(subtotal);

    if (subtotalEl) {
      subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }

    // Limit warning inside Cart Drawer
    if (limitWarningEl) {
      if (limitCheck.enabled && limitCheck.exceeded) {
        limitWarningEl.innerHTML = `
          <div class="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs shadow-lg pulse-limit-warning">
            <div class="flex items-center gap-2 font-bold text-rose-300 text-sm">
              <svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <span>Spending Limit Exceeded!</span>
            </div>
            <p class="mt-1 text-slate-300">
              Your spending limit of <strong class="text-white">$${limitCheck.limitAmount.toFixed(2)}</strong> will be exceeded by <strong class="text-rose-400">$${limitCheck.overBy.toFixed(2)}</strong>.
            </p>
            <div class="mt-2.5 flex items-center justify-between">
              <span class="text-[11px] text-slate-400">Total projected spend: $${limitCheck.newTotal.toFixed(2)}</span>
              <a href="#/limit" onclick="window.auraUI.toggleCartDrawer(false)" class="underline text-indigo-300 hover:text-indigo-200 font-semibold text-xs">
                Modify Limit ➔
              </a>
            </div>
          </div>
        `;
        if (checkoutBtn) {
          checkoutBtn.disabled = true;
          checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed', 'bg-rose-800');
          checkoutBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-500');
          checkoutBtn.innerText = "Exceeds Spending Limit (Adjust to Checkout)";
        }
      } else if (limitCheck.enabled && limitCheck.percent >= 80) {
        limitWarningEl.innerHTML = `
          <div class="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs">
            <span class="font-semibold">⚠️ Nearing Budget Limit:</span>
            Using ${limitCheck.percent}% ($${limitCheck.newTotal.toFixed(0)} of $${limitCheck.limitAmount.toFixed(0)}). Remaining: $${limitCheck.remaining.toFixed(2)}.
          </div>
        `;
        if (checkoutBtn) {
          checkoutBtn.disabled = false;
          checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-rose-800');
          checkoutBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-500');
          checkoutBtn.innerText = `Proceed to Checkout ($${subtotal.toFixed(2)})`;
        }
      } else {
        limitWarningEl.innerHTML = `
          <div class="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-300">
            <span>🛡️ Budget Limit: $${limitCheck.limitAmount ? limitCheck.limitAmount.toFixed(0) : 'None'}</span>
            <span class="font-semibold text-emerald-400">Safe: $${limitCheck.remaining ? limitCheck.remaining.toFixed(2) : '0.00'} remaining</span>
          </div>
        `;
        if (checkoutBtn) {
          checkoutBtn.disabled = cart.length === 0;
          checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-rose-800');
          checkoutBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-500');
          checkoutBtn.innerText = `Proceed to Checkout ($${subtotal.toFixed(2)})`;
        }
      }
    }

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16 px-4">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </div>
          <p class="text-base font-semibold text-white">Your cart is empty</p>
          <p class="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Explore our curated collection and add products to start shopping.</p>
          <button onclick="window.auraUI.toggleCartDrawer(false); window.auraRouter.navigate('/');" class="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white">
            Browse Products
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = cart.map(item => `
      <div class="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-slate-700/60 transition-all">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover bg-slate-800 shrink-0" />
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-semibold text-white truncate">${item.name}</h4>
          <span class="text-[11px] text-slate-400 block">${item.category}</span>
          <span class="text-xs font-bold text-indigo-400 font-mono mt-0.5 block">$${item.price.toFixed(2)}</span>
          
          <!-- Quantity Controls -->
          <div class="flex items-center gap-2 mt-2">
            <div class="flex items-center border border-slate-700 rounded-lg bg-slate-800/80 overflow-hidden">
              <button onclick="window.auraStore.updateCartQuantity('${item.id}', ${item.quantity - 1})" class="px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-700">-</button>
              <span class="px-2.5 py-0.5 text-xs font-semibold text-white font-mono">${item.quantity}</span>
              <button onclick="window.auraStore.updateCartQuantity('${item.id}', ${item.quantity + 1})" class="px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-700">+</button>
            </div>
            <button onclick="window.auraStore.removeFromCart('${item.id}'); window.auraUI.showToast('Item removed', 'info');" class="text-[11px] text-rose-400 hover:text-rose-300 ml-auto p-1">
              Remove
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- MODAL DIALOG MANAGER ---

  openModal(htmlContent) {
    this.closeModal();

    const backdrop = document.createElement('div');
    backdrop.id = 'aura-modal-backdrop';
    backdrop.className = 'fixed inset-0 z-[9990] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in';
    backdrop.innerHTML = `
      <div id="aura-modal-content" class="relative max-w-2xl w-full glass-modal rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden animate-slide-down max-h-[90vh] overflow-y-auto">
        ${htmlContent}
      </div>
    `;

    // Click outside to close
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.closeModal();
    });

    document.body.appendChild(backdrop);
    this.activeModal = backdrop;
  }

  closeModal() {
    const existing = document.getElementById('aura-modal-backdrop');
    if (existing) {
      existing.remove();
      this.activeModal = null;
    }
  }
}

window.auraUI = new UIManager();
