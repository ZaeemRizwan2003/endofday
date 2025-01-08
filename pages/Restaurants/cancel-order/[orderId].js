import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const CancelOrderPage = () => {
  const [cancelReason, setCancelReason] = useState("");
  const [orderId, setOrderId] = useState(""); // Store orderId in state
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const router = useRouter(); // Use Next.js router

  // Fetch orderId once query is ready
  useEffect(() => {
    if (router.query.orderId) {
      setOrderId(router.query.orderId); // Update orderId from query
    }
  }, [router.query.orderId]); // Trigger useEffect only when orderId is available

  const handleCancelSubmit = async () => {
    // Validation for empty reason
    if (!cancelReason) {
      alert("Please provide a reason for cancelling.");
      return;
    }

    try {
      // Enable loader
      setIsLoading(true);

      // Log data to check values
      console.log("Order ID:", orderId);
      console.log("Reason:", cancelReason);

      // Send the cancellation reason to the server
      await axios.post("/api/Restaurants/cancelorders", {
        orderId,
        reason: cancelReason,
      });

      // After submission, navigate back to the orders page
      router.push("/Restaurants/RDashboard"); // Navigate using Next.js router
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel the order. Please try again.");
    } finally {
      // Disable loader
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {isLoading ? (
        <div className="flex flex-col items-center">
          {/* Loader Spinner */}
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700 text-lg font-medium">
            Informing user of order cancellation...
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
          <h1 className="text-3xl font-bold text-red-500 mb-6 text-center">
            Cancel Order
          </h1>
          <p className="text-gray-700 text-center mb-4">
            Please provide a reason for cancelling this order.
          </p>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none text-gray-800"
            rows="5"
            placeholder="Enter your reason here..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => router.push("/Restaurants/RDashboard")}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg shadow-lg hover:bg-gray-400 focus:ring-2 focus:ring-gray-300 focus:outline-none transition duration-200"
            >
              Go Back
            </button>
            <button
              onClick={handleCancelSubmit}
              className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none transition duration-200"
            >
              Submit Cancellation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelOrderPage;
