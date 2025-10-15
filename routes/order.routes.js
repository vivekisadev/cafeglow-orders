const express = require('express');
const router = express.Router();
const orderModel = require('../models/orders.model.js');
const isLoggedIn = require('../middlewares/isLoggedIn.js');

// Get all orders (admin only)
router.get('/orders', isLoggedIn, async (req, res) => {
    try {
        const orders = await orderModel.find()
            .populate('cart.product', 'name price')
            .sort({ time: -1 })
            .lean();
        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get single order (admin only)
router.get('/orders/:id', isLoggedIn, async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id)
            .populate('cart.product', 'name price')
            .lean();
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, order });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Place new order (public)
router.post('/orders', async (req, res) => {
    try {
        const newOrder = new orderModel(req.body);
        await newOrder.save();
        res.json({ success: true, message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        console.error('Place order error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update order status (admin only)
router.put('/orders/:id/status', isLoggedIn, async (req, res) => {
    try {
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
        
        res.json({ success: true, message: 'Order status updated', order: updatedOrder });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete order (admin only)
router.delete('/orders/:id', isLoggedIn, async (req, res) => {
    try {
        const deletedOrder = await orderModel.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
