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
   const {email,password} = req.body;
   const admin = await adminModel.findOne({ email: email});

   if(!admin){
   return res.status(404).send({message: "Admin not found"});
   }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if(!isPasswordValid){
        return res.status(401).send({message: "Admin not found"});
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    res.cookie('token', token);

    const orders = await orderModel.find().populate('cart.product');


    res.render('dashboard',{admin , orders})
    // res.send({message: "Login successful"},token);
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
    res.status(201).json({ success:true, message:"successfully changed"});
  
});

router.get('/logout',(req, res) => {
    res.clearCookie('token');
    res.send({ message: "Logged out successfully" });
})






module.exports = router;