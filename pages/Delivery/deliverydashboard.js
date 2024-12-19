import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DeliveryHeader from "@/Components/DeliveryHeader";
import axios from "axios";

const DeliveryOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const router = useRouter();

  const getMyOrders = async (driverId) => {
    try {
      console.log("Fetching orders for driverId:", driverId);
      const response = await axios.get(
        `/api/deliverypartners/orders-assign?driverId=${driverId}`
      );

      if (response.status === 200 && response.data.success) {
        const currentOrders = response.data.orders.filter(
          (order) => order.status !== "Delivered"
        );
        const delivered = response.data.orders.filter(
          (order) => order.status === "Delivered"
        );
        setMyOrders(currentOrders);
        setDeliveredOrders(delivered);
        console.log("Orders fetched successfully:", response.data.orders);
      } else {
        console.error("Failed to fetch orders:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Error fetching orders. Please try again later.");
    }
  };

  useEffect(() => {
    const deliveryData = localStorage.getItem("delivery");

    if (!deliveryData) {
      console.warn("No delivery data found in localStorage. Redirecting to login...");
      router.push("/Delivery/deliverypartner");
      return;
    }
    let parsedData;
    try {
      parsedData = JSON.parse(deliveryData);
    } catch (error) {
      console.error("Failed to parse delivery data:", error.message);
      localStorage.removeItem("delivery"); // Clear invalid data
      router.push("/Delivery/deliverypartner");
      return;
    }
  
    if (parsedData && parsedData._id) {
      getMyOrders(parsedData._id);
    } else {
      console.warn("Invalid delivery data structure. Redirecting to login...");
      router.push("/Delivery/deliverypartner");
    }
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put("/api/deliverypartners/update-status", {
        orderId,
        status: newStatus,
      });

      if (response.status === 200) {
        setMyOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );

        if (newStatus === "Delivered") {
          setDeliveredOrders((prevDelivered) => [
            ...prevDelivered,
            response.data.updatedOrder,
          ]);
        }
      } else {
        console.error("Failed to update order status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Delivery Header */}
      <DeliveryHeader />

      {/* Page Title */}
      <h1 className=" mt-18 pt-14 text-3xl font-bold text-center text-purple-800 my-8">
        My Order List
      </h1>

      {/* Orders Section */}
      <div className="container mx-auto px-2">
        <h2 className="text-2xl font-bold text-gray-800"> In Processing</h2>
        {myOrders.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No current orders available at the moment.
          </p>
        ) : (
          myOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-lg rounded-lg p-6 mb-6 hover:shadow-xl transition-shadow"
            >
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    <span className="text-purple-700">Name:</span> {order.userId.name}
                  </h4>
                  <p className="text-gray-600">
                    <span className="font-semibold">Contact:</span>{" "}
                    {order.contact || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Amount:</span> Rs.{order.totalAmount}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Address:</span>{" "}
                    {order.address || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Status:</span> {order.status}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor={`status-${order._id}`}
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    Update Status:
                  </label>
                  <select
                    id={`status-${order._id}`}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    defaultValue="Choose Status"
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    <option disabled>Choose Status</option>
                    <option>Confirmed</option>
                    <option>On The Way</option>
                    <option>Delivered</option>
                    <option>Failed To Deliver</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delivered Orders Section */}
      <div className="container mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          Delivered Orders
        </h2>
        {deliveredOrders.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No delivered orders yet.
          </p>
        ) : (
          deliveredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-lg rounded-lg p-6 mb-6 hover:shadow-xl transition-shadow"
            >
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    <span className="text-green-700">Name:</span> {order.userId.name}
                  </h4>
                  <p className="text-gray-600">
                    <span className="font-semibold">Contact:</span>{" "}
                    {order.contact || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Amount:</span> Rs.{order.totalAmount}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Address:</span>{" "}
                    {order.address || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Status:</span> Delivered
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryOrders;
