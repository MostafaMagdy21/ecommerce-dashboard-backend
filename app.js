require("dotenv").config();
const express = require("express");
const app = express();
const cartRoutes = require("./routes/carts.routes");
const mongoose = require("mongoose");
const cors = require("cors");
const path =require("path");
//database connection
mongoose.connect(process.env.DB_ONLINE);
const conn = mongoose.connection;
conn.once("open", () => console.log(`Database Connected Successfully`));
conn.on("error", (err) => console.log("connection failed", err.message));

// middlewares
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(cors());

//routing
app.use("/admins", require("./routes/admins.routes"));
app.use("/users", require("./routes/user.routes"));
app.use("/carts", cartRoutes);
app.use("/coupons", require("./routes/coupon.routes"));
app.use("/orders", require("./routes/order.routes"));
app.use("/shippingCosts", require("./routes/shippingCost.routes"));
app.use("/products", require("./routes/product.routes"));
app.use("/categories", require("./routes/category.routes"));
app.use("/reviews", require("./routes/review.routes"));

module.exports = app;
