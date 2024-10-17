const Orders = require("../models/order");
const Cart = require("../models/cart");
const ShippingCost = require("../models/shippingCost");
const mongoose = require("mongoose");

// async function index(req, res) {
//   try {
//     const allOrders = await Orders.find({}).populate("cart shipping");
//     if (allOrders.length) {
//       res.status(200).json({
//         method: "GET",
//         url: `http://localhost:5000/orders/`,
//         body: allOrders.map((result) => ({
//           //   id: result._id,
//           cart: result.cart,
//           shippingCost: result.shipping,
//           totalPrice: result.totalPrice,
//           status: result.status,
//           createdAt: result.createdAt,
//           updatedAt: result.updatedAt,
//         })),
//       });
//     } else {
//       res.status(404).json({
//         method: "GET",
//         url: `http://localhost:5000/orders/`,
//         body: {
//           message: "No Orders Yet...",
//         },
//       });
//     }
//     // Orders.find({})
//     // 	.populate("cart shipping")
//     // 	.then((result) => {
//     // 		result.map((order) => {
//     // 			Cart.find({ _id: order.cart?._id })
//     // 				.populate("products.productId")
//     // 				.populate("userId")
//     // 				.then((results) => {
//     // 					res.status(200).json({
//     // 						method: "GET",
//     // 						url: `http://localhost:5000/orders/`,
//     // 						body: results,
//     // 					});
//     // 				});
//     // 		});
//     // 	});
//   } catch (err) {
//     res.status(500).json({
//       message: "Server Error",
//       error_message: err.message,
//     });
//   }
// }

async function indexMod(req, res) {
  try {
    const allOrders = await Orders.find({}).populate(
      "userId",
      "_id fname lname email phone"
    );
    if (allOrders.length) {
      res.status(200).json({
        method: "GET",
        url: `http://localhost:5000/orders/`,
        results: allOrders.map((order) => {
          return {
            id: order._id,
            cart: order.cart,
            shipping: order.shipping,
            status: order.status,
            products: order.products,
            userName: `${order.userId.fname} ${order.userId.lname}`,
            userId: order.userId._id,
            totalPrice: order.totalPrice,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          };
        }),
      });
    } else {
      res.status(404).json({
        method: "GET",
        url: `http://localhost:5000/orders/`,
        body: {
          message: "No Orders Yet...",
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

// async function show(req, res) {
// 	const { id } = req.params;
// 	if (!mongoose.Types.ObjectId.isValid(id)) {
// 		return res.status(400).json({ message: "Invalid order ID" });
// 	}
// 	try {
// 		const singleOrder = await Orders.findById(id)
// 			.populate("cart", "couponCodeId")
// 			.populate("shipping", "place cost");
// 		if (!singleOrder) {
// 			return res.status(404).json({
// 				method: "GET",
// 				url: `http://localhost:5000/orders/${id}`,
// 				body: { message: "Order Not Found..." },
// 			});
// 		}

// 		const cart = await Cart.findById(singleOrder.cart._id)
// 			.populate(
// 				"products.productId",
// 				"price options sku title description images quantity tags rating"
// 			)
// 			.populate("userId", "fname lname email phone");

// 		res.status(200).json({
// 			method: "GET",
// 			url: `http://localhost:5000/orders/${id}`,
// 			body: {
// 				id: singleOrder._id,
// 				cart,
// 				shippingCost: singleOrder.shipping,
// 				totalPrice: singleOrder.totalPrice,
// 				status: singleOrder.status,
// 				createdAt: singleOrder.createdAt,
// 				updatedAt: singleOrder.updatedAt,
// 			},
// 		});
// 	} catch (err) {
// 		res.status(500).json({
// 			message: "Server Error",
// 			error_message: err.message,
// 		});
// 	}
// }

async function showMod(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }
  try {
    const singleOrder = await Orders.findById(id)
      .populate("userId", "_id fname lname email phone")
      .populate("products.productId", "_id options.size sku title images");
    if (!singleOrder) {
      return res.status(404).json({
        method: "GET",
        url: `http://localhost:5000/orders/${id}`,
        body: { message: "Order Not Found..." },
      });
    }

    return res.status(200).json({
      method: "GET",
      url: `http://localhost:5000/orders/${id}`,
      results: {
        id: singleOrder._id,
        cart: singleOrder.cart,
        shipping: singleOrder.shipping,
        status: singleOrder.status,
        products: singleOrder.products.map((product) => {
          return {
            productId: product.productId._id,
            sku: product.productId.sku,
            title: product.productId.title,
            images: product.productId.images[0],
            size: product.productId.options.size[0],
            quantity: product.quantity,
          };
        }),
        userName: `${singleOrder.userId.fname} ${singleOrder.userId.lname}`,
        userId: singleOrder.userId._id,
        totalPrice: singleOrder.totalPrice,
        createdAt: singleOrder.createdAt,
        updatedAt: singleOrder.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error_message: err.message,
    });
  }
}

async function updateOrdersStatus(req, res) {
  const { id, newStatus } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }
  try {
    const singleOrder = await Orders.findById(id);
    if (!singleOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (newStatus === "cancel") {
      if (singleOrder.status === "canceled") {
        return res
          .status(400)
          .json({ message: "The order is already canceled." });
      }
      if (singleOrder.status === "under testing") {
        singleOrder.status = "canceled";
      } else {
        return res
          .status(400)
          .json({ message: "Sorry, you cannot cancel this order now." });
      }
    } else if (newStatus === "close") {
      if (singleOrder.status === "closed") {
        return res
          .status(400)
          .json({ message: "The order is already closed." });
      }
      singleOrder.status = "closed";
    } else {
      return res
        .status(400)
        .json({ message: "The status you chose is not allowed." });
    }

    await singleOrder.save();
    res
      .status(200)
      .json({ message: `Order ${newStatus} successfully`, singleOrder });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error_message: err.message,
    });
  }
}

// async function store(req, res) {
//   const { cartId, shippingId } = req.body;
//   if (!mongoose.Types.ObjectId.isValid(cartId)) {
//     return res.status(400).json({ message: "Invalid card ID" });
//   }
//   if (!mongoose.Types.ObjectId.isValid(shippingId)) {
//     return res.status(400).json({ message: "Invalid shipping ID" });
//   }

//   try {
//     // Find the cart by ID
//     const cart = await Cart.findById(cartId);
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     // Find the shipping cost by ID
//     const shipping = await ShippingCost.findById(shippingId);
//     if (!shipping) {
//       return res.status(404).json({ message: "Shipping option not found" });
//     }

//     // Calculate total price (add shipping cost to cart total)
//     const totalPrice = cart.total + shipping.cost;

//     // Create a new order
//     const newOrder = new Orders({
//       cart: cartId,
//       shipping: shippingId,
//       totalPrice,
//     });

//     // Save the new order
//     await newOrder.save();

//     // Clear the cart after creating the order
//     // await Cart.findByIdAndUpdate(cartId, { products: [], total: 0 });

//     // Send response with success message
//     res.status(201).json({
//       method: "POST",
//       url: `http://localhost:5000/orders/`,
//       body: { message: "Order created successfully and cart cleared" },
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// }

async function storeMod(req, res) {
  const { cartId, shippingId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    return res.status(400).json({ message: "Invalid card ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(shippingId)) {
    return res.status(400).json({ message: "Invalid shipping ID" });
  }

  try {
    // Find the cart by ID
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the shipping cost by ID
    const shipping = await ShippingCost.findById(shippingId);
    if (!shipping) {
      return res.status(404).json({ message: "Shipping option not found" });
    }

    // Calculate total price (add shipping cost to cart total)
    const cartTotal = cart.products.reduce((prev, curr) => {
      prev += curr.total;
      return prev;
    }, 0);
    const totalPrice = cartTotal + shipping.cost;

    // Create a new order
    const newOrder = new Orders({
      cart: cartId,
      shipping: shippingId,
      products: cart.products,
      userId: cart.userId,
      totalPrice,
    });

    // Save the new order
    await newOrder.save();

    // Clear the cart after creating the order
    await Cart.findByIdAndUpdate(cartId, { products: [], total: 0 });

    // Send response with success message
    res.status(201).json({
      method: "POST",
      url: req.originalUrl,
      body: { message: "Order created successfully and cart cleared" },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
}

//* original
// async function getOrdersByUser(req, res) {
//   const { id } = req.params;
//   try {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid user ID" });
//     }
//     const allOrders = await Orders.find({}).populate("cart");
//     const userOrders = allOrders.find((order) => {
//       return order.cart.userId == id;
//     });
//     res.status(200).json({
//       userOrders,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Server Error",
//       error_message: err.message,
//     });
//   }
// }

async function getOrdersByUser(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    Orders.find({ userId: id })
      .populate("shipping", "place")
      .then((orders) => {
        if (orders.length > 0) {
          res.status(200).json({
            method: "GET",
            url: `http://localhost:5000/orders/users/${id}`,
            results: orders.map((order) => {
              return {
                id: order._id,
                cart: order.cart,
                status: order.status,
                products: order.products,
                totalPrice: order.totalPrice,
                city: order.shipping.place,
                createdAt: order.createdAt,
              };
            }),
          });
        } else {
          return res.status(404).json({
            method: "GET",
            url: `http://localhost:5000/orders/`,
            body: {
              message: "No Orders Yet...",
            },
          });
        }
      });
    // const userOrders = allOrders.find({}).then((results) => {
    //   res.json({
    //     results: results,
    //   });
    // });
    // res.status(200).json({
    //   userOrders,
    // });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error_message: err.message,
    });
  }
}

module.exports = {
  storeMod,
  showMod,
  indexMod,
  updateOrdersStatus,
  getOrdersByUser,
};
