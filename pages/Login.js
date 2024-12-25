import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { useCart } from "./Customer/cartcontext";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { fetchUserCart } = useCart();

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
        const { token, userId, userType, userData } = res.data;

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
          // Store delivery-specific details in localStorage
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
                className="w-full text-black bg-purple-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
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
    </section>
  );
};

export default Login;
