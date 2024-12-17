import React, { useState, useEffect } from "react";

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [bakeryCount, setBakeryCount] = useState(0); // Added state for bakery count

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const response = await fetch("/api/Admin/displayallrestaurants");
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Restaurants</h1>

      {/* Display the total bakery count */}
      <p className="text-lg text-gray-700 mb-6">
        Total Bakeries: {bakeryCount}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {/* Render Image */}
            {restaurant.image && restaurant.imageContentType ? (
              <img
                src={`data:${restaurant.imageContentType};base64,${restaurant.image}`}
                alt={restaurant.restaurantName}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-300 rounded-md mb-4 flex justify-center items-center">
                <span>No Image Available</span>
              </div>
            )}

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {restaurant.restaurantName}
            </h2>
            <p className="text-gray-600 mb-2">Location: {restaurant.address}</p>
            <p className="text-gray-600 mb-4">Phone: {restaurant.number}</p>
            <div className="flex flex-wrap gap-2">
              {restaurant.option.map((option, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
