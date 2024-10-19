import Navbar from '@/Components/Navbar';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie to manage cookies
import { useRouter } from 'next/router';
import Image from 'next/image';

const Dashboard = () => {
    const [listings, setListings] = useState([]); // Initialize as an empty array
    const [reminders, setReminders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedListingId, setSelectedListingId] = useState(null);

    const router = useRouter();

    // Fetch listings from the API when the component mounts

    useEffect(() => {
        const fetchListings = async () => {
            // Get user ID from cookie
            const userId = Cookies.get('userId'); // Replace 'userID' with the actual name of your cookie

            if (!userId) {
                router.push('/Login'); // Redirect if no user ID found
                return;
            }

            try {
                const response = await fetch(`/api/Restaurants/getlisting?id=${userId}`);
                const data = await response.json();

                if (response.ok) {
                    const processedListings = data.listings.map(listing => {
                        if (listing.image && listing.image.data && listing.image.contentType) {
                            const base64Image = listing.image.data.toString('base64');
                            return {
                                ...listing,
                                image: {
                                    data: base64Image,
                                    contentType: listing.image.contentType
                                }
                            };
                        }
                        return listing;
                    });
                    setListings(processedListings); // Set fetched listings
                } else {
                    console.error('Failed to fetch listings:', data.message);
                }
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        fetchListings();
    }, [router]);

    // Calculate reminders when the component loads
    useEffect(() => {
        const currentTime = new Date();
        const updateReminders = listings.map((listing) => {
            const lastUpdated = new Date(listing.updatedAt);
            const hoursSinceUpdate = (currentTime - lastUpdated) / (1000 * 60 * 60); // Difference in hours
            return {
                ...listing,
                needsUpdate: hoursSinceUpdate >= 23, // true if 23 hours have passed
            };
        });
        setReminders(updateReminders);
    }, [listings]);

    const deleteListing = async (id) => {
        try {
            const response = await fetch('/api/Restaurants/deletelisting', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }), // Send the listing id to the API
            });

            const data = await response.json();
            if (data.success) {
                // Update the listings after successful deletion
                setListings(listings.filter((listing) => listing._id !== id));
            } else {
                console.error('Failed to delete listing:', data.error);
            }
        } catch (error) {
            console.error('Error deleting listing:', error);
        }
    };

    const handleAddFood = () => {
        router.push('/Restaurants/addFoodListing');
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4 mt-20">
                {/* Add Food Button */}
                <div className="flex justify-center mb-6">
                    <button onClick={handleAddFood} className="button bg-purple-500 hover:bg-purple-700 text-black font-bold py-2 px-4 rounded flex items-center">
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
                <h1 className="text-2xl font-bold mb-4 text-center text-black">Your Food Listings</h1>
                {reminders.length === 0 ? (
                    <p className="text-center">No Listings found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reminders.map((listing) => (
                            <div key={listing._id} className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
                                {/* Display the image stored in the database */}
                                {listing.image && listing.image.data && listing.image.contentType && (
                                    <div className="w-full h-36 relative mb-2">
                                        <Image
                                            src={`data:${listing.image.contentType};base64,${listing.image.data}`}
                                            alt={listing.itemname}
                                            layout="fill" // To make it responsive
                                            objectFit="cover" // Ensures the image covers the div area
                                            className="rounded-lg"
                                            unoptimized // Important: allows data URLs
                                        />
                                    </div>
                                )}

                                <h2 className="text-xl font-bold text-gray-800">{listing.itemname}</h2>
                                <p className="text-lg text-gray-600">
                                    Price: <span className="text-red-500 line-through">${listing.price}</span>
                                </p>
                                <p className="text-lg text-gray-600">
                                    Discounted Price: <span className="text-gray-800">${listing.discountedprice}</span>
                                </p>
                                <p className="text-lg text-gray-600">
                                    Remaining Items: <span className="text-gray-800">{listing.remainingitem}</span>
                                </p>
                                <p className="text-lg text-gray-600">
                                    Manufacture Date: <span className="text-gray-800">{new Date(listing.manufacturedate).toLocaleDateString()}</span>
                                </p>
                                <p className="text-base text-gray-500">Description: {listing.description}</p>

                                {/* Reminder to update if 23 hours have passed */}
                                {listing.needsUpdate && (
                                    <p className="text-red-500 font-bold">⚠️ Please update this listing!</p>
                                )}

                                <div className="flex justify-between mt-4">
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => {
                                            setSelectedListingId(listing._id);
                                            setShowModal(true);
                                        }}
                                        className="Btn flex items-center text-red-600 hover:text-red-800"
                                    >
                                        <svg
                                            viewBox="0 0 16 16"
                                            className="bi bi-trash3-fill"
                                            fill="currentColor"
                                            height="18"
                                            width="18"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 1 0v-8a.5.5 0 0 0-.5-.5Z" />
                                        </svg>
                                        <span className="ml-2">Delete</span>
                                    </button>

                                    {/* Edit Button */}
                                    <button
                                        onClick={() => router.push(`/Restaurants/addFoodListing?edit=${listing._id}`)}
                                        className="edit-button flex items-center text-green-600 hover:text-green-800"
                                    >
                                        <svg className="edit-svgIcon" viewBox="0 0 512 512" height="18" width="18">
                                            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                                        </svg>
                                        <span className="ml-2">Edit</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Confirmation Modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                            <p className="mb-6">Are you sure you want to delete this listing?</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowModal(false)} // Cancel deletion
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        deleteListing(selectedListingId); // Confirm deletion
                                        setShowModal(false); // Close the modal
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

// Remove getServerSideProps as we're fetching listings from the API
export default Dashboard;
