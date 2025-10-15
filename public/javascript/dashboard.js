// Initialize dashboard when page loads - CONSOLIDATED EVENT HANDLER
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Dashboard initialization started...');
  
  // Load and apply settings
  const settings = JSON.parse(localStorage.getItem('cafeSettings')) || {
    darkMode: false,
    notifications: true,
    autoRefresh: false,
    cafeName: 'CafeFlow',
    operatingHours: '9:00 AM - 10:00 PM',
    phoneNumber: '+91 98765 43210',
    autoAcceptOrders: false,
    preparationTime: 15,
    maxTables: 20
  };
  
  applySettings(settings);
  
  // Setup navigation first
  setupNavigation();
  
  // Load dashboard home after a short delay to ensure everything is ready
  setTimeout(() => {
    console.log('📊 Loading dashboard home...');
    if (typeof handleDashboardHome === 'function') {
      handleDashboardHome();
    } else {
      console.error('❌ handleDashboardHome not available yet');
    }
  }, 500);
  
  console.log('✅ Dashboard initialization complete!');
});

// User dropdown functionality
const toggleUserDropdown = () => {
  const dropdown = document.getElementById('userDropdown');
  dropdown.classList.toggle('hidden');
};

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
  const userProfile = document.querySelector('.user-profile');
  const dropdown = document.getElementById('userDropdown');
  
  if (!userProfile.contains(event.target)) {
    dropdown.classList.add('hidden');
  }
});

// Show Profile Page
const showProfile = () => {
  const dashboardContent = document.getElementById("dashboard-content");
  
  // Get admin data from the page elements
  const adminNameElement = document.querySelector('.text-gray-700.font-medium');
  const adminEmailElement = document.querySelector('.text-gray-500.text-sm');
  
  const adminName = adminNameElement ? adminNameElement.textContent : 'Admin User';
  const adminEmail = adminEmailElement ? adminEmailElement.textContent : 'admin@cafeflow.com';
  const adminPhone = '+91 98765 43210'; // Default phone number
  
  dashboardContent.innerHTML = `
    <div class="p-6">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <!-- Profile Header -->
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-8">
            <div class="flex items-center space-x-6">
              <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <i class="fas fa-user text-4xl text-orange-500"></i>
              </div>
              <div class="text-white">
                <h1 class="text-3xl font-bold" id="profileName">${adminName}</h1>
                <p class="text-orange-100" id="profileEmail">${adminEmail}</p>
                <p class="text-orange-100 text-sm mt-1">Administrator</p>
              </div>
            </div>
          </div>
          
          <!-- Profile Content -->
          <div class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Account Information -->
              <div class="space-y-6">
                <h2 class="text-xl font-semibold text-gray-800 border-b pb-2">
                  <i class="fas fa-user-circle mr-2 text-orange-500"></i>
                  Account Information
                </h2>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" id="editName" value="${adminName}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" id="editEmail" value="${adminEmail}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" id="editPhone" value="${adminPhone}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                </div>
              </div>
              
              <!-- Security Settings -->
              <div class="space-y-6">
                <h2 class="text-xl font-semibold text-gray-800 border-b pb-2">
                  <i class="fas fa-shield-alt mr-2 text-orange-500"></i>
                  Security Settings
                </h2>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input type="password" id="currentPassword" placeholder="Enter current password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" id="newPassword" placeholder="Enter new password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input type="password" id="confirmPassword" placeholder="Confirm new password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 mt-8 pt-6 border-t">
              <button onclick="cancelProfileEdit()" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onclick="saveProfileChanges()" class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Close dropdown
document.getElementById('userDropdown').classList.add('hidden');
};

// Save Settings Function
const saveSettings = () => {
  const settings = {
    darkMode: document.getElementById('darkMode').checked,
    notifications: document.getElementById('notifications').checked,
    autoRefresh: document.getElementById('autoRefresh').checked,
    cafeName: document.getElementById('cafeName').value,
    operatingHours: document.getElementById('operatingHours').value,
    phoneNumber: document.getElementById('phoneNumber').value,
    autoAcceptOrders: document.getElementById('autoAcceptOrders').checked,
    preparationTime: parseInt(document.getElementById('preparationTime').value),
    maxTables: parseInt(document.getElementById('maxTables').value)
  };
  
  // Save to localStorage
  localStorage.setItem('cafeSettings', JSON.stringify(settings));
  
  // Show success message
  showToast('Settings saved successfully!', 'success');
  
  // Apply settings immediately
  applySettings(settings);
};

// Apply Settings Function
const applySettings = (settings) => {
  // Apply dark mode
  if (settings.darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Apply auto refresh
  if (settings.autoRefresh) {
    // Start auto refresh (refresh every 30 seconds)
    if (window.autoRefreshInterval) {
      clearInterval(window.autoRefreshInterval);
    }
    window.autoRefreshInterval = setInterval(() => {
      handleDashboardHome();
    }, 30000);
  } else {
    // Stop auto refresh
    if (window.autoRefreshInterval) {
      clearInterval(window.autoRefreshInterval);
      window.autoRefreshInterval = null;
    }
  }
  
  // Apply other settings as needed
  console.log('Settings applied:', settings);
};

// Show Settings Page
const showSettings = () => {
  const dashboardContent = document.getElementById("dashboard-content");
  
  // Load current settings from localStorage or use defaults
  const settings = JSON.parse(localStorage.getItem('cafeSettings')) || {
    darkMode: false,
    notifications: true,
    autoRefresh: false,
    cafeName: 'CafeFlow',
    operatingHours: '9:00 AM - 10:00 PM',
    phoneNumber: '+91 98765 43210',
    autoAcceptOrders: false,
    preparationTime: 15,
    maxTables: 20
  };
  
  dashboardContent.innerHTML = `
    <div class="p-6">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">
          <i class="fas fa-cog mr-3 text-orange-500"></i>
          Settings
        </h1>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- General Settings -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              <i class="fas fa-sliders-h mr-2 text-orange-500"></i>
              General Settings
            </h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Dark Mode</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="darkMode" class="sr-only peer" ${settings.darkMode ? 'checked' : ''}>
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Notifications</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="notifications" class="sr-only peer" ${settings.notifications ? 'checked' : ''}>
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Auto Refresh</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="autoRefresh" class="sr-only peer" ${settings.autoRefresh ? 'checked' : ''}>
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>
          </div>
          
          <!-- Cafe Settings -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              <i class="fas fa-coffee mr-2 text-orange-500"></i>
              Cafe Settings
            </h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cafe Name</label>
                <input type="text" id="cafeName" value="${settings.cafeName}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
                <input type="text" id="operatingHours" value="${settings.operatingHours}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" id="phoneNumber" value="${settings.phoneNumber}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              </div>
            </div>
          </div>
          
          <!-- Order Settings -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              <i class="fas fa-shopping-cart mr-2 text-orange-500"></i>
              Order Settings
            </h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-700">Auto Accept Orders</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="autoAcceptOrders" class="sr-only peer" ${settings.autoAcceptOrders ? 'checked' : ''}>
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Preparation Time (min)</label>
                <input type="number" id="preparationTime" value="${settings.preparationTime}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Maximum Tables</label>
                <input type="number" id="maxTables" value="${settings.maxTables}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              </div>
            </div>
          </div>
        </div>
        
        <!-- Save Settings Button -->
        <div class="flex justify-end mt-8">
          <button onclick="saveSettings()" class="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Close dropdown
  document.getElementById('userDropdown').classList.add('hidden');
};

// Home dashboard function - reloads the dashboard content
const handleDashboardHome = async () => {
  try {
    const dashboardContent = document.getElementById("dashboard-content");
    const response = await fetch("/api/dashboard/content", {
      credentials: 'include'
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // If unauthorized, redirect to login
        window.location.href = '/admin';
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    dashboardContent.innerHTML = html;
    
    // Update active state in sidebar
    document.querySelectorAll('.sidebar-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector('a[href="/admin/dashboard"]').classList.add('active');
  } catch (error) {
    console.error("Error loading dashboard:", error);
    alert("Error loading dashboard: " + error.message);
  }
};

const handleOrder = async () => {
  const dashboardContent = document.getElementById("dashboard-content");
  const response = await fetch("/api/orders", {
    credentials: 'include'
  });

  // Handle auth or HTTP errors gracefully
  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = '/admin';
      return;
    }
    dashboardContent.innerHTML = `
      <div class="p-6">
        <div class="text-center py-12">
          <i class="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
          <h3 class="text-xl text-red-400 mb-2">Error loading orders</h3>
          <p class="text-gray-500">HTTP ${response.status}</p>
        </div>
      </div>
    `;
    return;
  }

  // Support both array and object-shaped API responses
  const data = await response.json();
  const orders = Array.isArray(data) ? data : (data.orders || []);

  let tableRows = "";
  orders.forEach((order) => {
    console.log(order.cart);
    // Render items in the cart (guard against missing product or cart)
    const safeCart = Array.isArray(order.cart) ? order.cart : [];
    let items = safeCart.map((item) => (item.product && item.product.name) ? item.product.name : 'Unknown item').join(", ");
    
    // Get status color based on order status
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      preparing: 'bg-blue-100 text-blue-800 border-blue-200',
      packing: 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-200';
    
    tableRows += `
      <tr class="bg-[#2a1b0a] hover:bg-[#3a2b1a] transition-colors duration-200 border-b border-[#3a2b1a]">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="bg-[#ff6b00] bg-opacity-20 p-3 rounded-full mr-3">
              <i class="fas fa-table text-[#ff6b00]"></i>
            </div>
            <div class="text-lg font-semibold text-[#f2e8d5]">Table ${order.tableNumber}</div>
          </div>
        </td>
        
        <td class="px-6 py-4">
          <div class="flex flex-col space-y-2">
            <div class="flex items-start">
              <i class="fas fa-coffee text-[#e5c07b] mt-1 mr-2"></i>
              <div class="text-[#f2e8d5] font-medium">${items}</div>
            </div>
            <div class="flex items-center text-sm">
              <i class="fas fa-user text-gray-400 mr-2"></i>
              <span class="text-gray-300">${order.name || 'Unknown Customer'}</span>
            </div>
            <div class="flex items-center text-sm">
              <i class="fas fa-envelope text-gray-400 mr-2"></i>
              <span class="text-gray-400">${order.email || 'No email'}</span>
            </div>
          </div>
        </td>
        
        <td class="px-6 py-4">
          <div class="max-w-xs">
            <div class="text-[#f2e8d5] text-sm leading-relaxed">
              ${order.instructions || 'No special instructions'}
            </div>
          </div>
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-2xl font-bold text-[#e5c07b]">
            ₹${order.total ? order.total.toFixed(2) : "0.00"}
          </div>
          <div class="text-xs text-gray-400 mt-1">
            ${new Date(order.time).toLocaleDateString()}
          </div>
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex flex-col space-y-2">
            <select class="bg-[#1c110a] text-[#f2e8d5] border border-[#3a2b1a] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent transition-all duration-200" 
                    onchange="updateOrderStatus('${order._id}', this.value)">
              <option value="pending" ${order.status === 'pending' ? 'selected' : ''} class="bg-[#1c110a]">Pending</option>
              <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''} class="bg-[#1c110a]">Preparing</option>
              <option value="packing" ${order.status === 'packing' ? 'selected' : ''} class="bg-[#1c110a]">Packing</option>
              <option value="completed" ${order.status === 'completed' ? 'selected' : ''} class="bg-[#1c110a]">Completed</option>
              <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''} class="bg-[#1c110a]">Cancelled</option>
            </select>
            <div class="flex items-center justify-center">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusColor}">
                <i class="fas fa-circle w-2 h-2 mr-1"></i>
                ${(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
              </span>
            </div>
          </div>
        </td>
      </tr>
    `;
  });

  dashboardContent.innerHTML = `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <div class="bg-[#ff6b00] bg-opacity-20 p-3 rounded-full mr-4">
            <i class="fas fa-shopping-cart text-[#ff6b00] text-2xl"></i>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-[#e5c07b]">Orders Management</h1>
            <p class="text-gray-400 mt-1">Manage all customer orders and track their status</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="bg-[#2a1b0a] rounded-lg px-4 py-2 border border-[#3a2b1a]">
            <span class="text-sm text-gray-400">Total Orders:</span>
            <span class="text-lg font-bold text-[#e5c07b] ml-2">${orders.length}</span>
          </div>
        </div>
      </div>
      
      <div class="bg-[#1c110a] rounded-xl shadow-2xl border border-[#3a2b1a] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-[#3a2b1a]">
            <thead class="bg-[#2a1b0a]">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-[#e5c07b] uppercase tracking-wider">
                  <i class="fas fa-table mr-2"></i>Table
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-[#e5c07b] uppercase tracking-wider">
                  <i class="fas fa-coffee mr-2"></i>Order Details
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-[#e5c07b] uppercase tracking-wider">
                  <i class="fas fa-sticky-note mr-2"></i>Instructions
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-[#e5c07b] uppercase tracking-wider">
                  <i class="fas fa-rupee-sign mr-2"></i>Total
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-[#e5c07b] uppercase tracking-wider">
                  <i class="fas fa-info-circle mr-2"></i>Status
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#3a2b1a]" id="orderTableBody">
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

const handleItems = async () => {
  const dashboardContent = document.getElementById("dashboard-content");
  const response = await fetch("/api/products", {
    credentials: 'include'
  });
  const products = await response.json();

  let tableRows = "";
  products.forEach((product) => {
    tableRows += `
      <tr>
        <td class="border px-4 py-2">${product.name}</td>
        <td class="border px-4 py-2">₹${
          product.price ? product.price.toFixed(2) : "0.00"
        }</td>
        <td class="border px-4 py-2">${product.category || ""}</td>
        <td class="border px-4 py-2">${
          product.availability ? "available" : "not available"
        }</td>
        <td class="border px-4 py-2">
          <button onclick="updateAvailability('${
            product._id
          }', true)" class="my-2 flex items-center justify-center px-5 py-2 bg-green-400 rounded-full w-40 cursor-pointer">Available</button>
          <button onclick="updateAvailability('${
            product._id
          }', false)" class="my-2 flex items-center justify-center px-5 py-2 bg-red-400 rounded-full w-40 cursor-pointer">Not Available</button>
        </td>
      </tr>
    `;
  });

  dashboardContent.innerHTML = `
    <h1 class="text-3xl text-white p-5">Menu Items</h1>
    <table>
      <thead>
        <tr>
          <th class="border px-4 py-2">Name</th>
          <th class="border px-4 py-2">Price</th>
          <th class="border px-4 py-2">Category</th>
          <th class="border px-4 py-2">Availability</th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
};

// Add this function to handle availability updates
window.updateAvailability = async (id, available) => {
  await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ availability: available }),
    credentials: 'include'
  });
  handleItems(); // Refresh the table after update
};

// Add function to update order status
window.updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
      credentials: 'include'
    });
    
    if (response.ok) {
      // Show success message
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      toast.textContent = `Order status updated to ${newStatus}`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
      
      // Refresh the current view
      if (typeof handleOrder === 'function') {
        handleOrder(); // Refresh orders view if we're in it
      }
    } else {
      alert('Failed to update order status');
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    alert('Error updating order status');
  }
};

// Billing function
const handleBilling = async () => {
  const dashboardContent = document.getElementById("dashboard-content");
  dashboardContent.innerHTML = `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-[#e5c07b] mb-6">Billing & Revenue</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-[#2a1b0a] rounded-xl p-6 shadow-lg">
          <h3 class="text-xl font-semibold text-[#e5c07b] mb-4">Daily Revenue</h3>
          <p class="text-2xl font-bold">$1,250.00</p>
          <p class="text-sm text-green-400 mt-2">↑ 15% from yesterday</p>
        </div>
        <div class="bg-[#2a1b0a] rounded-xl p-6 shadow-lg">
          <h3 class="text-xl font-semibold text-[#e5c07b] mb-4">Monthly Revenue</h3>
          <p class="text-2xl font-bold">$12,500.00</p>
          <p class="text-sm text-green-400 mt-2">↑ 18% from last month</p>
        </div>
        <div class="bg-[#2a1b0a] rounded-xl p-6 shadow-lg">
          <h3 class="text-xl font-semibold text-[#e5c07b] mb-4">Pending Payments</h3>
          <p class="text-2xl font-bold">$450.00</p>
          <p class="text-sm text-yellow-400 mt-2">3 pending orders</p>
        </div>
      </div>
    </div>
  `;
  
  // Guard against undefined event (prevent ReferenceError)
  if (typeof event !== 'undefined' && event.target) {
    document.querySelectorAll('.sidebar-button').forEach(btn => btn.classList.remove('active'));
    const el = event.target.closest('.sidebar-button');
    if (el) el.classList.add('active');
  }
};

// Analytics data fetching function
const fetchAnalyticsData = async () => {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const viewType = document.getElementById('analyticsView').value;
  
  try {
    // Show loading state
    document.getElementById('revenueChart').innerHTML = `
      <div class="animate-pulse text-gray-400">
        <i class="fas fa-chart-line text-4xl mb-2"></i>
        <p>Loading revenue data...</p>
      </div>
    `;
    document.getElementById('orderChart').innerHTML = `
      <div class="animate-pulse text-gray-400">
        <i class="fas fa-shopping-cart text-4xl mb-2"></i>
        <p>Loading order data...</p>
      </div>
    `;
    
    // Fetch analytics data from backend
    const response = await fetch(`/api/analytics?startDate=${startDate}&endDate=${endDate}&view=${viewType}`, {
      credentials: 'include', // Ensure cookies are sent for admin-protected endpoint
    });
    const data = await response.json();
    
    if (data.success) {
      // Update analytics cards
      document.getElementById('totalRevenue').textContent = `₹${data.totalRevenue.toLocaleString()}`;
      document.getElementById('totalOrders').textContent = data.totalOrders.toLocaleString();
      document.getElementById('avgOrderValue').textContent = `₹${data.avgOrderValue.toFixed(2)}`;
      document.getElementById('peakHour').textContent = data.peakHour;
      document.getElementById('peakHourOrders').textContent = `${data.peakHourOrders} orders`;
      
      // Update change indicators
      document.getElementById('revenueChange').textContent = `${data.revenueChange >= 0 ? '+' : ''}${data.revenueChange}% from previous period`;
      document.getElementById('ordersChange').textContent = `${data.ordersChange >= 0 ? '+' : ''}${data.ordersChange}% from previous period`;
      document.getElementById('avgOrderChange').textContent = `${data.avgOrderChange >= 0 ? '+' : ''}${data.avgOrderChange}% from previous period`;
      
      // Render charts
      renderRevenueChart(data.revenueData, viewType);
      renderOrderChart(data.orderData, viewType);
      renderPopularItems(data.popularItems);
    } else {
      throw new Error(data.message || 'Failed to fetch analytics data');
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    
    // Show error state
    document.getElementById('revenueChart').innerHTML = `
      <div class="text-red-400 text-center">
        <i class="fas fa-exclamation-triangle text-4xl mb-2"></i>
        <p>Error loading revenue data</p>
      </div>
    `;
    document.getElementById('orderChart').innerHTML = `
      <div class="text-red-400 text-center">
        <i class="fas fa-exclamation-triangle text-4xl mb-2"></i>
        <p>Error loading order data</p>
      </div>
    `;
  }
};

// Chart rendering functions
const renderRevenueChart = (data, viewType) => {
  const chartContainer = document.getElementById('revenueChart');
  
  if (!data || data.length === 0) {
    chartContainer.innerHTML = `
      <div class="text-gray-400 text-center">
        <i class="fas fa-chart-line text-4xl mb-2"></i>
        <p>No revenue data available</p>
      </div>
    `;
    return;
  }
  
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const chartHeight = 200;
  const chartWidth = chartContainer.offsetWidth - 40;
  
  let chartHTML = `
    <div class="relative h-full">
      <div class="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4" style="height: ${chartHeight}px;">
  `;
  
  data.forEach((item, index) => {
    const height = (item.revenue / maxRevenue) * (chartHeight - 20);
    const label = viewType === 'daily' ? new Date(item.date).getDate() : 
                  viewType === 'monthly' ? new Date(item.date).toLocaleDateString('en', { month: 'short' }) :
                  new Date(item.date).getFullYear();
    
    chartHTML += `
      <div class="flex flex-col items-center" style="width: ${chartWidth / data.length}px;">
        <div class="bg-gradient-to-t from-[#ff6b00] to-[#ff8c00] rounded-t-lg transition-all duration-300 hover:from-[#ff8c00] hover:to-[#ffaa00]"
             style="height: ${height}px; width: 80%; margin-bottom: 4px;"
             title="${viewType === 'daily' ? new Date(item.date).toLocaleDateString() : item.date}: ₹${item.revenue.toLocaleString()}">
        </div>
        <span class="text-xs text-gray-400 mt-1">${label}</span>
      </div>
    `;
  });
  
  chartHTML += `
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-px bg-[#3a2b1a]"></div>
    </div>
  `;
  
  chartContainer.innerHTML = chartHTML;
};

const renderOrderChart = (data, viewType) => {
  const chartContainer = document.getElementById('orderChart');
  
  if (!data || data.length === 0) {
    chartContainer.innerHTML = `
      <div class="text-gray-400 text-center">
        <i class="fas fa-shopping-cart text-4xl mb-2"></i>
        <p>No order data available</p>
      </div>
    `;
    return;
  }
  
  const maxOrders = Math.max(...data.map(d => d.orders));
  const chartHeight = 200;
  const chartWidth = chartContainer.offsetWidth - 40;
  
  let chartHTML = `
    <div class="relative h-full">
      <div class="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4" style="height: ${chartHeight}px;">
  `;
  
  data.forEach((item, index) => {
    const height = (item.orders / maxOrders) * (chartHeight - 20);
    const label = viewType === 'daily' ? new Date(item.date).getDate() : 
                  viewType === 'monthly' ? new Date(item.date).toLocaleDateString('en', { month: 'short' }) :
                  new Date(item.date).getFullYear();
    
    chartHTML += `
      <div class="flex flex-col items-center" style="width: ${chartWidth / data.length}px;">
        <div class="bg-gradient-to-t from-[#00ff88] to-[#00cc6a] rounded-t-lg transition-all duration-300 hover:from-[#00cc6a] hover:to-[#00ff88]"
             style="height: ${height}px; width: 80%; margin-bottom: 4px;"
             title="${viewType === 'daily' ? new Date(item.date).toLocaleDateString() : item.date}: ${item.orders} orders">
        </div>
        <span class="text-xs text-gray-400 mt-1">${label}</span>
      </div>
    `;
  });
  
  chartHTML += `
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-px bg-[#3a2b1a]"></div>
    </div>
  `;
  
  chartContainer.innerHTML = chartHTML;
};

const renderPopularItems = (items) => {
  const container = document.getElementById('popularItems');
  
  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="text-gray-400 text-center py-8 col-span-full">
        <i class="fas fa-coffee text-4xl mb-2"></i>
        <p>No popular items data available</p>
      </div>
    `;
    return;
  }
  
  let itemsHTML = '';
  items.forEach((item, index) => {
    const percentage = ((item.sold / items[0].sold) * 100).toFixed(0);
    
    itemsHTML += `
      <div class="bg-gradient-to-r from-[#1c110a] to-[#2a1b0a] rounded-lg p-4 border border-[#3a2b1a] hover:border-[#ff6b00] transition-all duration-300">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <div class="bg-[#ff6b00] bg-opacity-20 p-2 rounded-full">
              <i class="fas fa-coffee text-[#ff6b00]"></i>
            </div>
            <div>
              <h4 class="text-white font-semibold">${item.name}</h4>
              <p class="text-gray-400 text-sm">${item.category}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-[#e5c07b] font-bold">${item.sold}</p>
            <p class="text-gray-400 text-xs">sold</p>
          </div>
        </div>
        <div class="w-full bg-[#3a2b1a] rounded-full h-2">
          <div class="bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] h-2 rounded-full transition-all duration-500" 
               style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = itemsHTML;
};

// Graph function with enhanced analytics
const handleGraph = async () => {
  const dashboardContent = document.getElementById("dashboard-content");
  dashboardContent.innerHTML = `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-[#e5c07b] mb-6">Analytics & Graphs</h1>
      
      <!-- Date Filter Controls -->
      <div class="bg-[#2a1b0a] rounded-xl p-6 mb-6 shadow-lg">
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <div class="flex gap-4 items-center">
            <label class="text-[#e5c07b] font-semibold">View by:</label>
            <select id="analyticsView" class="px-4 py-2 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00]">
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div class="flex gap-4 items-center">
            <input type="date" id="startDate" class="px-4 py-2 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00]">
            <span class="text-[#e5c07b]">to</span>
            <input type="date" id="endDate" class="px-4 py-2 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00]">
            <button onclick="fetchAnalyticsData()" class="bg-gradient-to-r from-[#ff6b00] to-[#e55d00] hover:from-[#e55d00] hover:to-[#d44d00] text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
              <i class="fas fa-chart-line mr-2"></i>Update
            </button>
          </div>
        </div>
      </div>

      <!-- Analytics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-gradient-to-br from-[#2a1b0a] to-[#3a2b1a] rounded-xl p-6 shadow-lg border border-[#3a2b1a]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[#e5c07b] text-sm font-medium">Total Revenue</p>
              <p id="totalRevenue" class="text-2xl font-bold text-white">₹0</p>
            </div>
            <div class="bg-[#ff6b00] bg-opacity-20 p-3 rounded-full">
              <i class="fas fa-rupee-sign text-[#ff6b00] text-xl"></i>
            </div>
          </div>
          <p id="revenueChange" class="text-green-400 text-sm mt-2">+0% from previous period</p>
        </div>
        
        <div class="bg-gradient-to-br from-[#2a1b0a] to-[#3a2b1a] rounded-xl p-6 shadow-lg border border-[#3a2b1a]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[#e5c07b] text-sm font-medium">Total Orders</p>
              <p id="totalOrders" class="text-2xl font-bold text-white">0</p>
            </div>
            <div class="bg-[#00ff88] bg-opacity-20 p-3 rounded-full">
              <i class="fas fa-shopping-cart text-[#00ff88] text-xl"></i>
            </div>
          </div>
          <p id="ordersChange" class="text-green-400 text-sm mt-2">+0% from previous period</p>
        </div>
        
        <div class="bg-gradient-to-br from-[#2a1b0a] to-[#3a2b1a] rounded-xl p-6 shadow-lg border border-[#3a2b1a]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[#e5c07b] text-sm font-medium">Average Order Value</p>
              <p id="avgOrderValue" class="text-2xl font-bold text-white">₹0</p>
            </div>
            <div class="bg-[#ffaa00] bg-opacity-20 p-3 rounded-full">
              <i class="fas fa-chart-line text-[#ffaa00] text-xl"></i>
            </div>
          </div>
          <p id="avgOrderChange" class="text-green-400 text-sm mt-2">+0% from previous period</p>
        </div>
        
        <div class="bg-gradient-to-br from-[#2a1b0a] to-[#3a2b1a] rounded-xl p-6 shadow-lg border border-[#3a2b1a]">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[#e5c07b] text-sm font-medium">Peak Hour</p>
              <p id="peakHour" class="text-2xl font-bold text-white">--:--</p>
            </div>
            <div class="bg-[#ff6b6b] bg-opacity-20 p-3 rounded-full">
              <i class="fas fa-clock text-[#ff6b6b] text-xl"></i>
            </div>
          </div>
          <p id="peakHourOrders" class="text-gray-400 text-sm mt-2">0 orders</p>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-[#2a1b0a] rounded-xl p-6 shadow-lg border border-[#3a2b1a]">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-[#e5c07b]">Revenue Trend</h3>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-[#ff6b00] rounded-full"></div>
              <span class="text-sm text-gray-400">Revenue</span>
            </div>
          </div>
          <div id="revenueChart" class="h-64 flex items-center justify-center">
            <div class="animate-pulse text-gray-400">
              <i class="fas fa-chart-line text-4xl mb-2"></i>
              <p>Loading revenue data...</p>
            </div>
          </div>
        </div>
        
        <div class="bg-[#2a1b0a] rounded-xl p-6 shadow-lg border border-[#3a2b1a]">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-[#e5c07b]">Order Volume</h3>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-[#00ff88] rounded-full"></div>
              <span class="text-sm text-gray-400">Orders</span>
            </div>
          </div>
          <div id="orderChart" class="h-64 flex items-center justify-center">
            <div class="animate-pulse text-gray-400">
              <i class="fas fa-shopping-cart text-4xl mb-2"></i>
              <p>Loading order data...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Items Section -->
      <div class="bg-[#2a1b0a] rounded-xl p-6 shadow-lg border border-[#3a2b1a]">
        <h3 class="text-xl font-semibold text-[#e5c07b] mb-4">Popular Items</h3>
        <div id="popularItems" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="animate-pulse text-gray-400 text-center py-8">
            <i class="fas fa-coffee text-4xl mb-2"></i>
            <p>Loading popular items...</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Set default dates
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
  document.getElementById('startDate').value = thirtyDaysAgo.toISOString().split('T')[0];
  document.getElementById('endDate').value = today.toISOString().split('T')[0];
  
  // Fetch initial data
  fetchAnalyticsData();

  // Guard against undefined event (prevent ReferenceError)
  if (typeof event !== 'undefined' && event.target) {
    document.querySelectorAll('.sidebar-button').forEach(btn => btn.classList.remove('active'));
    const el = event.target.closest('.sidebar-button');
    if (el) el.classList.add('active');
  }
};

// Logout function
const handleLogout = async () => {
  if (confirm("Are you sure you want to log out?")) {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        window.location.href = '/admin';
      } else {
        alert('Error logging out');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error logging out');
    }
  }
};

// Product Management Function
const handleProducts = async () => {
  const dashboardContent = document.getElementById("dashboard-content");
  
  try {
    // Fetch products from backend
    const response = await fetch('/api/products');
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch products');
    }
    
    const products = result.products;
    
    dashboardContent.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-[#e5c07b]">Product Management</h1>
          <button onclick="AddItems()" class="bg-gradient-to-r from-[#ff6b00] to-[#e55d00] hover:from-[#e55d00] hover:to-[#d44d00] text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
            <i class="fas fa-plus mr-2"></i>Add New Product
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          ${products.map(product => `
            <div class="bg-gradient-to-br from-[#2a1b0a] to-[#3a2b1a] rounded-xl p-6 shadow-lg border border-[#3a2b1a] hover:border-[#ff6b00] transition-all duration-300 group">
              <div class="relative mb-4">
                <img src="${product.image || '/images/default-product.jpg'}" 
                     alt="${product.name}" 
                     class="w-full h-32 object-cover rounded-lg border border-[#3a2b1a]">
                <div class="absolute top-2 right-2">
                  <span class="px-2 py-1 text-xs rounded-full ${product.availability ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}">
                    ${product.availability ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              
              <h3 class="text-white font-bold text-lg mb-2">${product.name}</h3>
              <p class="text-[#e5c07b] text-sm mb-2">${product.category}</p>
              <p class="text-gray-400 text-sm mb-3 line-clamp-2">${product.description || 'No description available'}</p>
              
              <div class="flex justify-between items-center mb-4">
                <span class="text-2xl font-bold text-[#ff6b00]">₹${product.price}</span>
                <span class="text-sm text-gray-400">${product.ingredients ? product.ingredients.split(',').length : 0} ingredients</span>
              </div>
              
              <div class="flex gap-2">
                <button onclick="editProduct('${product._id}')" 
                        class="flex-1 bg-gradient-to-r from-[#ff6b00] to-[#e55d00] hover:from-[#e55d00] hover:to-[#d44d00] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                  <i class="fas fa-edit mr-1"></i>Edit
                </button>
                <button onclick="deleteProduct('${product._id}', '${product.name}')" 
                        class="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                  <i class="fas fa-trash mr-1"></i>Delete
                </button>
              </div>
            </div>
          `).join('')}
        </div>
        
        ${products.length === 0 ? `
          <div class="text-center py-12">
            <i class="fas fa-coffee text-6xl text-gray-400 mb-4"></i>
            <h3 class="text-xl text-gray-400 mb-2">No products found</h3>
            <p class="text-gray-500">Add your first product to get started</p>
          </div>
        ` : ''}
      </div>
    `;
    
  } catch (error) {
    console.error('Error loading products:', error);
    dashboardContent.innerHTML = `
      <div class="p-6">
        <div class="text-center py-12">
          <i class="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
          <h3 class="text-xl text-red-400 mb-2">Error loading products</h3>
          <p class="text-gray-500">${error.message}</p>
          <button onclick="handleProducts()" class="mt-4 bg-gradient-to-r from-[#ff6b00] to-[#e55d00] hover:from-[#e55d00] hover:to-[#d44d00] text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200">
            <i class="fas fa-redo mr-2"></i>Retry
          </button>
        </div>
      </div>
    `;
  }
  
  // Guard against undefined event (prevent ReferenceError)
  if (typeof event !== 'undefined' && event.target) {
    document.querySelectorAll('.sidebar-button').forEach(btn => btn.classList.remove('active'));
    const el = event.target.closest('.sidebar-button');
    if (el) el.classList.add('active');
  }
};

// Edit Product Function
const editProduct = async (productId) => {
  try {
    const response = await fetch(`/api/products/${productId}`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch product details');
    }
    
    const product = result.product;
    const dashboardContent = document.getElementById("dashboard-content");
    
    dashboardContent.innerHTML = `
      <div class="p-6">
        <div class="flex items-center mb-6">
          <button onclick="handleProducts()" class="mr-4 text-[#e5c07b] hover:text-[#ff6b00] transition-colors">
            <i class="fas fa-arrow-left text-xl"></i>
          </button>
          <h1 class="text-3xl font-bold text-[#e5c07b]">Edit Product</h1>
        </div>
        
        <div class="bg-[#2a1b0a] rounded-xl p-6 shadow-lg max-w-2xl mx-auto border border-[#3a2b1a]">
          <form id="editProductForm" class="space-y-6">
            <input type="hidden" id="productId" value="${product._id}">
            
            <div class="form-group">
              <label class="block text-[#e5c07b] font-semibold mb-2" for="name">Product Name</label>
              <input type="text" id="name" name="name" value="${product.name}" 
                     class="w-full px-4 py-3 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors" required>
            </div>
            
            <div class="form-group">
              <label class="block text-[#e5c07b] font-semibold mb-2" for="category">Category</label>
              <select name="category" id="category" class="w-full px-4 py-3 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors" required>
                <option value="coffee" ${product.category === 'coffee' ? 'selected' : ''}>Coffee</option>
                <option value="tea" ${product.category === 'tea' ? 'selected' : ''}>Tea</option>
                <option value="cold drinks" ${product.category === 'cold drinks' ? 'selected' : ''}>Cold Drinks</option>
                <option value="breakfast" ${product.category === 'breakfast' ? 'selected' : ''}>Breakfast</option>
                <option value="lunch" ${product.category === 'lunch' ? 'selected' : ''}>Lunch</option>
                <option value="desserts" ${product.category === 'desserts' ? 'selected' : ''}>Desserts</option>
                <option value="snacks" ${product.category === 'snacks' ? 'selected' : ''}>Snacks</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="block text-[#e5c07b] font-semibold mb-2" for="price">Price (₹)</label>
              <input type="number" id="price" name="price" step="0.01" min="0" value="${product.price}" 
                     class="w-full px-4 py-3 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors" required>
            </div>
            
            <div class="form-group">
              <label class="block text-[#e5c07b] font-semibold mb-2" for="description">Description</label>
              <textarea id="description" name="description" rows="3" 
                        class="w-full px-4 py-3 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors">${product.description || ''}</textarea>
            </div>
            
            <div class="form-group">
              <label class="block text-[#e5c07b] font-semibold mb-2" for="image">Image URL</label>
              <input type="text" id="image" name="image" value="${product.image || ''}" 
                     class="w-full px-4 py-3 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors">
            </div>
            
            <div class="form-group">
              <label class="block text-[#e5c07b] font-semibold mb-2" for="ingredients">Ingredients</label>
              <textarea id="ingredients" name="ingredients" rows="2" 
                        class="w-full px-4 py-3 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors">${product.ingredients || ''}</textarea>
            </div>
            
            <div class="form-group">
              <label class="block text-[#e5c07b] font-semibold mb-2" for="availability">Availability</label>
              <select id="availability" name="availability" 
                      class="w-full px-4 py-3 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors">
                <option value="true" ${product.availability ? 'selected' : ''}>Available</option>
                <option value="false" ${!product.availability ? 'selected' : ''}>Unavailable</option>
              </select>
            </div>
            
            <div class="flex gap-4 pt-4">
              <button type="submit" class="flex-1 bg-gradient-to-r from-[#ff6b00] to-[#e55d00] hover:from-[#e55d00] hover:to-[#d44d00] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                <i class="fas fa-save mr-2"></i>Update Product
              </button>
              <button type="button" onclick="handleProducts()" class="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
                <i class="fas fa-times mr-2"></i>Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    // Add event listener for form submission
    document.getElementById('editProductForm').onsubmit = async function (e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      data.availability = data.availability === 'true';
      data.price = parseFloat(data.price);
      
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include', // Add this so session cookie is sent
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Show success toast
          const toast = document.createElement('div');
          toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center';
          toast.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Product updated successfully!';
          document.body.appendChild(toast);
          
          setTimeout(() => {
            document.body.removeChild(toast);
            handleProducts(); // Return to products list
          }, 2000);
        } else {
          alert(result.message || 'Failed to update product.');
        }
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Error updating product. Please try again.');
      }
    };
    
  } catch (error) {
    console.error('Error loading product details:', error);
    alert('Error loading product details. Please try again.');
  }
};

// Delete Product Function
const deleteProduct = async (productId, productName) => {
  if (confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Add this so session cookie is sent
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Show success toast
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center';
        toast.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Product deleted successfully!';
        document.body.appendChild(toast);
        
        setTimeout(() => {
          document.body.removeChild(toast);
          handleProducts(); // Refresh products list
        }, 2000);
      } else {
        alert(result.message || 'Failed to delete product.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  }
};

const AddItems = async () => {
  const dashboardContent = document.getElementById("dashboard-content");

  dashboardContent.innerHTML = `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-[#e5c07b] mb-6">Add New Product</h1>
      <div class="bg-[#2a1b0a] rounded-xl p-6 shadow-lg max-w-2xl mx-auto border border-[#3a2b1a]">
        <form id="addProductForm" class="space-y-6">
          <div class="form-group">
            <label class="block text-[#e5c07b] font-semibold mb-2" for="name">Product Name</label>
            <input type="text" id="name" name="name" class="w-full px-4 py-3 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors" placeholder="Enter product name" required>
          </div>
          
          <div class="form-group">
            <label class="block text-[#e5c07b] font-semibold mb-2" for="category">Category</label>
            <select name="category" id="category" class="w-full px-4 py-3 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors" required>
              <option value="">Select a category</option>
              <option value="coffee">Coffee</option>
              <option value="tea">Tea</option>
              <option value="cold drinks">Cold Drinks</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="desserts">Desserts</option>
              <option value="snacks">Snacks</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="block text-[#e5c07b] font-semibold mb-2" for="price">Price (₹)</label>
            <input type="number" id="price" name="price" step="0.01" min="0" class="w-full px-4 py-3 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors" placeholder="Enter price" required>
          </div>
          
          <div class="form-group">
            <label class="block text-[#e5c07b] font-semibold mb-2" for="description">Description</label>
            <textarea id="description" name="description" rows="3" class="w-full px-4 py-3 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors" placeholder="Enter product description"></textarea>
          </div>
          
          <div class="form-group">
            <label class="block text-[#e5c07b] font-semibold mb-2" for="image">Image URL</label>
            <input type="text" id="image" name="image" class="w-full px-4 py-3 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors" placeholder="Enter image URL">
          </div>
          
          <div class="form-group">
            <label class="block text-[#e5c07b] font-semibold mb-2" for="ingredients">Ingredients</label>
            <textarea id="ingredients" name="ingredients" rows="2" class="w-full px-4 py-3 bg-[#1c110a] border border-[#3a2b1a] rounded-lg text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors" placeholder="Enter ingredients"></textarea>
          </div>
          
          <div class="flex justify-center pt-4">
            <button type="submit" class="bg-gradient-to-r from-[#ff6b00] to-[#e55d00] hover:from-[#e55d00] hover:to-[#d44d00] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
              <i class="fas fa-plus mr-2"></i>Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Add event listener after rendering
  document.getElementById("addProductForm").onsubmit = async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: 'include', // Add this so session cookie is sent
      });
      const result = await res.json();
      
      if (result.success) {
        // Show success toast
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center';
        toast.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Product added successfully!';
        document.body.appendChild(toast);
        
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 3000);
        
        // Reset form
        e.target.reset();
      } else {
        alert(result.message || "Failed to add product.");
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    }
  };
  
  // Guard against undefined event (prevent ReferenceError)
  if (typeof event !== 'undefined' && event.target) {
    document.querySelectorAll('.sidebar-button').forEach(btn => btn.classList.remove('active'));
    const el = event.target.closest('.sidebar-button');
    if (el) el.classList.add('active');
  }
};

// Save profile changes function
const saveProfileChanges = async () => {
  const name = document.getElementById('editName').value;
  const email = document.getElementById('editEmail').value;
  const phone = document.getElementById('editPhone').value;
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validate password change if provided
  if (currentPassword || newPassword || confirmPassword) {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill all password fields', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
  }

  try {
    const response = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify({
        name,
        email,
        phone,
        currentPassword,
        newPassword
      })
    });

    const data = await response.json();

    if (data.success) {
      // Update the header with new name and email
      document.getElementById('profileName').textContent = name;
      document.getElementById('profileEmail').textContent = email;
      
      // Update the top bar admin info
      const adminNameElement = document.querySelector('.text-gray-700.font-medium');
      const adminEmailElement = document.querySelector('.text-gray-500.text-sm');
      if (adminNameElement) adminNameElement.textContent = name;
      if (adminEmailElement) adminEmailElement.textContent = email;
      
      showToast('Profile updated successfully!', 'success');
      
      // Clear password fields
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
    } else {
      showToast(data.message || 'Failed to update profile', 'error');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    showToast('Error updating profile. Please try again.', 'error');
  }
};

// Cancel profile edit function
const cancelProfileEdit = () => {
  showProfile(); // Reload the profile page to reset fields
};

// Show toast notification
const showToast = (message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
};

// Robust navigation setup - ensure all sidebar buttons work
function setupNavigation() {
  console.log('🔧 Setting up navigation handlers...');
  
  // Handle all sidebar buttons with data-action attributes
  const sidebarButtons = document.querySelectorAll('.sidebar-button[data-action]');
  console.log(`📋 Found ${sidebarButtons.length} sidebar buttons with data-action attributes`);
  
  sidebarButtons.forEach(button => {
    const action = button.getAttribute('data-action');
    console.log(`⚙️ Setting up ${action} button...`);
    
    // Remove any existing event listeners to prevent duplicates
    button.removeEventListener('click', handleSidebarClick);
    
    // Add new event listener
    button.addEventListener('click', handleSidebarClick);
  });

  // Also bind any non-sidebar elements that use data-action (e.g., "View All Orders")
  const nonSidebarActionButtons = document.querySelectorAll('[data-action]:not(.sidebar-button)');
  console.log(`📋 Found ${nonSidebarActionButtons.length} non-sidebar action buttons`);
  nonSidebarActionButtons.forEach(button => {
    const action = button.getAttribute('data-action');
    console.log(`⚙️ Binding ${action} button (non-sidebar)...`);
    button.removeEventListener('click', handleSidebarClick);
    button.addEventListener('click', handleSidebarClick);
  });
  
  // Also handle the "View All Orders" button in the recent orders section
  const viewAllOrdersButton = document.querySelector('button[onclick*="handleOrder"]');
  if (viewAllOrdersButton) {
    console.log('📦 Found "View All Orders" button, updating...');
    viewAllOrdersButton.removeAttribute('onclick');
    viewAllOrdersButton.setAttribute('data-action', 'orders');
    viewAllOrdersButton.addEventListener('click', handleSidebarClick);
  }
  
  // Handle all buttons with onclick="handleOrder()" - convert them to use data-action
  const allOrderButtons = document.querySelectorAll('[onclick="handleOrder()"]');
  console.log(`📋 Found ${allOrderButtons.length} buttons with onclick="handleOrder()"`);
  
  allOrderButtons.forEach(button => {
    console.log('🔄 Converting order button to use data-action...');
    button.removeAttribute('onclick');
    button.setAttribute('data-action', 'orders');
    button.addEventListener('click', handleSidebarClick);
  });
}

// Handle sidebar button clicks
function handleSidebarClick(event) {
  event.preventDefault();
  const button = event.currentTarget;
  const action = button.getAttribute('data-action');
  
  console.log(`🎯 ${action} button clicked!`);
  
  // Update active state
  document.querySelectorAll('.sidebar-button').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  
  // Handle the action
  switch(action) {
    case 'dashboard':
      if (typeof handleDashboardHome === 'function') {
        handleDashboardHome();
      } else {
        console.error('❌ handleDashboardHome function not found!');
      }
      break;
      
    case 'orders':
      if (typeof handleOrder === 'function') {
        handleOrder();
      } else {
        console.error('❌ handleOrder function not found!');
        alert('Error: Orders function not available. Please refresh the page.');
      }
      break;
      
    case 'products':
      if (typeof handleProducts === 'function') {
        handleProducts();
      } else {
        console.error('❌ handleProducts function not found!');
      }
      break;
      
    case 'additems':
      if (typeof AddItems === 'function') {
        AddItems();
      } else {
        console.error('❌ AddItems function not found!');
      }
      break;
      
    case 'billing':
      if (typeof handleBilling === 'function') {
        handleBilling();
      } else {
        console.error('❌ handleBilling function not found!');
      }
      break;
      
    case 'graph':
      if (typeof handleGraph === 'function') {
        handleGraph();
      } else {
        console.error('❌ handleGraph function not found!');
      }
      break;
      
    case 'logout':
      if (typeof handleLogout === 'function') {
        handleLogout();
      } else {
        console.error('❌ handleLogout function not found!');
      }
      break;
      
    default:
      console.warn(`⚠️ Unknown action: ${action}`);
  }
}