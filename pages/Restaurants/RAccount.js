import React, { useState } from "react";
import dbConnect from "@/middleware/mongoose"; // Import your DB connection
import RegisteredBakeries from "@/models/RBakerymodel"; // Import your model
import { verifyToken } from "@/middleware/auth";
import DashNav from "@/Components/Navbar";
import Link from "next/link";
const Account = ({ user, error }) => {
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <p className="text-lg text-red-600 font-semibold">Error: {error}</p>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: user.restaurantName,
    email: user.email,
    address: user.address,
    number: user.number,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => setIsEditing(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/Restaurants/updateUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      const data = await response.json();
      setFormData(data.user);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Error updating user data. Please try again.");
    }
  };

  return (
    <>
      <DashNav />

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-200">
        <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-xl border border-gray-200">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Account Information
          </h1>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 font-medium">
                  Restaurant Name:
                </label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium">
                  Address:
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium">
                  Phone Number:
                </label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="ml-4 w-full py-3 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-800">
                <strong>Restaurant Name:</strong> {formData.restaurantName}
              </p>
              <p className="text-gray-800">
                <strong>Email:</strong> {formData.email}
              </p>
              <p className="text-gray-800">
                <strong>Address:</strong> {formData.address}
              </p>
              <p className="text-gray-800">
                <strong>Phone Number:</strong> {formData.number}
              </p>
              <button
                onClick={handleEdit}
                className="w-full mt-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  await dbConnect();

  const user = verifyToken(context.req);

  if (!user) {
    return {
      redirect: {
        destination: "Restaurants/RLogin",
        permanent: false,
      },
    };
  }

  try {
    const bakeryOwner = await RegisteredBakeries.findById(user.userId)
      .select("-password")
      .lean();
    if (!bakeryOwner) {
      return { notFound: true };
    }

    return {
      props: {
        user: JSON.parse(JSON.stringify(bakeryOwner)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        error: "Failed to fetch user data",
      },
    };
  }
}

export default Account;
