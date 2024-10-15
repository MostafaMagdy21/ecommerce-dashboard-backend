const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema(
	{
		categoryName: {type :String ,required :true },
		description: {type :String},
		
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Category", CategorySchema);
