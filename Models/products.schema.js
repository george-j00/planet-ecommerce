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
    required: true
  },
  status: {
    type: String,
    enum: ["active", "deleted"],
    default: "active"
  },
  additionalInformation: {
    type: String,
  },
  productHasDiscount:{
    type: Boolean,
    default:false
  },
  offers: [
    {
      offerName: { type: String },
      discountPercentage: { type: Number },
      startDate: { type: Date },
      endDate: { type: Date },
    }
  ],
});



const Product = mongoose.model('Product', productSchema);

module.exports = Product;
