const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  couponCode: String,
  discountAmount: Number,
  minPurchase: Number,
  maxPurchase: Number,
  expiryDate: Date,
  usageLimit: {
    type: Number,
    default: 50, // Set the default usage limit to 50 times
  },
  usedCount: {
    type: Number,
    default: 0, // Initialize the usedCount to 0
  },
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
