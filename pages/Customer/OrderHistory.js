import { useEffect, useState } from "react";
import axios from "axios";
import DashNav from "@/Components/CustomerNavbar";
import Navbar from "@/Components/HomeNavbar";
import Link from "next/link";
import { useRouter } from "next/router";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null); // Assuming userId is stored in localStorage
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = () => {
      const id = localStorage.getItem("userId"); // Get userId from localStorage
      setUserId(id); // Set userId in state
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

  const handleReviewOrder = (orderId) => {
    // Navigate to the review page with the order ID as a query parameter
    router.push(`/Customer/ReviewOrder?orderId=${orderId}`);
  };

  return (
    <>
      <DashNav />
      <div className="mt-16 container mx-auto p-4">
        <h1 className="text-2xl font-bold text-purple-800 mb-4">
          Order History
          <Link legacyBehavior href="/Customer/Cdashboard">
            <a className="ml-8 text-blue-600 hover:underline text-sm">
              Browse Again
            </a>
          </Link>
        </h1>
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
                <ul className="list-disc pl-5">
                  {order.items.map((item) => (
                    <li key={item.itemId}>
                      {item.title} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete Order
                  </button>
                  <button
                    onClick={() => handleReviewOrder(order._id)}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                  >
                    Review Order
                  </button>
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
