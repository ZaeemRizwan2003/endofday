import { useEffect, useState } from "react";
import DashNav from "@/Components/CustomerNavbar";
import { useRouter } from "next/router";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in session storage");
        return;
      }

      try {
        const res = await fetch(`/api/Customer/return?userId=${userId}`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to fetch order history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleReturn = (orderId) => {
    router.push(`/Customer/Return-request?orderId=${orderId}`);
  };

  if (loading) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  return (
    <>
      <DashNav />
      <div className="pt-24 px-8 min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Orders delivered in the last 24 hours
        </h1>
        {orders.length === 0 ? (
          <div className="text-center text-gray-600">
            No orders found in the last 24 hours.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl p-4 shadow-md flex justify-between items-center"
              >
                <div>
                  <div className="text-lg font-semibold text-gray-800">
                    {order.bakeryId?.restaurantName || "Unknown Bakery"}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Order Delivered:{" "}
                    {new Date(order.updatedAt).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-800">
                    Status: {order.deliveryStatus}
                  </div>
                  <div className="text-sm text-gray-800">
                    Total Amount: PKR {order.totalAmount.toFixed(2)}
                  </div>
                </div>

                {order.refundApplied ? (
                  <div className="text-green-600 font-semibold ml-4">
                    Refund Applied
                  </div>
                ) : (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md ml-4"
                    onClick={() => handleReturn(order._id)}
                  >
                    Apply for Return
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
