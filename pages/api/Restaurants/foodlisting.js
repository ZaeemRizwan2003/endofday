// pages/api/foodlisting.js

import dbConnect from '@/middleware/mongoose';
import Listings from '@/models/foodlistingmodel';
import cookie from 'cookie';
import RegisteredBakeries from '@/models/RBakerymodel';
export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        // Handle creating a new listing
        const { itemname, description, price, discountedprice, remainingitem, manufacturedate, image, contentType } = req.body;

        // Parse cookies to get user ID
        const cookies = cookie.parse(req.headers.cookie || '');
        const userId = cookies.userId;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated. Please log in.' });
        }

        if (!itemname || !description || !price || !discountedprice || !manufacturedate) {
            return res.status(422).json({ message: 'Fill all the required fields.' });
        }

        try {
            const newListing = new Listings({
                itemname,
                description,
                price,
                discountedprice,
                remainingitem,
                manufacturedate: new Date(manufacturedate),
                bakeryowner: userId
            });

            if (image && contentType) {
                const imgBuffer = Buffer.from(image, 'base64');
                newListing.image.data = imgBuffer;
                newListing.image.contentType = contentType;
            }

            await newListing.save();
            await RegisteredBakeries.findByIdAndUpdate(userId, {
                $push: { menu: newListing._id }
            });
            return res.status(200).json({ message: 'Listing Added Successfully.' });
        } catch (error) {
            console.error('Error creating listing:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    } else if (req.method === 'PUT') {
        // Handle updating an existing listing
        const { id, itemname, description, price, discountedprice, remainingitem, manufacturedate, image, contentType } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Listing ID is required for update.' });
        }

        try {
            const listing = await Listings.findById(id);
            if (!listing) {
                return res.status(404).json({ message: 'Listing not found.' });
            }

            // Update fields
            listing.itemname = itemname || listing.itemname;
            listing.description = description || listing.description;
            listing.price = price || listing.price;
            listing.discountedprice = discountedprice || listing.discountedprice;
            listing.remainingitem = remainingitem || listing.remainingitem;
            listing.manufacturedate = manufacturedate ? new Date(manufacturedate) : listing.manufacturedate;

            if (image && contentType) {
                const imgBuffer = Buffer.from(image, 'base64');
                listing.image.data = imgBuffer;
                listing.image.contentType = contentType;
            }

            await listing.save();
            return res.status(200).json({ message: 'Listing Updated Successfully.' });
        } catch (error) {
            console.error('Error updating listing:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    } else if (req.method === 'GET') {
        // Handle fetching a listing
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: 'Listing ID is required.' });
        }

        try {
            const listing = await Listings.findById(id).lean();
            if (!listing) {
                return res.status(404).json({ message: 'Listing not found.' });
            }

            // If image exists, convert it to Base64
            if (listing.image && listing.image.data) {
                const base64Image = listing.image.data.toString('base64');
                listing.image = {
                    data: base64Image,
                    contentType: listing.image.contentType
                };
            } else {
                listing.image = null;
            }

            return res.status(200).json(listing);
        } catch (error) {
            console.error('Error fetching listing:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    } else {
        // Method not allowed
        return res.status(405).json({ message: 'Method not allowed.' });
    }
}
