import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import DashNav from "@/Components/CustomerNavbar";
import Link from "next/link";
import dynamic from "next/dynamic";
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  {
    ssr: false,
  }
);

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

          {/* Progress Bar with Animations */}
          <div className="mt-6">
            <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${
                    ((currentStatusIndex + 1) / statuses.length) * 100
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              {statuses.map((status, index) => (
                <div
                  key={status}
                  className="flex flex-col items-center text-center w-1/4"
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${
                      index <= currentStatusIndex
                        ? "bg-green-500 animate-pulse"
                        : "bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`mt-1 text-sm font-semibold ${
                      index <= currentStatusIndex
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>

            {/* Status Animations */}
            <div className="flex justify-center mt-6">
              {order.status === "Pending" && (
                <Player
                  autoplay
                  loop
                  src="https://assets8.lottiefiles.com/packages/lf20_q7uarxsb.json"
                  style={{ height: "150px", width: "150px" }}
                />
              )}
              {order.status === "Confirmed" && (
                <Player
                  autoplay
                  loop
                  src="https://assets6.lottiefiles.com/packages/lf20_jnyb0m8z.json"
                  style={{ height: "150px", width: "150px" }}
                />
              )}
              {order.status === "On The Way" && (
                <Player
                  autoplay
                  loop
                  src="https://assets6.lottiefiles.com/packages/lf20_V9t630.json"
                  style={{ height: "150px", width: "150px" }}
                />
              )}
              {order.status === "Delivered" && (
                <Player
                  autoplay
                  loop
                  src="https://assets6.lottiefiles.com/packages/lf20_5ngs2ksb.json"
                  style={{ height: "150px", width: "150px" }}
                />
              )}
            </div>
          </div>

          {/* <p>Address: {order.address.addressLine}</p> */}
          {selectedAddress ? (
            <p>
              Address: {selectedAddress.addressLine}, {selectedAddress.area},,{" "}
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
