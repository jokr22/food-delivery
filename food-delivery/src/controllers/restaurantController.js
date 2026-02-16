const pool = require("../config/db");

// Get all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM restaurants WHERE is_open = true ORDER BY rating DESC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting restaurants:", error);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
};

// Get restaurant by ID
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM restaurants WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error getting restaurant:", error);
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
};

// Get restaurant menu
const getRestaurantMenu = async (req, res) => {
  try {
    const { id } = req.params;

    // Get restaurant info
    const restaurantResult = await pool.query(
      "SELECT * FROM restaurants WHERE id = $1",
      [id],
    );

    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Get categories
    const categoriesResult = await pool.query(
      "SELECT * FROM menu_categories WHERE restaurant_id = $1 ORDER BY name",
      [id],
    );

    // Get menu items
    const menuItemsResult = await pool.query(
      "SELECT * FROM menu_items WHERE restaurant_id = $1 AND is_available = true ORDER BY category_id, name",
      [id],
    );

    // Group menu items by category
    const menu = categoriesResult.rows.map((category) => ({
      ...category,
      items: menuItemsResult.rows.filter(
        (item) => item.category_id === category.id,
      ),
    }));

    res.json({
      restaurant: restaurantResult.rows[0],
      menu,
    });
  } catch (error) {
    console.error("Error getting restaurant menu:", error);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantMenu,
};
