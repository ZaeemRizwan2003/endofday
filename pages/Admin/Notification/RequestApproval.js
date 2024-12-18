import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
const RequestApproval = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { status = "pending" } = router.query; // Default to 'pending'

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/Notification/approvenotification?status=${status}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data.notifications);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (status) {
      fetchNotifications();
    }
  }, [status]);

  const handleFilterChange = (newStatus) => {
    router.push(
      {
        pathname: router.pathname,
        query: { status: newStatus },
      },
      undefined,
      { shallow: true } // Prevent full page reload
    );
  };

  const handleAction = async (id, actionStatus) => {
    try {
      const response = await fetch(`/api/Notification/updatestatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: actionStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Remove updated notification from the list
      setNotifications(
        notifications.filter((notification) => notification._id !== id)
      );

      alert(`Notification successfully ${actionStatus}`);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-20">
      <Link
        legacyBehavior
        href="/Admin/AdminDashboard"
        className="text-blue-600 hover:text-blue-800"
      >
        &larr; Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-4 text-center">
        Notification Requests
      </h1>

      {/* Status Filter Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        {["pending", "approved", "rejected"].map((filterStatus) => (
          <button
            key={filterStatus}
            className={`px-4 py-2 rounded ${
              status === filterStatus
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => handleFilterChange(filterStatus)}
          >
            {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <p className="text-center">No {status} notifications found.</p>
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
              {status === "pending" && (
                <div className="mt-4">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => handleAction(notification._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleAction(notification._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RequestApproval;
