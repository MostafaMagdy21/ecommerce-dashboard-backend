const express = require("express");
const router = express.Router();
const {
	createCard,
	updateCard,
	getCard,
} = require("../controllers/cardController");

router.get("/:id", getCard);

router.post("/create", createCard);

router.post("/update", updateCard);

module.exports = router;
