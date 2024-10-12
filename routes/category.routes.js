const express = require("express"),
router = express.Router(),
CategoryController =require('../controllers/category.controller');


router.get("/", CategoryController.showAllCategories);
router.get("/:id",CategoryController.showSingleCategory);
router.post("/create", CategoryController.createCategory);
router.put("/:id",CategoryController.updateCategory);
router.delete("/:id",CategoryController.deleteCategory);

module.exports = router;
