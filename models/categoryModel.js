const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema(
	{
		name: String,
		description: String,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("category", CategorySchema);
