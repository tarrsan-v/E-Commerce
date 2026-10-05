/**
 * Aura Commerce - Full Shopping Cart & Limit-Guarded Checkout View
 * URL: #/cart
 */

const CartView = {
  render() {
    const appMain = document.getElementById('app-main');
    if (!appMain) return;

    const cart = window.auraStore.getCart();
    const subtotal = window.auraStore.getCartSubtotal();
    const shipping = subtotal > 50 || subtotal === 0 ? 0.00 : 9.99;
    const tax = +(subtotal * 0.08).toFixed(2);
    const finalTotal = +(subtotal + shipping + tax).toFixed(2);

    const limitStatus = window.auraStore.checkSpendingLimit(subtotal);

    appMain.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-mono font-semibold text-indigo-400">Shopping Cart</span>
              <span class="text-xs font-mono text-slate-400">URL: #/cart</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight">Your Cart</h1>
          </div>
          <a href="#/" class="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            <span>← Continue Shopping</span>
          </a>
        </div>

        ${cart.length === 0 ? `
          <div class="text-center py-20 glass-panel rounded-3xl p-8 max-w-lg mx-auto mt-10">
            <div class="w-20 h-20 mx-auto mb-4 rounded-3xl bg-slate-800 flex items-center justify-center text-slate-500">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </div>
            <h3 class="text-xl font-bold text-white">Your Cart is Currently Empty</h3>
            <p class="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
              Discover minimalist electronics, designer lifestyle goods, and smart lighting in our catalog.
            </p>
            <a href="#/" class="inline-block mt-6 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all">
              Explore Catalog Now
            </a>
          </div>
        ` : `
          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            
            <!-- Left: Items List (7 Cols) -->
            <div class="lg:col-span-7 space-y-4">
              <div class="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl divide-y divide-white/5">
                ${cart.map(item => `
                  <div class="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-2xl object-cover bg-slate-900 border border-slate-700/60 shrink-0" />
                    
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between">
                        <div>
                          <span class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">${item.category}</span>
                          <h4 class="text-sm font-bold text-white truncate max-w-xs">${item.name}</h4>
                        </div>
                        <span class="text-sm font-bold text-indigo-400 font-mono">$${(item.price * item.quantity).toFixed(2)}</span>
                      </div>

                      <div class="flex items-center justify-between mt-3">
                        <div class="flex items-center border border-slate-700 rounded-xl bg-slate-900 overflow-hidden">
                          <button onclick="CartView.updateQty('${item.id}', ${item.quantity - 1})" class="px-3 py-1 text-xs text-slate-300 hover:bg-slate-800 transition-colors">-</button>
                          <span class="px-3 py-1 text-xs font-bold text-white font-mono">${item.quantity}</span>
                          <button onclick="CartView.updateQty('${item.id}', ${item.quantity + 1})" class="px-3 py-1 text-xs text-slate-300 hover:bg-slate-800 transition-colors">+</button>
                        </div>

                        <button onclick="CartView.removeItem('${item.id}')" class="text-xs text-rose-400 hover:text-rose-300 font-medium">
                          Remove Item
                        </button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Quick action to empty cart -->
              <div class="flex justify-end">
                <button onclick="window.auraStore.clearCart(); CartView.render();" class="text-xs text-slate-500 hover:text-rose-400 transition-colors">
                  Clear All Cart Items
                </button>
              </div>
            </div>

            <!-- Right: Order Summary & Spending Limit Analysis (5 Cols) -->
            <div class="lg:col-span-5 space-y-6">
              
              <!-- Spending Limit Feedback Widget -->
              <div class="glass-panel p-6 rounded-3xl border ${limitStatus.exceeded ? 'border-rose-500/60 bg-rose-950/40 glow-rose' : 'border-white/10'} shadow-2xl">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-sm font-bold text-white flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full ${limitStatus.exceeded ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}"></span>
                    <span>Spending Limit Guard</span>
                  </h3>
                  <a href="#/limit" class="text-xs text-indigo-400 hover:underline font-semibold">
                    Edit Limit
                  </a>
                </div>

                ${limitStatus.enabled ? `
                  <div class="space-y-3 text-xs">
                    <div class="flex items-center justify-between text-slate-300">
                      <span>Active Limit Cap:</span>
                      <span class="font-mono font-bold text-white">$${limitStatus.limitAmount.toFixed(2)} (${limitStatus.durationLabel})</span>
                    </div>
                    <div class="flex items-center justify-between text-slate-300">
                      <span>Previously Spent in Window:</span>
                      <span class="font-mono">$${limitStatus.currentSpent.toFixed(2)}</span>
                    </div>
                    <div class="flex items-center justify-between text-slate-300">
                      <span>Current Cart Subtotal:</span>
                      <span class="font-mono text-indigo-300 font-semibold">+$${subtotal.toFixed(2)}</span>
                    </div>

                    <div class="pt-2 border-t border-slate-700/80 flex items-center justify-between font-bold">
                      <span class="text-white">Projected Window Total:</span>
                      <span class="font-mono ${limitStatus.exceeded ? 'text-rose-400 text-sm' : 'text-emerald-400 text-sm'}">
                        $${limitStatus.newTotal.toFixed(2)}
                      </span>
                    </div>

                    ${limitStatus.exceeded ? `
                      <div class="p-3.5 rounded-xl bg-rose-900/40 border border-rose-500/50 text-rose-200 mt-2 space-y-2">
                        <div class="font-bold flex items-center gap-1.5 text-rose-300">
                          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                          <span>Checkout Blocked: Limit Exceeded</span>
                        </div>
                        <p class="text-[11px] text-slate-200 leading-relaxed">
                          This checkout will exceed your active spending limit by <strong>$${limitStatus.overBy.toFixed(2)}</strong>. You must either reduce your cart or modify your limit in the Limit settings.
                        </p>
                        <a href="#/limit" class="inline-flex items-center gap-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 px-3 py-1.5 rounded-lg transition-all">
                          Modify Limit to Proceed ➔
                        </a>
                      </div>
                    ` : `
                      <div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 mt-2 flex items-center justify-between">
                        <span>✓ Budget Approved</span>
                        <span class="font-mono font-semibold">$${limitStatus.remaining.toFixed(2)} remaining</span>
                      </div>
                    `}
                  </div>
                ` : `
                  <p class="text-xs text-slate-400">
                    No spending limit is currently enforced. <a href="#/limit" class="text-indigo-400 underline">Set one here</a>.
                  </p>
                `}
              </div>

              <!-- Order Pricing Summary -->
              <div class="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
                <h3 class="text-sm font-bold text-white">Order Summary</h3>

                <div class="space-y-2.5 text-xs text-slate-300">
                  <div class="flex justify-between">
                    <span>Subtotal</span>
                    <span class="font-mono font-semibold text-white">$${subtotal.toFixed(2)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span class="font-mono text-emerald-400">${shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Estimated Sales Tax (8%)</span>
                    <span class="font-mono">$${tax.toFixed(2)}</span>
                  </div>
                  <div class="pt-3 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                    <span>Total Amount</span>
                    <span class="font-mono text-lg text-indigo-300">$${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <!-- Checkout Button -->
                <button 
                  onclick="CartView.handleCheckout()" 
                  ${limitStatus.exceeded ? 'disabled' : ''}
                  class="w-full py-4 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
                    limitStatus.exceeded 
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white shadow-indigo-600/30'
                  }"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  <span>${limitStatus.exceeded ? 'Blocked by Spending Limit' : `Confirm Checkout ($${finalTotal.toFixed(2)})`}</span>
                </button>

                <p class="text-[11px] text-center text-slate-500">
                  🔒 Safe & encrypted simulated transaction. Real-time limit protection.
                </p>
              </div>

            </div>

          </div>
        `}

      </div>
    `;
  },

  updateQty(productId, qty) {
    try {
      window.auraStore.updateCartQuantity(productId, qty);
      this.render();
    } catch (err) {
      window.auraUI.showToast(err.message, "warning");
    }
  },

  removeItem(productId) {
    window.auraStore.removeFromCart(productId);
    window.auraUI.showToast("Item removed from cart", "info");
    this.render();
  },

  handleCheckout() {
    try {
      const order = window.auraStore.checkoutOrder();
      
      const modalContent = `
        <div class="p-8 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <span class="text-xs font-mono font-semibold text-emerald-400 uppercase">Order Confirmed</span>
          <h2 class="text-2xl font-bold text-white mt-1">Thank You for Your Order!</h2>
          <p class="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
            Order <strong class="text-indigo-300 font-mono">${order.id}</strong> has been confirmed and logged in your spending ledger.
          </p>

          <div class="my-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-2">
            <div class="flex justify-between">
              <span class="text-slate-400">Total Billed:</span>
              <span class="font-bold font-mono text-white">$${order.total.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Customer:</span>
              <span class="text-slate-200">${order.customerName} (${order.customerEmail})</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Timestamp:</span>
              <span class="text-slate-300 font-mono">${new Date(order.date).toLocaleTimeString()}</span>
            </div>
          </div>

          <div class="flex items-center justify-center gap-3">
            <button onclick="window.auraUI.closeModal(); window.auraRouter.navigate('/orders');" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs">
              View Order History
            </button>
            <button onclick="window.auraUI.closeModal(); window.auraRouter.navigate('/');" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700">
              Continue Shopping
            </button>
          </div>
        </div>
      `;

      window.auraUI.openModal(modalContent);
      this.render();

    } catch (err) {
      window.auraUI.showToast(err.message, "error", 6000);
    }
  }
};

window.CartView = CartView;
