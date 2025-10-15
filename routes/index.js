const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth.routes.js');
const productRoutes = require('./product.routes.js');
const orderRoutes = require('./order.routes.js');
const pageRoutes = require('./page.routes.js');
const developerRoutes = require('./developer.routes.js');
const adminRoutes = require('./admin.route.js');

// Mount routes with appropriate prefixes
router.use('/api/auth', authRoutes);           // Authentication routes
router.use('/api', productRoutes);           // Product routes (public)
router.use('/api', orderRoutes);               // Order routes (public + admin)
router.use('/', pageRoutes);                   // Page serving routes
router.use('/api/developer', developerRoutes); // Developer tools routes
router.use('/admin', adminRoutes);             // Admin dashboard routes

module.exports = router;