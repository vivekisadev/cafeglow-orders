const express = require('express');
const router = express.Router();
const productModel = require('../models/products.model.js');
const isLoggedIn = require('../middlewares/isLoggedIn.js');

// Customer menu page (root)
router.get('/', async (req, res) => {
    try {
        const items = await productModel.find({ availability: true }).lean();
        res.render('index', { items });
    } catch (error) {
        console.error('Error loading menu:', error);
        res.status(500).send('Error loading menu');
    }
});

// Customer menu page (alternate route)
router.get('/menu', async (req, res) => {
    try {
        const items = await productModel.find({ availability: true }).lean();
        res.render('table-menu', { items });
    } catch (error) {
        console.error('Error loading menu:', error);
        res.status(500).send('Error loading menu');
    }
});

// Admin dashboard page
router.get('/admin/dashboard', isLoggedIn, async (req, res) => {
    try {
        res.render('dashboard', { admin: req.admin });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).send('Error loading dashboard');
    }
});

// Admin login page
router.get('/admin/login', (req, res) => {
    res.render('admin-login');
});

// Admin registration page
router.get('/admin/register', (req, res) => {
    res.render('admin-register');
});

module.exports = router;
