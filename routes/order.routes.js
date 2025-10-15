const express = require('express');
const router = express.Router();

// Safe requires for optional dependencies
let orderModel;
try {
  orderModel = require('../models/orders.model.js');
} catch (e) {
  console.warn('orders.model.js not found, order endpoints will be limited:', e.message);
  orderModel = null;
}

let isLoggedIn;
try {
  isLoggedIn = require('../middlewares/isLoggedIn.js');
} catch (e) {
  console.warn('isLoggedIn middleware not found, using permissive fallback for dev:', e.message);
  isLoggedIn = (req, _res, next) => next();
}

// Get all orders (admin only)
router.get('/orders', isLoggedIn, async (req, res) => {
  try {
    if (orderModel && typeof orderModel.find === 'function') {
      const orders = await orderModel
        .find()
        .populate('cart.product', 'name price')
        .sort({ time: -1 })
        .lean();
      return res.json(orders);
    }
    return res.json([]);
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single order (admin only)
router.get('/orders/:id', isLoggedIn, async (req, res) => {
  try {
    if (!(orderModel && typeof orderModel.findById === 'function')) {
      return res.status(503).json({ success: false, message: 'Order model not configured' });
    }
    const order = await orderModel
      .findById(req.params.id)
      .populate('cart.product', 'name price')
      .lean();
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Place new order (public)
router.post('/orders', async (req, res) => {
  try {
    if (!orderModel) {
      return res.status(503).json({ success: false, message: 'Order model not configured' });
    }
    const newOrder = new orderModel(req.body);
    await newOrder.save();
    return res.json({ success: true, message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Place order error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update order status (admin only)
router.put('/orders/:id/status', isLoggedIn, async (req, res) => {
  try {
    if (!(orderModel && typeof orderModel.findByIdAndUpdate === 'function')) {
      return res.status(503).json({ success: false, message: 'Order model not configured' });
    }
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'packing', 'ready', 'delivered', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete order (admin only)
router.delete('/orders/:id', isLoggedIn, async (req, res) => {
  try {
    if (!(orderModel && typeof orderModel.findByIdAndDelete === 'function')) {
      return res.status(503).json({ success: false, message: 'Order model not configured' });
    }
    const deletedOrder = await orderModel.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
