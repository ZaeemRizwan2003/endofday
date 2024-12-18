import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Navbar from "@/Components/Navbar";
import { FaSpinner } from "react-icons/fa";

const NotificationRequests = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = Cookies.get("userId"); // Fetch token from cookies

      if (!token) {
        router.push("/Login"); // Redirect to login if no token
        return;
      }

      try {
        const response = await fetch(
          `/api/Notification/shownotification?id=${token}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data.notifications); // Assuming the response contains notifications
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-6xl text-blue-500" />
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Function to get the status class based on the status
  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 font-bold text-2xl"; // Green for approved
      case "rejected":
        return "text-red-600 font-bold text-2xl"; // Red for rejected
      case "pending":
        return "text-purple-700 font-bold text-2xl"; // Purple for pending
      default:
        return "text-gray-500"; // Default style
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 mt-20">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">
          Notification Requests
        </h1>
        {notifications.length === 0 ? (
          <p>No notification requests found.</p>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className="bg-white p-4 shadow-lg rounded-lg mb-4"
              >
                <h2 className="font-bold text-lg">{notification.title}</h2>
                <p>{notification.message}</p>
                <p className="text-sm text-gray-500">
                  Requested on:{" "}
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
                {/* Display the status with dynamic styling */}
                <p className={getStatusClass(notification.status)}>
                  {notification.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default NotificationRequests;
