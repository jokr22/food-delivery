import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("/api/restaurants");
        setRestaurants(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
    );
  }

  return (
    <div>
      <div className="hero">
        <div className="hero-content">
          <h1>Delicious Food, Delivered Fast</h1>
          <p>
            Order from your favorite restaurants and get it delivered to your
            doorstep
          </p>
          <Link
            to="/"
            className="btn btn-primary"
            onClick={() =>
              window.scrollTo(
                0,
                document.querySelector(".restaurants-section").offsetTop,
              )
            }
          >
            Browse Restaurants
          </Link>
        </div>
      </div>

      <section className="restaurants-section">
        <h2 className="section-title">Popular Restaurants</h2>
        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="restaurant-card">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="restaurant-image"
              />
              <div className="restaurant-info">
                <h3 className="restaurant-name">{restaurant.name}</h3>
                <p className="restaurant-description">
                  {restaurant.description}
                </p>
                <div className="restaurant-meta">
                  <span className="rating">⭐ {restaurant.rating}</span>
                  <span className="delivery-info">
                    {restaurant.delivery_time} • ${restaurant.delivery_fee}
                  </span>
                </div>
                <Link
                  to={`/menu/${restaurant.id}`}
                  className="btn btn-primary"
                  style={{
                    marginTop: "1rem",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  View Menu
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
