import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import DashNav from "@/Components/CustomerNavbar";
import Link from "next/link";

const OrderPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!router.isReady) return;

    const orderId = id || sessionStorage.getItem("lastOrderId");

    if (!orderId) {
      setError("No valid order ID provided.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/Customer/order?id=${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to fetch order.");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchOrder();

    // Poll every 5 seconds
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id, router.isReady]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!order) {
    return <p>No order found.</p>;
  }

  const deliveryStatuses = [
    "Assigned",
    "Picked Up",
    "On the Way",
    "Delivered",
    "Done",
  ];
  const currentDeliveryStatusIndex = deliveryStatuses.indexOf(order.deliveryStatus);

  const isDelivered = order.deliveryStatus === "Delivered";
const isDone = order.deliveryStatus === "Done";

  const selectedAddress = order.userId.addresses.find(
    (address) => address._id.toString() === order.address.toString()
  );

  return (
    <div className="flex items-center justify-center">
      <DashNav />
      <div className="mt-20 p-10 w-70 shadow-md rounded-md">
        <h1 className="text-3xl font-bold text-purple-800 mb-4 text-center">
          Order Confirmation
          <Link href="/Customer/Cdashboard" legacyBehavior>
            <a className="ml-8 text-blue-600 hover:underline text-sm">
              Browse Again
            </a>
          </Link>
        </h1>
        <div className="border rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500 ${isDelivered ? 'bg-green-500' : 'bg-blue-500'}`"
                style={{
                  width: `${((currentDeliveryStatusIndex + 1) / deliveryStatuses.length) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              {deliveryStatuses.map((status, index) => (
                <div
                  key={status}
                  className="flex flex-col items-center text-center w-1/4"
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${
                      index <= currentDeliveryStatusIndex ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`mt-1 text-sm font-semibold ${
                      index <= currentDeliveryStatusIndex ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {isDelivered && (
          <div className="mt-4 text-center">
            <h3 className="text-2xl font-bold text-green-600">
              Delivered! Enjoy your meal!
            </h3>
          </div>
        )}

        {isDone && (
          <div className="mt-4 text-center">
            <h3 className="text-xl font-semibold text-blue-500">
              Order is completed (Done).
            </h3>
          </div>
        )}
        
          <div>
            <p className="mt-4 text-lg text-purple-800 font-semibold text-center mb-3 underline">
              <Link href={`/Customer/ReviewPage?orderId=${order._id}`} legacyBehavior>
                Don't forget to give us a review!
              </Link>
            </p>
          </div>

          {selectedAddress ? (
            <p>
              Address: {selectedAddress.addressLine}, {selectedAddress.area},{" "}
              {selectedAddress.city}, {selectedAddress.postalCode}
            </p>
          ) : (
            <p>No address found for this order.</p>
          )}

          <p>Contact: {order.contact}</p>
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
