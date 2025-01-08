import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersMade = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch orders for logged-in bakery
  const fetchOrders = async () => {
    try {
      const userId = sessionStorage.getItem("userId");

      if (!userId) {
        throw new Error("User ID not found in sessionStorage");
      }

      const response = await axios.get("/api/Restaurants/ordersmade", {
        params: { userId },
      });

      setOrders(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>📦 Bakery Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found for your bakery.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div
              key={order.orderId}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                margin: "10px 0",
                padding: "15px",
              }}
            >
              <h3>🆔 Order ID: {order.orderId}</h3>
              <p>
                <strong>User ID:</strong> {order.userId}
              </p>
              <h4>🛒 Items:</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    <strong>Item ID:</strong> {item.itemId} <br />
                    <strong>Bakery Owner:</strong> {item.bakeryowner}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersMade;
