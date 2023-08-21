const mongoose = require("mongoose");
const { User } = require("../Models/users.schema")
const { Product } = require("../Models/products.schema")

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    // coupon: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: COUPON,
    //   default : "63d25c73a171f7d607159252"
    // },
    // isCouponApplied: {
    //   type: Boolean,
    //   default : false,
    // },
   
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;