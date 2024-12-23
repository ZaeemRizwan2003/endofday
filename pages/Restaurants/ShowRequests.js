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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <FaSpinner className="animate-spin text-6xl text-purple-500" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <p className="text-lg text-red-600 font-semibold">Error: {error}</p>
      </div>
    );
  }

  // Function to get the status class based on the status
  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 font-bold"; // Green for approved
      case "rejected":
        return "text-red-600 font-bold"; // Red for rejected
      case "pending":
        return "text-purple-600 font-bold"; // Purple for pending
      default:
        return "text-gray-500"; // Default style
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-200">
        <div className="w-full max-w-4xl p-6 bg-white shadow-xl rounded-xl border border-gray-200">
          <h1 className="text-3xl font-bold text-center text-purple-900 mb-6">
            Notification Requests
          </h1>
          {notifications.length === 0 ? (
            <p className="text-center text-gray-600">
              No notification requests found.
            </p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
                >
                  <h2 className="font-semibold text-xl text-center text-purple-700 mb-2">
                    {notification.title}
                  </h2>
                  <p className={getStatusClass(notification.status)}>
                    Status: {notification.status}
                  </p>
                  <p className="text-gray-600 mb-4">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    Requested on:{" "}
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationRequests;
