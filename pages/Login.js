import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { useCart } from "./Customer/cartcontext";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // New state for payment success popup
  const [pendingStatus, setPendingStatus] = useState(false);
  const { fetchUserCart } = useCart();

  // Handle query parameter for payment success
  useEffect(() => {
    if (router.query.paymentSuccess) {
      setPaymentSuccess(true);
      // Remove the query parameter from the URL after showing the popup
      router.replace("/Login", undefined, { shallow: true });
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/login", formData);

      if (res.status === 200) {
        const { token, userId, userType, userData, status } = res.data;

        if (userType === "bakery" && status === "pending") {
          setPendingStatus(true);
          setLoading(false);
          return;
        }
        // Store token and userId in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        // Handle different user types
        if (userType === "listing") {
          await fetchUserCart(userId); // Set cart for the customer
          router.push("/Customer/Cdashboard");
        } else if (userType === "bakery") {
          router.push("/Restaurants/RDashboard");
        } else if (userType === "delivery") {
          localStorage.setItem("delivery", JSON.stringify(userData));
          router.push("/Delivery/deliverydashboard");
        }
      }
    } catch (err) {
      setError("Invalid email, phone number, or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-3">
          <img
            className="mx-auto h-10 w-auto"
            src="/mainlogo.png"
            alt="EndofDay"
          />
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Log in to your account
            </h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="identifier"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  name="identifier"
                  id="identifier"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Enter email or phone number"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <Link
                  href="/ForgotPassword/Forgot-Password"
                  className="text-sm font-medium text-primary-600 hover:underline text-black"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-purple-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-6 h-6 text-white animate-spin mr-2"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5C100 78.2335 77.6142 100.5 50 100.5C22.3858 100.5 0 78.2335 0 50.5C0 22.7665 22.3858 0.5 50 0.5C77.6142 0.5 100 22.7665 100 50.5ZM9.08166 50.5C9.08166 73.0845 27.7017 91.5 50 91.5C72.2983 91.5 90.9183 73.0845 90.9183 50.5C90.9183 27.9155 72.2983 9.5 50 9.5C27.7017 9.5 9.08166 27.9155 9.08166 50.5Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.041C96.393 38.4039 97.8624 35.9236 97.0079 33.5924C95.2932 29.0914 92.871 24.9874 89.8167 21.4711C85.3077 16.0724 79.2477 12.079 72.3743 9.87624C65.5009 7.67351 58.1089 7.34337 51.0295 8.91136C44.0382 10.4578 37.4635 13.8644 31.8722 18.8181C26.2809 23.7718 21.8668 30.128 19 37.2802C18.0761 39.5922 19.5704 42.0847 21.9997 42.7056C24.429 43.3265 26.911 41.8541 27.8348 39.5422C30.1462 33.7443 33.916 28.6491 38.7757 24.7302C43.6354 20.8113 49.4033 18.2296 55.5072 17.2528C61.6111 16.276 67.8189 16.9378 73.5163 19.1763C79.2136 21.4147 84.1948 25.1403 87.902 30.0314C90.3989 33.3504 92.1585 37.0408 93.9676 41.0086C94.8101 43.0591 97.2406 44.5294 99.6659 43.8914C102.091 43.2533 103.56 40.7729 102.706 38.4418C101.099 33.8705 98.6757 29.7975 95.6157 26.2708C91.1067 20.8721 85.0467 16.8787 78.1733 14.6759C71.2999 12.4731 63.9079 12.143 56.8285 13.711C49.8372 15.2574 43.2625 18.664 37.6712 23.6177C32.0799 28.5714 27.6658 34.9276 24.799 42.0798C23.8751 44.3917 25.3694 46.8842 27.7987 47.5051C30.228 48.126 32.71 46.6536 33.6338 44.3417Z"
                        fill="currentColor"
                      />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>

              <p className="text-sm text-black font-light">
                Don’t have an account yet?{" "}
                <Link
                  href="/Customer/Signup"
                  className="font-medium text-black hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Payment Success Popup */}
      {paymentSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              ✅ Payment Successful!
            </h2>
            <p className="text-gray-700 mb-4">
              Your payment was successfully processed. Your bakery status will
              be sent to you via email.
            </p>
            <button
              onClick={() => setPaymentSuccess(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {pendingStatus && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow text-center">
            <h2>🕒 Pending Approval</h2>
            <p>
              Your request is being processed by the admin. Please wait for an
              email.
            </p>
            <button
              onClick={() => setPendingStatus(false)}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Login;
