import DashNav from "@/Components/CustomerNavbar";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { LuLoader } from "react-icons/lu";
import useSearch from "@/hooks/useSearch";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faStar as faStarOutline,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const {
    results,
    search,
    setSearch,
    activeOption,
    setActiveOption,
    page,
    setPage,
    totalPages,
  } = useSearch();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/Login");
    } else {
      axios
        .get("/api/Customer/user-info", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
        .then((res) => {
          console.log("User info fetched successfully", res.data);
          setUser(res.data.user);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Failed to fetch user info", error);
          router.push("/Login");
        });
    }
  }, [router]);

  const renderStars = (avgRating) => {
    const totalStars = 5;
    const filledStars = Math.floor(avgRating); // Get the whole number part of the average rating
    const halfStar = avgRating - filledStars >= 0.5; // Check if there is a half-star
    const emptyStars = totalStars - filledStars - (halfStar ? 1 : 0); // Remaining stars will be empty

    const stars = [];

    // Add filled stars
    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`filled-${i}`}
          icon={faStar}
          className="text-yellow-500 w-5 h-5"
        />
      );
    }

    // Add half star if needed
    if (halfStar) {
      stars.push(
        <FontAwesomeIcon
          key="half-star"
          icon={faStarHalfAlt}
          className="text-yellow-500 w-5 h-5"
        />
      );
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`empty-${i}`}
          icon={faStarOutline}
          className="text-gray-400 w-5 h-5"
        />
      );
    }

    return stars;
  };

  return (
    <>
      <DashNav search={search} setSearch={setSearch} />

      <div className="p-20">
        {/* Options Buttons */}
        <div className="p-4 flex justify-center space-x-4 mb-8">
          {["all", "pickup", "delivery"].map((option) => (
            <button
              key={option}
              onClick={() => setActiveOption(option)}
              className={`px-6 py-3 font-medium text-white rounded-lg ${
                activeOption === option
                  ? "bg-purple-800"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LuLoader className="text-purple-800 animate-spin text-5xl" />
            <span className="ml-4 text-lg text-purple-800 font-semibold">
              Loading restaurants...
            </span>
          </div>
        ) : (
          /* Restaurant Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.restaurants.length > 0 ? (
              results.restaurants.map((restaurant) => (
                <Link
                  href={`/Customer/restaurant/${restaurant._id}`}
                  key={restaurant._id}
                >
                  <div className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow">
                    <div className="relative w-full h-25 flex justify-center items-center">
                      <img
                        src={`data:${restaurant.imageContentType};base64,${restaurant.image}`}
                        alt={restaurant.restaurantName}
                        className="object-contain w-50 h-40"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/placeholder.png"; // Fallback image
                          e.target.alt = "Image not available";
                        }}
                      />
                    </div>
                    <div className="p-3 bg-purple-200">
                      <h3 className="text-lg font-semibold">
                        {restaurant.restaurantName}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {restaurant.address}
                      </p>
                      {/* Display the average rating */}
                      <div className="flex items-center mt-2">
                        <div className="flex">
                          {renderStars(restaurant.avgRating)}
                        </div>
                        <p className="text-gray-600 text-lg font-semibold mr-2">
                          {restaurant.avgRating}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>Fetching {activeOption}.......</p>
            )}
          </div>
        )}

        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-l disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2">{`Page ${page} of ${totalPages}`}</span>
          <button
            className="px-4 py-2 bg-gray-200 rounded-r disabled:opacity-50"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
