const express = require('express');
const router = express.Router();
const path = require('path');
const isLoggedIn = require('../middlewares/isLoggedIn.js');
const orderModel = require('../models/orders.model.js');
const productModel = require('../models/products.model.js');

// Main customer page - redirect to table 1 (default)
router.get('/', async (req, res) => {
  res.redirect('/table/1');
});

// Serve admin dashboard
router.get('/admin/dashboard', isLoggedIn, async (req, res) => {
    try {
        // Fetch dashboard data
        const orders = await orderModel.find()
            .populate('cart.product')
            .sort({ time: -1 })
            .limit(10);
        
        const totalOrders = await orderModel.countDocuments();
        const totalProducts = await productModel.countDocuments();
        
        // Calculate total revenue from completed orders
        const completedOrders = await orderModel.find({ status: 'completed' });
        const totalRevenue = completedOrders.reduce((sum, order) => {
            return sum + order.cart.reduce((cartSum, item) => cartSum + (item.price * item.quantity || 0), 0);
        }, 0);
        
        // Dashboard data
        const dashboardData = {
            totalOrders: totalOrders,
            totalProducts: totalProducts,
            totalRevenue: totalRevenue,
            recentOrders: orders
        };
        
        res.render('dashboard', { admin: req.user, dashboardData: dashboardData });
    } catch (error) {
        console.error('Dashboard loading error:', error);
        res.status(500).send('Error loading dashboard');
    }
});

// Serve admin login page
router.get('/admin/login', (req, res) => {
    res.render('admin');
});

// Serve admin register page
router.get('/admin/register', (req, res) => {
    res.render('register');
});

// Dashboard content endpoint (for AJAX requests)
router.get('/api/dashboard/content', isLoggedIn, async (req, res) => {
    try {
        // Fetch real data for dashboard
        const orders = await orderModel.find()
            .populate('cart.product')
            .sort({ time: -1 })
            .limit(10);
        
        const totalOrders = await orderModel.countDocuments();
        const totalProducts = await productModel.countDocuments();
        
        // Calculate total revenue from completed orders
        const completedOrders = await orderModel.find({ status: 'completed' });
        const totalRevenue = completedOrders.reduce((sum, order) => {
            return sum + order.cart.reduce((cartSum, item) => cartSum + (item.price * item.quantity || 0), 0);
        }, 0);
        
        // Real dashboard data
        const dashboardData = {
            totalOrders: totalOrders,
            totalProducts: totalProducts,
            totalRevenue: totalRevenue,
            recentOrders: orders
        };
        
        // Render dashboard content only (for AJAX requests)
        res.render('dashboard_content', { dashboardData: dashboardData });
        
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Server error loading dashboard' });
    }
});

// Serve customer menu page
router.get('/table/:num', async (req, res) => {
    try {
        const num = parseInt(req.params.num, 10);
        if (num < 1 || num > 99) return res.status(400).send('Invalid table number');
        const items = await productModel.find({ available: true }).lean();
        res.render('index', { tableNum: num, items });
    } catch (err) {
        console.error('Error loading table menu:', err);
        res.status(500).send('Error loading page');
    }
});

module.exports = router;