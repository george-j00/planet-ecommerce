const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productTitle: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
  },
  
  productImages: [
    {
      secure_url: { type: String },
      cloudinary_id: { type: String }
    }
  ],
  category: {
    type: String,
    // enum: ["indoor", "outdoor"],
    required: true
},
  additionalInformation: {
    type: String,
  },
});



const Product = mongoose.model('Product', productSchema);

module.exports = Product;
