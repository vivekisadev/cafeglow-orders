const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    name:{
        type:String
    },
    cart:[{
         product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
         quantity: { type: Number, required: true }
    }],
    instructions:{
        type:String
    },
    total:{
        type:Number
    }
    ,
     time: {
    type: Date,
    default: Date.now
  },
  
  tableNumber:{
    type:Number,
    default:0
  },
  
  email:{
    type:String
    
  }
})

const orderModel = mongoose.model('order',orderSchema);

module.exports = orderModel