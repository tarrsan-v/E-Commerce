/**
 * Aura Commerce - Hash-based Client Router
 * Manages URL navigation between Customer and Admin domains.
 * Ensures distinct URLs:
 * Customer: #/, #/login, #/signup, #/cart, #/limit, #/orders
 * Admin:    #/admin/login, #/admin/dashboard, #/admin/products
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.params = {};

    window.addEventListener('hashchange', () => this.handleRouting());
    window.addEventListener('load', () => this.handleRouting());
  }

  register(path, handler, options = {}) {
    this.routes[path] = {
      handler,
      requiresAdmin: !!options.requiresAdmin,
      requiresCustomer: !!options.requiresCustomer
    };
  }

  navigate(hashPath) {
    if (!hashPath.startsWith('#/')) {
      hashPath = '#/' + hashPath.replace(/^\/+/, '');
    }
    window.location.hash = hashPath;
  }

  getCurrentHash() {
    const raw = window.location.hash.slice(1); // remove '#'
    if (raw) return raw;

    // Support direct clean URLs on Vercel deployment (e.g. /admin/login)
    const pathname = window.location.pathname;
    if (pathname && pathname !== '/' && !pathname.endsWith('.html') && !pathname.includes('.')) {
      return pathname;
    }
    return '/';
  }

  handleRouting() {
    let path = this.getCurrentHash();
    if (!path.startsWith('/')) path = '/' + path;

    // Separate path from query params if any
    const [cleanPath, queryString] = path.split('?');
    const queryParams = new URLSearchParams(queryString || '');

    // Route matching
    let matchedRoute = this.routes[cleanPath];

    // Fallback if not found
    if (!matchedRoute) {
      if (cleanPath.startsWith('/admin')) {
        matchedRoute = this.routes['/admin/dashboard'] || this.routes['/admin/login'];
      } else {
        matchedRoute = this.routes['/'];
      }
    }

    // Auth Guards
    if (matchedRoute.requiresAdmin) {
      const admin = window.auraStore.getCurrentAdmin();
      if (!admin) {
        window.auraUI.showToast("Please log in with admin credentials to access the admin portal.", "warning");
        this.navigate('/admin/login');
        return;
      }
    }

    this.currentRoute = cleanPath;
    this.params = Object.fromEntries(queryParams.entries());

    // Execute route handler
    if (matchedRoute && matchedRoute.handler) {
      matchedRoute.handler(this.params);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update active nav indicators
    this.updateActiveNavs(cleanPath);
  }

  updateActiveNavs(path) {
    document.querySelectorAll('[data-route]').forEach(el => {
      const target = el.getAttribute('data-route');
      if (target === path) {
        el.classList.add('nav-active');
      } else {
        el.classList.remove('nav-active');
      }
    });
  }
}

window.auraRouter = new Router();
