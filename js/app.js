/**
 * Aura Commerce - Main Application Coordinator & Bootstrap
 * Wires the Router, Data Store, Views, and UI Components together.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Global UI Services (Toasts, Modals)
  window.auraUI.init();

  // 2. Register Routes
  const router = window.auraRouter;

  // --- Customer Portal Routes ---
  router.register('/', (params) => {
    window.auraUI.renderNavbar('/');
    window.StorefrontView.render(params);
  });

  router.register('/login', () => {
    window.auraUI.renderNavbar('/login');
    window.AuthView.renderLogin();
  });

  router.register('/signup', () => {
    window.auraUI.renderNavbar('/signup');
    window.AuthView.renderSignup();
  });

  router.register('/cart', () => {
    window.auraUI.renderNavbar('/cart');
    window.CartView.render();
  });

  router.register('/limit', () => {
    window.auraUI.renderNavbar('/limit');
    window.LimitView.render();
  });

  router.register('/orders', () => {
    window.auraUI.renderNavbar('/orders');
    window.OrdersView.render();
  });

  // --- Admin Portal Routes (COMPLETELY DIFFERENT URLS) ---
  router.register('/admin', () => {
    const admin = window.auraStore.getCurrentAdmin();
    if (admin) {
      router.navigate('/admin/dashboard');
    } else {
      router.navigate('/admin/login');
    }
  });

  router.register('/admin/login', () => {
    window.auraUI.renderNavbar('/admin/login');
    window.AdminView.renderLogin();
  });

  router.register('/admin/dashboard', () => {
    window.auraUI.renderNavbar('/admin/dashboard');
    window.AdminView.renderDashboard();
  }, { requiresAdmin: true });

  router.register('/admin/products', () => {
    window.auraUI.renderNavbar('/admin/products');
    window.AdminView.renderProducts();
  }, { requiresAdmin: true });

  // 3. React to state changes across views
  window.auraStore.subscribe((event) => {
    const current = router.getCurrentHash();
    if (event === 'products' && (current === '/' || current.startsWith('/products'))) {
      window.StorefrontView.render();
    } else if (event === 'products' && current === '/admin/products') {
      window.AdminView.renderProducts();
    } else if (event === 'limit' && current === '/limit') {
      window.LimitView.render();
    }
  });

  // 4. Initial Route trigger
  router.handleRouting();
});
