const express = require('express');
const router = express.Router();
const productModel = require('../models/products.model.js');
const isLoggedIn = require('../middlewares/isLoggedIn.js');

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await productModel.find();
        res.json({ success: true, products });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get single product by ID
router.get('/products/:id', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
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
        const { name, price, description, image, category, ingredients } = req.body;

        if (!name || !price) {
            return res.status(400).json({ success: false, message: 'Name and price are required' });
        }

        // Include ingredients because the schema marks it as required
        const newProduct = new productModel({
            name,
            price,
            description: description || '',
            image: image || '',
            category: category || 'general',
            ingredients: ingredients || 'N/A'
        });

        await newProduct.save();
        res.json({ success: true, message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ success: false, message: 'Server error adding product' });
    }
});

// Update product (admin only)
router.put('/products/:id', isLoggedIn, async (req, res) => {
    try {
        const { name, price, description, image, category } = req.body;
        
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id,
            { name, price, description, image, category },
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