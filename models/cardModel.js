const mongoose = require("mongoose");
const { Schema } = mongoose;

const CardSchema = new Schema({
	title: String,
	quentity: Number,
	price: Number,
	total: Number,
});

module.exports = mongoose.model("card", CardSchema);
