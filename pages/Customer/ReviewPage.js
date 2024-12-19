import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import DashNav from "@/Components/CustomerNavbar";

const ReviewPage = () => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [itemId, setItemId] = useState(null);
  const [bakeryOwner, setBakeryOwner] = useState("");

  const router = useRouter();
  const { orderId } = router.query;
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // Fetch order details
  useEffect(() => {
    if (orderId) {
      axios
        .get(`/api/Customer/postReview?orderId=${orderId}`)
        .then((response) => {
          const { itemId, bakeryowner } = response.data;
          setItemId(itemId);
          setBakeryOwner(bakeryowner);
        })
        .catch((error) => {
          console.error("Error fetching order details:", error);
          setMessage("Failed to fetch order details.");
        });
    }
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !review || !itemId || !bakeryOwner) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        `/api/Customer/postReview?orderId=${orderId}`,
        {
          itemId,
          bakeryOwner,
          userId,
          rating,
          review,
        }
      );

      if (response.status === 200) {
        setMessage("Review submitted successfully!");
        setReview("");
        setRating(0);
        setTimeout(() => router.push("/Customer/OrderHistory"), 2000);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("Failed to submit the review.");
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i + 1}
        className={`cursor-pointer text-2xl ${
          i + 1 <= (hoverRating || rating) ? "text-yellow-500" : "text-gray-400"
        }`}
        onClick={() => setRating(i + 1)}
        onMouseEnter={() => setHoverRating(i + 1)}
        onMouseLeave={() => setHoverRating(0)}
      >
        ★
      </span>
    ));
  };

  return (
    <>
    <DashNav/>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-purple-800 text-center mb-6">
          Share Your Experience
        </h1>

        {message && (
          <p
            className={`text-center text-lg font-semibold ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700">
              Rate this Bakery
            </h3>
            <div className="flex justify-center mt-2">{renderStars()}</div>
          </div>

          <div>
            <label
              htmlFor="review"
              className="block text-sm font-medium text-gray-600"
            >
              Your Review
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-4 mt-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              rows="5"
              placeholder="Share your experience..."
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-purple-800 text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-purple-900 transition-transform transform hover:scale-105"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default ReviewPage;
