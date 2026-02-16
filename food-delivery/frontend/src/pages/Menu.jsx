import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Menu = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          `/api/restaurants/${restaurantId}/menu`,
        );
        setRestaurant(response.data.restaurant);
        setMenu(response.data.menu);
        if (response.data.menu.length > 0) {
          setSelectedCategory(response.data.menu[0].id);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setLoading(false);
      }
    };
    fetchMenu();
  }, [restaurantId]);

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Item added to cart!");
  };

  const selectedCategoryData = menu.find((cat) => cat.id === selectedCategory);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
    );
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>{restaurant?.name}</h1>
        <p>{restaurant?.description}</p>
        <p>
          ⭐ {restaurant?.rating} • {restaurant?.delivery_time} • $
          {restaurant?.delivery_fee} delivery
        </p>
      </div>

      <div className="menu-categories">
        {menu.map((category) => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? "active" : ""}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="menu-items-grid">
        {selectedCategoryData?.items.map((item) => (
          <div key={item.id} className="menu-item">
            <img src={item.image} alt={item.name} className="menu-item-image" />
            <div className="menu-item-info">
              <h3 className="menu-item-name">{item.name}</h3>
              <p className="menu-item-description">{item.description}</p>
              <div className="menu-item-footer">
                <span className="menu-item-price">${item.price}</span>
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
