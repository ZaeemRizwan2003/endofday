import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DeliveryLogin = () => {
  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const delivery = sessionStorage.getItem("delivery");
      if (delivery) {
        const parsedData = JSON.parse(delivery);
        if (parsedData && parsedData._id) {
          router.push("/Delivery/deliverydashboard");
        }
      }
    } catch (error) {
      console.error("Error parsing delivery data from sessionStorage:", error);
    }
  }, [router]);

  const handleLogin = async () => {
    if (!loginMobile || !loginPassword) {
      setError(true);
      return;
    }
    setError(false);

    try {
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
        sessionStorage.setItem("delivery", JSON.stringify(userData));
        sessionStorage.setItem("deliveryToken", token);
        alert("Login successful");
        router.push("/Delivery/deliverydashboard");
      } else {
        alert(
          "Login failed. Please try again with a valid Mobile Number and Password."
        );
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <section className=" flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <img
            className="mx-auto h-16 w-auto"
            src="/mainlogo.png"
            alt="EndofDay"
          />
          <h2 className="mt-4 text-3xl font-extrabold text-purple-800 tracking-tight">
            Rider Login
          </h2>
          <p className="mt-2 text-md text-purple-600 font-semibold">
            Welcome back to your delivery dashboard
          </p>
        </div>

        {/* Form Section */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Mobile Number */}
          <div>
            <label
              htmlFor="mobile"
              className="block text-lg font-semibold text-purple-700"
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
              className="mt-1 block w-full px-4 py-3 rounded-lg bg-white text-purple-800 placeholder-gray-400 border border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition ease-in-out shadow-md"
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
              className="block text-lg font-semibold text-purple-700"
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
              className="mt-1 block w-full px-4 py-3 rounded-lg bg-white text-purple-800 placeholder-gray-400 border border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition ease-in-out shadow-md"
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
              className="w-full bg-purple-800 hover:bg-purple-700 text-white py-3 px-4 rounded-lg shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 transition ease-in-out"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default DeliveryLogin;
