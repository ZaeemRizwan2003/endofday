import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DeliveryLogin = () => {
  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const delivery = JSON.parse(localStorage.getItem("delivery"));
    if (delivery) {
      router.push("deliverydashboard");
    }
  }, []);

  const handleLogin = async () => {
    if (!loginMobile || !loginPassword) {
      setError(true);
      return;
    }
    setError(false);
    let response = await fetch("/api/deliverypartners/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile: loginMobile, password: loginPassword }),
    });

    response = await response.json();

    if (response.success) {
      const { userData, token } = response;
      delete userData.password;
      localStorage.setItem("delivery", JSON.stringify(userData));
      localStorage.setItem("deliveryToken", token);
      alert("Login successful");
      router.push("/Delivery/deliverydashboard");
    } else {
      alert(
        "Login failed. Please try again with a valid Mobile Number and Password."
      );
    }
  };

  return (
    <section className=" flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        {/* Header Section */}
        <div className="text-center mb-6">
          <img
            className="mx-auto h-12 w-auto"
            src="/mainlogo.png"
            alt="EndofDay"
          />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-purple-800">
            Rider Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back to your delivery dashboard
          </p>
        </div>

        {/* Form Section */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Mobile Number */}
          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <input
              id="mobile"
              name="mobile"
              type="text"
              value={loginMobile}
              onChange={(e) => setLoginMobile(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
              placeholder="Enter your mobile number"
            />
            {error && !loginMobile && (
              <p className="text-red-600 text-sm mt-1">
                Please enter a valid mobile number
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
              placeholder="Enter your password"
            />
            {error && !loginPassword && (
              <p className="text-red-600 text-sm mt-1">
                Please enter a password
              </p>
            )}
          </div>

          {/* Login Button */}
          <div>
            <button
              type="button"
              onClick={handleLogin}
              className="w-50 bg-purple-800 hover:bg-purple-700 text-white py-2 px-4 rounded-lg shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-purple-600"
            >
              Log in
            </button>
          </div>
        </form>

        {/* Footer Section */}
        {/* <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Don’t have an account?{" "}
          <a
            href="/Delivery/deliverysignup"
            className="text-purple-700 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div> */}
      </div>
    </section>
  );
};

export default DeliveryLogin;
