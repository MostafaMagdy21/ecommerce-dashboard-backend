const Cart = require('../models/cart');

// Add item to cart
exports.addToCart = async (req, res) => {
  const { productId, userId, couponCodeId, quantity, price } = req.body;
  try {
    const total = quantity * price; // Calculate total price
    const cart = new Cart({ productId, userId, couponCodeId, quantity, price, total });
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user cart
exports.getCartByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.find({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update cart item (e.g., quantity or coupon)
exports.updateCart = async (req, res) => {
  const { cartId } = req.params;
  const { quantity, price } = req.body;
  try {
    const total = quantity * price;
    const cart = await Cart.findByIdAndUpdate(cartId, { quantity, price, total }, { new: true });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await Cart.findByIdAndDelete(cartId);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

