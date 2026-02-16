const pool = require("./config/db");

const seedData = async () => {
  try {
    // Insert sample restaurants
    const restaurantQuery = `
      INSERT INTO restaurants (name, description, image, rating, delivery_time, delivery_fee, cuisine_type, is_open)
      VALUES 
        ('Burger Palace', 'Best burgers in town with fresh ingredients', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500', 4.5, '30-40 min', 2.99, 'American', true),
        ('Pizza Heaven', 'Authentic Italian pizzas with homemade sauce', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500', 4.7, '25-35 min', 1.99, 'Italian', true),
        ('Sushi Master', 'Fresh sushi and Japanese delicacies', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500', 4.8, '35-45 min', 3.99, 'Japanese', true),
        ('Taco Fiesta', 'Authentic Mexican tacos and burritos', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500', 4.3, '20-30 min', 1.49, 'Mexican', true),
        ('Curry House', 'Indian curries and tandoori specialties', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500', 4.6, '30-40 min', 2.49, 'Indian', true)
      ON CONFLICT DO NOTHING
      RETURNING id, name;
    `;

    const restaurants = await pool.query(restaurantQuery);
    console.log("Restaurants seeded:", restaurants.rowCount);

    // Get restaurant IDs
    const burgerPalace = restaurants.rows[0];
    const pizzaHeaven = restaurants.rows[1];
    const sushiMaster = restaurants.rows[2];
    const tacoFiesta = restaurants.rows[3];
    const curryHouse = restaurants.rows[4];

    // Insert menu categories for Burger Palace
    const categoriesQuery = `
      INSERT INTO menu_categories (restaurant_id, name, description)
      VALUES 
        ($1, 'Burgers', 'Juicy beef and chicken burgers'),
        ($1, 'Sides', 'Crispy sides to complement your meal'),
        ($1, 'Drinks', 'Refreshing beverages')
      ON CONFLICT DO NOTHING
      RETURNING id, name;
    `;

    const burgerCategories = await pool.query(categoriesQuery, [
      burgerPalace.id,
    ]);
    const pizzaCategories = await pool.query(categoriesQuery, [pizzaHeaven.id]);
    const sushiCategories = await pool.query(categoriesQuery, [sushiMaster.id]);
    const tacoCategories = await pool.query(categoriesQuery, [tacoFiesta.id]);
    const curryCategories = await pool.query(categoriesQuery, [curryHouse.id]);

    // Insert menu items for Burger Palace
    const menuItemsQuery = `
      INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image, is_available)
      VALUES 
        ($1, $2, 'Classic Cheeseburger', 'Beef patty with cheddar, lettuce, tomato, and special sauce', 9.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', true),
        ($1, $2, 'Bacon Deluxe Burger', 'Double beef patty with bacon, cheese, and caramelized onions', 12.99, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500', true),
        ($1, $3, 'French Fries', 'Crispy golden fries with sea salt', 3.99, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500', true),
        ($1, $3, 'Onion Rings', 'Crispy battered onion rings', 4.99, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500', true),
        ($1, $4, 'Cola', 'Classic refreshing cola', 1.99, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500', true)
      ON CONFLICT DO NOTHING
    `;

    // Insert menu items for each restaurant
    await pool.query(menuItemsQuery, [
      burgerPalace.id,
      burgerCategories.rows[0].id,
    ]);
    await pool.query(menuItemsQuery, [
      pizzaHeaven.id,
      pizzaCategories.rows[0].id,
    ]);
    await pool.query(menuItemsQuery, [
      sushiMaster.id,
      sushiCategories.rows[0].id,
    ]);
    await pool.query(menuItemsQuery, [
      tacoFiesta.id,
      tacoCategories.rows[0].id,
    ]);
    await pool.query(menuItemsQuery, [
      curryHouse.id,
      curryCategories.rows[0].id,
    ]);

    console.log("Menu items seeded successfully");
    console.log("Database seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
