const mongoose = require('mongoose');

const orderReturnSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  isWholeOrder: {
    type: Boolean,
    default: false
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      productReason: {
        type: String,
        required: true
      }
    }
  ],
  returnReason: {
    type: String,  
    default: "Default reason" 
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const OrderReturn = mongoose.model('OrderReturn', orderReturnSchema);

module.exports = OrderReturn;
