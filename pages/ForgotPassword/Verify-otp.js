import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function VerifyOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // Tracks success or error
  const [loading, setLoading] = useState(false); // Tracks loading state
  const [resendLoading, setResendLoading] = useState(false); // Tracks resend state
  const [resendTimer, setResendTimer] = useState(10); // ⏳ Timer starts at 10 seconds

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("forgotPasswordEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/ForgotPassword"); // Redirect back if no email is found
    }
  }, [router]);

  // Timer Countdown Logic
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer); // Cleanup on unmount
  }, [resendTimer]);

  // Handle OTP Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("/api/ForgotPassword/verify-otp", {
        email,
        otp,
      });
      setMessage(res.data.message);
      setMessageType("success");
      setLoading(false);

      if (res.status === 200) {
        router.push({
          pathname: "/ForgotPassword/Reset-password",
          query: { email },
        });
      }
    } catch (error) {
      console.error(error);
      setMessage("OTP verification failed. Please try again.");
      setMessageType("error");
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true);
    setMessage(""); // Clear any previous message
    try {
      await axios.post("/api/ForgotPassword/forgot-password", { email });
      setMessage("A new OTP has been sent to your email.");
      setMessageType("success");
      setResendTimer(10); // ⏳ Reset timer to 10 seconds
    } catch (error) {
      console.error(error);
      setMessage("Failed to resend OTP. Please try again later.");
      setMessageType("error");
    } finally {
      setResendLoading(false);
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
            disabled={loading}
            className={`w-full py-3 mt-4 text-white rounded-md ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            } focus:outline-none focus:ring focus:ring-purple-300`}
          >
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend OTP Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn't get the OTP?{" "}
            <button
              onClick={handleResendOTP}
              disabled={resendTimer > 0 || resendLoading}
              className={`text-purple-600 hover:underline ${
                resendTimer > 0 || resendLoading
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              {resendLoading
                ? "Resending..."
                : resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Resend OTP"}
            </button>
          </p>
        </div>

        {/* Success/Error Message */}
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
