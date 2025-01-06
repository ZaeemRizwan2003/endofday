import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/Components/AdminLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditRestaurant() {
  const router = useRouter();
  const { id } = router.query; // Get restaurant ID from query parameters

  // States for form fields
  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch restaurant details when page loads
  useEffect(() => {
    async function fetchRestaurantDetails() {
      if (!id) return; // Wait until ID is available

      try {
        const response = await fetch(
          `/api/Admin/Restaurants/getRestaurant?id=${id}`
        );
        const data = await response.json();

        if (response.ok) {
          setRestaurantName(data.restaurantName || "");
          setAddress(data.address || "");
          setNumber(data.number || "");
          setOptions(data.option || []);
        } else {
          alert("Failed to fetch restaurant details.");
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurantDetails();
  }, [id]);

  // Handle form submission
  const handleUpdateRestaurant = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const updatedRestaurant = {
      restaurantName,
      address,
      number,
      option: options,
    };

    try {
      const response = await fetch(
        `/api/Admin/Restaurants/updateRestaurant?id=${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedRestaurant),
        }
      );

      if (response.ok) {
        toast.success("Restaurant updated successfully!");
        router.push("/Admin/ManageRestaurants/Manage-restaurants"); // Redirect after success
      } else {
        toast.error("Failed to update restaurant.");
      }
    } catch (error) {
      console.error("Error updating restaurant:", error);
      toast.error("An error occurred while updating.");
    } finally {
      setUpdating(false);
    }
  };

  // Add new option to list
  const handleAddOption = () => {
    setOptions([...options, ""]); // Add an empty option field
  };

  // Update option value
  const handleOptionChange = (index, value) => {
    const updatedOptions = options.map((opt, i) => (i === index ? value : opt));
    setOptions(updatedOptions);
  };

  // Remove option from list
  const handleRemoveOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Edit Restaurant
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <form
            onSubmit={handleUpdateRestaurant}
            className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto"
          >
            {/* Restaurant Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Options */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Options
              </label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-2 px-3 py-1 bg-green-500 text-white rounded-lg"
              >
                Add Option
              </button>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={updating}
                className={`w-full py-2 px-4 text-white rounded-lg ${
                  updating
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-purple-500 hover:bg-purple-700"
                }`}
              >
                {updating ? "Updating..." : "Update Restaurant"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
