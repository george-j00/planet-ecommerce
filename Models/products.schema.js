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
  // productImage: {
  //   data: Buffer, // You can also store the image path or URL
  //   ContentType: String, //
  // },
  // productImage: [{
  //   filename: { 
  //     type: String, 
  //     required: true
  //    },
  //    data: {
  //     type: Buffer,
  //     required: true 
  //     }
  // }],
  productImage:{
    type: String,
},
cloudinary_id: {
  type: String,
},
  category: {
    type: String,
    enum: ["indoor", "outdoor"],
    required: true
},
  additionalInformation: {
    type: String,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
