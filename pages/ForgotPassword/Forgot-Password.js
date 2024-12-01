// pages/forgot-password.js
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/ForgotPassword/forgot-password", {
        email,
      });
      setMessage(res.data.message);

      // Redirect to verify-otp page if OTP is successfully sent
      if (res.status === 200) {
        router.push({
          pathname: "/ForgotPassword/Verify-otp", // Redirect to verify OTP
          query: { email }, // Pass email as query parameter
        });
      }
    } catch (error) {
      setMessage("Error sending OTP. Please try again.");
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
            className="w-full py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Send OTP
          </button>
        </form>
        {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
