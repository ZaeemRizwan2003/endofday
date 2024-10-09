import dbConnect from "@/middleware/mongoose";
import Listings from "@/models/foodlistingmodel";

export default async function handler(req, res) {
    await dbConnect();
    if (req.method === 'DELETE') {
        try {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({ error: 'Listing ID is required' });
            }

            await Listings.findByIdAndDelete(id);
            return res.status(200).json({ success: true, message: 'Listing deleted successfully' });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: 'Something went wrong' });
        }
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}