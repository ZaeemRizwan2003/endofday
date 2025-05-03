import React, { useState, useEffect } from "react";
import DashNav from "@/Components/CustomerNavbar";
const OffersPromotions = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(`/api/Offers/getalloffers`);
        if (!response.ok) {
          throw new Error("Failed to fetch offers");
        }
        const data = await response.json();
        setOffers(data.offers);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter offers based on search query
  const filteredOffers = offers.filter((offer) =>
    offer.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get today's date
  const today = new Date();
  const todayDate = today.setHours(0, 0, 0, 0); // Set to 00:00 to compare dates only

  // Split offers into Available Now and Coming Soon
  const availableNow = filteredOffers.filter(
    (offer) => new Date(offer.startDate).getTime() <= todayDate
  );
  const comingSoon = filteredOffers.filter(
    (offer) => new Date(offer.startDate).getTime() > todayDate
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <p className="text-xl text-gray-700">Loading offers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
          <DashNav />
    <div className="
    pt-20 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search Offers"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Available Now Section */}
        {availableNow.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-purple-600 mb-4">
              Available Now
            </h2>
            <div className="space-y-6">
              {availableNow.map((offer) => (
                <div
                  key={offer._id}
                  className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Bakery Name */}
                  <div className="mb-4 text-lg font-medium text-gray-700">
                    <strong>Offered by:</strong> {offer.createdBy?.restaurantName}
                  </div>

                  {/* Offer Title */}
                  <h3 className="text-2xl font-semibold text-purple-600">{offer.title}</h3>
                  <p className="mt-2 text-gray-600">{offer.message}</p>

                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      <strong>Start Date:</strong> {new Date(offer.startDate).toLocaleDateString("en-GB")}
                    </p>
                    <p>
                      <strong>End Date:</strong> {new Date(offer.endDate).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon Section */}
        {comingSoon.length > 0 && (
          <div>
            <h2 className="text-3xl font-semibold text-purple-600 mb-4">
              Coming Soon
            </h2>
            <div className="space-y-6">
              {comingSoon.map((offer) => (
                <div
                  key={offer._id}
                  className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Bakery Name */}
                  <div className="mb-4 text-lg font-medium text-gray-700">
                    <strong>Offered by:</strong> {offer.createdBy?.restaurantName}
                  </div>

                  {/* Offer Title */}
                  <h3 className="text-2xl font-semibold text-purple-600">{offer.title}</h3>
                  <p className="mt-2 text-gray-600">{offer.message}</p>

                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      <strong>Start Date:</strong> {new Date(offer.startDate).toLocaleDateString("en-GB")}
                    </p>
                    <p>
                      <strong>End Date:</strong> {new Date(offer.endDate).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default OffersPromotions;
