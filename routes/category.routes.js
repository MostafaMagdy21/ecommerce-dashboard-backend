const express = require("express");
const router = express.Router();
const {
	createCategory,
	updateCategory,
	deleteCategory,
	showAllCategories,
	showSingleCategory,
} = require("../controllers/category.controller");

router.get("/", showAllCategories);
router.get("/:id", showSingleCategory);
router.post("/create", createCategory);
router.post("/update", updateCategory);
router.delete("/delete", deleteCategory);

module.exports = router;
