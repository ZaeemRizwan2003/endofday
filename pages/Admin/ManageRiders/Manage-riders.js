import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import AdminLayout from "@/Components/AdminLayout";

export default function ManageRiders() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRider, setCurrentRider] = useState(null);
  const [updatedRider, setUpdatedRider] = useState({
    name: "",
    contact: "",
    area: "",
    city: "",
  });

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const response = await axios.get("/api/Admin/Riders/manageRiders");
        if (response.data.success) {
          setRiders(response.data.deliveryPartners);
        } else {
          console.error("Failed to fetch riders");
        }
      } catch (error) {
        console.error("Error fetching riders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiders();
  }, []);

  const handleDeleteRider = async (riderId) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this rider? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `/api/Admin/Riders/manageRiders?partnerId=${riderId}`
      );
      if (response.data.success) {
        setRiders((prev) => prev.filter((rider) => rider._id !== riderId));
        alert("Rider deleted successfully!");
      } else {
        alert("Failed to delete rider.");
      }
    } catch (error) {
      console.error("Error deleting rider:", error);
      alert("An error occurred while deleting the rider.");
    }
  };

  const openEditModal = (rider) => {
    setCurrentRider(rider);
    setUpdatedRider({
      name: rider.name,
      contact: rider.contact,
      area: rider.area,
      city: rider.city,
    });
    setEditModalOpen(true);
  };

  const handleEditRider = async () => {
    const payload = {
      partnerId: currentRider._id,
      ...updatedRider,
    };

    try {
      const response = await axios.put("/api/Admin/Riders/manageRiders", payload);
      if (response.data.success) {
        alert("Rider updated successfully!");
        setRiders((prev) =>
          prev.map((r) =>
            r._id === currentRider._id
              ? { ...r, ...response.data.updatedPartner }
              : r
          )
        );
        setEditModalOpen(false);
      } else {
        alert("Failed to update rider.");
      }
    } catch (error) {
      console.error("Error updating rider:", error);
      alert("An error occurred while updating the rider.");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Page Title */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Manage Riders</h1>
          <Link href="/Admin/AdminDashboard" className="text-blue-600 hover:text-blue-800">
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center mt-12">
            <p className="text-lg text-gray-500 animate-pulse">Loading riders...</p>
          </div>
        ) : riders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {riders.map((rider) => (
              <div
                key={rider._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
              >
                {/* Icons for Edit and Delete */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => openEditModal(rider)}
                    className="text-blue-500 hover:text-blue-700 transition"
                    title="Edit Rider"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteRider(rider._id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Delete Rider"
                  >
                    <FaTrashAlt size={20} />
                  </button>
                </div>

                {/* Rider Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{rider.name}</h2>
                    <p className="text-gray-500">Contact: {rider.contact}</p>
                    <p className="text-gray-500">Area: {rider.area}</p>
                    <p className="text-gray-500">City: {rider.city}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Total Deliveries:{" "}
                        <span className="font-semibold text-gray-700">
                          {rider.orderCount}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Created On:{" "}
                        <span className="font-semibold text-gray-700">
                          {new Date(rider.createdAt).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                    <Link
                      href={`/Admin/ManageRiders/Rider-details?userId=${rider._id}`}
                      className="text-blue-500 hover:text-blue-700 font-medium transition"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600">No riders found.</p>
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Edit Rider</h2>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={updatedRider.name}
                  onChange={(e) =>
                    setUpdatedRider({ ...updatedRider, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Contact</label>
                <input
                  type="text"
                  value={updatedRider.contact}
                  onChange={(e) =>
                    setUpdatedRider({ ...updatedRider, contact: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Area</label>
                <input
                  type="text"
                  value={updatedRider.area}
                  onChange={(e) =>
                    setUpdatedRider({ ...updatedRider, area: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">City</label>
                <input
                  type="text"
                  value={updatedRider.city}
                  onChange={(e) =>
                    setUpdatedRider({ ...updatedRider, city: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditRider}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
