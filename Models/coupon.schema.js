const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  couponCode: String,
  discountAmount: Number,
  minPurchase: Number,
  expiryDate: { 
    type: Date,
    expires: 0, // TTL index with immediate expiration
  },
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
