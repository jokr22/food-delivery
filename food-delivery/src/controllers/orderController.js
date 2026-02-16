const pool = require("../config/db");

// Create new order
const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      restaurant_id,
      items,
      total_amount,
    } = req.body;

    // Insert order
    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, restaurant_id, total_amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        restaurant_id,
        total_amount,
      ],
    );

    const order = orderResult.rows[0];

    // Insert order items
    for (const item of items) {
      const menuItemResult = await client.query(
        "SELECT price FROM menu_items WHERE id = $1",
        [item.menu_item_id],
      );
      const price = menuItemResult.rows[0].price;
      const subtotal = price * item.quantity;

      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, price, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.menu_item_id, item.quantity, price, subtotal],
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    client.release();
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, r.name as restaurant_name 
       FROM orders o 
       LEFT JOIN restaurants r ON o.restaurant_id = r.id 
       ORDER BY o.created_at DESC`,
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      `SELECT o.*, r.name as restaurant_name 
       FROM orders o 
       LEFT JOIN restaurants r ON o.restaurant_id = r.id 
       WHERE o.id = $1`,
      [id],
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await pool.query(
      `SELECT oi.*, mi.name, mi.description, mi.image
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       WHERE oi.order_id = $1`,
      [id],
    );

    order.items = itemsResult.rows;

    res.json(order);
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      success: true,
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
