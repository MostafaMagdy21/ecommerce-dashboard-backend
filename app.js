const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

//database connection
mongoose.connect(process.env.DB_URL);
const conn = mongoose.connection;
conn.once("open", () =>
	console.log(`Database Connected Successfully At Link ${process.env.DB_URL}`)
);
conn.on("error", (err) => console.log("connection faild"));

// meddlwares
app.use(express.json());

//routing

module.exports = app;
