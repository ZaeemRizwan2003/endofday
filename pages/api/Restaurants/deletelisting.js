import dbConnect from "@/middleware/mongoose";
import Listings from "@/models/foodlistingmodel";
import User from "@/models/CustomerUser";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Listing ID is required' });
      }

      // Delete the listing from the Listings collection
      const deletedListing = await Listings.findByIdAndDelete(id);
      if (!deletedListing) {
        return res.status(404).json({ error: 'Listing not found' });
      }

      // Remove the listing ID from all users' favorites array
      await User.updateMany(
        { favorites: id },
        { $pull: { favorites: id } }
      );

      return res.status(200).json({ success: true, message: 'Listing deleted and removed from favorites' });

    } catch (error) {
      console.error("Error deleting listing:", error);
      return res.status(500).json({ success: false, error: 'Something went wrong' });
    }

  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
