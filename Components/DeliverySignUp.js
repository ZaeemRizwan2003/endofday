import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import DeliveryLogin from "./DeliveryLogin";

const DeliverySignUp = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess]= useState("");
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
        city,
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
    <section className=" flex items-center justify-center">
    <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <img
          className="mx-auto h-12 w-auto"
          src="/mainlogo.png"
          alt="EndofDay"
        />
        <h2 className="text-2xl font-bold text-purple-800 mt-4">
          Rider Sign Up
        </h2>
        <p className="text-sm text-gray-600">
          Join our delivery team and start earning today!
        </p>
      </div>

      {/* Form Section */}
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
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
            className="mt-1 block w-full p-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          />
          {error && !name && (
            <p className="text-red-600 text-sm mt-1">Please enter your name</p>
          )}
        </div>

        {/* Contact */}
        <div>
          <label
            htmlFor="contact"
            className="block text-sm font-medium text-gray-700"
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
            className="mt-1 block w-full p-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          />
          {error && (!contact || contact.length !== 11) && (
            <p className="text-red-600 text-sm mt-1">
              Contact number must be 11 digits long
            </p>
          )}
        </div>

        {/* Area */}
        <div>
          <label
            htmlFor="area"
            className="block text-sm font-medium text-gray-700"
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
            className="mt-1 block w-full p-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          />
          {error && !area && (
            <p className="text-red-600 text-sm mt-1">Please enter your area</p>
          )}
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="mt-1 block w-full p-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          />
          {error && !city && (
            <p className="text-red-600 text-sm mt-1">Please enter your city</p>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full p-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          />
          {error && !password && (
            <p className="text-red-600 text-sm mt-1">Please enter a password</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
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
            className="mt-1 block w-full p-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
          />
          {error && password !== confirmPassword && (
            <p className="text-red-600 text-sm mt-1">
              Passwords do not match
            </p>
          )}
        </div>
      </form>

      {/* Submit Button */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={handleSignup}
          className="w-70 bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Sign Up
        </button>
      </div>
    </div>
  </section>
  );
};

export default DeliverySignUp;
