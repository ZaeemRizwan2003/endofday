import DashNav from "@/Components/CustomerNavbar";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { LuLoader } from "react-icons/lu";
import useSearch from "@/hooks/useSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faStar as faStarOutline,
} from "@fortawesome/free-solid-svg-icons";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [ongoingOrder, setOngoingOrder] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const {
    results,
    search,
    setSearch,
    activeOption,
    setActiveOption,
    page,
    setPage,
    totalPages,
  } = useSearch();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    } else {
      axios
        .get("/api/Customer/user-info", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
        .then((res) => {
          setUser(res.data.user);
          setLoading(false);
        })
        .catch(() => {
          router.push("/Login");
        });
    }

    // Listen for messages from Page 1
    const handleStorage = (event) => {
      if (event.key === "page1Message" && event.newValue) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "Driver ", text: event.newValue },
        ]);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [router]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      localStorage.setItem("page2Message", newMessage.trim());
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Customer", text: newMessage.trim() },
      ]);
      setNewMessage("");
    }
  };

  const renderStars = (avgRating) => {
    const totalStars = 5;
    const filledStars = Math.floor(avgRating);
    const halfStar = avgRating - filledStars >= 0.5;
    const emptyStars = totalStars - filledStars - (halfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`filled-${i}`}
          icon={faStar}
          className="text-yellow-500 w-5 h-5"
        />
      );
    }

    if (halfStar) {
      stars.push(
        <FontAwesomeIcon
          key="half-star"
          icon={faStarHalfAlt}
          className="text-yellow-500 w-5 h-5"
        />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`empty-${i}`}
          icon={faStarOutline}
          className="text-gray-400 w-5 h-5"
        />
      );
    }

    return stars;
  };


  useEffect(() => {
    let orderCheckInterval;
  
    const fetchOngoingOrder = async () => {
      try {
        const response = await axios.get("/api/Customer/order?status=ongoing");
        if (response.data?.ongoingOrder) {
          setOngoingOrder(response.data.ongoingOrder);
  
          toast.dismiss("ongoing-order-toast");

            toast(
              (t) => (
                <div
                  onClick={() => {
                    toast.dismiss(t.id); // Dismiss toast when clicked
                    router.push(
                      `/Customer/OrderConfirm?id=${response.data.ongoingOrder._id}`
                    );
                  }}
                  className="cursor-pointer"
                >
                  🚚 <strong>Your order is in progress!</strong>
                  <p className="text-sm">Click here to track your order.</p>
                </div>
              ),
              {
                id: "ongoing-order-toast", // Unique toast ID to prevent duplicates
                duration: Infinity, // Toast remains until manually dismissed
                style: {
                  background: "#4F46E5",
                  color: "#fff",
                  cursor: "pointer",
                },
                position: "bottom-left",
              }
            );
        } else {
          // Clear toast if order is delivered or not ongoing
          toast.dismiss("ongoing-order-toast");
          clearInterval(orderCheckInterval);
        }
      } catch (error) {
        console.error("Failed to fetch ongoing order:", error);
      }
    };
  
    // Check for ongoing orders every 10 seconds
    fetchOngoingOrder();
    orderCheckInterval = setInterval(fetchOngoingOrder, 10000);
  
    return () => clearInterval(orderCheckInterval); 
  }, [router]);

  return (
    <>
      <DashNav search={search} setSearch={setSearch} />
      <Toaster position="bottom-left" reverseOrder={false} />


      <div className="p-20 relative">
        {/* Chat Icon */}
        <button
          className="fixed bottom-6 right-6 bg-purple-800 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 focus:outline-none"
          onClick={() => setShowChat((prev) => !prev)}
        >
          <ChatBubbleOvalLeftIcon className="w-8 h-8" />
        </button>

        {/* Chat UI */}
        {showChat && (
          <div className="fixed bottom-16 right-6 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
            <div className="p-4 border-b border-gray-300 bg-purple-100 text-purple-800 font-bold">
              Chat with Driver
            </div>
            <div className="p-4 max-h-64 overflow-y-auto">
              {messages.map((message, index) => (
                <p
                  key={index}
                  className={`mb-2 ${
                    message.sender === "Customer"
                      ? "text-right text-blue-600"
                      : "text-left text-green-600"
                  }`}
                >
                  {message.sender}: {message.text}
                </p>
              ))}
            </div>
            <div className="p-4 flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Type your message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Options Buttons */}
        <div className="p-4 flex justify-center space-x-4 mb-8">
          {["all", "pickup", "delivery"].map((option) => (
            <button
              key={option}
              onClick={() => setActiveOption(option)}
              className={`px-6 py-3 font-medium text-white rounded-lg ${
                activeOption === option
                  ? "bg-purple-800"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LuLoader className="text-purple-800 animate-spin text-5xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.restaurants.map((restaurant) => (
              <Link
                href={`/Customer/restaurant/${restaurant._id}`}
                key={restaurant._id}
              >
                <div className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow">
                  <div className="relative w-full h-25 flex justify-center items-center">
                    <img
                      src={`data:${restaurant.imageContentType};base64,${restaurant.image}`}
                      alt={restaurant.restaurantName}
                      className="object-contain w-50 h-40"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 bg-purple-200">
                    <h3 className="text-lg font-semibold">
                      {restaurant.restaurantName}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {restaurant.address}
                    </p>
                    <div className="flex items-center mt-2">
                      <div className="flex">
                        {renderStars(restaurant.avgRating)}
                      </div>
                      <p className="text-gray-600 text-lg font-semibold mr-2">
                        {restaurant.avgRating}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-l disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2">{`Page ${page} of ${totalPages}`}</span>
          <button
            className="px-4 py-2 bg-gray-200 rounded-r disabled:opacity-50"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
