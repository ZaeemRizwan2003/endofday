import Navbar from "@/Components/Navbar";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";

const Dashboard = () => {
  const [listings, setListings] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListingId, setSelectedListingId] = useState(null); // Modal support for delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const router = useRouter();

  // Fetch listings from the API
  useEffect(() => {
    const fetchListings = async () => {
      const userId = Cookies.get("userId");
      if (!userId) {
        router.push("/Login");
        return;
      }

      try {
        const response = await fetch(
          `/api/Restaurants/getlisting?id=${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          const processedListings = data.listings.map((listing) => {
            if (
              listing.image &&
              listing.image.data &&
              listing.image.contentType
            ) {
              const base64Image = listing.image.data.toString("base64");
              return {
                ...listing,
                image: {
                  data: base64Image,
                  contentType: listing.image.contentType,
                },
              };
            }
            return listing;
          });
          setListings(processedListings);
        } else {
          console.error("Failed to fetch listings:", data.message);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [router]);

  // Calculate reminders for updates
  useEffect(() => {
    const currentTime = new Date();
    const updateReminders = listings.map((listing) => {
      const lastUpdated = new Date(listing.updatedAt);
      const hoursSinceUpdate = (currentTime - lastUpdated) / (1000 * 60 * 60);
      return {
        ...listing,
        needsUpdate: hoursSinceUpdate >= 23,
      };
    });
    setReminders(updateReminders);
  }, [listings]);

  const deleteListing = async (id) => {
    try {
      const response = await fetch("/api/Restaurants/deletelisting", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (data.success) {
        setListings(listings.filter((listing) => listing._id !== id));
        setShowDeleteModal(false);
      } else {
        console.error("Failed to delete listing:", data.error);
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const handleAddFood = () => {
    router.push("/Restaurants/addFoodListing");
  };

  const openDeleteModal = (id) => {
    setSelectedListingId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedListingId(null);
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-6xl text-purple-500" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 mt-20">
        <div className="flex justify-center mb-6">
          <button
            onClick={handleAddFood}
            className="button bg-purple-500 hover:bg-purple-700 text-black font-bold py-2 px-4 rounded flex items-center"
          >
            <span className="button__text">Add Food</span>
            <span className="button__icon ml-2">
              <svg
                className="svg"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="12" x2="12" y1="5" y2="19"></line>
                <line x1="5" x2="19" y1="12" y2="12"></line>
              </svg>
            </span>
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">
          Your Food Listings
        </h1>
        {reminders.length === 0 ? (
          <p className="text-center">No Listings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reminders.map((listing) => (
              <div
                key={listing._id}
                className="bg-white p-4 shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200"
              >
                {listing.image &&
                  listing.image.data &&
                  listing.image.contentType && (
                    <div className="w-full h-36 relative mb-2">
                      <Image
                        src={`data:${listing.image.contentType};base64,${listing.image.data}`}
                        alt={listing.itemname}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                        unoptimized
                      />
                    </div>
                  )}
                <h2 className="text-xl font-bold text-gray-800">
                  {listing.itemname}
                </h2>
                <p className="text-lg text-gray-600">
                  Price:{" "}
                  <span className="text-red-500 line-through">
                    ${listing.price}
                  </span>
                </p>
                <p className="text-lg text-gray-600">
                  Discounted Price:{" "}
                  <span className="text-gray-800">
                    ${listing.discountedprice}
                  </span>
                </p>
                <p className="text-lg text-gray-600">
                  Remaining Items:{" "}
                  <span className="text-gray-800">{listing.remainingitem}</span>
                </p>
                <p className="text-lg text-gray-600">
                  Manufacture Date:{" "}
                  <span className="text-gray-800">
                    {new Date(listing.manufacturedate).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-base text-gray-500">
                  Description: {listing.description}
                </p>

                {listing.needsUpdate && (
                  <p className="text-red-500 font-bold">
                    ⚠️ Please update this listing!
                  </p>
                )}

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => openDeleteModal(listing._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      router.push(
                        `/Restaurants/addFoodListing?edit=${listing._id}`
                      )
                    }
                    className="text-green-600 hover:text-green-800"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Are you sure you want to delete this listing?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteListing(selectedListingId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
