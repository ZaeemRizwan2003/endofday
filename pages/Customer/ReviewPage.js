import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-purple-800 mb-4">
        Write a Review
      </h1>

      {message && <p className="text-red-600">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Rate this Bakery:</h3>
          <div className="flex">{renderStars()}</div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="review"
            className="block text-sm font-medium text-gray-700"
          >
            Your Review:
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mt-2"
            rows="5"
            placeholder="Share your experience..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-purple-800 text-white px-6 py-2 rounded-lg hover:bg-purple-900 transition"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewPage;
