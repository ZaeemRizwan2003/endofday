import { useState } from "react";
import axios from "axios";

const ReviewPage = ({ bakeryId }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId"); // Assuming the user is logged in

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !review) {
      setMessage("Please provide both a rating and a review.");
      return;
    }

    try {
      const response = await axios.post("/api/Customer/postReview", {
        bakeryId,
        userId,
        rating,
        review,
      });

      if (response.status === 200) {
        setMessage("Review submitted successfully!");
        setReview("");
        setRating(0);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("Failed to submit the review.");
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`cursor-pointer text-2xl ${
            i <= (hoverRating || rating) ? "text-yellow-500" : "text-gray-400"
          }`}
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
        >
          ★
        </span>
      );
    }
    return stars;
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

// Example to pass bakeryId from the server
// For dynamic bakeryId, use something like getServerSideProps
export const getServerSideProps = async (context) => {
  const { bakeryId } = context.query; // Assuming bakeryId is passed as a query parameter
  return {
    props: { bakeryId },
  };
};
