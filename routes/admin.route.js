const express = require('express');
const router = express.Router();
const adminModel = require('../models/admin.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isLoggedIn = require('../middlewares/isLoggedIn.js');
const productModel = require('../models/products.model.js');
const orderModel = require('../models/orders.model.js')

router.get('/',(req,res)=>{
    res.render('admin')
})

router.post('/register', async (req, res) => {
   const {name,email,password} = req.body;

   const admin = await adminModel.findOne({ email: email});
   if(admin){
   return res.status(400).send({message: "Admin already exists"});
   }

   const hashedPassword = await bcrypt.hash(password, 10);
   const newAdmin = new adminModel({
       name,
       email,
       password: hashedPassword
   });
   await newAdmin.save();


   const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET);
    res.cookie('token', token);

   res.status(201).send({message: "Admin registered successfully", token});
});



router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);
        
        // Find admin by email
        const admin = await adminModel.findOne({ email });
        
        if (!admin) {
            console.log('Admin not found for email:', email);
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        
        console.log('Admin found, checking password...');
        // Check password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        
        if (!isPasswordValid) {
            console.log('Password invalid for admin:', admin.email);
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
        
        // Set token as cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        // Fetch real data for dashboard
        const orders = await orderModel.find()
            .populate('cart.product')
            .sort({ createdAt: -1 })
            .limit(10);
        
        const totalOrders = await orderModel.countDocuments();
        const totalProducts = await productModel.countDocuments();
        
        // Calculate total revenue from completed orders
        const completedOrders = await orderModel.find({ status: 'completed' });
        const totalRevenue = completedOrders.reduce((sum, order) => {
            return sum + order.cart.reduce((cartSum, item) => cartSum + (item.price * item.quantity || 0), 0);
        }, 0);
        
        // Real dashboard data
        const dashboardData = {
            totalOrders: totalOrders,
            totalProducts: totalProducts,
            totalRevenue: totalRevenue,
            recentOrders: orders
        };
        
        // Render full dashboard with sidebar
        res.render('dashboard', { 
            admin: admin,
            orders: orders,
            dashboardData: dashboardData
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});


router.post('/add-products', isLoggedIn, async (req, res) => {
   const { name, image, price, description, category, ingredients } = req.body;

   const newProduct = await productModel.create({
      name,
      category,
      price,
      description,
      image,
      ingredients
   });
   if(!newProduct){
       return res.status(500).send({ message: "Failed to add product" });
   }

   res.status(201).json({ success: true, message: "Product added successfully!" });
});

router.put('/update-product/:id', async (req, res) => {
  try {
    await productModel.findByIdAndUpdate(req.params.id, { availability: req.body.availability });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/logout', (req, res) => {
    try {
        res.clearCookie('token');
        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: "Error during logout" });
    }
});

// Product management routes
router.get('/products', async (req, res) => {
    try {
        const products = await productModel.find().sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error fetching product' });
    }
});

router.put('/products/:id', isLoggedIn, async (req, res) => {
    try {
        const { name, category, price, description, image, ingredients, availability } = req.body;
        
        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id,
            { name, category, price, description, image, ingredients, availability },
            { new: true, runValidators: true }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({ success: true, message: 'Product updated successfully!', product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error updating product' });
    }
});

router.delete('/products/:id', isLoggedIn, async (req, res) => {
    try {
        const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully!' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
});

// GET route for dashboard content - used by handleDashboardHome function
router.get('/dashboard-content', async (req, res) => {
    try {
        // Fetch real data for dashboard
        const orders = await orderModel.find()
            .populate('cart.product')
            .sort({ time: -1 })
            .limit(10);
        
        const totalOrders = await orderModel.countDocuments();
        const totalProducts = await productModel.countDocuments();
        
        // Calculate total revenue from completed orders
        const completedOrders = await orderModel.find({ status: 'completed' });
        const totalRevenue = completedOrders.reduce((sum, order) => {
            return sum + order.cart.reduce((cartSum, item) => cartSum + (item.price * item.quantity || 0), 0);
        }, 0);
        
        // Real dashboard data
        const dashboardData = {
            totalOrders: totalOrders,
            totalProducts: totalProducts,
            totalRevenue: totalRevenue,
            recentOrders: orders
        };
        
        // Render dashboard content only (for AJAX requests)
        res.render('dashboard_content', { dashboardData: dashboardData });
        
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Server error loading dashboard' });
    }
});

// Route to update order status
router.put('/update-order/:id', async (req, res) => {
    try {
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ['pending', 'preparing', 'packing', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        
        // Update the order
        const updatedOrder = await orderModel.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );
        
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json({ success: true, message: 'Order status updated successfully' });
        
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error updating order status' });
    }
});

// Analytics endpoint for detailed statistics
router.get('/analytics', async (req, res) => {
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






// Profile update route
router.post('/profile/update', isLoggedIn, async (req, res) => {
    try {
        const { name, email, phone, currentPassword, newPassword } = req.body;
        console.log('Profile update request received:', { name, email, phone, hasCurrentPassword: !!currentPassword, hasNewPassword: !!newPassword });
        console.log('Request body:', req.body);
        console.log('User from token:', req.user);
        
        const adminId = req.user.adminId; // Fixed: use req.user.adminId from JWT token

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
            message: 'Profile updated successfully!',
            admin: {
                name: admin.name,
                email: admin.email,
                phone: admin.phone
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, message: 'Server error updating profile' });
    }
});

module.exports = router;