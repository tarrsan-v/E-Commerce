/**
 * Aura Commerce - Spending Limit Management View
 * Allows customers to set and modify customizable spending limits ($ amount)
 * across durations (1 Day, 2 Days, 1 Week, 2 Weeks, up to 1 Month).
 * URL: #/limit
 */

const LimitView = {
  selectedDurationDays: 7,
  selectedDurationLabel: '1 Week',

  render() {
    const appMain = document.getElementById('app-main');
    if (!appMain) return;

    const customer = window.auraStore.getCurrentCustomer();
    const customerId = customer ? customer.id : null;
    const currentLimit = window.auraStore.getCustomerLimit(customerId);
    const cartSubtotal = window.auraStore.getCartSubtotal();
    const limitStatus = window.auraStore.checkSpendingLimit(cartSubtotal);

    const currentSpent = limitStatus.currentSpent;
    const totalProjected = limitStatus.newTotal;
    const limitAmount = currentLimit.amount;
    const percentUsed = Math.min(100, Math.round((currentSpent / limitAmount) * 100));

    // Preset durations
    const durationOptions = [
      { days: 1, label: '1 Day', desc: '24-hour impulse control' },
      { days: 2, label: '2 Days', desc: 'Weekend shopping budget' },
      { days: 7, label: '1 Week', desc: 'Weekly curated allowance' },
      { days: 14, label: '2 Weeks', desc: 'Bi-weekly paycheck cycle' },
      { days: 30, label: '1 Month', desc: 'Monthly maximum cap' }
    ];

    this.selectedDurationDays = currentLimit.durationDays || 7;
    this.selectedDurationLabel = currentLimit.durationLabel || '1 Week';

    appMain.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Financial Mindfulness
              </span>
              <span class="text-xs font-mono text-slate-400">URL: #/limit</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight">Spending Limit Control</h1>
            <p class="text-sm text-slate-400 mt-1 max-w-xl">
              Set an unbreachable shopping budget for a chosen time horizon. When active, you will be protected from placing orders exceeding your limit.
            </p>
          </div>

          <!-- Quick Status Badge -->
          <div class="glass-panel p-4 rounded-2xl flex items-center gap-4 border ${limitStatus.exceeded ? 'border-rose-500/60 bg-rose-950/40 glow-rose' : 'border-emerald-500/30 bg-emerald-950/20'}">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${limitStatus.exceeded ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div>
              <span class="text-xs text-slate-400 block">Protection Status</span>
              <span class="text-base font-bold ${limitStatus.exceeded ? 'text-rose-300' : 'text-emerald-300'}">
                ${limitStatus.exceeded ? 'LIMIT EXCEEDED' : 'ACTIVE & PROTECTED'}
              </span>
              <span class="text-[11px] text-slate-400 block">${limitStatus.daysLeft}d ${limitStatus.hoursLeft}h remaining</span>
            </div>
          </div>
        </div>

        <!-- Main Grid: Live Meter vs Limit Configuration Form -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">

          <!-- Left Column: Visual Meter & Active Cycle Breakdown (5 Cols) -->
          <div class="lg:col-span-5 space-y-6">
            
            <!-- Real-time Meter Card -->
            <div class="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
              <h3 class="text-base font-bold text-white mb-4 flex items-center justify-between">
                <span>Active Cycle Usage</span>
                <span class="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">${currentLimit.durationLabel}</span>
              </h3>

              <!-- Usage Progress Bar -->
              <div class="space-y-2 my-4">
                <div class="flex items-baseline justify-between text-xs">
                  <span class="text-slate-400">Total Spent in Window:</span>
                  <span class="font-mono font-bold text-white text-base">$${currentSpent.toFixed(2)}</span>
                </div>

                <div class="w-full h-4 rounded-full bg-slate-800 overflow-hidden border border-white/10 p-0.5">
                  <div 
                    class="h-full rounded-full transition-all duration-700 ${
                      limitStatus.exceeded 
                        ? 'bg-rose-500 shadow-lg shadow-rose-500/50' 
                        : percentUsed >= 80 
                        ? 'bg-amber-400 shadow-lg shadow-amber-400/50' 
                        : 'bg-emerald-400 shadow-lg shadow-emerald-400/50'
                    }"
                    style="width: ${Math.min(100, (currentSpent / limitAmount) * 100)}%"
                  ></div>
                </div>

                <div class="flex items-center justify-between text-xs text-slate-400">
                  <span>$0.00</span>
                  <span class="font-mono font-semibold text-slate-300">${Math.round((currentSpent / limitAmount) * 100)}% Consumed</span>
                  <span class="font-mono font-bold text-indigo-300">$${limitAmount.toFixed(2)} Max</span>
                </div>
              </div>

              <!-- Cart Projection Section -->
              ${cartSubtotal > 0 ? `
                <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 my-4 text-xs space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">Current Items in Cart:</span>
                    <span class="font-mono font-semibold text-indigo-300">+$${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div class="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span class="font-medium text-slate-300">Projected Total with Cart:</span>
                    <span class="font-mono font-bold ${totalProjected > limitAmount ? 'text-rose-400 text-sm' : 'text-emerald-400 text-sm'}">
                      $${totalProjected.toFixed(2)}
                    </span>
                  </div>
                  ${totalProjected > limitAmount ? `
                    <p class="text-[11px] text-rose-300 bg-rose-950/60 p-2 rounded-lg border border-rose-800/40">
                      ⚠️ If you checkout now, you will exceed your limit by <strong>$${(totalProjected - limitAmount).toFixed(2)}</strong>. Please increase your limit or remove cart items.
                    </p>
                  ` : `
                    <p class="text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
                      ✓ Your cart total fits comfortably within your active spending limit!
                    </p>
                  `}
                </div>
              ` : ''}

              <!-- Time Horizon Details -->
              <div class="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div class="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <span class="text-slate-400 block text-[11px]">Cycle Started</span>
                  <span class="text-white font-mono font-semibold mt-0.5 block">
                    ${new Date(currentLimit.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div class="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <span class="text-slate-400 block text-[11px]">Cycle Ends</span>
                  <span class="text-white font-mono font-semibold mt-0.5 block">
                    ${new Date(currentLimit.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

            </div>

            <!-- Spending Ledger for this Window -->
            <div class="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl">
              <h3 class="text-sm font-bold text-white mb-3 flex items-center justify-between">
                <span>Orders Applied to Active Window</span>
                <span class="text-xs text-slate-400 font-mono">Counted Spend</span>
              </h3>

              <div id="limit-order-history" class="space-y-2.5">
                ${this.renderActivePeriodOrders(customerId, currentLimit)}
              </div>
            </div>

          </div>

          <!-- Right Column: Set & Modify Limit Form (7 Cols) -->
          <div class="lg:col-span-7">
            <div class="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative">
              
              <div class="mb-6">
                <h2 class="text-xl font-bold text-white tracking-tight">Set or Modify Spending Limit</h2>
                <p class="text-xs text-slate-400 mt-1">
                  Adjust the maximum dollar limit you allow yourself to spend, and specify the duration (1 day to 1 month).
                </p>
              </div>

              <form id="limit-config-form" onsubmit="LimitView.handleSaveLimit(event)" class="space-y-6">
                
                <!-- 1. Limit Dollar Amount -->
                <div>
                  <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    1. Maximum Spending Cap Amount ($ USD)
                  </label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-xl font-bold text-indigo-400 pointer-events-none">$</span>
                    <input 
                      type="number" 
                      id="limit-amount-input" 
                      min="10" 
                      max="10000" 
                      step="5"
                      value="${currentLimit.amount}"
                      required 
                      class="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono text-xl font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <!-- Quick Amount Preset Buttons -->
                  <div class="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1">
                    <span class="text-xs text-slate-400 shrink-0">Presets:</span>
                    ${[100, 200, 350, 500, 800].map(val => `
                      <button 
                        type="button" 
                        onclick="document.getElementById('limit-amount-input').value = ${val}" 
                        class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-medium text-slate-200 border border-slate-700"
                      >
                        $${val}
                      </button>
                    `).join('')}
                  </div>
                </div>

                <!-- 2. Duration Selector (1 Day, 2 Days, 1 Week, up to 1 Month) -->
                <div>
                  <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    2. Select Duration (1 Day up to 1 Month)
                  </label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" id="duration-selector-cards">
                    ${durationOptions.map(opt => `
                      <div 
                        onclick="LimitView.selectDuration(${opt.days}, '${opt.label}')"
                        id="duration-card-${opt.days}"
                        class="p-4 rounded-2xl border cursor-pointer transition-all ${
                          this.selectedDurationDays === opt.days 
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }"
                      >
                        <div class="flex items-center justify-between">
                          <span class="font-bold text-sm">${opt.label}</span>
                          <span class="w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            this.selectedDurationDays === opt.days ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'
                          }">
                            ${this.selectedDurationDays === opt.days ? '<span class="w-1.5 h-1.5 rounded-full bg-white"></span>' : ''}
                          </span>
                        </div>
                        <p class="text-[11px] text-slate-400 mt-1">${opt.desc}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- 3. Behavioral Protection Toggle -->
                <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 class="text-xs font-bold text-white">Strict Checkout Block</h4>
                    <p class="text-[11px] text-slate-400">Prevent checkout whenever cart items exceed the active budget limit.</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="limit-toggle-strict" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <!-- Save Action Button -->
                <div class="pt-4 flex items-center gap-3">
                  <button 
                    type="submit" 
                    class="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span>Save & Update Spending Limit</span>
                  </button>
                  <button 
                    type="button" 
                    onclick="LimitView.resetPeriod()" 
                    class="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all"
                  >
                    Reset Period
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>
    `;
  },

  selectDuration(days, label) {
    this.selectedDurationDays = days;
    this.selectedDurationLabel = label;
    this.render();
  },

  renderActivePeriodOrders(customerId, limit) {
    const orders = window.auraStore.getCustomerOrders(customerId);
    const startDate = new Date(limit.startDate);
    const endDate = new Date(limit.endDate);

    const activeOrders = orders.filter(o => {
      const d = new Date(o.date);
      return d >= startDate && d <= endDate;
    });

    if (activeOrders.length === 0) {
      return `
        <div class="text-center py-6 text-slate-500 text-xs">
          No purchases placed yet in this active window. Your full limit ($${limit.amount.toFixed(2)}) is completely untouched!
        </div>
      `;
    }

    return activeOrders.map(order => `
      <div class="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
        <div>
          <span class="font-bold text-white block">${order.id}</span>
          <span class="text-[11px] text-slate-400">
            ${new Date(order.date).toLocaleDateString()} - ${order.items ? order.items.length : 1} items
          </span>
        </div>
        <span class="font-mono font-bold text-rose-400">-$${order.total.toFixed(2)}</span>
      </div>
    `).join('');
  },

  handleSaveLimit(e) {
    e.preventDefault();
    const amountVal = document.getElementById('limit-amount-input').value;
    const amount = parseFloat(amountVal);

    if (isNaN(amount) || amount <= 0) {
      window.auraUI.showToast("Please enter a valid limit amount greater than $0.", "warning");
      return;
    }

    const customer = window.auraStore.getCurrentCustomer();
    const customerId = customer ? customer.id : null;

    window.auraStore.setCustomerLimit(customerId, amount, this.selectedDurationDays, this.selectedDurationLabel);
    window.auraUI.showToast(`Spending Limit updated to $${amount.toFixed(2)} for ${this.selectedDurationLabel}!`, "success");
    
    // Re-render view to reflect updated stats
    this.render();
  },

  resetPeriod() {
    const customer = window.auraStore.getCurrentCustomer();
    const customerId = customer ? customer.id : null;
    const current = window.auraStore.getCustomerLimit(customerId);

    window.auraStore.setCustomerLimit(customerId, current.amount, current.durationDays, current.durationLabel);
    window.auraUI.showToast("Spending cycle period refreshed for another full duration.", "info");
    this.render();
  }
};

window.LimitView = LimitView;
