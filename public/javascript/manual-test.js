// Manual test for orders functionality
console.log('🧪 Manual test script loaded');

window.testOrdersFunctionality = function() {
    console.log('🚀 Starting manual test of orders functionality...');
    
    // Test 1: Check if handleOrder function exists
    console.log('Test 1: Checking if handleOrder function exists...');
    if (typeof handleOrder === 'function') {
        console.log('✅ handleOrder function exists');
        
        // Test 2: Try to call handleOrder directly
        console.log('Test 2: Calling handleOrder function directly...');
        try {
            handleOrder();
            console.log('✅ handleOrder function called successfully');
        } catch (error) {
            console.error('❌ Error calling handleOrder:', error);
        }
    } else {
        console.error('❌ handleOrder function does not exist');
        console.log('Available functions:', Object.keys(window).filter(key => key.includes('handle')));
    }
    
    // Test 3: Check dashboard content
    console.log('Test 3: Checking dashboard content element...');
    const dashboardContent = document.getElementById('dashboard-content');
    if (dashboardContent) {
        console.log('✅ Dashboard content element found');
        console.log('Current content:', dashboardContent.innerHTML.substring(0, 200) + '...');
    } else {
        console.error('❌ Dashboard content element not found');
    }
    
    // Test 4: Check navigation setup
    console.log('Test 4: Checking navigation setup...');
    const orderButtons = document.querySelectorAll('[data-action="orders"]');
    console.log('Found order buttons:', orderButtons.length);
    
    orderButtons.forEach((button, index) => {
        console.log(`Button ${index + 1}:`, button.textContent.trim());
        button.addEventListener('click', function(e) {
            console.log('🖱️ Order button clicked!');
            console.log('Button text:', this.textContent.trim());
            console.log('Button data-action:', this.getAttribute('data-action'));
        });
    });
    
    console.log('✅ Manual test setup complete. Use testOrdersFunctionality() to run the test.');
};

// Auto-run the test after 2 seconds
setTimeout(() => {
    console.log('🔄 Auto-running manual test...');
    testOrdersFunctionality();
}, 2000);