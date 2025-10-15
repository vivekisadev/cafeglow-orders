const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const adminModel = require('../models/admin.model.js');

// Developer middleware - simple check for now (in production, use more secure method)
const isDeveloper = (req, res, next) => {
    const devKey = req.headers['x-dev-key'] || req.query.devkey;
    if (devKey === 'DEV_MODE_2024') { // Change this in production
        next();
    } else {
        res.status(403).json({ success: false, message: 'Developer access denied' });
    }
};

// Get all admin accounts (developer only)
router.get('/admins', isDeveloper, async (req, res) => {
    try {
        const admins = await adminModel.find({}, { password: 0 });
        res.json({ success: true, admins });
    } catch (error) {
        console.error('Developer get admins error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Create new admin (developer only)
router.post('/admins', isDeveloper, async (req, res) => {
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
        const newAdmin = new adminModel({
            name,
            email,
            password: hashedPassword
        });
        
        await newAdmin.save();
        res.json({ success: true, message: 'Admin created successfully' });
    } catch (error) {
        console.error('Developer create admin error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete admin (developer only)
router.delete('/admins/:id', isDeveloper, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent deleting the last admin
        const adminCount = await adminModel.countDocuments();
        if (adminCount <= 1) {
            return res.status(400).json({ success: false, message: 'Cannot delete the last admin account' });
        }
        
        const result = await adminModel.findByIdAndDelete(id);
        if (result) {
            res.json({ success: true, message: 'Admin deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Admin not found' });
        }
    } catch (error) {
        console.error('Developer delete admin error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Reset all admins and create one (developer only)
router.post('/admins/reset', isDeveloper, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        console.log('Developer reset: Removing all admin accounts...');
        await adminModel.deleteMany({});
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new adminModel({
            name,
            email,
            password: hashedPassword
        });
        
        await newAdmin.save();
        res.json({ success: true, message: 'All admins reset, new admin created' });
    } catch (error) {
        console.error('Developer reset admins error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;