const express = require('express');
const router = express.Router();

// Safe requires for optional dependencies
let productModel;
try {
  productModel = require('../models/products.model.js');
} catch (e) {
  console.warn('products.model.js not found, product endpoints will be limited:', e.message);
  productModel = null;
}

let isLoggedIn;
try {
  isLoggedIn = require('../middlewares/isLoggedIn.js');
} catch (e) {
  console.warn('isLoggedIn middleware not found, using permissive fallback for dev:', e.message);
  isLoggedIn = (req, _res, next) => next();
}

// Get all products (public)
router.get('/products', async (req, res) => {
  try {
    if (productModel && typeof productModel.find === 'function') {
      const products = await productModel.find().lean();
      return res.json({ success: true, products });
    }
    return res.json({ success: true, products: [] });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single product (public)
router.get('/products/:id', async (req, res) => {
  try {
    if (!(productModel && typeof productModel.findById === 'function')) {
      return res.status(503).json({ success: false, message: 'Product model not configured' });
    }
    const product = await productModel.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, product });
  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add new product (admin only)
router.post('/products', isLoggedIn, async (req, res) => {
  try {
    if (!productModel) {
      return res.status(503).json({ success: false, message: 'Product model not configured' });
    }
    const newProduct = new productModel(req.body);
    await newProduct.save();
    return res.json({ success: true, message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Add product error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update product (admin only)
router.put('/products/:id', isLoggedIn, async (req, res) => {
  try {
    if (!(productModel && typeof productModel.findByIdAndUpdate === 'function')) {
      return res.status(503).json({ success: false, message: 'Product model not configured' });
    }
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
    return res.json({ success: true, message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/products/:id', isLoggedIn, async (req, res) => {
  try {
    if (!(productModel && typeof productModel.findByIdAndDelete === 'function')) {
      return res.status(503).json({ success: false, message: 'Product model not configured' });
    }
    const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
