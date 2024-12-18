import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DeliveryHeader from "@/Components/DeliveryHeader";
import axios from "axios";

const AllOrders = () => {
    const [allOrders, setAllOrders] = useState([]);
    const router = useRouter();

    // Fetch all orders for the driver
    const fetchAllOrders = async (driverId) => {
        try {
            const response = await axios.get(
                `/api/deliverypartners/all-orders?driverId=${driverId}`
            );

            if (response.status === 200 && response.data.success) {
                setAllOrders(response.data.orders);
            } else {
                console.error("Failed to fetch all orders:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching all orders:", error);
        }
    };

    // Fetch orders on component mount
    useEffect(() => {
        const deliveryData = JSON.parse(localStorage.getItem("delivery"));
        if (!deliveryData) {
            router.push("/Delivery/deliverypartner");
            return;
        }

        fetchAllOrders(deliveryData._id);
    }, []);

    return (
      <div className="bg-gray-50 min-h-screen">
      {/* Delivery Header */}
      <DeliveryHeader />

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center text-purple-800 my-8">
        All Orders
      </h1>

      {/* Orders Section */}
      <div className="container mx-auto px-4">
        {allOrders.length > 0 ? (
          allOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-lg rounded-lg p-6 mb-6 border-l-4 border-purple-600 hover:shadow-xl transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Column 1: User Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    <span className="text-purple-700">Name:</span> {order.userId.name}
                  </h4>
                  <p className="text-gray-600">
                    <span className="font-semibold">Contact:</span> {order.contact || "N/A"}
                  </p>
                </div>

                {/* Column 2: Order Details */}
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Amount:</span> Rs.{order.totalAmount}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Address:</span> {order.address || "N/A"}
                  </p>
                </div>

                {/* Column 3: Status */}
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Status:</span> {order.status}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 text-lg">
            No orders found.
          </p>
        )}
      </div>
    </div>
    );
};

export default AllOrders;
