import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";

const router = express.Router();

// Create an new order

router.post("/", async (req, res) => {
  const io = req.app.get("socketio");
  const { userId, cart, address, city } = req.body;
  try {
    const user = await User.findById(userId);
    const order = await Order.create({
      owner: userId,
      products: cart,
      address,
      city,
    });

    // Update the order count and total based on the cart

    order.count = cart.count;
    order.total = cart.total;
    await order.save();

    // Clear the user's cart and add the order to their list of orders

    user.cart = { total: 0, count: 0 };
    user.orders.push(order);
    user.markModified("orders");
    await user.save();

    // Send a notification to the admin using websockets

    const notification = {
      status: "unread",
      message: `Nueva orden de: ${user.name}`,
      time: new Date(),
    };
    io.sockets.emit("new-order", notification);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// Get all the orders

router.get("/", async (req, res) => {
  try {
    // Find all orders and populate the "owner" field with the corresponding user's email and name
    const orders = await Order.find().populate("owner", ["email", "name"]);
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// Mark as shipped order

router.patch("/:id/mark-shipped", async (req, res) => {
  const { ownerId } = req.body;
  const { id } = req.params;
  const io = req.app.get("socketio");
  try {
    const user = await User.findById(ownerId);

    // Update the order with the specified ID to have a status of "shipped"

    await Order.findByIdAndUpdate(id, { status: "shipped" });
    const orders = await Order.find().populate("owner", ["email", "name"]);

    // Send a notification to the user using websockets

    const notification = {
      status: "unread",
      message: `Orden ${id} enviada con éxito.`,
      time: new Date(),
    };
    io.sockets.emit("notification", notification, ownerId);

    // Save the notification into the user account (database)

    user.notifications.unshift(notification);
    await user.save();

    // Respond with the updated list of orders
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

export default router;
