const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.post("/", cartController.addToCart);
router.put("/:cartId", cartController.updateCart);
router.delete("/:cartId", cartController.removeFromCart);
router.get("/user/:userId", cartController.getCart);
router.delete("/user/:userId", cartController.clearCart);

module.exports = router;
