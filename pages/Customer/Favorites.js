import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import DashNav from "@/Components/CustomerNavbar";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Fetch the user's favorites
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`/api/Customer/favorites?userId=${userId}`)
        .then((response) => setFavorites(response.data.favorites))
        .catch((error) => console.error("Error fetching favorites:", error));
    }
  }, []);

  const handleRemoveFavorite = async (listingId) => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.delete(`/api/Customer/favorites`, {
        data: { userId, listingId },
      });
      setFavorites((prev) => prev.filter((fav) => fav._id !== listingId));
    } catch (error) {
      console.error("Failed to remove from favorites:", error);
    }
  };

  return (
    <>
    <DashNav/>
    <div className="p-6 pt-20 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">My Favorites</h2>

      {loading ? (
        <div className="text-center">Loading favorites...</div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Card Content */}
              <div
                onClick={() => router.push(`/Customer/restaurant/${fav.bakeryowner}`)}
                className="cursor-pointer"
              >
                <img
                  src={fav.image?.data || "/default-image.jpg"}
                  alt={fav.itemname}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-purple-800 mb-1">
                    {fav.itemname}
                  </h3>
                  <p className="text-gray-700">
                    Price: <span className="font-semibold">Rs.{fav.discountedprice}</span>
                  </p>
                  <p className="text-gray-500">
                    Restaurant: <span className="font-semibold">{fav.bakeryownerName}</span>
                  </p>
                </div>
              </div>
              {/* Remove Favorite */}
              <div className="p-2 bg-red-100 text-right">
                <button
                  onClick={() => handleRemoveFavorite(fav._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrashAlt className="inline-block mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No favorites added yet.</p>
      )}
    </div>
    </>
  );
}
