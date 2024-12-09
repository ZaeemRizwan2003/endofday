import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import DashNav from "@/Components/CustomerNavbar";
import { LuLoader } from "react-icons/lu";

const RestaurantReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `/api/Customer/restaurantreviews?restaurantId=${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashNav />
      <div className="pt-32 px-10">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LuLoader className="text-purple-800 animate-spin text-5xl" />
            <span className="ml-4 text-lg text-purple-800 font-semibold">
              Loading Reviews...
            </span>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl font-bold text-purple-800 mb-8">
              Customer Reviews
            </h1>
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
                  >
                    <h2 className="text-lg font-semibold text-purple-800 mb-1">
                      {review.userName || "Anonymous"}
                    </h2>
                    <p className="text-gray-600 italic mb-4">
                      "{review.review}"
                    </p>

                    <div className="mt-4 text-sm text-gray-700">
                      <p className="font-semibold">
                        ⭐ Rating: {review.rating || "Not Rated"} / 5
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg text-red-600 font-semibold">
                No reviews available yet.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default RestaurantReview;
