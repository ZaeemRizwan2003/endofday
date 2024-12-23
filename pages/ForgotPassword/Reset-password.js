// pages/reset-password.js
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ResetPassword() {
  const router = useRouter();
  const { email } = router.query; // Get email from query string
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Tracks loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    setMessage(""); // Clear previous message
    try {
      const res = await axios.post("/api/ForgotPassword/reset-password", {
        email,
        newPassword,
      });
      setMessage(res.data.message);
      setLoading(false); // End loading state
      if (res.status === 200) {
        router.push("/Login"); // Redirect to login after password reset
      }
    } catch (error) {
      setMessage("Error resetting password. Please try again.");
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-700">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-green-500">{message}</p>
        )}
      </div>
    </div>
  );
}
