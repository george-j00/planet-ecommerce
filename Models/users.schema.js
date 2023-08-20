const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }, 
  hashedPassword: {
    type: String,
    required: true
  },
  status:{
    type: Boolean,
  },
  phone: {
    type: Number,
  },
  addresses: [
    {
      country: String,
      streetAddress: String,
      city: String,
      state: String,
      pincode: String,
    },
  ],
  cart: {
    items: [
      {
        productId: String,
        quantity: Number,
        price: Number,
        subtotal: Number,
      },
    ],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
       