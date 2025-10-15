// ... keep existing code (requires, initial routes)

router.get('/dashboard', isLoggedIn, async (req, res) => {
    try {
        res.render('dashboard', { 
            admin: req.admin || { name: 'Admin', email: 'admin@cafeflow.com' }
        });
    } catch (error) {
        console.error('Dashboard render error:', error);
        res.status(500).send('Error loading dashboard');
    }
});

// ... keep existing code (dashboard-content route and other routes)
