import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DeliveryHeader from "@/Components/DeliveryHeader";
import axios from "axios";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const getMyOrders = async (driverId) => {
    try {
      const response = await axios.get(
        `/api/deliverypartners/orders-assign?driverId=${driverId}`
      );

      if (response.status === 200 && response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const deliveryData = sessionStorage.getItem("delivery");

    if (!deliveryData) {
      router.replace("/Login");
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(deliveryData);
    } catch {
      sessionStorage.removeItem("delivery");
      router.replace("/Login");
      return;
    }

    if (parsedData && parsedData._id) {
      setDeliveryBoy(parsedData);
      getMyOrders(parsedData._id);
    } else {
      router.replace("/Login");
    }
  }, [router]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.put("/api/deliverypartners/update-status", {
        orderId,
        deliveryStatus: newStatus,
      });

      if (response.status === 200) {
        // Update the orders list
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, deliveryStatus: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusOptions = (currentStatus, restaurantStatus) => {
    const statusFlow = {
      Assigned: restaurantStatus === "Ready" ? ["Picked Up"] : [],
      "Picked Up": ["On the Way"],
      "On the Way": ["Delivered"],
    };

    return statusFlow[currentStatus] || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <DeliveryHeader />

      <div className="container mx-auto mt-10 px-4">
        <h1 className="text-4xl font-bold text-purple-800 mb-4">
          Hi, {deliveryBoy?.name || "Delivery Partner"} 👋
        </h1>
      </div>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Delivery Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {["Assigned", "Picked Up", "On the Way"].map((status) => (
            <div key={status} className="border rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-semibold">{status} Orders</h2>
              {orders
                .filter((order) => order.deliveryStatus === status)
                .map((order) => (
                  <div key={order._id} className="border p-3 mb-3">
                    <p>Restaurant Name: {order.restaurant.name}</p>
                    <p>Restaurant Status : {order.restaurantStatus}</p>
                    <p>Customer Name: {order.userId.name}</p>
                    <p>Customre Contact: {order.contact}</p>
                    <p>
                      Delivery Address:{" "}
                      {order.address
                        ? `${order.address.addressLine}, ${order.address.area}, ${order.address.city}`
                        : "Address not available"}
                    </p>
                    <p>Order Items:</p>
                    <ul className="list-disc ml-5">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.title} x {item.quantity} (Rs. {item.price})
                        </li>
                      ))}
                    </ul>
                    <p>Order Total: Rs. {order.totalAmount}</p>


                    <select
                      className="mt-2 p-2 border rounded"
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Update Status
                      </option>
                      {getStatusOptions(
                        order.deliveryStatus,
                        order.restaurantStatus
                      ).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
