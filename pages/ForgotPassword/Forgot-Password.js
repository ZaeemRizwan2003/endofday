// pages/forgot-password.js
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const [otpSent, setOtpSent] = useState(false); // State to track OTP sent status
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show "Sending OTP" text
    setOtpSent(false); // Reset OTP sent status

    try {
      const res = await axios.post("/api/ForgotPassword/forgot-password", {
        email,
      });

      setMessage(res.data.message);
      setOtpSent(true); // OTP sent successfully
      sessionStorage.setItem("forgotPasswordEmail", email);
      // Redirect to verify-otp page after a brief delay
      setTimeout(() => {
        if (res.status === 200) {
          router.push({
            pathname: "/ForgotPassword/Verify-otp",
            query: { email },
          });
        }
      }, 2000); // Delay of 2 seconds for user to see the message
    } catch (error) {
      setMessage("Error sending OTP. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className={`w-full py-3 ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800"
            } text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            {loading ? "Sending OTP..." : otpSent ? "OTP Sent!" : "Send OTP"}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
