/**
 * Aura Commerce - Customer Orders & Spending Ledger View
 * URL: #/orders
 */

const OrdersView = {
  render() {
    const appMain = document.getElementById('app-main');
    if (!appMain) return;

    const customer = window.auraStore.getCurrentCustomer();
    const customerId = customer ? customer.id : null;
    const orders = window.auraStore.getCustomerOrders(customerId);
    const limit = window.auraStore.getCustomerLimit(customerId);

    const limitStart = new Date(limit.startDate);
    const limitEnd = new Date(limit.endDate);

    appMain.innerHTML = `
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-mono font-semibold text-indigo-400">Transaction History</span>
              <span class="text-xs font-mono text-slate-400">URL: #/orders</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight">Order History & Ledger</h1>
            <p class="text-xs text-slate-400 mt-1">
              View your completed orders and see how each purchase impacts your active Spending Limit.
            </p>
          </div>

          <a href="#/limit" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 self-start sm:self-auto transition-all">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Check Active Limit ($${limit.amount.toFixed(0)})</span>
          </a>
        </div>

        ${orders.length === 0 ? `
          <div class="text-center py-20 glass-panel rounded-3xl p-8 max-w-md mx-auto mt-8">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <h3 class="text-lg font-bold text-white">No Orders Placed Yet</h3>
            <p class="text-xs text-slate-400 mt-1">Start shopping from our curated catalog.</p>
            <a href="#/" class="inline-block mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg">
              Browse Products
            </a>
          </div>
        ` : `
          <div class="space-y-4 mt-8">
            ${orders.map(order => {
              const orderDate = new Date(order.date);
              const countsTowardLimit = orderDate >= limitStart && orderDate <= limitEnd;

              return `
                <div class="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl hover:border-slate-700/60 transition-all">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-bold font-mono text-white">${order.id}</span>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ${order.status || 'Confirmed'}
                        </span>
                        ${countsTowardLimit ? `
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            🛡️ Applied to Active Limit
                          </span>
                        ` : ''}
                      </div>
                      <span class="text-xs text-slate-400 mt-1 block">
                        Placed on ${orderDate.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div class="text-left sm:text-right">
                      <span class="text-xs text-slate-400 block">Total Amount</span>
                      <span class="text-lg font-bold font-mono text-indigo-300">$${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <!-- Order Items List -->
                  <div class="pt-4 divide-y divide-white/5">
                    ${(order.items || []).map(item => `
                      <div class="py-2.5 flex items-center justify-between text-xs">
                        <div class="flex items-center gap-3">
                          <span class="w-6 h-6 rounded-md bg-slate-800 text-slate-300 font-mono font-bold flex items-center justify-center text-[11px]">
                            ${item.quantity}x
                          </span>
                          <span class="font-medium text-slate-200">${item.name}</span>
                        </div>
                        <span class="font-mono text-slate-400">$${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}

      </div>
    `;
  }
};

window.OrdersView = OrdersView;
