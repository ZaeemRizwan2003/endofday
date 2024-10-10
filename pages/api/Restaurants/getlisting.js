// pages/api/getlisting.js

import dbConnect from '@/middleware/mongoose';
import Listings from '@/models/foodlistingmodel';
import RegisteredBakeries from '@/models/RBakerymodel';

export default async function handler(req, res) {
    const { id } = req.query;

    await dbConnect();

    if (req.method === 'GET') {
        try {

            const listing = await Listings.findById(id).lean();
            if (listing) {
                let image = null;
                if (listing.image && listing.image.data) {
                    const base64 = listing.image.data.toString('base64');
                    image = {
                        data: base64,
                        contentType: listing.image.contentType
                    };
                }
                return res.status(200).json({ ...listing, image });
            }

            // Find the bakery by ID
            const bakery = await RegisteredBakeries.findById(id).populate('menu'); // Populate the menu field

            if (!bakery) {
                return res.status(404).json({ message: 'Bakery not found.' });
            }

            // If you want to fetch specific listings based on the menu array
            const listingIds = bakery.menu; // This should be an array of ObjectIds
            const listings = await Listings.find({ _id: { $in: listingIds } }).lean(); // Fetch listings

            // Convert image buffers to base64 strings for each listing
            const processedListings = listings.map(listing => {
                let image = null;
                if (listing.image && listing.image.data) {
                    const base64 = listing.image.data.toString('base64');
                    image = {
                        data: base64,
                        contentType: listing.image.contentType
                    };
                }
                return { ...listing, image }; // Add image to listing object
            });

            return res.status(200).json({ bakery, listings: processedListings });
        } catch (error) {
            console.error('Error fetching bakery or listings:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed.' });
    }
}
