const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

// Get all menu items
router.get("/", menuController.getAllMenuItems);

// Get menu items by restaurant
router.get("/restaurant/:restaurantId", menuController.getMenuByRestaurant);

// Get menu item by ID
router.get("/:id", menuController.getMenuItemById);

// Get menu categories
router.get(
  "/categories/:restaurantId",
  menuController.getCategoriesByRestaurant,
);

module.exports = router;
