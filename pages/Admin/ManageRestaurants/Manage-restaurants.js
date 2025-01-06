import AdminLayout from "@/Components/AdminLayout";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [bakeryCount, setBakeryCount] = useState(0); // State for bakery count
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state for confirmation
  const [restaurantToDelete, setRestaurantToDelete] = useState(null); // Restaurant to be deleted
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Success modal visibility state

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const response = await fetch(
          "/api/Admin/Restaurants/displayallrestaurants"
        );
        const data = await response.json();

        // Log the data to check structure
        console.log(data);

        if (response.ok && data && Array.isArray(data.listings)) {
          setRestaurants(data.listings); // Directly set listings
          setBakeryCount(data.count); // Set the bakery count
        } else {
          console.error("Invalid data format or no listings found.");
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false); // Turn off loading state
      }
    }

    fetchRestaurants();
  }, []);

  const handleEditRestaurant = (restaurantId) => {
    // Navigate to the edit page with the restaurant ID as a query parameter
    window.location.href = `/Admin/ManageRestaurants/EditRestaurant?id=${restaurantId}`;
  };

  const handleDeleteRestaurant = (restaurantId) => {
    setRestaurantToDelete(restaurantId); // Set the restaurant to be deleted
    setIsModalOpen(true); // Open the confirmation modal
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `/api/Admin/Restaurants/deleteres?id=${restaurantToDelete}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setRestaurants((prev) =>
          prev.filter((restaurant) => restaurant._id !== restaurantToDelete)
        );
        setIsSuccessModalOpen(true); // Open success modal
      } else {
        alert("Failed to delete restaurant.");
      }
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      alert("An error occurred while deleting the restaurant.");
    } finally {
      setIsModalOpen(false); // Close the confirmation modal
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the confirmation modal if user cancels
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false); // Close the success modal
  };

  // Modal Component for Deletion Confirmation
  const Modal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null; // Don't render modal if not open

    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Are you sure you want to delete this restaurant?
          </h3>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Success Modal Component
  const SuccessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Restaurant deleted successfully!
          </h3>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Page Title */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Restaurants</h1>
          <p className="text-lg font-semibold text-gray-700">
            Total Bakeries: {bakeryCount}
          </p>
        </div>

        {/* Restaurants Grid */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
              >
                {/* Restaurant Info */}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {restaurant.restaurantName}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    Location: {restaurant.address}
                  </p>
                  <p className="text-gray-600 mb-4">
                    Phone: {restaurant.number}
                  </p>

                  {/* Options */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.option.map((option, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                      >
                        {option}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end">
                    <a
                      href={`/Admin/ManageRestaurants/Showlistings?id=${restaurant._id}`}
                      className="text-purple-700 hover:text-purple-900 font-medium transition"
                    >
                      View Menu &rarr;
                    </a>
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditRestaurant(restaurant._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit size={20} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteRestaurant(restaurant._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrashAlt size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Confirmation */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
      />
    </AdminLayout>
  );
}
