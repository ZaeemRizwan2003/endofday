import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import DeliveryLogin from "./DeliveryLogin";

const DeliverySignUp = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const delivery = JSON.parse(localStorage.getItem("delivery"));
    if (delivery) {
      router.push("/Delivery/deliverydashboard");
    }
  }, []);

  const handleSignup = async () => {
    if (
      !contact ||
      !password ||
      !confirmPassword ||
      !name ||
      password !== confirmPassword ||
      contact.length !== 11
    ) {
      setError(true);
      return false;
    } else {
      setError(false);
    }
    let response = await fetch("/api/deliverypartners/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify JSON format
      },
      body: JSON.stringify({
        name,
        contact,
        password,
        confirmPassword,
        area,
      }),
    });
    const result = await response.json();

    if (response.ok) {
      alert("Success");
      localStorage.setItem("delivery", JSON.stringify(result));
      router.push("/Delivery/deliverydashboard");
    } else {
      alert("Failed to Signup: " + result.message); // Display the server error message
    }
  };

  return (
    <div className="flex items-center justify-center bg-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-20 w-auto"
          src="/mainlogo.png"
          alt="EndofDay"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-purple-800">
          Rider Sign Up
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Become a part of our delivery team
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form
            className="space-y-4 text-start"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-purple-800 ml-2"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
              {error && !name && (
                <p className="text-red-600 text-sm mt-1">
                  Please enter your name
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-purple-800 ml-2"
              >
                Contact Number
              </label>
              <input
                id="contact"
                name="contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                className="block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
              {error && (!contact || contact.length !== 11) && (
                <p className="text-red-600 text-sm mt-1">
                  Contact number must be 11 digits long
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="area"
                className="block text-sm font-medium text-purple-800 ml-2"
              >
                Area
              </label>
              <input
                id="area"
                name="area"
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                className="block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
              {error && !area && (
                <p className="text-red-600 text-sm mt-1">
                  Please enter your area
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-purple-800 ml-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
              {error && !password && (
                <p className="text-red-600 text-sm mt-1">
                  Please enter a password
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-purple-800 ml-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="block w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
              {error && password !== confirmPassword && (
                <p className="text-red-600 text-sm mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={handleSignup}
                className="w-full bg-purple-800 hover:bg-purple-700 text-white py-2 px-4 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 focus:outline-none"
              >
                Sign Up
              </button>
            </div>

            {/* <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already a member?{' '}
                <Link className="text-purple-700 hover:underline">
                <DeliveryLogin/>
                </Link>
              </p>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeliverySignUp;
