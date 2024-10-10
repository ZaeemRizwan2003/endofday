import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import DashNav from "@/Components/CustomerNavbar";
import { LuLoader } from "react-icons/lu";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders");
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <p>
        <LuLoader />
      </p>
    );

  return (
    <div>
      <DashNav />
      <div className="p-14">
        <h1 className="text-3xl font-bold text-purple-800 mb-4">Your Orders</h1>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 mb-4">
              <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
              <p>Status: {order.status}</p>
              <p>Address: {order.address}</p>
              <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
              <h3 className="mt-2 font-bold">Items:</h3>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.title} - ${item.price.toFixed(2)} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderPage;
