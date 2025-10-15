const express = require('express');
const router = express.Router();
const productModel = require('../models/products.model.js');
const isLoggedIn = require('../middlewares/isLoggedIn.js');

// Get all products (public)
router.get('/products', async (req, res) => {
    try {
        const products = await productModel.find().lean();
        res.json({ success: true, products });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get single product (public)
router.get('/products/:id', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id).lean();
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Add new product (admin only)
router.post('/products', isLoggedIn, async (req, res) => {
    try {
        const newProduct = new productModel(req.body);
        await newProduct.save();
        res.json({ success: true, message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update product (admin only)
router.put('/products/:id', isLoggedIn, async (req, res) => {
    try {
        const allowedFields = ['name', 'price', 'description', 'image', 'category', 'availability', 'ingredients'];
        const updateData = {};
        for (const key of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                updateData[key] = req.body[key];
            }
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: 'No valid fields provided for update' });
        }
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete product (admin only)
router.delete('/products/:id', isLoggedIn, async (req, res) => {
    try {
        const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
