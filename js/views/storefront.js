/**
 * Aura Commerce - Storefront View
 * Creative product showcase, live search, multi-category filters, sorting, and quick view.
 */

const StorefrontView = {
  activeCategory: 'All',
  searchQuery: '',
  sortBy: 'featured',

  render(params = {}) {
    const appMain = document.getElementById('app-main');
    if (!appMain) return;

    if (params.q) {
      this.searchQuery = params.q;
    }

    appMain.innerHTML = `
      <!-- Hero Presentation Banner -->
      <section class="relative overflow-hidden pt-6 pb-12 sm:pb-16 border-b border-white/5">
        <div class="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none"></div>
        <div class="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div class="text-center max-w-3xl mx-auto">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
              Modern Smart Living & Minimalist Design
            </div>
            <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Design for <span class="gradient-text">Intentional Living</span>.
            </h1>
            <p class="mt-4 text-base sm:text-lg text-slate-400 font-normal max-w-2xl mx-auto">
              Curated precision audio, modern desk setups, and mindful lifestyle essentials with integrated <strong class="text-indigo-300 font-semibold">Spending Limit Protection</strong>.
            </p>
            <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href="#/limit" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Set Spending Limit (1d to 1mo)
              </a>
              <a href="#limit" onclick="document.getElementById('storefront-search') && document.getElementById('storefront-search').focus()" class="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-sm font-medium flex items-center gap-2 transition-all">
                <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <span>Search Products</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Active Spending Limit Notice Bar (If enabled) -->
      <div id="store-limit-banner" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <!-- Rendered via updateLimitBanner() -->
      </div>

      <!-- Controls Section: Search, Filters, and Sorting -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
          
          <!-- Live Search Bar -->
          <div class="relative flex-1 max-w-lg">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input 
              type="text" 
              id="storefront-search" 
              value="${this.searchQuery}" 
              placeholder="Search headphones, watch, lamp, jacket, ceramics..." 
              class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            ${this.searchQuery ? `
              <button onclick="StorefrontView.clearSearch()" class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white">
                ✕
              </button>
            ` : ''}
          </div>

          <!-- Category Filters -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0" id="category-pills">
            ${['All', 'Electronics', 'Accessories', 'Fashion', 'Home & Living'].map(cat => `
              <button 
                onclick="StorefrontView.setCategory('${cat}')" 
                class="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  this.activeCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/60'
                }"
              >
                ${cat}
              </button>
            `).join('')}
          </div>

          <!-- Sort Selector -->
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-xs text-slate-400 font-medium">Sort:</span>
            <select 
              id="storefront-sort" 
              onchange="StorefrontView.setSort(this.value)"
              class="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="featured" ${this.sortBy === 'featured' ? 'selected' : ''}>Featured</option>
              <option value="price-asc" ${this.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-desc" ${this.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
              <option value="rating" ${this.sortBy === 'rating' ? 'selected' : ''}>Highest Rated</option>
            </select>
          </div>

        </div>

        <!-- Product Grid Results -->
        <div id="storefront-product-grid" class="mt-8">
          <!-- Injected via renderProducts() -->
        </div>
      </section>
    `;

    this.bindEvents();
    this.renderProducts();
    this.updateLimitBanner();
  },

  bindEvents() {
    const searchInput = document.getElementById('storefront-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderProducts();
      });
    }
  },

  clearSearch() {
    this.searchQuery = '';
    const input = document.getElementById('storefront-search');
    if (input) input.value = '';
    this.renderProducts();
  },

  setCategory(category) {
    this.activeCategory = category;
    this.render();
  },

  setSort(sortValue) {
    this.sortBy = sortValue;
    this.renderProducts();
  },

  updateLimitBanner() {
    const bannerEl = document.getElementById('store-limit-banner');
    if (!bannerEl) return;

    const cartSubtotal = window.auraStore.getCartSubtotal();
    const limitCheck = window.auraStore.checkSpendingLimit(cartSubtotal);

    if (!limitCheck.enabled) {
      bannerEl.innerHTML = `
        <div class="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-indigo-500">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-white">Smart Spending Limit (UI/UX Feature)</h4>
              <p class="text-xs text-slate-400">Set a customizable budget limit for 1 day, 2 days, 1 week, or up to 1 month to prevent accidental overspending.</p>
            </div>
          </div>
          <a href="#/limit" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shrink-0">
            Activate Spending Limit
          </a>
        </div>
      `;
      return;
    }

    if (limitCheck.exceeded) {
      bannerEl.innerHTML = `
        <div class="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/60 shadow-xl glow-rose flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 animate-bounce">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div>
              <h4 class="text-sm font-bold text-rose-200">Alert: Active Spending Limit Exceeded!</h4>
              <p class="text-xs text-rose-300/90 mt-0.5">
                Current window total is <strong>$${limitCheck.newTotal.toFixed(2)}</strong>, which exceeds your set limit of <strong>$${limitCheck.limitAmount.toFixed(2)}</strong> by <span class="font-bold text-white">$${limitCheck.overBy.toFixed(2)}</span>. (${limitCheck.daysLeft} days remaining).
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <a href="#/limit" class="px-4 py-2 rounded-xl bg-white text-rose-950 hover:bg-slate-100 text-xs font-bold shrink-0 transition-all">
              Modify Limit Now
            </a>
          </div>
        </div>
      `;
    } else {
      bannerEl.innerHTML = `
        <div class="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-500/30 bg-emerald-950/20">
          <div class="flex items-center gap-3.5 w-full sm:w-auto">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-semibold text-white">Active Limit: $${limitCheck.limitAmount.toFixed(2)} (${limitCheck.durationLabel})</h4>
                <span class="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">${limitCheck.daysLeft}d ${limitCheck.hoursLeft}h left</span>
              </div>
              <p class="text-xs text-slate-300 mt-0.5">
                Spent: <strong>$${limitCheck.newTotal.toFixed(2)}</strong> | Remaining: <strong class="text-emerald-400">$${limitCheck.remaining.toFixed(2)}</strong> (${limitCheck.percent}% used)
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div class="w-32 h-2.5 rounded-full bg-slate-800 overflow-hidden border border-white/10 hidden md:block">
              <div class="h-full bg-emerald-400" style="width: ${limitCheck.percent}%"></div>
            </div>
            <a href="#/limit" class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all">
              Adjust Limit
            </a>
          </div>
        </div>
      `;
    }
  },

  renderProducts() {
    const gridContainer = document.getElementById('storefront-product-grid');
    if (!gridContainer) return;

    let products = window.auraStore.getProducts();

    // 1. Filter Category
    if (this.activeCategory !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === this.activeCategory.toLowerCase());
    }

    // 2. Filter Search Query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // 3. Sorting
    if (this.sortBy === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else {
      // featured
      products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    if (products.length === 0) {
      gridContainer.innerHTML = `
        <div class="text-center py-20 glass-panel rounded-2xl p-8 max-w-md mx-auto">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 class="text-lg font-bold text-white">No products found</h3>
          <p class="text-xs text-slate-400 mt-1">We couldn't find matches for "${this.searchQuery}". Try a different keyword or reset filters.</p>
          <button onclick="StorefrontView.clearSearch(); StorefrontView.setCategory('All');" class="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white">
            Reset Filters
          </button>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs text-slate-400 font-medium">Showing ${products.length} products</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${products.map(prod => this.renderProductCard(prod)).join('')}
      </div>
    `;
  },

  renderProductCard(product) {
    const isLowStock = product.stock > 0 && product.stock <= 5;
    const isOutOfStock = product.stock <= 0;

    return `
      <div class="group glass-panel rounded-2xl overflow-hidden glass-panel-hover flex flex-col border border-white/5 hover:border-indigo-500/40 transition-all">
        
        <!-- Image & Badges -->
        <div class="relative aspect-square w-full overflow-hidden bg-slate-900 cursor-pointer" onclick="StorefrontView.openQuickView('${product.id}')">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span class="text-xs text-white/90 font-medium flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg">
              <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              Quick Preview
            </span>
          </div>

          <!-- Status Badges -->
          <div class="absolute top-3 left-3 flex flex-col gap-1.5">
            ${product.badge ? `
              <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-600/90 text-white backdrop-blur-md shadow-md">
                ${product.badge}
              </span>
            ` : ''}
            ${product.originalPrice ? `
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white shadow-md">
                -${Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            ` : ''}
          </div>

          <!-- Stock Pill -->
          <div class="absolute top-3 right-3">
            ${isOutOfStock ? `
              <span class="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-rose-950/90 text-rose-300 border border-rose-800">
                Out of Stock
              </span>
            ` : isLowStock ? `
              <span class="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-amber-950/90 text-amber-300 border border-amber-800">
                Only ${product.stock} left
              </span>
            ` : `
              <span class="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-slate-900/80 text-emerald-400 border border-emerald-500/30">
                In Stock (${product.stock})
              </span>
            `}
          </div>
        </div>

        <!-- Product Details -->
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>${product.category}</span>
              <div class="flex items-center gap-1 text-amber-400 font-semibold">
                ★ <span>${product.rating}</span>
                <span class="text-slate-500 font-normal">(${product.reviewsCount})</span>
              </div>
            </div>

            <h3 class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 cursor-pointer" onclick="StorefrontView.openQuickView('${product.id}')">
              ${product.name}
            </h3>
            <p class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              ${product.tagline || product.description}
            </p>
          </div>

          <!-- Pricing & CTA -->
          <div class="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <div>
              <div class="flex items-baseline gap-2">
                <span class="text-lg font-bold text-white font-mono">$${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `
                  <span class="text-xs text-slate-500 line-through font-mono">$${product.originalPrice.toFixed(2)}</span>
                ` : ''}
              </div>
            </div>

            <button 
              onclick="StorefrontView.handleAddToCart('${product.id}')" 
              ${isOutOfStock ? 'disabled' : ''}
              class="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isOutOfStock 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-md shadow-indigo-600/30'
              }"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              <span>${isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
            </button>
          </div>

        </div>

      </div>
    `;
  },

  handleAddToCart(productId) {
    const product = window.auraStore.getProductById(productId);
    if (!product) return;

    // Check if adding this will breach the customer's spending limit
    const currentCartSubtotal = window.auraStore.getCartSubtotal();
    const limitCheck = window.auraStore.checkSpendingLimit(currentCartSubtotal + product.price);

    try {
      window.auraStore.addToCart(productId, 1);
      
      if (limitCheck.enabled && limitCheck.exceeded) {
        window.auraUI.showToast(`⚠️ Warning: Adding "${product.name}" puts you over your active spending limit by $${limitCheck.overBy.toFixed(2)}!`, "warning", 6000);
      } else {
        window.auraUI.showToast(`Added "${product.name}" to cart!`, "success");
      }
      this.updateLimitBanner();
    } catch (err) {
      window.auraUI.showToast(err.message, "error");
    }
  },

  openQuickView(productId) {
    const product = window.auraStore.getProductById(productId);
    if (!product) return;

    const modalHtml = `
      <div class="p-6">
        <button onclick="window.auraUI.closeModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white p-2">
          ✕
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div class="aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" />
          </div>

          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                ${product.category}
              </span>
              <span class="text-xs text-amber-400 font-semibold">
                ★ ${product.rating} (${product.reviewsCount} customer reviews)
              </span>
            </div>

            <h2 class="text-xl font-bold text-white">${product.name}</h2>
            <p class="text-xs text-indigo-300 mt-1 font-medium">${product.tagline || ''}</p>

            <div class="my-4 flex items-baseline gap-3">
              <span class="text-2xl font-bold text-white font-mono">$${product.price.toFixed(2)}</span>
              ${product.originalPrice ? `
                <span class="text-sm text-slate-500 line-through font-mono">$${product.originalPrice.toFixed(2)}</span>
              ` : ''}
              <span class="text-xs text-emerald-400 font-medium ml-auto">
                Stock: ${product.stock} units available
              </span>
            </div>

            <div class="text-xs text-slate-300 leading-relaxed space-y-2 border-t border-b border-slate-800 py-3">
              <p>${product.description}</p>
              <ul class="list-disc pl-4 text-slate-400 space-y-1">
                <li>Original manufacturer warranty included (2-Year).</li>
                <li>Free carbon-neutral courier shipping on orders over $50.</li>
                <li>Spending Limit protected checkout.</li>
              </ul>
            </div>

            <div class="mt-5 flex items-center gap-3">
              <button 
                onclick="StorefrontView.handleAddToCart('${product.id}'); window.auraUI.closeModal();" 
                class="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                Add to Cart ($${product.price.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    window.auraUI.openModal(modalHtml);
  }
};

window.StorefrontView = StorefrontView;
