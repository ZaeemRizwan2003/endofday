import React, { useEffect, useState } from "react";
import axios from "axios";

const CompletedOrders = ({ restaurantId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletedOrders = async () => {
    try {
      const response = await axios.get(
        `/api/Restaurants/done-orders?restaurantId=${restaurantId}`
      );

      if (response.status === 200 && response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching completed orders:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (restaurantId) {
      fetchCompletedOrders();
    }
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading completed orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Completed Orders</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {orders.length === 0 ? (
          <p>No completed orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg shadow-md">
              <p><strong>Customer Name:</strong> {order.userId?.name}</p>
              <p><strong>Order Total:</strong> Rs. {order.totalAmount}</p>
              <p><strong>Restaurant Name:</strong> {order.bakeryId?.restaurantName}</p>
              <p><strong>Contact:</strong> {order.contact}</p>
              <p><strong>Delivery Status:</strong> {order.deliveryStatus}</p>
              <p><strong>Address:</strong> {order.address?.addressLine}</p>
              <p><strong>Items:</strong></p>
              <ul className="list-disc ml-5">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} x {item.quantity} (Rs. {item.price})
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompletedOrders;
