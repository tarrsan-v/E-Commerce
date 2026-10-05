/**
 * Aura Commerce - Dedicated Admin Management Views
 * Distinct URLs:
 * - #/admin/login     (Dedicated Admin Authentication)
 * - #/admin/dashboard (Store KPI Metrics & Operations)
 * - #/admin/products  (Catalog CRUD: Add, Modify, Remove Items)
 */

const AdminView = {
  searchQuery: '',
  categoryFilter: 'All',

  // --- 1. DEDICATED ADMIN LOGIN (#/admin/login) ---

  renderLogin() {
    const appMain = document.getElementById('app-main');
    if (!appMain) return;

    appMain.innerHTML = `
      <div class="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div class="max-w-md w-full glass-panel rounded-3xl p-8 border border-amber-500/20 shadow-2xl relative overflow-hidden animate-slide-down">
          
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Header -->
          <div class="text-center mb-8">
            <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-lg">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-mono font-bold uppercase mb-2">
              Protected Admin Portal
            </div>

            <h2 class="text-2xl font-bold text-white tracking-tight">Staff Administration</h2>
            <p class="text-xs text-slate-400 mt-1">
              Inventory modification & catalog control. Different URL from customer login.
            </p>
            <div class="mt-2 text-xs font-mono text-indigo-300">
              Active URL: <strong>#/admin/login</strong>
            </div>
          </div>

          <!-- Form -->
          <form id="admin-login-form" onsubmit="AdminView.handleAdminLogin(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Admin Email Address</label>
              <input 
                type="email" 
                id="admin-email" 
                required 
                value="admin@aura.store"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Admin Password</label>
              <input 
                type="password" 
                id="admin-password" 
                required 
                value="admin"
                class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <button 
              type="submit" 
              class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 active:scale-95 text-white font-bold text-sm shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
              <span>Access Admin Dashboard</span>
            </button>
          </form>

          <!-- Demo Credentials Display -->
          <div class="mt-5 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
            <span class="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">Default Demo Staff Login:</span>
            <div class="flex justify-between font-mono text-slate-300">
              <span>Email: admin@aura.store</span>
              <span>Pass: admin</span>
            </div>
          </div>

          <!-- Link to Customer Portal -->
          <div class="mt-6 text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
            Are you a customer? 
            <a href="#/login" class="text-indigo-400 hover:underline font-semibold">
              Go to Customer Login (#/login) ➔
            </a>
          </div>

        </div>
      </div>
    `;
  },

  handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    try {
      const admin = window.auraStore.adminLogin(email, password);
      window.auraUI.showToast(`Admin authenticated! Welcome ${admin.name}`, "success");
      window.auraRouter.navigate('/admin/dashboard');
    } catch (err) {
      window.auraUI.showToast(err.message, "error");
    }
  },

  // --- 2. ADMIN DASHBOARD (#/admin/dashboard) ---

  renderDashboard() {
    const appMain = document.getElementById('app-main');
    if (!appMain) return;

    const products = window.auraStore.getProducts();
    const orders = JSON.parse(localStorage.getItem('aura_orders') || '[]');
    const customers = JSON.parse(localStorage.getItem('aura_customers') || '[]');

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lowStockCount = products.filter(p => p.stock <= 5).length;

    appMain.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Admin Console
              </span>
              <span class="text-xs font-mono text-slate-400">URL: #/admin/dashboard</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight">Operations Dashboard</h1>
            <p class="text-sm text-slate-400 mt-1">Live metrics across store catalog, customer orders, and inventory health.</p>
          </div>

          <div class="flex items-center gap-3">
            <a href="#/admin/products" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              <span>Manage Products (CRUD)</span>
            </a>
            <button onclick="AdminView.openAddProductModal()" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              <span>+ Add New Product</span>
            </button>
          </div>
        </div>

        <!-- 4 KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          
          <div class="glass-panel p-5 rounded-2xl border border-white/5">
            <div class="flex items-center justify-between text-slate-400 mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
            </div>
            <div class="text-2xl font-bold font-mono text-white">$${totalRevenue.toFixed(2)}</div>
            <span class="text-[11px] text-emerald-400 mt-1 block font-medium">Orders logged in system</span>
          </div>

          <div class="glass-panel p-5 rounded-2xl border border-white/5">
            <div class="flex items-center justify-between text-slate-400 mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider">Catalog Items</span>
              <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
            </div>
            <div class="text-2xl font-bold font-mono text-white">${products.length}</div>
            <span class="text-[11px] text-indigo-400 mt-1 block font-medium">Editable by Admin</span>
          </div>

          <div class="glass-panel p-5 rounded-2xl border border-white/5">
            <div class="flex items-center justify-between text-slate-400 mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider">Low Stock Warnings</span>
              <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
            </div>
            <div class="text-2xl font-bold font-mono ${lowStockCount > 0 ? 'text-amber-400' : 'text-white'}">${lowStockCount}</div>
            <span class="text-[11px] text-slate-400 mt-1 block">5 units or fewer remaining</span>
          </div>

          <div class="glass-panel p-5 rounded-2xl border border-white/5">
            <div class="flex items-center justify-between text-slate-400 mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider">Registered Customers</span>
              <div class="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              </div>
            </div>
            <div class="text-2xl font-bold font-mono text-white">${customers.length}</div>
            <span class="text-[11px] text-purple-400 mt-1 block">Protected by Spending Limits</span>
          </div>

        </div>

        <!-- Quick Access to Product Management Table -->
        <div class="mt-8 glass-panel p-6 rounded-3xl border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-bold text-white">Recent Catalog Products</h2>
              <p class="text-xs text-slate-400">Quickly view, edit, or delete items from the store.</p>
            </div>
            <a href="#/admin/products" class="text-xs font-semibold text-indigo-400 hover:underline">
              View All Products (${products.length}) ➔
            </a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="text-slate-400 border-b border-slate-800">
                <tr>
                  <th class="py-3 px-3">Item</th>
                  <th class="py-3 px-3">Category</th>
                  <th class="py-3 px-3">Price</th>
                  <th class="py-3 px-3">Stock</th>
                  <th class="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                ${products.slice(0, 5).map(prod => `
                  <tr class="hover:bg-slate-800/40">
                    <td class="py-3 px-3 flex items-center gap-3">
                      <img src="${prod.image}" class="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0" />
                      <div>
                        <div class="font-bold text-white">${prod.name}</div>
                        <div class="text-[11px] text-slate-400">${prod.tagline || ''}</div>
                      </div>
                    </td>
                    <td class="py-3 px-3 text-slate-300">${prod.category}</td>
                    <td class="py-3 px-3 font-mono font-bold text-indigo-300">$${prod.price.toFixed(2)}</td>
                    <td class="py-3 px-3">
                      <span class="px-2 py-0.5 rounded text-[11px] font-semibold ${prod.stock <= 5 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300'}">
                        ${prod.stock} in stock
                      </span>
                    </td>
                    <td class="py-3 px-3 text-right space-x-2">
                      <button onclick="AdminView.openEditProductModal('${prod.id}')" class="px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-semibold">
                        Edit
                      </button>
                      <button onclick="AdminView.confirmDeleteProduct('${prod.id}')" class="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 font-semibold">
                        Delete
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  // --- 3. ADMIN PRODUCT MANAGEMENT (#/admin/products) ---

  renderProducts() {
    const appMain = document.getElementById('app-main');
    if (!appMain) return;

    let products = window.auraStore.getProducts();

    if (this.categoryFilter !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === this.categoryFilter.toLowerCase());
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    appMain.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Catalog CRUD Suite
              </span>
              <span class="text-xs font-mono text-slate-400">URL: #/admin/products</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight">Products Management</h1>
            <p class="text-sm text-slate-400 mt-1">Add new items, modify pricing and stock, or remove products in real-time.</p>
          </div>

          <div class="flex items-center gap-3">
            <button onclick="AdminView.resetDefaultData()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all">
              ↺ Reset Sample Catalog
            </button>
            <button onclick="AdminView.openAddProductModal()" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              <span>+ Add New Product</span>
            </button>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
          <div class="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Search product inventory..." 
              value="${this.searchQuery}"
              oninput="AdminView.searchQuery = this.value; AdminView.renderProducts();"
              class="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            ${['All', 'Electronics', 'Accessories', 'Fashion', 'Home & Living'].map(cat => `
              <button 
                onclick="AdminView.categoryFilter = '${cat}'; AdminView.renderProducts();"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  this.categoryFilter === cat ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }"
              >
                ${cat}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Product Table -->
        <div class="mt-6 glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="text-slate-400 bg-slate-900/80 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <tr>
                  <th class="py-3.5 px-4">Product Details</th>
                  <th class="py-3.5 px-4">Category</th>
                  <th class="py-3.5 px-4">Price</th>
                  <th class="py-3.5 px-4">Inventory Stock</th>
                  <th class="py-3.5 px-4">Badge</th>
                  <th class="py-3.5 px-4 text-right">Actions (Modify / Remove)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/80">
                ${products.length === 0 ? `
                  <tr>
                    <td colspan="6" class="text-center py-12 text-slate-400">
                      No products found. <button onclick="AdminView.openAddProductModal()" class="text-indigo-400 underline font-semibold">Add a product</button>
                    </td>
                  </tr>
                ` : products.map(prod => `
                  <tr class="hover:bg-slate-800/30 transition-colors">
                    <td class="py-3.5 px-4 flex items-center gap-3">
                      <img src="${prod.image}" class="w-12 h-12 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700" />
                      <div class="min-w-0 max-w-xs">
                        <div class="font-bold text-white truncate text-sm">${prod.name}</div>
                        <div class="text-[11px] text-slate-400 line-clamp-1">${prod.description}</div>
                      </div>
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-[11px]">
                        ${prod.category}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 font-mono font-bold text-white text-sm">
                      $${prod.price.toFixed(2)}
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="px-2.5 py-1 rounded-md text-xs font-semibold ${
                        prod.stock <= 5 
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/60' 
                          : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/40'
                      }">
                        ${prod.stock} units
                      </span>
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="text-[11px] text-indigo-300 font-medium">${prod.badge || '-'}</span>
                    </td>
                    <td class="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <button 
                        onclick="AdminView.openEditProductModal('${prod.id}')" 
                        class="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/60 text-indigo-300 border border-indigo-500/40 font-semibold transition-all"
                      >
                        Modify
                      </button>
                      <button 
                        onclick="AdminView.confirmDeleteProduct('${prod.id}')" 
                        class="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 font-semibold transition-all"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  // --- MODALS FOR ADD, EDIT, DELETE ---

  openAddProductModal() {
    const modalHtml = `
      <div class="p-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 class="text-lg font-bold text-white">Add New Product to Store</h3>
            <p class="text-xs text-slate-400">Item will instantly appear in the Customer Catalog.</p>
          </div>
          <button onclick="window.auraUI.closeModal()" class="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        <form id="add-product-form" onsubmit="AdminView.handleAddProductSubmit(event)" class="space-y-4 mt-4 text-xs">
          <div>
            <label class="block font-semibold text-slate-300 mb-1">Product Title</label>
            <input type="text" id="add-prod-name" required placeholder="e.g. Aura Studio Monitor Speakers" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Category</label>
              <select id="add-prod-category" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none">
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Living">Home & Living</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Badge Tag</label>
              <input type="text" id="add-prod-badge" placeholder="e.g. New Arrival, Sale" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Selling Price ($)</label>
              <input type="number" step="0.01" id="add-prod-price" required placeholder="149.00" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Initial Stock Count</label>
              <input type="number" id="add-prod-stock" required value="15" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none" />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Image URL</label>
            <input type="url" id="add-prod-image" required value="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none" />
            
            <!-- Quick Image Presets for testing -->
            <div class="flex items-center gap-1.5 mt-2">
              <span class="text-[10px] text-slate-400">Presets:</span>
              <button type="button" onclick="document.getElementById('add-prod-image').value='https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80'" class="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 hover:bg-slate-700">Smartwatch</button>
              <button type="button" onclick="document.getElementById('add-prod-image').value='https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80'" class="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 hover:bg-slate-700">Sunglasses</button>
              <button type="button" onclick="document.getElementById('add-prod-image').value='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'" class="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 hover:bg-slate-700">Sneakers</button>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Description</label>
            <textarea id="add-prod-desc" rows="3" placeholder="Detailed product story and specifications..." class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"></textarea>
          </div>

          <div class="pt-3 flex justify-end gap-2">
            <button type="button" onclick="window.auraUI.closeModal()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg">Save & Add Product</button>
          </div>
        </form>
      </div>
    `;

    window.auraUI.openModal(modalHtml);
  },

  handleAddProductSubmit(e) {
    e.preventDefault();
    const productData = {
      name: document.getElementById('add-prod-name').value,
      category: document.getElementById('add-prod-category').value,
      badge: document.getElementById('add-prod-badge').value,
      price: document.getElementById('add-prod-price').value,
      stock: document.getElementById('add-prod-stock').value,
      image: document.getElementById('add-prod-image').value,
      description: document.getElementById('add-prod-desc').value,
      featured: true
    };

    window.auraStore.addProduct(productData);
    window.auraUI.showToast(`Product "${productData.name}" added to catalog!`, "success");
    window.auraUI.closeModal();
    this.renderProducts();
  },

  openEditProductModal(productId) {
    const prod = window.auraStore.getProductById(productId);
    if (!prod) return;

    const modalHtml = `
      <div class="p-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 class="text-lg font-bold text-white">Modify Product: ${prod.name}</h3>
            <p class="text-xs text-slate-400">Updates reflect immediately in Customer Storefront.</p>
          </div>
          <button onclick="window.auraUI.closeModal()" class="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        <form id="edit-product-form" onsubmit="AdminView.handleEditProductSubmit(event, '${prod.id}')" class="space-y-4 mt-4 text-xs">
          <div>
            <label class="block font-semibold text-slate-300 mb-1">Product Title</label>
            <input type="text" id="edit-prod-name" value="${prod.name}" required class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Category</label>
              <select id="edit-prod-category" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none">
                <option value="Electronics" ${prod.category === 'Electronics' ? 'selected' : ''}>Electronics</option>
                <option value="Accessories" ${prod.category === 'Accessories' ? 'selected' : ''}>Accessories</option>
                <option value="Fashion" ${prod.category === 'Fashion' ? 'selected' : ''}>Fashion</option>
                <option value="Home & Living" ${prod.category === 'Home & Living' ? 'selected' : ''}>Home & Living</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Badge Tag</label>
              <input type="text" id="edit-prod-badge" value="${prod.badge || ''}" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Price ($ USD)</label>
              <input type="number" step="0.01" id="edit-prod-price" value="${prod.price}" required class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none" />
            </div>
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Available Stock Units</label>
              <input type="number" id="edit-prod-stock" value="${prod.stock}" required class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none" />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Image URL</label>
            <input type="url" id="edit-prod-image" value="${prod.image}" required class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none" />
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Product Description</label>
            <textarea id="edit-prod-desc" rows="3" class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none">${prod.description}</textarea>
          </div>

          <div class="pt-3 flex justify-end gap-2">
            <button type="button" onclick="window.auraUI.closeModal()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg">Save Modifications</button>
          </div>
        </form>
      </div>
    `;

    window.auraUI.openModal(modalHtml);
  },

  handleEditProductSubmit(e, productId) {
    e.preventDefault();
    const updatedFields = {
      name: document.getElementById('edit-prod-name').value,
      category: document.getElementById('edit-prod-category').value,
      badge: document.getElementById('edit-prod-badge').value,
      price: document.getElementById('edit-prod-price').value,
      stock: document.getElementById('edit-prod-stock').value,
      image: document.getElementById('edit-prod-image').value,
      description: document.getElementById('edit-prod-desc').value
    };

    window.auraStore.updateProduct(productId, updatedFields);
    window.auraUI.showToast("Product modified successfully!", "success");
    window.auraUI.closeModal();
    this.renderProducts();
  },

  confirmDeleteProduct(productId) {
    const prod = window.auraStore.getProductById(productId);
    if (!prod) return;

    const modalHtml = `
      <div class="p-6 text-center">
        <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </div>
        <h3 class="text-lg font-bold text-white">Remove Product?</h3>
        <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Are you sure you want to permanently delete <strong class="text-white">"${prod.name}"</strong>? It will immediately disappear from the storefront and customer carts.
        </p>

        <div class="mt-6 flex items-center justify-center gap-3">
          <button onclick="window.auraUI.closeModal()" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700">
            Cancel
          </button>
          <button onclick="AdminView.executeDeleteProduct('${prod.id}')" class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30">
            Yes, Remove Product
          </button>
        </div>
      </div>
    `;

    window.auraUI.openModal(modalHtml);
  },

  executeDeleteProduct(productId) {
    window.auraStore.deleteProduct(productId);
    window.auraUI.showToast("Product removed from catalog", "info");
    window.auraUI.closeModal();
    this.renderProducts();
  },

  resetDefaultData() {
    window.auraStore.resetDefaultProducts();
    window.auraUI.showToast("Catalog reset to 10 curated initial products!", "info");
    this.renderProducts();
  }
};

window.AdminView = AdminView;
