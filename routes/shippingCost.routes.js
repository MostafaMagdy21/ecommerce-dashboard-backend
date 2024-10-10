const express = require("express"),
  router = express.Router(),
  shippingCostController = require("../controllers/shippingCost.controller");

router.get("/", shippingCostController.index);
router.get("/:id", shippingCostController.show);
router.post("/", shippingCostController.store);
router.put("/:id", shippingCostController.update);
router.delete("/:id", shippingCostController.destroy);

module.exports = router;
