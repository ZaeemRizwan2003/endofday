import React, { useState, useEffect } from "react";
import AdminLayout from "@/Components/AdminLayout";
import Link from "next/link";

const AllOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state for actions

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("/api/Offers/getalloffers");

        if (!response.ok) {
          throw new Error("Failed to fetch offers");
        }

        const data = await response.json();
        setOffers(data.offers);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setIsLoading(true); // Set loading to true when the button is clicked
    let rejectionReason = "";

    if (newStatus === "rejected") {
      rejectionReason = prompt("Please provide a reason for rejecting this offer:");
      if (!rejectionReason) {
        alert("Rejection reason is required!");
        setIsLoading(false); // Reset loading when prompt is cancelled
        return;
      }
    }

    try {
      const response = await fetch("/api/Offers/updateStatus", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          status: newStatus,
          reason: rejectionReason, // include reason if rejected
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update offer status");
      }

      // Update frontend offers list
      setOffers((prevOffers) =>
        prevOffers.filter((offer) => offer._id !== id) // remove offer if rejected
      );
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false); // Reset loading when the action is done
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <p className="text-lg font-semibold text-gray-700 animate-pulse">Loading offers...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <p className="text-lg font-semibold text-red-500">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  // Filter offers to show only those with "pending" status
  const pendingOffers = offers.filter((offer) => offer.status === "Pending");

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-700">Pending Offers</h1>
          <Link
            href="/Admin/AdminDashboard"
            className="inline-flex items-center text-white bg-purple-600 hover:bg-purple-700 font-medium py-2 px-4 rounded-lg transition"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {pendingOffers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No pending offers found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingOffers.map((offer) => (
              <div
                key={offer._id}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between"
              >
                {/* Bakery Name */}
                <div className="mb-4">
                  <h3 className="text-xl text-center font-bold text-purple-600">
                    {offer.createdBy?.restaurantName || "Unknown Bakery"}
                  </h3>
                  <p className="text-sm text-center text-black">{offer.createdBy?.email}</p>
                </div>

                {/* Offer Title */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{offer.title}</h2>
                  <p className="text-gray-600 mt-2">{offer.message}</p>
                </div>

                {/* Offer Details */}
                <div className="text-sm text-gray-500 space-y-1 mb-4">
                  <p><span className="font-medium text-gray-700">Start:</span> {new Date(offer.startDate).toLocaleDateString("en-GB")}</p>
                  <p><span className="font-medium text-gray-700">End:</span> {new Date(offer.endDate).toLocaleDateString("en-GB")}</p>
                  <p>
                    <span className="font-medium text-gray-700">Status:</span>{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          offer.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : offer.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {offer.status}
                    </span>
                  </p>
                </div>

                {/* Approve / Reject Buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleStatusChange(offer._id, "approved")}
                    disabled={offer.status === "approved" || isLoading} // Disable button if loading or already approved
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg disabled:opacity-50 transition"
                  >
                    {isLoading ? (
                      <div className="loader">Loading...</div> // Show loader while processing
                    ) : (
                      "Approve"
                    )}
                  </button>
                  <button
                    onClick={() => handleStatusChange(offer._id, "rejected")}
                    disabled={offer.status === "rejected" || isLoading} // Disable button if loading or already rejected
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg disabled:opacity-50 transition"
                  >
                    {isLoading ? (
                      <div className="loader">Loading...</div> // Show loader while processing
                    ) : (
                      "Reject"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AllOffers;
