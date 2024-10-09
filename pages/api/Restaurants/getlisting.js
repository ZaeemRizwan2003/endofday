// pages/api/getlisting.js

import dbConnect from '@/middleware/mongoose';
import Listings from '@/models/foodlistingmodel';

export default async function handler(req, res) {
    const { id } = req.query;

    await dbConnect();

    if (req.method === 'GET') {
        try {
            const listing = await Listings.findById(id);
            if (!listing) {
                return res.status(404).json({ message: 'Listing not found.' });
            }

            // Convert image buffer to base64 string if image exists
            let image = null;
            if (listing.image && listing.image.data) {
                const base64 = listing.image.data.toString('base64');
                image = {
                    data: base64,
                    contentType: listing.image.contentType
                };
            }

            return res.status(200).json({ ...listing.toObject(), image });
        } catch (error) {
            console.error('Error fetching listing:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed.' });
    }
}
