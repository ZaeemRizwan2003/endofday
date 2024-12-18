import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import DashNav from "@/Components/CustomerNavbar";
import Link from "next/link";
import { Player } from "@lottiefiles/react-lottie-player";

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

  const statuses = ["Pending", "Confirmed", "On The Way", "Delivered"];
  const currentStatusIndex = statuses.indexOf(order.status);

  const handleReviewClick = () => {
    router.push(`/Customer/ReviewPage?orderId=${order._id}`);
  };

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

          {/* Progress Line */}
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              {statuses.map((status, index) => (
                <div key={status} className="flex items-center">
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full ${
                      index <= currentStatusIndex
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < statuses.length - 1 && (
                    <div
                      className={`w-10 h-1 ${
                        index < currentStatusIndex
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {statuses.map((status) => (
                <span
                  key={status}
                  className="text-sm font-semibold text-gray-600"
                >
                  {status}
                </span>
              ))}
            </div>
          </div>

          {/* Delivered Animation */}
          {order.status === "Delivered" && (
            <div className="mt-6 flex flex-col items-center justify-center">
              <Player
                autoplay
                loop={true}
                src="https://assets6.lottiefiles.com/packages/lf20_5ngs2ksb.json"
                style={{ height: "150px", width: "150px" }}
              />

              <h2 className="text-2xl font-bold text-green-600 mt-4 animate-bounce">
                Enjoy your food!
              </h2>

              <button
              onClick={handleReviewClick}
              className="mt-4 text-purple-700 hover:underline text-base font-semibold transition mb-3"
            >
              Don’t Forget to Leave a Review
            </button>
            </div>
          )}

          {/* <p>Address: {order.address.addressLine}</p> */}
          {selectedAddress ? (
            <p>
              Address: {selectedAddress.addressLine}, {selectedAddress.area},
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
