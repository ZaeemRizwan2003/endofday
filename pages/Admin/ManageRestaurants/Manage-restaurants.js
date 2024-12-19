import AdminLayout from "@/Components/AdminLayout";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [bakeryCount, setBakeryCount] = useState(0); // Added state for bakery count
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const response = await fetch("/api/Admin/Restaurants/displayallrestaurants");
        const data = await response.json();

        // Log the data to check if it's structured correctly
        console.log(data);

        if (response.ok && data && Array.isArray(data.listings)) {
          const processedListings = data.listings.map((listing) => {
            if (
              listing.image &&
              listing.image.data &&
              listing.image.contentType
            ) {
              const base64Image = listing.image.data.toString("base64");
              return {
                ...listing,
                image: {
                  data: base64Image,
                  contentType: listing.image.contentType,
                },
              };
            }
            return listing;
          });
          setRestaurants(processedListings);
          setBakeryCount(data.count); // Set the bakery count
        } else {
          console.error("Invalid data format or no listings found.");
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    }

    fetchRestaurants();
  }, []);

  const handleDeleteRestaurant = async (restaurantId) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this restaurant? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `/api/Admin/Restaurants/deleteRestaurant?id=${restaurantId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setRestaurants((prev) =>
          prev.filter((restaurant) => restaurant._id !== restaurantId)
        );
        alert("Restaurant deleted successfully!");
      } else {
        alert("Failed to delete restaurant.");
      }
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      alert("An error occurred while deleting the restaurant.");
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
          >
            {/* Restaurant Image */}
            {restaurant.image && restaurant.imageContentType ? (
              <img
                src={`data:${restaurant.imageContentType};base64,${restaurant.image}`}
                alt={restaurant.restaurantName}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-300 flex justify-center items-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}

            {/* Restaurant Info */}
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {restaurant.restaurantName}
              </h2>
              <p className="text-gray-600 mb-2">Location: {restaurant.address}</p>
              <p className="text-gray-600 mb-4">Phone: {restaurant.number}</p>

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
                  href={`/Customer/restaurant/${restaurant._id}`}
                  className="text-purple-700 hover:text-purple-900 font-medium transition"
                >
                  View Menu &rarr;
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </AdminLayout>
  );
}
