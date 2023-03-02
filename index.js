const express = require("express");
const connectDB = require("./configs/db.js");
require("dotenv").config();
const { userRouter } = require("./routes/User.route.js");

const app = express();
app.use(express.json());

// app.get("/", (req, res) => {
// 	res.send("Welcome to home page!");
// });

app.use("/user", userRouter);

app.listen(process.env.PORT, async () => {
	try {
		await connectDB;
		console.log("DB connected");
	} catch (error) {
		console.log(error);
	}
	console.log(
		`Your server is listening to http://localhost:${process.env.PORT}`
	);
});
