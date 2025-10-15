const express = require('express');
const router = express.Router();
const orderModel = require('../models/orders.model.js');
const productModel = require('../models/products.model.js');
const isLoggedIn = require('../middlewares/isLoggedIn.js');

// Get all orders (admin only)
router.get('/orders', isLoggedIn, async (req, res) => {
    try {
        const orders = await orderModel.find().populate('cart.product', 'name price');
        res.json({ success: true, orders });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get single order by ID (admin only)
router.get('/orders/:id', isLoggedIn, async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id).populate('cart.product', 'name price');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, order });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update order status (admin only)
router.put('/orders/:id/status', isLoggedIn, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        
        const updatedOrder = await orderModel.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('items.productId', 'name price');
        
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        res.json({ success: true, message: 'Order status updated successfully', order: updatedOrder });
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

// Analytics endpoint for detailed statistics
router.get('/analytics', isLoggedIn, async (req, res) => {
    try {
        const { startDate, endDate, view = 'daily' } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the entire end date
        
        // Fetch orders within the date range
        const orders = await orderModel.find({
            time: { $gte: start, $lte: end }
        }).populate('cart.product');
        
        // Calculate basic statistics
        const totalRevenue = orders.reduce((sum, order) => {
            return sum + order.cart.reduce((cartSum, item) => {
                return cartSum + (item.price * item.quantity || 0);
            }, 0);
        }, 0);
        
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        // Calculate peak hour
        const hourCounts = {};
        orders.forEach(order => {
            const hour = new Date(order.time).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        
        const peakHour = Object.keys(hourCounts).length > 0 
            ? `${Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b)}:00`
            : '--:--';
        const peakHourOrders = hourCounts[Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b, 0)] || 0;
        
        // Calculate period-over-period changes (previous period comparison)
        const periodDuration = end - start;
        const previousStart = new Date(start.getTime() - periodDuration);
        const previousEnd = new Date(start.getTime() - 1);
        
        const previousOrders = await orderModel.find({
            time: { $gte: previousStart, $lte: previousEnd }
        }).populate('cart.product');
        
        const previousRevenue = previousOrders.reduce((sum, order) => {
            return sum + order.cart.reduce((cartSum, item) => {
                return cartSum + (item.price * item.quantity || 0);
            }, 0);
        }, 0);
        
        const previousAvgOrderValue = previousOrders.length > 0 
            ? previousRevenue / previousOrders.length : 0;
        
        const revenueChange = previousRevenue > 0 
            ? ((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(1) : 0;
        const ordersChange = previousOrders.length > 0 
            ? ((totalOrders - previousOrders.length) / previousOrders.length * 100).toFixed(1) : 0;
        const avgOrderChange = previousAvgOrderValue > 0 
            ? ((avgOrderValue - previousAvgOrderValue) / previousAvgOrderValue * 100).toFixed(1) : 0;
        
        // Generate data for charts based on view type
        let revenueData = [];
        let orderData = [];
        
        if (view === 'daily') {
            // Daily view - group by day
            const dailyRevenue = {};
            const dailyOrders = {};
            
            orders.forEach(order => {
                const date = order.time.toISOString().split('T')[0];
                const orderTotal = order.cart.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
                
                dailyRevenue[date] = (dailyRevenue[date] || 0) + orderTotal;
                dailyOrders[date] = (dailyOrders[date] || 0) + 1;
            });
            
            // Fill in missing dates with 0
            const currentDate = new Date(start);
            while (currentDate <= end) {
                const dateStr = currentDate.toISOString().split('T')[0];
                revenueData.push({ date: dateStr, revenue: dailyRevenue[dateStr] || 0 });
                orderData.push({ date: dateStr, orders: dailyOrders[dateStr] || 0 });
                currentDate.setDate(currentDate.getDate() + 1);
            }
        } else if (view === 'monthly') {
            // Monthly view - group by month
            const monthlyRevenue = {};
            const monthlyOrders = {};
            
            orders.forEach(order => {
                const month = order.time.toISOString().slice(0, 7); // YYYY-MM format
                const orderTotal = order.cart.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
                
                monthlyRevenue[month] = (monthlyRevenue[month] || 0) + orderTotal;
                monthlyOrders[month] = (monthlyOrders[month] || 0) + 1;
            });
            
            // Fill in missing months
            const currentMonth = new Date(start.getFullYear(), start.getMonth(), 1);
            const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
            
            while (currentMonth <= endMonth) {
                const monthStr = currentMonth.toISOString().slice(0, 7);
                revenueData.push({ date: monthStr, revenue: monthlyRevenue[monthStr] || 0 });
                orderData.push({ date: monthStr, orders: monthlyOrders[monthStr] || 0 });
                currentMonth.setMonth(currentMonth.getMonth() + 1);
            }
        }
        
        // Get popular items (top 6)
        const itemSales = {};
        orders.forEach(order => {
            order.cart.forEach(item => {
                if (item.product) {
                    const productName = item.product.name;
                    const category = item.product.category;
                    itemSales[productName] = {
                        sold: (itemSales[productName]?.sold || 0) + item.quantity,
                        category: category
                    };
                }
            });
        });
        
        const popularItems = Object.entries(itemSales)
            .map(([name, data]) => ({ name, sold: data.sold, category: data.category }))
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 6);
        
        res.json({
            success: true,
            totalRevenue,
            totalOrders,
            avgOrderValue,
            peakHour,
            peakHourOrders,
            revenueChange,
            ordersChange,
            avgOrderChange,
            revenueData,
            orderData,
            popularItems
        });
        
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Server error generating analytics' });
    }
});

// Place new order (public)
router.post('/orders', async (req, res) => {
    try {
        const { name, email, cart, total, tableNumber } = req.body;
        
        if (!name || !cart || !Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ success: false, message: 'Customer name and cart items are required' });
        }
        
        const newOrder = new orderModel({
            name,
            email: email || '',
            cart,
            total: total || 0,
            tableNumber: tableNumber || 0,
            status: 'pending'
        });
        
        await newOrder.save();
        await newOrder.populate('cart.product', 'name price');
        
        res.json({ success: true, message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        console.error('Place order error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;