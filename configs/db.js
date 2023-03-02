const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = mongoose.connect(process.env.MONGO_ATLAS_URL);

module.exports = connectDB;
