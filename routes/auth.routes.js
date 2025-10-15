const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminModel = require('../models/admin.model.js');
const isLoggedIn = require('../middlewares/isLoggedIn.js');

// Register new admin
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new adminModel({ name, email, password: hashedPassword });
        
        await newAdmin.save();
        
        const token = jwt.sign({ id: newAdmin._id, email: newAdmin.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.json({ success: true, message: 'Admin registered successfully', token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login admin
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }
        
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        
        const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.json({ success: true, message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Logout admin
router.post('/logout', isLoggedIn, (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
});

// Profile update route
router.post('/profile', isLoggedIn, async (req, res) => {
    try {
        const { name, email, phone, currentPassword, newPassword } = req.body;
        const adminId = req.user.id; // Fixed: use req.user.id instead of req.user.adminId

        // Find the admin user
        const admin = await adminModel.findById(adminId);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        // If password change is requested, validate current password
        if (currentPassword && newPassword) {
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({ success: false, message: 'Current password is incorrect' });
            }
            
            // Hash the new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            admin.password = hashedNewPassword;
        }

        // Update profile information
        admin.name = name || admin.name;
        admin.email = email || admin.email;
        admin.phone = phone || admin.phone;

        // Save the updated admin
        await admin.save();

        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            admin: {
                name: admin.name,
                email: admin.email,
                phone: admin.phone
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, message: 'Error updating profile' });
    }
});

// Get current admin info
router.get('/me', isLoggedIn, async (req, res) => {
    try {
        const admin = await adminModel.findById(req.user.id).select('-password'); // Fixed: use req.user.id instead of req.admin.id
        res.json({ success: true, admin });
    } catch (error) {
        console.error('Get admin info error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;