const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

// Get all restaurants
router.get("/", restaurantController.getAllRestaurants);

// Get single restaurant
router.get("/:id", restaurantController.getRestaurantById);

// Get restaurant menu
router.get("/:id/menu", restaurantController.getRestaurantMenu);

module.exports = router;
