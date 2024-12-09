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
      <div className="mt-16 container mx-auto p-4 relative">
        <h1 className="text-2xl font-bold text-purple-800 mb-4">
          Order History
          <Link legacyBehavior href="/Customer/Cdashboard">
            <a className="ml-8 text-blue-600 hover:underline text-sm">
              Browse Again
            </a>
          </Link>
        </h1>
        <button
          onClick={handleClearHistory}
          className="absolute top-4 right-4 text-red-600 hover:underline text-sm"
        >
          Clear History
        </button>
        <div className="mt-4">
          {orders.length === 0 ? (
            <p className="text-gray-600">No orders found.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-300 rounded-lg shadow p-4 mb-4"
              >
                <h2 className="font-semibold text-lg">Order ID: {order._id}</h2>
                <p className="text-sm text-gray-500">
                  Total Amount: Rs.{order.totalAmount}
                </p>
                <p className="text-sm text-gray-500">
                  Address: {order.address}
                </p>
                <h3 className="mt-2 font-bold">Items:</h3>
                <ul className="pl-5">
                  {order.items.map((item) => (
                    <li key={item.itemId}>
                      {item.title} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end items-center mt-4 space-x-2">
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <FaTrashCan className="w-6 h-6" />
                  </button>
                  {order.reviewStatus === "Reviewed" ? (
                    <span className="text-green-600 font-semibold">
                      Reviewed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleReviewOrder(order._id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
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
