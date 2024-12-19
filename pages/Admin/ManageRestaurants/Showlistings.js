import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaTrashAlt, FaEdit } from "react-icons/fa"; // Import icons
import AdminLayout from "@/Components/AdminLayout";
export default function Showlistings() {
  const router = useRouter();
  const { id } = router.query; // Extract the id from the URL query
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      async function fetchListings() {
        try {
          const response = await fetch(
            `/api/Admin/Restaurants/fetchlistings?id=${id}`
          );
          const data = await response.json();

          if (response.ok) {
            setListings(data.listings);
          } else {
            console.error("Failed to fetch listings:", data.message);
          }
        } catch (error) {
          console.error("Error fetching listings:", error);
        } finally {
          setLoading(false);
        }
      }

      fetchListings();
    }
  }, [id]);

  // Function to handle deleting a listing
  const handleDelete = async (listingId) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        const response = await fetch(
          `/api/Admin/Restaurants/deletelisting?id=${listingId}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          setListings((prevListings) =>
            prevListings.filter((listing) => listing._id !== listingId)
          );
          alert("Listing deleted successfully.");
        } else {
          alert("Failed to delete the listing.");
        }
      } catch (error) {
        console.error("Error deleting listing:", error);
        alert("An error occurred while deleting the listing.");
      }
    }
  };

  // Function to handle editing a listing
  const handleEdit = (listingId) => {
    router.push(`/Admin/ManageRestaurants/editListing?id=${listingId}`);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Listings</h1>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
              >
                {/* Display Image */}
                {listing.image &&
                listing.image.data &&
                listing.image.contentType ? (
                  <div className="w-full h-48 relative">
                    <Image
                      src={`data:${
                        listing.image.contentType
                      };base64,${Buffer.from(listing.image.data).toString(
                        "base64"
                      )}`}
                      alt={listing.itemname}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-300 flex justify-center items-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}

                {/* Display Item Details */}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {listing.itemname}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    Price: Rs.{listing.price}
                  </p>
                  <p className="text-red-600 mb-2">
                    Discounted Price: Rs.{listing.discountedprice}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Remaining Items: {listing.remainingitem ?? "N/A"}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Manufacture Date:{" "}
                    {new Date(listing.manufacturedate).toLocaleDateString()}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex justify-end items-center gap-4 mt-4">
                    {/* Edit Icon */}
                    {/* <button
                    onClick={() => handleEdit(listing._id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit Listing"
                  >
                    <FaEdit size={20} />
                  </button> */}

                    {/* Delete Icon */}
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Listing"
                    >
                      <FaTrashAlt size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No listings available for this restaurant.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
