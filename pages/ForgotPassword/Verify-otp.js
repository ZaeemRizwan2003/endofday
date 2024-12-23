// pages/verify-otp.js
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function VerifyOTP() {
  const router = useRouter();
  const { email } = router.query; // Get email from query string
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // Tracks success or error
  const [loading, setLoading] = useState(false); // Tracks loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    setMessage(""); // Clear any previous message
    try {
      const res = await axios.post("/api/ForgotPassword/verify-otp", {
        email,
        otp,
      });
      setMessage(res.data.message);
      setMessageType("success"); // Set message type to success
      setLoading(false); // End loading state

      if (res.status === 200) {
        router.push({
          pathname: "/ForgotPassword/Reset-password",
          query: { email }, // Pass email to next step
        });
      }
    } catch (error) {
      console.error(error);
      setMessage("OTP verification failed. Please try again.");
      setMessageType("error"); // Set message type to error
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-700">
          Verify OTP
        </h1>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading} // Disable button while loading
            className={`w-full py-3 mt-4 text-white rounded-md ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            } focus:outline-none focus:ring focus:ring-purple-300`}
          >
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              messageType === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
