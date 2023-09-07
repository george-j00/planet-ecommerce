const mongoose = require('mongoose');
const Product = require('./products.schema');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  shippingAddress: {
    name: { type: String, required: true },
    country: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true },
  shippingCharge: { type: Number, required: true },
  subtotals: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  createdOn: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending','Placed', 'Shipped', 'Delivered','Canceled','Returned'], default: 'Pending' },
  deliveredOn: { type: Date },
  razorpayOrderId:{type: String},
  isCouponApplied: {
    type: Boolean,
    default : false,
  }
});


// Define the pre middleware to update product quantities
orderSchema.pre('save', async function (next) {
  const itemsToUpdate = this.items; // Get the items from the order
  const promises = itemsToUpdate.map(async item => {
    const product = await Product.findById(item.productId);
    if (product) {
      if (this.status === 'Placed') {
        product.totalQuantity -= item.quantity; // Reduce the product quantity on order placement
        if (product.totalQuantity < 0) {
          // Handle case where there are insufficient products
          console.log('Insufficient products for order:', this._id);
          throw new Error('Insufficient products');
        }
      } else if (this.status === 'Canceled' || this.status === 'Approved') {
        let returnedQuantity = 0;
        if (this.status === 'Canceled') {
          returnedQuantity = item.quantity; // Increment the product quantity on order cancellation
        } else if (this.status === 'Approved' && item.productReason === 'baad') {
          returnedQuantity = 1; // Increment the product quantity on return approval
        }

        product.totalQuantity += returnedQuantity;
      }

      await product.save(); // Save the changes to the product
    } else {
      console.log('Product not found for item:', item.productId);
      throw new Error('Product not found');
    }
  });

  try {
    await Promise.all(promises); // Wait for all product updates to complete
    next();
  } catch (error) {
    console.error('Error updating product quantities:', error);
    // Handle the error here (e.g., send an error response to the client)
  }
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
