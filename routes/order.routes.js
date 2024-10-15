const express = require("express"),
	router = express.Router(),
	orderController = require("../controllers/order.controller");

router.post("/", orderController.store);
router.get("/:id", orderController.show);
router.get("/", orderController.index);
router.put("/update/:id", orderController.updateOrdersStatus);

module.exports = router;
