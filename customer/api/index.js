// Vercel serverless function: POST /api  { action, ... }
// Data lives in Redis (Upstash) so admin and customer deployments share it.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const AE = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const AP = process.env.ADMIN_PASSWORD || 'password';

const cmd = async (a) =>
  (await (await fetch(URL_, { method: 'POST', headers: { Authorization: 'Bearer ' + TOKEN }, body: JSON.stringify(a) })).json()).result;

const seed = () => ({
  products: [
    { id: 1, name: 'Wireless Earbuds', price: 1999, stock: 20, emoji: '🎧', cat: 'Electronics' },
    { id: 2, name: 'Running Shoes', price: 2499, stock: 15, emoji: '👟', cat: 'Fashion' },
    { id: 3, name: 'Coffee Mug', price: 299, stock: 50, emoji: '☕', cat: 'Home' },
    { id: 4, name: 'Backpack', price: 1299, stock: 12, emoji: '🎒', cat: 'Fashion' },
    { id: 5, name: 'Desk Lamp', price: 899, stock: 8, emoji: '💡', cat: 'Home' },
    { id: 6, name: 'Smart Watch', price: 3999, stock: 5, emoji: '⌚', cat: 'Electronics' },
  ],
  users: [], orders: [], nid: 7,
});
const load = async () => { const r = await cmd(['GET', 'se_db']); return r ? JSON.parse(r) : seed(); };
const save = (d) => cmd(['SET', 'se_db', JSON.stringify(d)]);

// start of current day/week/month in the customer's timezone (off = getTimezoneOffset minutes)
function pstart(per, off) {
  const d = new Date(Date.now() - off * 60000);
  d.setUTCHours(0, 0, 0, 0);
  if (per === 'week') d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  if (per === 'month') d.setUTCDate(1);
  return d.getTime() + off * 60000;
}

module.exports = async (req, res) => {
  try {
    if (!URL_ || !TOKEN) return res.status(500).json({ error: 'Redis env vars missing' });
    const b = req.body || {}, a = String(b.action || '');
    const d = await load();
    const out = (x) => res.status(200).json(x);
    const isAdmin = b.email === AE && b.password === AP;
    const user = d.users.find((u) => u.phone === b.phone);
    const spent = (u) => u.limit
      ? d.orders.filter((o) => o.phone === u.phone && o.ts >= pstart(u.limit.per, b.off || 0)).reduce((s, o) => s + o.total, 0)
      : 0;

    if (a === 'products') return out({ products: d.products });

    // ---- admin ----
    if (a === 'adminLogin') return out(isAdmin ? { ok: 1 } : { error: 'Invalid admin credentials' });
    if (a.startsWith('admin') && !isAdmin) return out({ error: 'Unauthorized' });
    if (a === 'adminData') return out({ products: d.products, users: d.users.length, orders: d.orders.length });
    if (a === 'adminSave') {
      const i = b.item || {};
      const o = { name: String(i.name || '').slice(0, 60), cat: String(i.cat || 'General').slice(0, 30),
        price: Math.max(0, +i.price || 0), stock: Math.max(0, +i.stock || 0), emoji: String(i.emoji || '📦').slice(0, 4) };
      if (!o.name) return out({ error: 'Name required' });
      const ex = i.id && d.products.find((x) => x.id === i.id);
      if (ex) Object.assign(ex, o); else d.products.push({ id: d.nid++, ...o });
      await save(d); return out({ products: d.products });
    }
    if (a === 'adminDelete') { d.products = d.products.filter((x) => x.id !== b.id); await save(d); return out({ products: d.products }); }

    // ---- customer ----
    if (a === 'userGet') return out(user ? { user, spent: spent(user) } : {});
    if (a === 'userCreate') {
      if (!/^\d{10}$/.test(b.phone || '') || !b.name) return out({ error: 'Invalid details' });
      if (user) return out({ error: 'Account exists' });
      const u = { phone: b.phone, name: String(b.name).slice(0, 60), email: '', address: '', limit: null };
      d.users.push(u); await save(d); return out({ user: u, spent: 0 });
    }
    if (!user) return out({ error: 'Not logged in' });
    if (a === 'userUpdate') {
      for (const k of ['name', 'email', 'address']) if (typeof b[k] === 'string' && (k !== 'name' || b[k].trim())) user[k] = b[k].slice(0, 120);
      const l = b.limit;
      if (l && +l.amt > 0 && ['day', 'week', 'month'].includes(l.per)) user.limit = { per: l.per, amt: +l.amt };
      await save(d); return out({ user, spent: spent(user) });
    }
    if (a === 'orders') return out({ orders: d.orders.filter((o) => o.phone === user.phone).reverse() });
    if (a === 'checkout') {
      const items = [];
      let total = 0;
      for (const [id, n] of Object.entries(b.cart || {})) {
        const p = d.products.find((x) => x.id == id), q = Math.floor(+n);
        if (!p || q < 1) continue;
        if (p.stock < q) return out({ error: 'Not enough stock for ' + p.name });
        items.push([p, q]); total += p.price * q;
      }
      if (!items.length) return out({ error: 'Cart is empty' });
      if (user.limit) {
        const rem = user.limit.amt - spent(user);
        if (rem <= 0) return out({ error: 'Wallet limit reached. Modify your limit to continue.' });
        if (total > rem) return out({ error: 'Order ₹' + total + ' exceeds remaining limit ₹' + rem + '. Modify your limit.' });
      }
      items.forEach(([p, q]) => (p.stock -= q));
      d.orders.push({ phone: user.phone, ts: Date.now(), items: items.map(([p, q]) => p.name + ' ×' + q).join(', '), total });
      await save(d); return out({ ok: 1, user, spent: spent(user) });
    }
    return out({ error: 'Unknown action' });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
};
