import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DeliveryHeader from "@/Components/DeliveryHeader";
import axios from "axios";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid"; 

const DeliveryOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false); // Chat UI state
  const [chatMessages, setChatMessages] = useState([]); // Chat messages
  const [messageInput, setMessageInput] = useState(""); // Message input
  const router = useRouter();

  const getMyOrders = async (driverId) => {
    try {
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
      router.push("/Delivery/deliverypartner");
      return;
    }
    let parsedData;
    try {
      parsedData = JSON.parse(deliveryData);
    } catch {
      localStorage.removeItem("delivery");
      router.push("/Delivery/deliverypartner");
      return;
    }
    if (parsedData && parsedData._id) {
      getMyOrders(parsedData._id);
    } else {
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

  return (
    <div className="bg-gray-50">
      <DeliveryHeader />
      <h1 className="mt-18 pt-14 text-3xl font-bold text-center text-purple-800 my-8">
        My Order List
      </h1>

      {/* Orders Section */}
      <div className="container mx-auto px-2">
        <h2 className="text-2xl font-bold text-gray-800">In Processing</h2>
        {myOrders.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No current orders available at the moment.
          </p>
        ) : (
          myOrders.map((order) => (
            <div key={order._id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    <span className="text-purple-700">Name:</span> {order.userId.name}
                  </h4>
                  <p className="text-gray-600">
                    <span className="font-semibold">Contact:</span> {order.contact || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Amount:</span> Rs.{order.totalAmount}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Address:</span> {order.address || "N/A"}
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
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg"
                    defaultValue="Choose Status"
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
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

      {/* Chat Icon */}
      <div
        className="fixed bottom-4 right-4 bg-purple-500 p-3 rounded-full shadow-lg cursor-pointer"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
<ChatBubbleOvalLeftIcon className="h-8 w-8 text-white" />
</div>

     {/* Chat UI */}
{isChatOpen && (
  <div className="fixed bottom-16 right-6 bg-white shadow-2xl rounded-lg w-96 p-4 border border-gray-200">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-purple-800">Chat with Customer</h2>
      <button
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={() => setIsChatOpen(false)}
      >
        ✕
      </button>
    </div>

    {/* Chat Messages */}
    <div className="overflow-y-auto h-64 border border-gray-200 rounded-lg p-3 bg-gray-50">
      {chatMessages.map((msg, index) => (
        <div
          key={index}
          className={`mb-2 flex ${
            msg.from === "Me" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-xs p-3 rounded-lg text-sm ${
              msg.from === "Me"
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <strong className="block font-medium mb-1">{msg.from}</strong>
            <span>{msg.text}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Input Section */}
    <div className="flex items-center mt-4 space-x-2">
      <input
        type="text"
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Type a message..."
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <button
        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg focus:outline-none shadow-md transition-all"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default DeliveryOrders;
