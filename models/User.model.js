const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: String,
		email: {
			type: String,
			required: [true, "Please provide First Name"],
		},
		password: {
			type: String,
			required: [true, "Please Provide Password"],
		},
		image: String,
		score: { type: Number, default: 0 },
		won: { type: Number, default: 0 },
		lose: { type: Number, default: 0 },
	},
	{ versionKey: false }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
