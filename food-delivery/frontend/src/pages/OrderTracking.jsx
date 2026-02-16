import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${id}`);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error);
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ffc107";
      case "confirmed":
        return "#17a2b8";
      case "preparing":
        return "#fd7e14";
      case "delivered":
        return "#28a745";
      case "cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        Order not found
      </div>
    );
  }

  return (
    <div className="order-tracking">
      <h1>Order Tracking</h1>

      <div className="order-status">
        <span
          className="status-badge"
          style={{ backgroundColor: getStatusColor(order.status) }}
        >
          {order.status.toUpperCase()}
        </span>

        <h2>Order #{order.id}</h2>
        <p>Restaurant: {order.restaurant_name}</p>

        <div style={{ textAlign: "left", marginTop: "2rem" }}>
          <h3>Order Details</h3>
          {order.items?.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.5rem 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${item.subtotal}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "left", marginTop: "2rem" }}>
          <h3>Delivery Information</h3>
          <p>
            <strong>Name:</strong> {order.customer_name}
          </p>
          <p>
            <strong>Email:</strong> {order.customer_email}
          </p>
          <p>
            <strong>Phone:</strong> {order.customer_phone}
          </p>
          <p>
            <strong>Address:</strong> {order.customer_address}
          </p>
        </div>

        <div
          style={{ marginTop: "2rem", fontSize: "1.5rem", fontWeight: "bold" }}
        >
          Total: ${order.total_amount}
        </div>

        <p style={{ marginTop: "1rem", color: "#666" }}>
          Order placed on: {new Date(order.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default OrderTracking;
