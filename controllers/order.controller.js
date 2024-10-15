const Orders = require("../models/order");
const Cart = require("../models/cart");
const ShippingCost = require("../models/shippingCost");
async function index(req, res) {
  try {
    const allOrders = await Orders.find({}).populate("cart shipping");
    if (allOrders.length) {
      res.status(200).json({
        method: "GET",
        url: `http://localhost:5000/order/`,
        body: allOrders.map((result) => ({
          cart: result.cart,
          shippingCost: result.shipping,
          totalPrice: result.totalPrice,
          status: result.status,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        })),
      });
    } else {
      res.status(404).json({
        method: "GET",
        url: `http://localhost:5000/order/`,
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

async function show(req, res) {
  const { id } = req.params;
  try {
    const singleOrder = await Orders.findById(id).populate("cart shipping");
    if (!singleOrder) {
      return res.status(404).json({
        method: "GET",
        url: `http://localhost:5000/order/${id}`,
        body: { message: "Order Not Found..." },
      });
    }

    const cart = await Cart.findById(singleOrder.cart._id).populate(
      "products userId"
    );

    res.status(200).json({
      method: "GET",
      url: `http://localhost:5000/order/${id}`,
      body: {
        id: singleOrder._id,
        cart,
        shippingCost: singleOrder.shipping,
        totalPrice: singleOrder.totalPrice,
        status: singleOrder.status,
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


async function store(req, res) {
  const { cartId, shippingId } = req.body;

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
    const totalPrice =
      cart.total + shipping.cost;

    // Create a new order
    const newOrder = new Orders({
      cart: cartId,
      shipping: shippingId,
      totalPrice,
    });

    // Save the new order
    await newOrder.save();

    // Clear the cart after creating the order
    await Cart.findByIdAndUpdate(cartId,{products:[]});

    // Send response with success message
    res.status(201).json({
      method: "POST",
      url: `http://localhost:5000/order/`,
      body: { message: "Order created successfully and cart cleared" },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
}


module.exports = {
  store,
  show,
  index,
  updateOrdersStatus,
};
