import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DeliveryHeader from "@/Components/DeliveryHeader";
import axios from "axios";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";

const DeliveryOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false); // Chat UI state
  const [chatMessages, setChatMessages] = useState([]); // Chat messages
  const [messageInput, setMessageInput] = useState(""); // Message input
  const [deliveryBoy, setDeliveryBoy] = useState(null); // Delivery rider's data
  const [loading, setLoading] = useState(true); // Loading state during login verification
  const router = useRouter();

  const getMyOrders = async (driverId) => {
    try {
      const response = await axios.get(
        `/api/deliverypartners/orders-assign?driverId=${driverId}`
      );
      console.log("API Response:", response.data);
      if (response.status === 200 && response.data.success) {
        const currentOrders = response.data.orders
          .filter((order) => order.status !== "Delivered")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort descending by createdAt

        const delivered = response.data.orders
          .filter((order) => order.status === "Delivered")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort descending by createdAt

        setMyOrders(currentOrders);
        setDeliveredOrders(delivered);
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
      // Redirect to login if no delivery data
      router.replace("/Login");
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(deliveryData);
    } catch {
      localStorage.removeItem("delivery");
      router.replace("/Login");
      return;
    }

    if (parsedData && parsedData._id) {
      setDeliveryBoy(parsedData);
      getMyOrders(parsedData._id);
    } else {
      router.replace("/Login");
    }
    setLoading(false); // Stop loading after validation
  }, [router]);

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

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const message = { from: "Me", text: messageInput.trim() };
      setChatMessages((prev) => [...prev, message]);
      localStorage.setItem("page1Message", messageInput.trim()); // Send via localStorage
      setMessageInput("");
    }
  };

  useEffect(() => {
    const handleStorageEvent = (event) => {
      if (event.key === "page2Message" && event.newValue) {
        setChatMessages((prev) => [
          ...prev,
          { from: "Customer", text: event.newValue },
        ]);
      }
    };
    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Delivery Header */}
      <DeliveryHeader />

      {/* Greeting Section */}
      <div className="container mx-auto mt-10 px-4">
        <h1 className="text-4xl font-bold text-purple-800 mb-4">
          Hi, {deliveryBoy?.name || "Delivery Partner"} 👋
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Here's an overview of your assigned and delivered orders.
        </p>
      </div>

      {/* Orders Section */}
      <div className="container mx-auto px-2">
        {/* In Processing Orders */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🛵 In Progress
        </h2>
        {myOrders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No current orders available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">
                    🧾 Order #{order._id.slice(-6)}
                  </h4>
                  <span className="text-sm text-gray-500">
                    Status: {order.status}
                  </span>
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Name:</span>{" "}
                  {order.userId?.name || "N/A"}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Contact:</span>{" "}
                  {order.contact || "N/A"}
                </p>

                <p className="text-gray-700">
                  <span className="font-semibold">Amount:</span> Rs.
                  {order.totalAmount + 150}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Address:</span>{" "}
                  {order.address
                    ? `${order.address.addressLine}, ${order.address.area}, ${order.address.city}, ${order.address.postalCode}`
                    : "Address not available"}
                </p>

                <label className="block font-medium text-gray-700 mt-4">
                  Update Status:
                </label>
                <select
                  className="block w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  defaultValue={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                >
                  <option>Confirmed</option>
                  <option>On The Way</option>
                  <option>Delivered</option>
                  <option>Failed To Deliver</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Icon */}
      <div
        className="fixed bottom-4 right-4 bg-purple-500 p-3 rounded-full shadow-lg cursor-pointer"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <ChatBubbleOvalLeftIcon className="h-8 w-8 text-white" />
      </div>
    </div>
  );
};

export default DeliveryOrders;
