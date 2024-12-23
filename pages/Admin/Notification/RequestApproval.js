import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa";
import AdminLayout from "@/Components/AdminLayout";

const RequestApproval = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { status = "pending" } = router.query;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // setLoading(true);
        const response = await fetch("/api/Notification/approvenotification");

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data.notifications);
        setFilteredNotifications(
          data.notifications.filter((n) => n.status === status)
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    setFilteredNotifications(notifications.filter((n) => n.status === status));
  }, [status, notifications]);

  const handleFilterChange = (newStatus) => {
    router.push(
      {
        pathname: router.pathname,
        query: { status: newStatus },
      },
      undefined,
      { shallow: true }
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

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, status: actionStatus }
            : notification
        )
      );
      alert(`Notification successfully ${actionStatus}`);
    } catch (error) {
      alert(error.message);
    }
  };

  // if (loading) {
  //  return <div>Loading...</div>; 
  // }

  return (
    <AdminLayout>
      <div className="bg-gray-100 p-6 min-h-screen">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800">Notification Requests</h1>
          <Link
            href="/Admin/AdminDashboard"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          {["pending", "approved", "rejected"].map((filterStatus) => (
            <button
              key={filterStatus}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                status === filterStatus
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => handleFilterChange(filterStatus)}
            >
              {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
            </button>
          ))}
        </div>

        {/* Notification List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No {status} notifications found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Notification Header */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {notification.title}
                  </h2>
                  <span
                    className={`px-2 py-1 text-sm font-medium rounded-full ${
                      status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {notification.status.charAt(0).toUpperCase() +
                      notification.status.slice(1)}
                  </span>
                </div>

                {/* Notification Body */}
                <div className="p-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Bakery Owner:</strong>{" "}
                    {notification.bakeryOwnerName || "N/A"}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Message:</strong> {notification.message}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Requested on:{" "}
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                {status === "pending" && (
                  <div className="p-4 border-t border-gray-200 flex justify-end space-x-4">
                    <button
                      onClick={() => handleAction(notification._id, "approved")}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(notification._id, "rejected")}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RequestApproval;
