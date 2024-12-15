import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import DashNav from "@/Components/CustomerNavbar";
import Link from "next/link";

const OrderPage = () => {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!id) return;
      try {
        console.log("Fetching order with ID:", id);
        const res = await axios.get(`/api/Customer/order?id=${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id]);

  if (!order || Object.keys(order).length === 0) {
    return <p>No order found.</p>;
  }

  const selectedAddress = order.userId.addresses.find(
    (address) => address._id.toString() === order.address.toString()
  );

  return (
    <div className="flex items-center justify-center">
      <DashNav />
      <div className="mt-20 p-10 w-70 shadow-md rounded-md">
        <h1 className="text-3xl font-bold text-purple-800 mb-4 text-center">
          Order Confirmation
          <Link legacyBehavior href="/Customer/Cdashboard">
            <a className="ml-8 text-blue-600 hover:underline text-sm">
              Browse Again
            </a>
          </Link>
        </h1>
        <div className="border rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
          <p>Status: {order.status}</p>
          {/* <p>Address: {order.address.addressLine}</p> */}
          {selectedAddress ? (
            <p>
              Address: {selectedAddress.addressLine}, {selectedAddress.area},
              {selectedAddress.city}, {selectedAddress.postalCode}
            </p>
          ) : (
            <p>No address found for this order.</p>
          )}

          <p>Total Amount: Rs.{(order.totalAmount + 150).toFixed(2)}</p>
          <h3 className="mt-2 font-bold">Items:</h3>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.title} - Rs.{item.price.toFixed(2)} x {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
