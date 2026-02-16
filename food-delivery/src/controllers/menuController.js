const pool = require("../config/db");

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM menu_items WHERE is_available = true ORDER BY name",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting menu items:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};

// Get menu items by restaurant
const getMenuByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const result = await pool.query(
      "SELECT * FROM menu_items WHERE restaurant_id = $1 AND is_available = true ORDER BY category_id, name",
      [restaurantId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting menu items:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};

// Get menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM menu_items WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting menu item:", error);
    res.status(500).json({ error: "Failed to fetch menu item" });
  }
};

// Get categories by restaurant
const getCategoriesByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const result = await pool.query(
      "SELECT * FROM menu_categories WHERE restaurant_id = $1 ORDER BY name",
      [restaurantId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuByRestaurant,
  getMenuItemById,
  getCategoriesByRestaurant,
};
