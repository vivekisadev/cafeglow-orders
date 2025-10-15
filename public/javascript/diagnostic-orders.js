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
      const response = await fetch('/api/orders', {
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