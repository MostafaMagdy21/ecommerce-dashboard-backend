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

// middlewares
app.use(express.json());

//routing
app.use("/admin", require("./routes/admins.routes"));
app.use("/card", require("./routes/cards.routes"));
app.use("/category", require("./routes/category.routes"));
app.use("/coupon", require("./routes/coupon.routes"));
app.use("/order", require("./routes/order.routes"));


module.exports = app;
