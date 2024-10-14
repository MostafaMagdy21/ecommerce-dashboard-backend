const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

// Add item to cart
router.post('/add', cartController.addToCart);

// Update cart item
router.put('/update/:cartId', cartController.updateCart);

// Remove product(s) from the cart
router.delete('/remove/:userId', cartController.removeProductsFromCart);




// Get cart items for a specific user
router.get('/:userId', cartController.getCart);

// Clear entire cart for a user
router.delete('/clear/:userId', cartController.clearCart);

module.exports = router;
