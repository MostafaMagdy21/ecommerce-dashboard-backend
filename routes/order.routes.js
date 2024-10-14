const express = require("express"),
	router = express.Router(),
	orderController = require("../controllers/order.controller");

router.post("/", orderController.createOrder);
router.get("/:id", orderController.getSingleOrder);
router.get("/", orderController.getAllOrders);
router.put("/update/:id", orderController.UpdateOrdersStatus);

module.exports = router;
