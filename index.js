const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const connectDB = require("./configs/db.js");
require("dotenv").config();
const { userRouter } = require("./routes/User.route.js");
const { Server } = require("socket.io");
app.use(cors());

const server = https.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

io.on("connection", socket => {
	const userID = socket.id;
	console.log("connected to " + userID);

	socket.on("join_room", room => {
		try {
			socket.join(room);
			console.log(`User with ID: ${userID} joined room ${room}`);
		} catch (err) {
			fs.writeFileSync("/data.txt", err);
		}
	});

	socket.on("send_message", messageData => {
		// console.log('messageData:', messageData)
		socket.to(messageData.room).emit("receive_message", messageData);
	});

	socket.on("player_played", boardState => {
		// console.log("boardState:", boardState);
		socket
			.to(boardState.room)
			.emit("player_played_server_to_client", boardState);
	});

	socket.on("disconnect", () => {
		console.log("disconnected from " + userID);
	});
});

app.use(express.json());

app.get("/", async (req, res) => {
	res.send("Welcome to home page!");
});

app.use("/user", userRouter);

server.listen(3001, async () => {
	try {
		await connectDB;
		console.log("DB connected");
	} catch (error) {
		console.log(error);
	}
	console.log("SERVER RUNNING");
});
