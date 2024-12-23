import React, { useState } from "react";
import DashNav from "@/Components/Navbar";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    const { currentPassword, newPassword, confirmNewPassword } = formData;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/Restaurants/changepassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DashNav />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl border border-gray-200 transform transition-all hover:scale-105">
          <h2 className="text-3xl font-bold mb-6 text-center text-purple-800">
            Change Password
          </h2>
          {message && (
            <div className="mb-4 text-green-600 bg-green-100 p-2 rounded text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 text-red-600 bg-red-100 p-2 rounded text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-gray-700 font-semibold mb-2"
              >
                Current Password:
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-semibold mb-2"
              >
                New Password:
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label
                htmlFor="confirmNewPassword"
                className="block text-gray-700 font-semibold mb-2"
              >
                Confirm New Password:
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
