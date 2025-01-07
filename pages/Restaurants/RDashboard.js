import Navbar from "@/Components/Navbar";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { BiFoodMenu } from "react-icons/bi";

const Dashboard = () => {
  const [listings, setListings] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListingId, setSelectedListingId] = useState(null); // Modal support for delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isOrdersOpen, setIsOrdersOpen] = useState(true); // State for toggling orders visibility
  const [filter, setFilter] = useState("all");
  const toggleOrders = () => {
    setIsOrdersOpen((prevState) => !prevState); // Toggles the isOrdersOpen state
  };

  const filteredOrders = orders.filter((order) =>
    filter === "all" ? order.status !== "Ready" : order.status === filter
  );
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const bakeryId = Cookies.get("userId"); // Assuming bakery ID is stored in cookies
      if (!bakeryId) {
        router.push("/Login");
        return;
      }

      try {
        const response = await fetch(
          `/api/Restaurants/getOrders?bakeryId=${bakeryId}`
        );
        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders); // Set the orders
        } else {
          console.error("Failed to fetch orders:", data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch("/api/Restaurants/updateOrderStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Update the local orders state to reflect the new status
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("Failed to update order status:", data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

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
      <div className="container mx-auto p-4 mt-20 flex flex-col md:flex-row">
        {/* Orders Section - Mobile First */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isOrdersOpen
              ? window.innerWidth >= 1024
                ? "30%"
                : "100%"
              : "0px",
            opacity: isOrdersOpen ? 1 : 0,
          }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`bg-white border-l shadow-lg h-full overflow-y-auto ${
            isOrdersOpen ? "p-4" : "p-0"
          } w-full lg:w-[30%]`}
          style={{
            display: isOrdersOpen ? "visible" : "hidden",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-purple-800">Orders</h1>
            <button
              onClick={toggleOrders}
              className="text-purple-500 hover:text-purple-700"
            >
              {isOrdersOpen ? "Close" : "Open"}
            </button>
          </div>

          {/* Filter Options */}
          <div className="mb-4">
            <button
              onClick={() => setFilter("all")}
              className={`mr-4 px-4 py-2 rounded ${
                filter === "all" ? "bg-purple-500 text-white" : "bg-gray-200"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setFilter("Ready")}
              className={`px-4 py-2 rounded ${
                filter === "Ready" ? "bg-purple-500 text-white" : "bg-gray-200"
              }`}
            >
              Ready
            </button>
          </div>

          {/* Display filtered orders */}
          <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
            {filteredOrders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <div>
                {filteredOrders.map((order) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 p-4 mb-2 rounded-lg border"
                  >
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Order ID: {order._id}
                    </h2>
                    <p className="text-lg text-gray-600">
                      Rider Contact: {order.contact}
                    </p>
                    <p className="text-lg text-gray-600">
                      Total Amount: ${order.totalAmount}
                    </p>
                    <h3 className="text-lg font-bold mt-4 mb-2">Items:</h3>
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index} className="text-gray-600">
                          {item.title} - {item.quantity} x ${item.price}
                        </li>
                      ))}
                    </ul>

                    {/* Status Dropdown */}
                    <div className="mt-4">
                      <label
                        htmlFor={`status-${order._id}`}
                        className="block text-lg font-semibold text-gray-800"
                      >
                        Status:
                      </label>
                      <select
                        id={`status-${order._id}`}
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        className="mt-2 p-2 border rounded-lg w-full"
                      >
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Listings Section */}
        <div className="w-full md:w-2/3 p-4">
          <div className="flex justify-center mb-6">
            <button
              onClick={handleAddFood}
              className="button bg-purple-500 hover:bg-purple-700 text-black font-bold py-2 px-4 rounded flex items-center"
            >
              Add Food
            </button>
          </div>
          <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">
            Your Food Listings
          </h1>
          {reminders.length === 0 ? (
            <p className="text-center">No Listings found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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
                    Price: ${listing.price}
                  </p>
                  <p className="text-lg text-gray-600">
                    Discounted Price: ${listing.discountedprice}
                  </p>
                  <p className="text-lg text-gray-600">
                    Remaining Items: {listing.remainingitem}
                  </p>
                  <p className="text-lg text-gray-600">
                    Manufacture Date:{" "}
                    {new Date(listing.manufacturedate).toLocaleDateString()}
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
      </div>

      {/* Floating Button to Reopen Orders Panel on Desktop */}
      {!isOrdersOpen && (
        <button
          onClick={toggleOrders}
          className="fixed top-20 left-4 bg-purple-500 text-white p-4 rounded-full shadow-lg"
        >
          <BiFoodMenu size={30} />
        </button>
      )}
    </>
  );
};

export default Dashboard;
