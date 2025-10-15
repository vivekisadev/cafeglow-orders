// Authentication test for orders functionality
console.log('🔐 Authentication test loaded');

// Test if user is authenticated
window.testAuthentication = function() {
    console.log('🔍 Testing authentication status...');
    
    // Check if cookies are available
    console.log('🍪 Checking cookies...');
    console.log('Document cookie:', document.cookie);
    
    // Test fetch with credentials
    console.log('🔄 Testing fetch with credentials...');
    fetch('/api/orders', {
        method: 'GET',
        credentials: 'include', // This should send cookies
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);
        
        if (!response.ok) {
            console.error('❌ Authentication failed with status:', response.status);
            return response.text().then(text => {
                console.error('❌ Response text:', text);
                throw new Error('Authentication failed');
            });
        }
        
        return response.json();
    })
    .then(data => {
        console.log('✅ Authentication successful!');
        console.log('📦 Orders data:', data);
        console.log('📊 Number of orders:', data.length);
    })
    .catch(error => {
        console.error('❌ Authentication error:', error);
    });
};

// Test authentication immediately
setTimeout(() => {
    console.log('🔄 Auto-testing authentication...');
    testAuthentication();
}, 3000);

console.log('✅ Authentication test setup complete. Use testAuthentication() to test manually.');