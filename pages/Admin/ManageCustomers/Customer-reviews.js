import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { FaStar, FaArrowLeft } from "react-icons/fa"; // Import star and arrow icons
import AdminLayout from "@/Components/AdminLayout";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    const fetchReviews = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `/api/Admin/Customer/fetchReviews?userId=${userId}`
        );

        if (response.data.success) {
          setReviews(response.data.reviews);
          setTotalReviews(response.data.totalReviews);
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Customer Reviews</h1>
        <Link legacyBehavior href="/Admin/ManageCustomers/Manage-customers">
          <a className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition">
            <FaArrowLeft className="mr-2" /> Back to Customers
          </a>
        </Link>
      </div>

      {/* Total Reviews */}
      <div className="mb-6 text-lg font-medium text-gray-700">
        Total Reviews: <span className="text-blue-600 font-bold">{totalReviews}</span>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg animate-pulse">Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
            >
              {/* Bakery Name */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {review.bakeryName}
              </h2>

              {/* Star Ratings */}
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`mr-1 ${
                      i < review.rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Review Content */}
              <p className="text-gray-700 mb-4">{review.review}</p>

              {/* Date of Review */}
              <p className="text-sm text-gray-500">
                Reviewed on:{" "}
                <span className="font-medium">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600">No reviews found for this customer.</p>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
