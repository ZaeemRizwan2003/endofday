import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import axios from "axios";
import { useCart } from "./cartcontext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { cart, setCart } = useCart();

  const syncCartToServer = async (userId, cart) => {
    try {
      const res = await fetch("/api/Customer/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cart }),
      });
      if (!res.ok) throw new Error("Failed to sync cart");
    } catch (error) {
      console.error("Cart Sync Error:", error);
    }
  };

  const loadCartFromServer = async (userId) => {
    try {
      const res = await fetch(`/api/Customer/cart?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to load cart");
      const data = await res.json();
      return data.cart;
    } catch (error) {
      console.error("Cart Load Error:", error);
      return [];
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/Customer/login", {
        email,
        password,
      });
      const { token, userId } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      await syncCartToServer(userId, cart);

      if (!userId) {
        console.error("User ID not returned from login API");
        return setError("Login failed, please check credentials");
      }

      const serverCart = await loadCartFromServer(userId);
      setCart(serverCart);

      toast.success("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/Customer/Cdashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("login failed, please check credentials");
      toast.error("Login failed, please check credentials.");
    }
  };

  return (
    <div className="mt-6 relative">
      {/* Buttons for Partner Login and Rider Login at the top-right */}
      <div className="absolute top-0 right-0 flex space-x-6 mt-4 mr-8">
        <Link
          href="/Login" // Adjust the path to your partner login page
          className="font-semibold leading-6 text-purple-800 hover:text-indigo-500"
        >
          {" "}
          Want to become partner?
        </Link>
        <Link
          href="/Delivery/deliverypartner" // Adjust the path to your rider login page
          className="font-semibold leading-6 text-purple-800 hover:text-indigo-500"
        >
          {" "}
          Rider?
        </Link>
      </div>

      <div className="flex min-h-full flex-col justify-center px-6 py-20 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="/mainlogo.png"
            alt="EndofDay"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            LOGIN{" "}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    href="/ForgotPassword/Forgot-Password"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-purple-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log in
              </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?
            <Link
              href="/Customer/Signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              {" "}
              Signup
            </Link>
          </p>

        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
