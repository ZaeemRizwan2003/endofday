import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa";
import AdminLayout from "@/Components/AdminLayout";

const BakeryApproval = () => {
  const [bakeries, setBakeries] = useState([]);
  const [filteredBakeries, setFilteredBakeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { status = "pending" } = router.query;

  useEffect(() => {
    const fetchBakeries = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/Admin/Restaurants/bakeryrequests`);

        if (!response.ok) {
          throw new Error("Failed to fetch bakeries");
        }

        const data = await response.json();
        setBakeries(data.bakeries);
        setFilteredBakeries(data.bakeries.filter((b) => b.status === status));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBakeries();
  }, []);

  useEffect(() => {
    setFilteredBakeries(bakeries.filter((b) => b.status === status));
  }, [status, bakeries]);

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
      const response = await fetch(`/api/Admin/Restaurants/updatestatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: actionStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setBakeries((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: actionStatus } : b))
      );
      alert(`Bakery successfully ${actionStatus}`);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-6xl text-purple-500" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 mt-20">
        <Link
          href="/Admin/AdminDashboard"
          className="text-purple-600 hover:text-purple-800"
        >
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold mb-4 text-center">
          Bakery Approvals
        </h1>

        <div className="flex justify-center space-x-4 mb-6">
          {["pending", "approved", "rejected"].map((filterStatus) => (
            <button
              key={filterStatus}
              className={`px-4 py-2 rounded ${
                status === filterStatus
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => handleFilterChange(filterStatus)}
            >
              {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
            </button>
          ))}
        </div>

        {filteredBakeries.length === 0 ? (
          <p className="text-center">No {status} bakeries found.</p>
        ) : (
          <ul>
            {filteredBakeries.map((bakery) => (
              <li
                key={bakery._id}
                className="bg-white p-4 shadow-lg rounded-lg mb-4"
              >
                <p className="text-lg text-gray-700 font-semibold">
                  Name: {bakery.restaurantName}
                </p>
                <p className="text-sm text-gray-500">Email: {bakery.email}</p>
                <p className="text-sm text-gray-500">
                  Address: {bakery.address}
                </p>
                <p className="text-sm text-gray-500">Phone: {bakery.number}</p>
                <p className="text-sm text-gray-500">
                  Requested on:{" "}
                  {new Date(bakery.createdAt).toLocaleDateString()}
                </p>
                {status === "pending" && (
                  <div className="mt-4">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => handleAction(bakery._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleAction(bakery._id, "rejected")}
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
    </AdminLayout>
  );
};

export default BakeryApproval;
