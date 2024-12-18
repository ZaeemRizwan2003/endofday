import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import AdminLayout from "@/Components/AdminLayout";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `/api/Admin/Customer/fetchOrders?userId=${userId}`
        );

        if (response.data.success) {
            setOrders(response.data.orders); // Set orders array
            setTotalOrders(response.data.totalOrders); 
        } else {
            console.error("Failed to fetch orders:", response.data.message);
          }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Customer Orders</h1>
        <button
          onClick={() => router.push("/Admin/ManageCustomers/Manage-customers")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          &larr; Back to Customers
        </button>
      </div>

      {/* Total Orders */}
      <div className="mb-6 text-lg font-medium text-gray-700">
        Total Orders:{" "}
        <span className="text-blue-600 font-bold">{totalOrders}</span>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg animate-pulse">
            Loading orders...
          </p>
        </div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Order #{order._id}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Total Amount */}
              <p className="text-gray-700 font-medium mb-2">
                Total Amount:{" "}
                <span className="text-blue-600">Rs. {order.totalAmount}</span>
              </p>

              {/* Order Items */}
              <h3 className="text-gray-600 font-semibold mb-2">Items:</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                {order.items.map((item) => (
                  <li
                    key={item.itemId}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {item.title} - Qty: {item.quantity}
                    </span>
                    <span className="text-gray-800">Rs. {item.price}</span>
                  </li>
                ))}
              </ul>

              {/* Created Date */}
              <p className="text-gray-500 text-sm">
                <span className="font-semibold">Ordered On:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg">
            No orders found for this customer.
          </p>
        </div>
      )}
    </div>
  </AdminLayout>
  );
}
