const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Create new order
router.post("/", orderController.createOrder);

// Get all orders
router.get("/", orderController.getAllOrders);

// Get order by ID
router.get("/:id", orderController.getOrderById);

// Update order status
router.put("/:id/status", orderController.updateOrderStatus);

module.exports = router;
