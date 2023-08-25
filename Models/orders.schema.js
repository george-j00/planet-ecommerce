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
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' },
  deliveredOn: { type: Date },
 
});

// Define the pre middleware to update product quantities
orderSchema.pre('save', async function (next) {
  const itemsToUpdate = this.items; // Get the items from the order
  const promises = itemsToUpdate.map(async item => {
    const product = await Product.findById(item.productId);
    if (product) {
      product.totalQuantity -= item.quantity; // Reduce the product quantity
      await product.save(); // Save the changes to the product
    }else{
      console.log('Insufficient items');
    }
  });

  await Promise.all(promises); // Wait for all product updates to complete
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
