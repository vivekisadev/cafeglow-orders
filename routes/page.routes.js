const express = require('express');
const router = express.Router();

// Try to require the product model, fall back if missing
let productModel = null;
try {
  // If your models folder exists, this will work. Otherwise we fall back to sample data
  productModel = require('../models/products.model.js');
} catch (e) {
  console.warn('products.model.js not found; using in-memory sample items for /menu');
}

// Helper to get items (DB if available, else sample)
async function getAvailableItems() {
  if (productModel && typeof productModel.find === 'function') {
    try {
      const items = await productModel.find({ availability: true }).lean();
      return Array.isArray(items) ? items : [];
    } catch (err) {
      console.warn('Error querying products, falling back to sample items:', err.message);
    }
  }
  // Sample items fallback
  return [
    { _id: '1', name: 'Espresso', price: 120, description: 'Strong and rich shot of coffee', availability: true },
    { _id: '2', name: 'Cappuccino', price: 180, description: 'Espresso with steamed milk foam', availability: true },
    { _id: '3', name: 'Iced Latte', price: 200, description: 'Chilled milk and espresso over ice', availability: true },
  ];
}

// Root page - simple link to menu
router.get('/', async (req, res) => {
  res.send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>CafeGlow</title>
    <style>
      :root { color-scheme: dark; }
      body { font-family: system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif; margin:0; padding:2rem; background:#0f1115; color:#e5e7eb; }
      .card { max-width:720px; margin:3rem auto; background:#1c1f26; border:1px solid #2a2f3a; border-radius:16px; padding:24px; }
      .btn { display:inline-block; padding:10px 16px; border-radius:10px; background:#ff6b00; color:white; text-decoration:none; margin-right:8px; }
      .muted { color:#9aa4b2; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>✅ CafeGlow is running</h1>
      <p class="muted">Use the button below to open the menu. You can include a table param like <code>?table=1</code>.</p>
      <p>
        <a class="btn" href="/menu?table=1">View Menu (Table 1)</a>
      </p>
    </div>
  </body>
</html>`);
});

// Customer menu page
router.get('/menu', async (req, res) => {
  try {
    const items = await getAvailableItems();
    const tableNum = String(req.query.table || '1');

    // Minimal HTML rendering (no EJS dependency)
    const itemsHtml = items.map(i => `
      <div class="card" data-id="${i._id}">
        <div>
          <h3 class="title">${i.name}</h3>
          <p class="price">₹${(Number(i.price) || 0).toFixed(2)}</p>
          ${i.description ? `<p class="desc">${i.description}</p>` : ''}
        </div>
        <button class="btn">Add</button>
      </div>
    `).join('');

    res.send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Table ${tableNum} Menu</title>
    <style>
      :root { --primary:#ff6b00; --primary-dark:#e55d00; --bg:#121212; --card:#1c110a; --text:#e5c07b; color-scheme: dark; }
      body { background: var(--bg); color: var(--text); font-family: system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif; margin:0; padding:16px; }
      .container { max-width: 960px; margin: 0 auto; }
      header { display:flex; align-items:center; justify-content:space-between; margin-bottom: 16px; }
      .btn { background: var(--primary); color: white; padding: 8px 12px; border-radius: 8px; border:0; }
      .btn:hover { background: var(--primary-dark); }
      .grid { display:grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap: 12px; }
      .card { background: var(--card); border:1px solid #3a2b1a; border-radius: 8px; padding: 12px; display:flex; align-items:center; justify-content:space-between; }
      .title { margin:0 0 4px 0; font-size: 16px; }
      .price { margin:0 0 4px 0; color:#ffd38a; }
      .desc { margin:0; color:#b3a48a; font-size: 12px; }
      .badge { background:#3a2b1a; padding:4px 8px; border-radius:8px; color:#ffd38a; font-size:12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <h1>Table <span class="badge">${tableNum}</span> Menu</h1>
        <button class="btn" id="cartBtn">Cart <span id="cartCount" class="badge">0</span></button>
      </header>
      <section class="grid">${itemsHtml}</section>
    </div>
  </body>
</html>`);
  } catch (error) {
    console.error('Error loading menu:', error);
    res.status(500).send('Error loading menu');
  }
});

// Add admin dashboard page - minimal standalone page that wires up the existing dashboard.js
router.get('/admin/dashboard', async (_req, res) => {
  res.send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Admin Dashboard - CafeGlow</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style>
      :root { color-scheme: dark; }
      body { font-family: system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif; margin:0; background:#0f1115; color:#e5e7eb; }
      .layout { display:grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
      .sidebar { background:#1c1f26; border-right:1px solid #2a2f3a; padding:16px; }
      .sidebar h2 { margin:0 0 16px 0; font-size: 18px; color:#ff6b00; }
      .sidebar a { display:block; padding:10px 12px; margin-bottom:8px; border-radius:10px; color:#e5e7eb; text-decoration:none; border:1px solid #2a2f3a; }
      .sidebar a.active, .sidebar a:hover { background:#2a2f3a; border-color:#3a4452; }
      .content { padding:16px; }
    </style>
  </head>
  <body>
    <div class="layout">
      <aside class="sidebar">
        <h2>CafeGlow Admin</h2>
        <a href="/admin/dashboard" class="sidebar-button active" data-action="dashboard">Dashboard</a>
        <!-- Keep only Dashboard to avoid calling missing APIs; others can be added later -->
      </aside>
      <main class="content">
        <div id="dashboard-content">
          <!-- Will be filled by /api/dashboard/content via dashboard.js -->
        </div>
      </main>
    </div>
    <script src="/javascript/dashboard.js"></script>
  </body>
</html>`);
});

// Minimal dashboard content endpoint used by public/javascript/dashboard.js
router.get('/api/dashboard/content', async (_req, res) => {
  // Send a lightweight dashboard home so the UI can render without other APIs
  res.send(`
    <div class="p-6">
      <div class="flex items-center mb-6">
        <div class="bg-[#ff6b00] bg-opacity-20 p-3 rounded-full mr-4">
          <i class="fas fa-tachometer-alt text-[#ff6b00] text-2xl"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold" style="color:#e5c07b">Welcome to CafeGlow</h1>
          <p class="text-gray-400 mt-1">Your admin dashboard is ready.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-[#1c110a] rounded-xl p-6 border border-[#3a2b1a]">
          <p class="text-[#e5c07b] text-sm font-medium">Today's Orders</p>
          <p class="text-3xl font-bold text-white mt-2">0</p>
          <p class="text-gray-400 text-sm mt-1">No data yet</p>
        </div>
        <div class="bg-[#1c110a] rounded-xl p-6 border border-[#3a2b1a]">
          <p class="text-[#e5c07b] text-sm font-medium">Revenue</p>
          <p class="text-3xl font-bold text-white mt-2">₹0</p>
          <p class="text-gray-400 text-sm mt-1">No data yet</p>
        </div>
        <div class="bg-[#1c110a] rounded-xl p-6 border border-[#3a2b1a]">
          <p class="text-[#e5c07b] text-sm font-medium">Popular Items</p>
          <p class="text-3xl font-bold text-white mt-2">—</p>
          <p class="text-gray-400 text-sm mt-1">No data yet</p>
        </div>
      </div>

      <div class="mt-8 bg-[#1c110a] rounded-xl p-6 border border-[#3a2b1a]">
        <h2 class="text-xl font-semibold mb-2" style="color:#e5c07b">Getting Started</h2>
        <ul class="list-disc pl-5 text-gray-300">
          <li>This is a minimal dashboard page wired to the existing script.</li>
          <li>We'll add product and order endpoints next.</li>
        </ul>
      </div>
    </div>
  `);
});

module.exports = router;