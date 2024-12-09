import { useState, useEffect } from "react";
import { LuLoader } from "react-icons/lu"; // Loader icon
import DashNav from "@/Components/CustomerNavbar";

const RestaurantUserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user ID from the token (you can store it in localStorage or any other secure way)
  const userId = localStorage.getItem("userId"); // or extract from token if needed

  useEffect(() => {
    if (userId) {
      fetchReviews(userId);
    }
  }, [userId]);

  const fetchReviews = async (userId) => {
    try {
      const response = await fetch(`/api/Restaurants/customerreviews`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userId}`, // Send userId as token
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashNav />
      <div className="pt-32 px-6 md:px-16 lg:px-24">
        {" "}
        {/* Updated padding for responsiveness */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LuLoader className="text-purple-800 animate-spin text-6xl" />
            <span className="ml-4 text-xl text-purple-800 font-semibold">
              Loading Your Reviews...
            </span>
          </div>
        ) : error ? (
          <div className="text-red-600 font-semibold text-xl text-center">
            {error}
          </div>
        ) : (
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-purple-800 mb-12 text-center">
              Your Reviews
            </h1>
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-xl p-6 border-2 border-gray-200 transition-transform transform hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="mb-4">
                      <h2 className="text-2xl font-semibold text-purple-700">
                        Review by{" "}
                        <span className="text-purple-500">
                          {review.userName}
                        </span>
                      </h2>
                      <p className="text-lg text-gray-600">
                        {review.restaurantName}
                      </p>
                    </div>
                    <p className="text-gray-700 italic text-lg mb-4">
                      "{review.review}"
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-yellow-500">
                        Rating: ⭐ {review.rating} / 5
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg text-red-600 font-semibold text-center">
                You have not posted any reviews yet.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default RestaurantUserReviews;
