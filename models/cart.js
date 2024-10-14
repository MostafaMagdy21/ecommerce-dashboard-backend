const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    couponCodeId: {
      type: Schema.Types.ObjectId,
      ref: "CouponCode",
      default: null,
    },
  },
  { _id: false } 
);

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensures each user can only have one cart
    },
    products: [cartItemSchema], // Array of products in the cart
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
