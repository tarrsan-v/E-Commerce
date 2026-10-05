/**
 * Aura Commerce - State Store & Data Management
 * Handles Products, Users, Authentication, Cart, Orders, and the Spending Limit Engine.
 */

const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Aura Stealth ANC Wireless Headphones",
    tagline: "Ultra-low distortion studio sound with 40-hour battery life",
    category: "Electronics",
    price: 249.00,
    originalPrice: 299.00,
    stock: 14,
    rating: 4.9,
    reviewsCount: 128,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    badge: "Best Seller",
    featured: true,
    description: "Crafted for audiophiles and modern commuters. Features custom 45mm neodymium drivers, active noise cancellation with transparency mode, memory foam earcups, and multipoint Bluetooth 5.3 pairing."
  },
  {
    id: "prod-2",
    name: "Chronos Minimalist Sapphire Watch",
    tagline: "Swiss quartz movement with scratch-proof sapphire crystal",
    category: "Accessories",
    price: 185.00,
    originalPrice: 220.00,
    stock: 8,
    rating: 4.8,
    reviewsCount: 94,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    badge: "Trending",
    featured: true,
    description: "Sleek 38mm brushed aerospace stainless steel casing paired with an Italian vegetable-tanned leather strap. Water-resistant up to 50 meters."
  },
  {
    id: "prod-3",
    name: "Nomad All-Weather Roll-Top Backpack",
    tagline: "Waterproof Cordura fabric with magnetic Fidlock closures",
    category: "Fashion",
    price: 129.00,
    originalPrice: 159.00,
    stock: 19,
    rating: 4.7,
    reviewsCount: 81,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    badge: "Eco-Friendly",
    featured: true,
    description: "Engineered for everyday urban carry and weekend getaways. Features a padded 16-inch laptop compartment, hidden passport pocket, and breathable ergonomic shoulder harness."
  },
  {
    id: "prod-4",
    name: "Nordic Matte Ceramic Pour-Over Brewer",
    tagline: "Handcrafted stoneware designed for optimal coffee extraction",
    category: "Home & Living",
    price: 58.00,
    originalPrice: 72.00,
    stock: 22,
    rating: 4.9,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    badge: "Artisan Pick",
    featured: false,
    description: "Minimal Scandinavian design with interior spiral ribs to ensure even water flow and rich bloom. Comes with a matching heat-resistant bamboo coaster."
  },
  {
    id: "prod-5",
    name: "Kinesis Pro Ergonomic Mechanical Keyboard",
    tagline: "Hot-swappable tactile switches with wireless 2.4GHz & BT",
    category: "Electronics",
    price: 169.00,
    originalPrice: 199.00,
    stock: 6,
    rating: 4.9,
    reviewsCount: 210,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    badge: "Low Stock",
    featured: true,
    description: "Custom CNC anodized aluminum frame with factory-lubed switches, sound-dampening silicone pads, per-key RGB backlighting, and programmable rotary knob."
  },
  {
    id: "prod-6",
    name: "Loom & Warp Heavyweight Merino Hoodie",
    tagline: "100% superfine Australian merino wool thermoregulating fleece",
    category: "Fashion",
    price: 110.00,
    originalPrice: 140.00,
    stock: 12,
    rating: 4.8,
    reviewsCount: 67,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    badge: "Premium Wool",
    featured: false,
    description: "Naturally moisture-wicking and odor-resistant. Tailored modern fit with double-lined hood and concealed YKK zipper pockets."
  },
  {
    id: "prod-7",
    name: "Lumina Smart Touch Ambience Desk Lamp",
    tagline: "Biorhythmic circadian lighting with seamless Qi charging base",
    category: "Home & Living",
    price: 89.00,
    originalPrice: 115.00,
    stock: 15,
    rating: 4.6,
    reviewsCount: 53,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    badge: "Smart Home",
    featured: false,
    description: "Adjust temperature smoothly from 2200K warm candlelight to 6500K crisp daylight. Built-in 15W fast wireless charger base for smartphones and earbuds."
  },
  {
    id: "prod-8",
    name: "Solstice Polarized Titanium Aviator Sunglasses",
    tagline: "Grade 5 ultralight titanium with anti-glare hydrophobic coating",
    category: "Accessories",
    price: 98.00,
    originalPrice: 130.00,
    stock: 25,
    rating: 4.7,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    badge: "UV400 Protected",
    featured: false,
    description: "Weighing only 18 grams, offering 100% UV protection and high-contrast polarization for crystal clear road and water visibility."
  },
  {
    id: "prod-9",
    name: "Damascus 8-inch Precision Santoku Chef Knife",
    tagline: "67 layers of folded Japanese VG-10 steel with G10 ergonomic handle",
    category: "Home & Living",
    price: 145.00,
    originalPrice: 180.00,
    stock: 9,
    rating: 5.0,
    reviewsCount: 119,
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&auto=format&fit=crop&q=80",
    badge: "Master Crafted",
    featured: true,
    description: "Razor sharp 12-degree edge retention. Hand-polished spine and bolster provide optimal balance for slicing, dicing, and mincing."
  },
  {
    id: "prod-10",
    name: "Strata Slim Magnetic MagSafe Card Wallet",
    tagline: "Top-grain Horween leather with shielding RFID protection",
    category: "Accessories",
    price: 45.00,
    originalPrice: 55.00,
    stock: 30,
    rating: 4.8,
    reviewsCount: 162,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
    badge: "Popular",
    featured: false,
    description: "Holds up to 4 credit cards and folded bills with strong neodymium magnets that snap securely to MagSafe compatible smartphones."
  }
];

class Store {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    // 1. Products
    if (!localStorage.getItem('aura_products')) {
      localStorage.setItem('aura_products', JSON.stringify(DEFAULT_PRODUCTS));
    }

    // 2. Admin User (Preconfigured)
    if (!localStorage.getItem('aura_admin_account')) {
      const defaultAdmin = {
        id: "admin-1",
        name: "Aura Store Administrator",
        email: "admin@aura.store",
        password: "admin", // Demo password
        role: "admin"
      };
      localStorage.setItem('aura_admin_account', JSON.stringify(defaultAdmin));
    }

    // 3. Customers List
    if (!localStorage.getItem('aura_customers')) {
      const defaultCustomers = [
        {
          id: "cust-1",
          name: "Alex Morgan",
          email: "alex@example.com",
          phone: "+1 555-0192",
          password: "password123",
          role: "customer",
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('aura_customers', JSON.stringify(defaultCustomers));
    }

    // 4. Cart
    if (!localStorage.getItem('aura_cart')) {
      localStorage.setItem('aura_cart', JSON.stringify([]));
    }

    // 5. Orders
    if (!localStorage.getItem('aura_orders')) {
      // Seed one past order to show limit history
      const initialOrders = [
        {
          id: "ORD-94021",
          customerId: "cust-1",
          items: [
            { id: "prod-10", name: "Strata Slim Magnetic MagSafe Card Wallet", price: 45.00, quantity: 1 }
          ],
          total: 45.00,
          date: new Date(Date.now() - 3600000 * 6).toISOString() // 6 hours ago
        }
      ];
      localStorage.setItem('aura_orders', JSON.stringify(initialOrders));
    }

    // 6. Default Spending Limit for Demo Customer
    if (!localStorage.getItem('aura_limit_cust-1')) {
      const defaultLimit = {
        amount: 250.00,
        durationDays: 7,
        durationLabel: "1 Week",
        startDate: new Date(Date.now() - 3600000 * 24).toISOString(), // started 1 day ago
        endDate: new Date(Date.now() + 3600000 * 24 * 6).toISOString(),
        enabled: true
      };
      localStorage.setItem('aura_limit_cust-1', JSON.stringify(defaultLimit));
    }

    // Active sessions: check aura_current_customer, aura_current_admin
  }

  // --- PRODUCTS CRUD (Admin & Storefront) ---

  getProducts() {
    try {
      return JSON.parse(localStorage.getItem('aura_products')) || DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  }

  addProduct(productData) {
    const products = this.getProducts();
    const newProduct = {
      id: "prod-" + Date.now(),
      name: productData.name.trim(),
      tagline: productData.tagline?.trim() || "",
      category: productData.category || "General",
      price: parseFloat(productData.price) || 0,
      originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
      stock: parseInt(productData.stock, 10) || 0,
      rating: 5.0,
      reviewsCount: 1,
      image: productData.image?.trim() || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
      badge: productData.badge?.trim() || "New Arrival",
      featured: !!productData.featured,
      description: productData.description?.trim() || "High quality lifestyle product."
    };

    products.unshift(newProduct);
    localStorage.setItem('aura_products', JSON.stringify(products));
    this.emitChange('products');
    return newProduct;
  }

  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updatedFields,
      price: parseFloat(updatedFields.price) || products[index].price,
      originalPrice: updatedFields.originalPrice ? parseFloat(updatedFields.originalPrice) : products[index].originalPrice,
      stock: parseInt(updatedFields.stock, 10) >= 0 ? parseInt(updatedFields.stock, 10) : products[index].stock
    };

    localStorage.setItem('aura_products', JSON.stringify(products));
    this.emitChange('products');
    return products[index];
  }

  deleteProduct(id) {
    let products = this.getProducts();
    const deleted = products.find(p => p.id === id);
    products = products.filter(p => p.id !== id);
    localStorage.setItem('aura_products', JSON.stringify(products));

    // Also remove from cart if present
    this.removeFromCart(id);
    this.emitChange('products');
    return deleted;
  }

  resetDefaultProducts() {
    localStorage.setItem('aura_products', JSON.stringify(DEFAULT_PRODUCTS));
    this.emitChange('products');
    return DEFAULT_PRODUCTS;
  }

  // --- CUSTOMER & ADMIN AUTHENTICATION ---

  getCurrentCustomer() {
    try {
      return JSON.parse(localStorage.getItem('aura_current_customer')) || null;
    } catch {
      return null;
    }
  }

  setCurrentCustomer(customer) {
    if (customer) {
      localStorage.setItem('aura_current_customer', JSON.stringify(customer));
    } else {
      localStorage.removeItem('aura_current_customer');
    }
    this.emitChange('auth_customer');
  }

  getCurrentAdmin() {
    try {
      return JSON.parse(localStorage.getItem('aura_current_admin')) || null;
    } catch {
      return null;
    }
  }

  setCurrentAdmin(admin) {
    if (admin) {
      localStorage.setItem('aura_current_admin', JSON.stringify(admin));
    } else {
      localStorage.removeItem('aura_current_admin');
    }
    this.emitChange('auth_admin');
  }

  // Customer Login
  customerLogin(email, password) {
    const customers = JSON.parse(localStorage.getItem('aura_customers') || '[]');
    const customer = customers.find(c => c.email.toLowerCase() === email.toLowerCase().trim() && c.password === password);
    if (!customer) {
      throw new Error("Invalid email or password for customer account.");
    }
    this.setCurrentCustomer(customer);
    return customer;
  }

  // Customer Signup Stage 1: Store pending signup & generate Fake OTP
  startCustomerSignup(name, email, phone, password) {
    const customers = JSON.parse(localStorage.getItem('aura_customers') || '[]');
    if (customers.some(c => c.email.toLowerCase() === email.toLowerCase().trim())) {
      throw new Error("An account with this email already exists. Please log in.");
    }

    // Generate 6 digit fake OTP
    const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const pendingData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password,
      otp: fakeOtp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    };

    sessionStorage.setItem('aura_pending_signup', JSON.stringify(pendingData));
    return { otp: fakeOtp, phone: pendingData.phone, email: pendingData.email };
  }

  getPendingSignup() {
    try {
      return JSON.parse(sessionStorage.getItem('aura_pending_signup')) || null;
    } catch {
      return null;
    }
  }

  // Customer Signup Stage 2: Verify Fake OTP and finalize account
  verifyAndCompleteSignup(enteredOtp) {
    const pending = this.getPendingSignup();
    if (!pending) {
      throw new Error("Signup session expired or not found. Please start over.");
    }
    if (Date.now() > pending.expiresAt) {
      throw new Error("OTP has expired. Please request a new OTP.");
    }
    if (enteredOtp.trim() !== pending.otp) {
      throw new Error("Invalid OTP code. Please enter the code shown in the pop-up notification.");
    }

    // Register user
    const customers = JSON.parse(localStorage.getItem('aura_customers') || '[]');
    const newCustomer = {
      id: "cust-" + Date.now(),
      name: pending.name,
      email: pending.email,
      phone: pending.phone,
      password: pending.password,
      role: "customer",
      createdAt: new Date().toISOString()
    };

    customers.push(newCustomer);
    localStorage.setItem('aura_customers', JSON.stringify(customers));
    sessionStorage.removeItem('aura_pending_signup');

    // Automatically set an initial smart Spending Limit of $300 for 1 week for the new user!
    this.setCustomerLimit(newCustomer.id, 300, 7, "1 Week");

    this.setCurrentCustomer(newCustomer);
    return newCustomer;
  }

  // Admin Login (Dedicated URL)
  adminLogin(email, password) {
    const admin = JSON.parse(localStorage.getItem('aura_admin_account') || '{}');
    if (admin.email.toLowerCase() === email.toLowerCase().trim() && admin.password === password) {
      this.setCurrentAdmin(admin);
      return admin;
    }
    throw new Error("Invalid Admin credentials. Demo access: admin@aura.store / admin");
  }

  logoutCustomer() {
    this.setCurrentCustomer(null);
  }

  logoutAdmin() {
    this.setCurrentAdmin(null);
  }

  // --- SPENDING LIMIT ENGINE ("Limit") ---

  getCustomerLimit(customerId) {
    if (!customerId) {
      // Return guest preview limit or null
      const guestLimit = localStorage.getItem('aura_guest_limit');
      if (guestLimit) return JSON.parse(guestLimit);
      return {
        amount: 300.00,
        durationDays: 7,
        durationLabel: "1 Week",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        enabled: true
      };
    }
    const saved = localStorage.getItem(`aura_limit_${customerId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default limit if not yet set
    return {
      amount: 250.00,
      durationDays: 7,
      durationLabel: "1 Week",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      enabled: true
    };
  }

  setCustomerLimit(customerId, amount, durationDays, durationLabel) {
    const days = parseInt(durationDays, 10) || 7;
    const now = new Date();
    const endDate = new Date(now.getTime() + days * 86400000);

    const limitConfig = {
      amount: parseFloat(amount) || 100,
      durationDays: days,
      durationLabel: durationLabel || `${days} Days`,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      enabled: true
    };

    if (customerId) {
      localStorage.setItem(`aura_limit_${customerId}`, JSON.stringify(limitConfig));
    } else {
      localStorage.setItem('aura_guest_limit', JSON.stringify(limitConfig));
    }

    this.emitChange('limit');
    return limitConfig;
  }

  modifyLimitAmount(customerId, newAmount) {
    const current = this.getCustomerLimit(customerId);
    current.amount = parseFloat(newAmount) || current.amount;
    if (customerId) {
      localStorage.setItem(`aura_limit_${customerId}`, JSON.stringify(current));
    } else {
      localStorage.setItem('aura_guest_limit', JSON.stringify(current));
    }
    this.emitChange('limit');
    return current;
  }

  toggleLimitEnabled(customerId, enabled) {
    const current = this.getCustomerLimit(customerId);
    current.enabled = !!enabled;
    if (customerId) {
      localStorage.setItem(`aura_limit_${customerId}`, JSON.stringify(current));
    } else {
      localStorage.setItem('aura_guest_limit', JSON.stringify(current));
    }
    this.emitChange('limit');
    return current;
  }

  // Calculate customer spending within the active limit window
  getCustomerActiveSpend(customerId) {
    const limit = this.getCustomerLimit(customerId);
    if (!limit || !limit.enabled) return 0;

    const startDate = new Date(limit.startDate);
    const endDate = new Date(limit.endDate);
    const now = new Date();

    // Check if limit period has expired
    if (now > endDate) {
      return 0; // Fresh window or expired
    }

    const allOrders = JSON.parse(localStorage.getItem('aura_orders') || '[]');
    const userOrders = customerId 
      ? allOrders.filter(o => o.customerId === customerId)
      : allOrders.slice(0, 1);

    // Sum orders within [startDate, endDate]
    const activeSpend = userOrders.reduce((acc, order) => {
      const orderDate = new Date(order.date);
      if (orderDate >= startDate && orderDate <= endDate) {
        return acc + (order.total || 0);
      }
      return acc;
    }, 0);

    return activeSpend;
  }

  // Limit Check for Cart / Checkout
  checkSpendingLimit(additionalAmount = 0) {
    const customer = this.getCurrentCustomer();
    const limit = this.getCustomerLimit(customer ? customer.id : null);
    if (!limit || !limit.enabled) {
      return {
        enabled: false,
        exceeded: false,
        limitAmount: 0,
        currentSpent: 0,
        newTotal: additionalAmount,
        remaining: 999999,
        percent: 0,
        daysLeft: 0,
        hoursLeft: 0
      };
    }

    const currentSpent = this.getCustomerActiveSpend(customer ? customer.id : null);
    const newTotal = currentSpent + additionalAmount;
    const remaining = Math.max(0, limit.amount - newTotal);
    const overBy = Math.max(0, newTotal - limit.amount);
    const percent = Math.min(100, Math.round((newTotal / limit.amount) * 100));

    // Calculate time left in active window
    const now = new Date();
    const end = new Date(limit.endDate);
    const msLeft = Math.max(0, end - now);
    const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((msLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return {
      enabled: true,
      exceeded: newTotal > limit.amount,
      limitAmount: limit.amount,
      currentSpent: currentSpent,
      additionalAmount: additionalAmount,
      newTotal: newTotal,
      remaining: remaining,
      overBy: overBy,
      percent: percent,
      durationDays: limit.durationDays,
      durationLabel: limit.durationLabel,
      startDate: limit.startDate,
      endDate: limit.endDate,
      daysLeft: daysLeft,
      hoursLeft: hoursLeft
    };
  }

  // --- CART MANAGEMENT ---

  getCart() {
    try {
      return JSON.parse(localStorage.getItem('aura_cart')) || [];
    } catch {
      return [];
    }
  }

  addToCart(productId, quantity = 1) {
    const product = this.getProductById(productId);
    if (!product) throw new Error("Product not found.");
    if (product.stock <= 0) throw new Error("Product is out of stock.");

    let cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
      const newQty = cart[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        throw new Error(`Only ${product.stock} units available in stock.`);
      }
      cart[existingIndex].quantity = newQty;
    } else {
      if (quantity > product.stock) {
        throw new Error(`Only ${product.stock} units available in stock.`);
      }
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity
      });
    }

    localStorage.setItem('aura_cart', JSON.stringify(cart));
    this.emitChange('cart');
    return cart;
  }

  updateCartQuantity(productId, quantity) {
    let cart = this.getCart();
    const product = this.getProductById(productId);
    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }
    if (product && quantity > product.stock) {
      throw new Error(`Maximum available stock is ${product.stock}.`);
    }

    const item = cart.find(i => i.id === productId);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem('aura_cart', JSON.stringify(cart));
      this.emitChange('cart');
    }
    return cart;
  }

  removeFromCart(productId) {
    let cart = this.getCart().filter(item => item.id !== productId);
    localStorage.setItem('aura_cart', JSON.stringify(cart));
    this.emitChange('cart');
    return cart;
  }

  clearCart() {
    localStorage.setItem('aura_cart', JSON.stringify([]));
    this.emitChange('cart');
  }

  getCartSubtotal() {
    return this.getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Place Order (With strict Spending Limit validation)
  checkoutOrder() {
    const cart = this.getCart();
    if (cart.length === 0) throw new Error("Your cart is empty.");

    const subtotal = this.getCartSubtotal();
    const customer = this.getCurrentCustomer();

    // SPENDING LIMIT CHECK
    const limitStatus = this.checkSpendingLimit(subtotal);
    if (limitStatus.enabled && limitStatus.exceeded) {
      throw new Error(`Spending limit exceeded! Your current budget limit is $${limitStatus.limitAmount.toFixed(2)}. This purchase would make your total period spend $${limitStatus.newTotal.toFixed(2)} (exceeding limit by $${limitStatus.overBy.toFixed(2)}). Please adjust your limit or cart.`);
    }

    // Deduct stock
    const products = this.getProducts();
    cart.forEach(item => {
      const prod = products.find(p => p.id === item.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });
    localStorage.setItem('aura_products', JSON.stringify(products));

    // Create Order Record
    const order = {
      id: "ORD-" + Math.floor(10000 + Math.random() * 90000),
      customerId: customer ? customer.id : "guest",
      customerName: customer ? customer.name : "Guest Shopper",
      customerEmail: customer ? customer.email : "guest@aura.store",
      items: [...cart],
      total: subtotal,
      date: new Date().toISOString(),
      status: "Confirmed"
    };

    const orders = JSON.parse(localStorage.getItem('aura_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('aura_orders', JSON.stringify(orders));

    // Clear cart
    this.clearCart();
    this.emitChange('products');
    this.emitChange('orders');
    this.emitChange('limit');

    return order;
  }

  getCustomerOrders(customerId) {
    const orders = JSON.parse(localStorage.getItem('aura_orders') || '[]');
    if (!customerId) return orders;
    return orders.filter(o => o.customerId === customerId);
  }

  // --- EVENT LISTENER SUBSCRIPTION ---

  subscribe(callback) {
    if (!this.subscribers) this.subscribers = [];
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  emitChange(event) {
    if (this.subscribers) {
      this.subscribers.forEach(cb => {
        try { cb(event); } catch (e) { console.error("Subscriber error:", e); }
      });
    }
  }
}

// Global Store Instance
window.auraStore = new Store();
