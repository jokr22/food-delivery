import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${id}`);
        setRestaurant(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    localStorage.setItem("restaurantId", item.restaurant_id);
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1, restaurant_id: item.restaurant_id });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Item added to cart!");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
    );
  }

  if (!restaurant) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        Restaurant not found
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
        <h1 style={{ marginTop: "1rem" }}>{restaurant.name}</h1>
        <p>{restaurant.description}</p>
        <p>
          ⭐ {restaurant.rating} • {restaurant.delivery_time} • $
          {restaurant.delivery_fee} delivery
        </p>
        <Link
          to={`/menu/${id}`}
          className="btn btn-primary"
          style={{ marginTop: "1rem" }}
        >
          View Full Menu
        </Link>
      </div>
    </div>
  );
};

export default Restaurant;
