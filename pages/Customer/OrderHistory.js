import { useEffect, useState } from "react";
import axios from "axios";
import DashNav from "@/Components/CustomerNavbar";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaTrashCan } from "react-icons/fa6";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = () => {
      const id = localStorage.getItem("userId");
      setUserId(id);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `/api/Customer/orderhistory?userId=${userId}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`/api/Customer/order?id=${orderId}`);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleClearHistory = async () => {
    try {
      await axios.delete(`/api/Customer/clearhistory?userId=${userId}`);
      setOrders([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const handleReviewOrder = (orderId) => {
    router.push(`/Customer/ReviewPage?orderId=${orderId}`);
  };

  return (
    <>
      <DashNav />
      <div className="mt-16 container mx-auto px-4 lg:px-12 py-8 relative">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 flex-wrap">
          <h1 className="text-3xl font-bold text-purple-700">Order History</h1>
          <div className="flex gap-4 mt-4 lg:mt-0">
            <Link legacyBehavior href="/Customer/Cdashboard">
              <a className="text-blue-600 hover:underline text-sm">
                Browse Again
              </a>
            </Link>
            <button
              onClick={handleClearHistory}
              className="text-red-600 hover:text-red-800 font-semibold text-sm"
            >
              Clear History
            </button>
          </div>
        </div>

        {/* Order Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center text-lg">
              No orders found.
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300"
              >
                <h2 className="font-semibold text-lg mb-2 text-gray-800">
                  Order ID: {order._id}
                </h2>
                <p className="text-sm text-gray-500 mb-1">
                  Total Amount:{" "}
                  <span className="font-medium">Rs.{order.totalAmount}</span>
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Address: <span className="font-medium">{order.address}</span>
                </p>
                <h3 className="font-bold text-md mb-1">Items:</h3>
                <ul className="list-disc list-inside text-sm mb-4">
                  {order.items.map((item) => (
                    <li key={item.itemId}>
                      {item.title} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <FaTrashCan />
                    Delete
                  </button>
                  {order.reviewStatus === "Reviewed" ? (
                    <span className="text-green-600 font-semibold">
                      Reviewed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleReviewOrder(order._id)}
                      className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 transition"
                    >
                      Review Order
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default OrderHistory;
