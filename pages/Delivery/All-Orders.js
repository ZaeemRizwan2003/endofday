import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DeliveryHeader from "@/Components/DeliveryHeader";
import axios from "axios";

const DeliveredOrders = () => {
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const router = useRouter();

  const getDeliveredOrders = async (driverId) => {
    try {
      console.log("Fetching delivered orders for driverId:", driverId);
      const response = await axios.get(
        `/api/deliverypartners/orders-assign?driverId=${driverId}`
      );

      if (response.status === 200 && response.data.success) {
        const delivered = response.data.orders.filter(
          (order) => order.status === "Delivered"
        );
        setDeliveredOrders(delivered);
        console.log("Delivered orders fetched successfully:", delivered);
      } else {
        console.error("Failed to fetch orders:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching delivered orders:", error);
      alert("Error fetching orders. Please try again later.");
    }
  };

  useEffect(() => {
    const deliveryData = sessionStorage.getItem("delivery");

    if (!deliveryData) {
      console.warn(
        "No delivery data found in sessionStorage. Redirecting to login..."
      );
      router.push("/Delivery/deliverypartner");
      return;
    }
    let parsedData;
    try {
      parsedData = JSON.parse(deliveryData);
    } catch (error) {
      console.error("Failed to parse delivery data:", error.message);
      sessionStorage.removeItem("delivery"); // Clear invalid data
      router.push("/Delivery/deliverypartner");
      return;
    }

    if (parsedData && parsedData._id) {
      getDeliveredOrders(parsedData._id);
    } else {
      console.warn("Invalid delivery data structure. Redirecting to login...");
      router.push("/Delivery/deliverypartner");
    }
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Delivery Header */}
      <DeliveryHeader />

      {/* Page Title */}
      <h1 className="mt-18 pt-14 text-3xl font-bold text-center text-green-700 my-8">
        Delivered Orders
      </h1>

      {/* Delivered Orders Section */}
      <div className="container mx-auto px-4 mt-12">
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
                    <span className="text-green-700">Name:</span>{" "}
                    {order.userId.name}
                  </h4>
                  <p className="text-gray-600">
                    <span className="font-semibold">Contact:</span>{" "}
                    {order.contact || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Amount:</span> Rs.
                    {order.totalAmount}
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

export default DeliveredOrders;
