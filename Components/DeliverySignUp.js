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
  const [success, setSuccess] = useState("");
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
    <section className="flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8 space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <img
            className="mx-auto h-16 w-auto"
            src="/mainlogo.png"
            alt="EndofDay"
          />
          <h2 className="text-3xl font-bold text-purple-800 mt-4">
            Rider Sign Up
          </h2>
          <p className="text-lg text-purple-800 font-semibold tracking-wide mt-2">
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
              className="block text-lg font-semibold text-purple-700 mb-2"
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
              className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-purple-400"
            />
            {error && !name && (
              <p className="text-red-600 text-sm mt-1">
                Please enter your name
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label
              htmlFor="contact"
              className="block text-lg font-semibold text-purple-700 mb-2"
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
              className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-purple-400"
            />
            {error && (!contact || contact.length !== 11) && (
              <p className="text-red-600 text-sm mt-1">
                Contact number must be 11 digits long
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-lg font-semibold text-purple-700 mb-2"
            >
              City
            </label>
            <select
              id="city"
              name="city"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setArea(""); // Reset area when city changes
              }}
              required
              className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-purple-400"
            >
              <option value="">Select a city</option>
              <option value="Rawalpindi">Rawalpindi</option>
              <option value="Islamabad">Islamabad</option>
            </select>
            {error && !city && (
              <p className="text-red-600 text-sm mt-1">
                Please select your city
              </p>
            )}
          </div>

          {/* Area */}
          <div>
            <label
              htmlFor="area"
              className="block text-lg font-semibold text-purple-700 mb-2"
            >
              Area
            </label>
            <select
              id="area"
              name="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
              className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-purple-400"
            >
              <option value="">Select an area</option>
              {city === "Islamabad" &&
                [
                  "E-7, Islamabad",
                  "E-8, Islamabad",
                  "E-9, Islamabad",
                  "E-10, Islamabad",
                  "E-11, Islamabad",
                  "E-12, Islamabad",
                  "E-16, Islamabad",
                  "E-17, Islamabad",
                  "F-5, Islamabad",
                  "F-6, Islamabad",
                  "F-7",
                  "F-8, Islamabad",
                  "F-9",
                  "F-10, Islamabad",
                  "F-11, Islamabad",
                  "F-12, Islamabad",
                  "F-15, Islamabad",
                  "F-17, Islamabad",
                  "I-8, Islamabad",
                  "I-9, Islamabad",
                  "I-10, Islamabad",
                  "I-11, Islamabad",
                ].map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              {city === "Rawalpindi" &&
                ["A block", "B block", "D block", "Satellite town"].map(
                  (area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  )
                )}
            </select>
            {error && !area && (
              <p className="text-red-600 text-sm mt-1">
                Please select your area
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-semibold text-purple-700 mb-2"
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
              className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-purple-400"
            />
            {error && !password && (
              <p className="text-red-600 text-sm mt-1">
                Please enter a password
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-lg font-semibold text-purple-700 mb-2"
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
              className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-purple-400"
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
            className="w-40 bg-purple-400 hover:bg-purple-500 text-black py-3 px-6 rounded-lg shadow-md focus:ring-2 focus:ring-offset-2  text-xl focus:ring-purple-500 transition-all"
          >
            SIGN UP
          </button>
        </div>
      </div>
    </section>
  );
};

export default DeliverySignUp;
