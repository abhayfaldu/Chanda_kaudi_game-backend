const { comparePassword, hashedPassword } = require("../helper/authPassword");
const userModel = require("../models/User.model");
const JWT = require("jsonwebtoken");
require("dotenv").config()

// user register
exports.registerController = async (req, res) => {
	try {
		const { name, email, password, image } = req.body;
		//validations
		if (!email) {
			return res.send({ error: "Email is Required" });
		}
		if (!password) {
			return res.send({ error: "Password is Required" });
		}

		//existing user
		const existingUser = await userModel.findOne({ email });

		if (existingUser) {
			return res
				.status(409)
				.send({ success: false, message: "Already Registered Please Login " });
		}
		const hashPassword = await hashedPassword(password);

		const user = new userModel({
			name,
			email,
      password: hashPassword,
      image
		});
		await user.save();

		res
			.status(201)
			.send({ success: true, message: "User Registered Successfully", user });
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.send({ success: false, message: "Error in Registration", error });
	}
};

// user login
exports.loginController = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			res
				.status(404)
				.send({ success: false, message: "Invalid Email or Password" });
		}

		//check user
		const user = await userModel.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.send({ success: false, message: "Email is not registered" });
		}

		// check  password
		const match = await comparePassword(password, user.password);
		if (!match) {
			return res.status(200).send({
				success: false,
				message: "Invalid Email or Password",
			});
		}

		// token
		const token = await JWT.sign({ _id: user._id }, process.env.SECRET_KEY, {
			expiresIn: "7d",
		});

		res.status(200).send({
			success: true,
			message: "login successful",
			user: {
				id: user._id,
				name: user.name,
        email: user.email,
			},
			token,
		});
	} catch (error) {
		return res
			.status(404)
			.send({ success: false, message: "Email is not registered" });
	}
};

// get all users
exports.getAllUser = async (req, res) => {
	try {
		const users = await userModel.find().select("-password");
		if (!users) {
			return res
				.status(404)
				.send({ success: false, message: "Users Not Found" });
		}
		return res.status(200).send({ success: true, users, total: users.length });
	} catch (error) {
		return res.status(500).send({
			success: false,
			message: "Something went wrong",
			error: error.message,
		});
	}
};

// update user
exports.userUpdate = async (req, res) => {
	delete req.body.password;
	const ID = req.params.id;
	try {
		const user = await userModel.findByIdAndUpdate({ _id: ID }, req.body);
		res
			.status(200)
			.send({ success: true, message: "User Updated Successfully" });
	} catch (error) {
		res.status(404).send({ success: false, message: "User Not Found" });
	}
};