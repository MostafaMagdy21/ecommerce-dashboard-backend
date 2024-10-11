const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

// Add item to cart (POST /cart)
router.post('/', cartController.addToCart);

// Get cart items for a specific user (GET /cart/:userId)
router.get('/:userId', cartController.getCartByUserId);

// Update a cart item (PUT /cart/:cartId)
router.put('/:cartId', cartController.updateCart);

// Remove an item from cart (DELETE /cart/:cartId)
router.delete('/:cartId', cartController.removeFromCart);

module.exports = router;
