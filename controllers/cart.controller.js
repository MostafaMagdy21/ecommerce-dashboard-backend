const Cart = require("../models/cart");
const Product = require("../models/product");
const User = require("../models/user");
const CouponCode = require("../models/couponCode");
const mongoose = require("mongoose");

// Add item to cart with coupon code validation
async function addToCart(req, res) {
  const { productId, userId, couponCodeId, quantity, price } = req.body;

  if (!productId || !userId || !quantity || !price) {
    return res.status(400).json({ message: "Some fields are missed" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product || quantity > product.quantity) {
      return res
        .status(400)
        .json({ message: "Product not available or insufficient stock" });
    }

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found, you must signup first!" });

    let discount = 0;
    let total = quantity * price;

    if (couponCodeId) {
      const couponCode = await CouponCode.findById(couponCodeId);
      if (!couponCode || couponCode.discountStatus !== "active") {
        return res
          .status(400)
          .json({
            message: "Invalid coupon code or Expired, Contact with Admin!",
          });
      }
      discount = couponCode.discount;
      total -= total * (discount / 100);
    }

    const cart = new Cart({
      productId,
      userId,
      couponCodeId,
      quantity,
      price,
      total,
    });
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update cart item
async function updateCart(req, res) {
  const { cartId } = req.params;
  const { quantity, price, couponCodeId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    return res.status(400).json({ message: "Invalid cart ID" });
  }

  if (!quantity || !price) {
    return res.status(400).json({ message: "Quantity and price are required" });
  }

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const product = await Product.findById(cart.productId);
    if (!product || quantity > product.quantity) {
      return res
        .status(400)
        .json({ message: "Product not available or insufficient stock" });
    }

    let total = quantity * price;

    if (couponCodeId) {
      const couponCode = await CouponCode.findById(couponCodeId);
      if (!couponCode || couponCode.discountStatus !== "active") {
        return res.status(400).json({ message: "Invalid coupon code" });
      }
      total -= total * (couponCode.discount / 100);
    }

    cart.quantity = quantity;
    cart.price = price;
    cart.total = total;
    cart.couponCodeId = couponCodeId;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Remove item from cart
async function removeFromCart(req, res) {
  const { cartId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    return res.status(400).json({ message: "Invalid cart ID" });
  }

  try {
    const cart = await Cart.findByIdAndDelete(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get cart items for a specific user
async function getCart(req, res) {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const cartItems = await Cart.find({ userId })
      .populate("productId")
      .populate("couponCodeId");

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Clear entire cart for a user
async function clearCart(req, res) {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    await Cart.deleteMany({ userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  addToCart,
  updateCart,
  removeFromCart,
  getCart,
  clearCart,
};
