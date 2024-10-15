const Cart = require("../models/cart");
const Product = require("../models/product");
const User = require("../models/user");
const CouponCode = require("../models/couponCode");
const mongoose = require("mongoose");



async function addToCart(req, res) {
  const { productId, userId, couponCodeId, quantity } = req.body;

  if (!productId || !userId || !quantity) {
    return res.status(400).json({ message: "Some fields are missed" });
  }

  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be positive" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product || quantity > product.quantity) {
      return res
        .status(400)
        .json({ message: "Product not available or insufficient stock" });
    }

    // Extract the base price and check if there's a discount
    const price =
      product.price.discount > 0 ? product.price.discount : product.price.base;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, you must signup first!" });
    }

    let discount = 0;
    let total = quantity * price;

    // Coupon code validation
    if (couponCodeId) {
      const couponCode = await CouponCode.findById(couponCodeId);
      const currentDate = new Date();

      if (
        !couponCode ||
        couponCode.discountStatus !== "active" ||
        currentDate < couponCode.startDate ||
        currentDate > couponCode.endDate
      ) {
        return res.status(400).json({
          message: "Invalid coupon code or expired",
        });
      }

      discount = couponCode.discount;
      total -= total * (discount / 100); // Apply discount to total price
    }

    // Find existing cart for the user
    let cart = await Cart.findOne({ userId });
    if (cart) {
      const existingProduct = cart.products.find(
        (item) => item.productId.toString() === productId
      );
      if (existingProduct) {
        // Update the quantity and total for the existing product
        existingProduct.quantity += quantity;
        existingProduct.total =
          existingProduct.quantity * price -
          existingProduct.quantity * price * (discount / 100);
      } else {
        cart.products.push({
          productId,
          quantity,
          price,
          total,
          couponCodeId,
        });
      }
    } else {
      // Create a new cart for the user
      cart = new Cart({
        userId,
        products: [
          {
            productId,
            quantity,
            price,
            total,
            couponCodeId,
          },
        ],
      });
    }

    await cart.save();
    product.quantity -= quantity; // Decrement stock
    await product.save();

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



// Update cart item
async function updateCart(req, res) {
  const { cartId } = req.params;
  const { quantity, couponCodeId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    return res.status(400).json({ message: "Invalid cart ID" });
  }

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be positive" });
  }

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const product = await Product.findById(cart.productId);
    if (!product || quantity > product.quantity + cart.quantity) {
      return res
        .status(400)
        .json({ message: "Product not available or insufficient stock" });
    }

    // Use discount price if available, otherwise use base price
    const price =
      product.price.discount > 0 ? product.price.discount : product.price.base;
    let total = quantity * price;

    if (couponCodeId) {
      const couponCode = await CouponCode.findById(couponCodeId);
      const currentDate = new Date();

      if (
        !couponCode ||
        couponCode.discountStatus !== "active" ||
        currentDate < couponCode.startDate ||
        currentDate > couponCode.endDate
      ) {
        return res.status(400).json({ message: "Invalid coupon code" });
      }

      total -= total * (couponCode.discount / 100);
    }

    // Update stock
    product.quantity += cart.quantity; // restore previous quantity
    product.quantity -= quantity; // reduce by the new quantity
    await product.save();

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

// Remove product(s) from the cart
async function removeProductsFromCart(req, res) {
  const { userId } = req.params;
  const { productIds } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ message: "productIds must be an array and cannot be empty" });
  }

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Loop through the productIds and remove each from the cart's products array
    cart.products = cart.products.filter(
      (item) => !productIds.includes(item.productId.toString())
    );

    // Restore stock for each removed product
    for (const productId of productIds) {
      const product = await Product.findById(productId);
      if (product) {
        const removedItem = cart.products.find(item => item.productId.toString() === productId);
        if (removedItem) {
          product.quantity += removedItem.quantity; // Restore stock
          await product.save();
        }
      }
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Products removed from cart successfully", cart });
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
      .populate("products.productId")
      .populate("products.couponCodeId");

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
    const cartItems = await Cart.find({ userId });

    // Restore stock for each product in the cart
    for (const cartItem of cartItems) {
      const product = await Product.findById(cartItem.productId);
      if (product) {
        product.quantity += cartItem.quantity;
        await product.save();
      }
    }

    await Cart.deleteMany({ userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  addToCart,
  updateCart,
  removeProductsFromCart,
  getCart,
  clearCart,
};
