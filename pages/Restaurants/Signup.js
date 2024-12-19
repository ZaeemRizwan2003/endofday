// components/Signup.js
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    address: "",
    number: "",
    option: "delivery", // Default value for the service type
  });

  const [selectedImage, setSelectedImage] = useState(null); // Stores the File object
  const [previewImage, setPreviewImage] = useState(""); // For image preview
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query.paymentFailed) {
      setError("Payment failed. Please try again.");
    }
  }, [router.query]);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        setSelectedImage(file);
        // Generate preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.confirmpassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      let base64Image = "";
      let mimeType = "";

      if (selectedImage) {
        // Convert image file to Base64 string
        const result = await convertToBase64(selectedImage);
        base64Image = result.base64;
        mimeType = result.mimeType;
      } else {
        setError("Please select an image");
        setLoading(false);
        return;
      }

      const payload = {
        restaurantName: formData.name,
        email: formData.email,
        password: formData.password,
        confirmpassword: formData.confirmpassword,
        address: formData.address,
        number: formData.number,
        option: formData.option, // Include the selected type in the request
        image: base64Image, // Base64 string
        contentType: mimeType, // MIME type
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Step 1: Call Signup API
      const signupResponse = await axios.post(
        "/api/Restaurants/signup",
        payload,
        config
      );
      if (signupResponse.status === 200) {
        setSuccess("Signup successful! Redirecting to payment...");

        // Step 2: Call Subscribe API to handle Stripe payment
        const subscribeResponse = await axios.post(
          "/api/Restaurants/subscribe",
          {
            email: formData.email,
            userId: signupResponse.data.userId, // Assuming the signup API returns userId
            name: formData.name,
            password: formData.password,
            address: formData.address,
            number: formData.number,
            option: formData.option,
            image: base64Image,
          }
        );

        if (subscribeResponse.status === 200) {
          // Redirect to Stripe Checkout page
          window.location.href = subscribeResponse.data.url; // Redirect to Stripe Checkout URL
        }
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        const mimeType = reader.result
          .split(",")[0]
          .split(":")[1]
          .split(";")[0];
        resolve({ base64: base64String, mimeType });
      };
      reader.onerror = (error) => reject(error);
    });
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
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {/* Image Upload with Preview */}
              <div className="md:col-span-2">
                <label
                  htmlFor="image"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Profile Image
                </label>
                {previewImage && (
                  <div className="mb-2">
                    <img
                      src={previewImage}
                      alt="Selected image"
                      width={270}
                      height={180}
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Restaurant Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Tehzeeb Bakers"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="bakeryname@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmpassword"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmpassword"
                    id="confirmpassword"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.confirmpassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Restaurant Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Location of restaurant"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="number"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="number"
                    id="number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="+92 0000000000"
                    value={formData.number}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Dropdown for Service Type */}
                <div>
                  <label
                    htmlFor="option"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Service Type
                  </label>
                  <select
                    name="option"
                    id="option"
                    value={formData.option}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    required
                  >
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create an Account"}
              </button>

              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              <p className="text-sm font-light text-black ">
                Already have an account?{" "}
                <Link
                  href="/Login"
                  className="font-medium text-black hover:underline"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
