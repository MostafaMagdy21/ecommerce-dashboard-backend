const Orders = require("../models/order");
const Cart = require("../models/cart");
const CardController = require("./cart.controller");
const ShippingCost = require("../models/shippingCost");

async function getAllOrders(req, res) {
	try {
		const allOrders = await Orders.find({}).populate("cart shipping");
		if (allOrders.length) {
			res.status(200).json({
				method: "GET",
				url: "http://localhost:5000/order/",
				body: allOrders.map((result) => {
					// const { productId, userId, couponCodeId } = result.cart;
					// const productDetails = Pruducts.findById(productId);
					// const cardDetails = await result.cart.populate("productId");

					return {
						cart: result.cart,
						shippingCost: result.shipping,
						totalPrice: result.totalPrice,
						status: result.status,
						createdAt: result.createdAt,
						updatedAt: result.updatedAt,
					};
				}),
			});
		} else {
			res.status(404).json({
				method: "GET",
				url: "http://localhost:5000/order/",
				body: {
					message: "No Orders Yet ...",
				},
			});
		}
	} catch (err) {
		res.status(500).json({
			message: "Server Error",
			error_message: err.message,
		});
	}
}
async function getSingleOrder(req, res) {
	const { id } = req.params;
	try {
		const singleOrder = await Orders.findById(id).populate("cart shipping");
		console.log(singleOrder);
		const cartId = singleOrder.cart._id;

		const myCart = await Cart.findById(cartId).populate("products userId");

		if (singleOrder) {
			res.status(200).json({
				method: "GET",
				url: `http://localhost:5000/order/${id}`,
				body: {
					id: singleOrder._id,
					cart: myCart,
					shippingCost: singleOrder.shipping,
					totalPrice: singleOrder.totalPrice,
					status: singleOrder.status,
					createdAt: singleOrder.createdAt,
					updatedAt: singleOrder.updatedAt,
				},
			});
		} else {
			res.status(404).json({
				method: "GET",
				url: `http://localhost:5000/order/${id}`,
				body: {
					message: "Order Not Found ...",
				},
			});
		}
	} catch (err) {
		res.status(500).json({
			message: "Server Error",
			error_message: err.message,
		});
	}
}
async function UpdateOrdersStatus(req, res) {
	const { id, newStatus } = req.body;
	try {
		const singleOrder = await Orders.findById(id);
		if (newStatus === "cancel") {
			if (singleOrder.status === "canceled") {
				res.status(200).json({
					message: "the order is olredy canceled",
				});
			} else if (singleOrder.status === "under testing") {
				singleOrder.status = "canceled";
				singleOrder.save().then(() => {
					res.status(200).json({
						singleOrder,
					});
				});
			} else {
				res.status(200).json({
					message: "Sorry, You Can Not Cancel This Order Now",
				});
			}
		} else if (newStatus === "close") {
			if (singleOrder.status === "closed") {
				res.status(200).json({
					message: "the order is olredy closed",
				});
			} else {
				singleOrder.status = "closed";
				singleOrder.save().then(() => {
					res.status(200).json({
						message: "order closed successfully",
					});
				});
			}
		} else {
			res.status(200).json({
				message: "the status you choosed is not allowed",
			});
		}
	} catch (err) {
		res.status(500).json({
			message: "Server Error",
			error_message: err.message,
		});
	}
}
function getOrdersByUser(req, res) {}

async function createOrder(req, res) {
	const { cartId, shippingId } = req.body;
	try {
		const cart = await Cart.findById(cartId).populate("products userId");
		if (!cart) {
			return res.status(404).json({ message: "Cart not found" });
		}
		const shipping = await ShippingCost.findById(shippingId);
		if (!shipping) {
			return res.status(404).json({ message: "Shipping option not found" });
		}
		const totalPrice = cart.total + shipping.cost;
		const newOrder = new Orders({
			cart: cartId,
			shipping: shippingId,
			totalPrice: totalPrice,
		});

		newOrder.save();
		// CardController.clearCart();

		res.status(201).json({
			method: "POST",
			url: "http://localhost:5000/order/",
			body: {
				message: "Order created successfully",
			},
		});
	} catch (error) {
		res.status(500).json({
			message: "Server Error",
			error: error.message,
		});
	}
}
module.exports = {
	createOrder,
	getSingleOrder,
	getAllOrders,
	UpdateOrdersStatus,
};
