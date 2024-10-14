const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const order = new Schema(
	{
		cart: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
		shipping: {
			type: Schema.Types.ObjectId,
			ref: "ShippingCost",
			required: false,
		},
		totalPrice: { type: String, required: true },
		status: { type: String, default: "under testing" },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("order", order);
