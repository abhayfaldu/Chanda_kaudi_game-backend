const express = require("express");
const { loginController, registerController, getAllUser, userUpdate } = require("../controllers/user.controller");

const userRouter = express.Router();

// get all users
userRouter.get("/all", getAllUser);

// login route
userRouter.post("/login", loginController);

// register route
userRouter.post("/register", registerController);

// update user route
userRouter.patch("/update/:id", userUpdate);

module.exports = { userRouter };