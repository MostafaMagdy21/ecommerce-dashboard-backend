const express = require("express");
const router = express.Router();
const {
	createAdmin,
	deleteAdmin,
	getSingleAdmin,
	getAllAdmins,
	updateAdmin,
} = require("../controllers/adminController");

router.get("/", getAllAdmins);
router.get("/:id", getSingleAdmin);
router.post("/create", createAdmin);
router.post("/update", updateAdmin);
router.delete("/delete", deleteAdmin);

module.exports = router;
