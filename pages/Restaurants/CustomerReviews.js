import { useState, useEffect } from "react";
import { LuLoader } from "react-icons/lu"; // Loader icon
import DashNav from "@/Components/Navbar";

const RestaurantUserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = sessionStorage.getItem("userId");

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
          Authorization: `Bearer ${userId}`,
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
      <div className="pt-28 px-6 md:px-16 lg:px-24 bg-gradient-to-br from-purple-50 to-purple-100 min-h-screen">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <LuLoader className="text-purple-800 animate-spin text-6xl" />
            <span className="mt-4 text-xl text-purple-800 font-semibold">
              Loading Your Reviews...
            </span>
          </div>
        ) : error ? (
          <div className="text-red-600 font-semibold text-xl text-center">
            {error}
          </div>
        ) : (
          <div>
            <h1 className="text-4xl font-extrabold text-purple-800 mb-8 text-center">
              Your Reviews
            </h1>
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-2xl transform transition duration-300 hover:-translate-y-2"
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
              <p className="text-lg text-gray-600 font-semibold text-center">
                You have not recieved any reviews yet.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default RestaurantUserReviews;
