// Diagnostic test for orders functionality
console.log('🔍 Diagnostic test loaded for orders functionality');

// Test if handleOrder function exists
console.log('🔧 Testing handleOrder function availability...');
console.log('handleOrder function exists:', typeof handleOrder === 'function');

// Test if navigation setup is working
console.log('📋 Testing navigation setup...');
setTimeout(() => {
  const orderButtons = document.querySelectorAll('[data-action="orders"]');
  console.log('Found order buttons:', orderButtons.length);
  
  orderButtons.forEach((button, index) => {
    console.log(`Button ${index + 1}:`, button.textContent.trim(), '- data-action:', button.getAttribute('data-action'));
  });
}, 1000);

// Test dashboard content element
console.log('📄 Testing dashboard content element...');
const dashboardContent = document.getElementById('dashboard-content');
console.log('Dashboard content element exists:', !!dashboardContent);

// Override handleOrder to add debugging
if (typeof handleOrder === 'function') {
  const originalHandleOrder = handleOrder;
  window.handleOrder = async function() {
    console.log('🎯 handleOrder function called!');
    console.log('📄 Dashboard content element:', document.getElementById('dashboard-content'));
    
    try {
      console.log('🔄 Starting fetch request...');
      const response = await fetch('/admin/orders', {
        credentials: 'include'
      });
      console.log('📡 Fetch response status:', response.status);
      console.log('📡 Fetch response ok:', response.ok);
      
      if (!response.ok) {
        console.error('❌ Fetch failed with status:', response.status);
        return;
      }
      
      const orders = await response.json();
      console.log('📦 Orders received:', orders.length, 'orders');
      
      // Call original function
      originalHandleOrder.call(this);
      
    } catch (error) {
      console.error('❌ Error in handleOrder:', error);
    }
  };
}

// Test clicking on order buttons
window.testOrderClick = function() {
  console.log('🧪 Testing order button click...');
  const orderButton = document.querySelector('[data-action="orders"]');
  if (orderButton) {
    console.log('🖱️ Found order button, clicking...');
    orderButton.click();
  } else {
    console.error('❌ No order button found');
  }
};

console.log('✅ Diagnostic test setup complete. Use testOrderClick() to test clicking.');

// Add a lightweight endpoint tester accessible from the browser console
(function () {
  if (typeof window === 'undefined') return;

  async function safeFetch(url, options = {}) {
    try {
      const res = await fetch(url, options);
      const contentType = res.headers.get('content-type') || '';
      const text = await res.text();
      let body = text;
      if (contentType.includes('application/json')) {
        try { body = JSON.parse(text); } catch { /* keep text */ }
      }
      return { url, ok: res.ok, status: res.status, body };
    } catch (err) {
      return { url, ok: false, status: 0, body: String(err) };
    }
  }

  window.testCafeGlow = async function () {
    const today = new Date().toISOString().slice(0,10);
    const endpoints = [
      { name: 'Health', url: '/health' },
      { name: 'Home', url: '/' },
      { name: 'Menu (Table 1)', url: '/menu?table=1' },
      { name: 'Admin Login Page', url: '/admin', opts: { credentials: 'include' } },
      { name: 'Admin Products', url: '/admin/products', opts: { credentials: 'include' } },
      { name: 'Admin Orders', url: '/admin/orders', opts: { credentials: 'include' } },
      { name: 'Admin Dashboard Content', url: '/admin/dashboard-content', opts: { credentials: 'include' } },
      { name: 'Admin Analytics (today)', url: `/admin/analytics?startDate=${today}&endDate=${today}&view=daily`, opts: { credentials: 'include' } },
    ];

    console.group('CafeGlow Endpoint Tests');
    for (const ep of endpoints) {
      const result = await safeFetch(ep.url, ep.opts || {});
      console.log(`• ${ep.name}:`, { status: result.status, ok: result.ok, sample: typeof result.body === 'string' ? result.body.slice(0, 120) : result.body });
    }
    console.groupEnd();
    console.info('Tip: Run window.testCafeGlow() again anytime.');
  };
})();