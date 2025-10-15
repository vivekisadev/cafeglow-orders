const express = require('express');
const router = express.Router();
const Order = require('../models/orders.model');

router.post('/table-order', async (req, res) => {
    try {
        const { tableNum, items } = req.body;
        if (!tableNum || !Array.isArray(items) || !items.length) {
            return res.status(400).json({ message: 'Missing tableNum or items' });
        }
        const newOrder = new Order({
            cart: items.map(it => ({
                product: it.id,
                quantity: it.qty
            })),
            table: tableNum,
            status: 'pending'
        });
        await newOrder.save();
        res.json({ message: 'Order placed', orderId: newOrder._id });
    } catch (err) {
        console.error('Table order error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;