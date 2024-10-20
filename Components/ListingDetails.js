import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const ListingDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [listing, setListing] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            const fetchListing = async () => {
                try {
                    const res = await axios.get(`/api/Restaurants/foodlisting?id=${id}`);
                    setListing(res.data);
                } catch (err) {
                    console.error(err);
                    setError('Unable to fetch listing data');
                }
            };
            fetchListing();
        }
    }, [id]);

    if (error) return <p className="text-red-500">{error}</p>;


    return (
        <div className="max-w-3xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">{listing.itemname}</h1>
            {listing.image && listing.image.data ? (
                <img
                    src={`data:${listing.image.contentType};base64,${listing.image.data}`}
                    alt={listing.itemname}
                    className="w-full h-auto object-cover rounded mb-4"
                />
            ) : (
                <p>No image available.</p>
            )}
            <p><strong>Description:</strong> {listing.description}</p>
            <p><strong>Price:</strong> ${listing.price}</p>
            <p><strong>Discounted Price:</strong> ${listing.discountedprice}</p>
            <p><strong>Remaining Items:</strong> {listing.remainingitem}</p>
            <p><strong>Manufacture Date:</strong> {new Date(listing.manufacturedate).toLocaleDateString()}</p>
        </div>
    );
};

export default ListingDetails;
