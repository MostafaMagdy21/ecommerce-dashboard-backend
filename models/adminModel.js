const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema(
	{
		userName: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
	},
	{
		timestamp: true,
	}
);

module.exports = mongoose.model("admin", AdminSchema);
