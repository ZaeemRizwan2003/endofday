import dbConnect from "@/middleware/mongoose";
import User from "@/models/CustomerUser";
import Listings from "@/models/foodlistingmodel";
import RegisteredBakeries from "@/models/RBakerymodel";

export default async function handler(req, res) {
  await dbConnect();

  const { userId, listingId } = req.body;

  if (req.method === "GET") {
    // Fetch user's favorites
    try {
      const user = await User.findById(req.query.userId).populate({
        path: "favorites",
        populate: { path: "bakeryowner", model: "RegisteredBakeries" },
      }); // Populate favorites

      if (!user) return res.status(404).json({ error: "User not found" });

      const favoritesWithRestaurant = user.favorites.map((listing) => ({
        _id: listing._id,
        itemname: listing.itemname,
        discountedprice: listing.discountedprice,
        image: listing.image,
        bakeryowner: listing.bakeryowner._id,
        bakeryownerName: listing.bakeryowner.restaurantName, // Add restaurant name
      }));

      return res.status(200).json({ favorites:favoritesWithRestaurant });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch favorites" });
    }
  } else if (req.method === "POST") {
    // Add to favorites
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      if (user.favorites.includes(listingId)) {
        return res.status(400).json({ error: "Listing already in favorites" });
      }

      user.favorites.push(listingId);
      await user.save();

      return res
        .status(200)
        .json({ message: "Added to favorites", favorites: user.favorites });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to add to favorites" });
    }
  } else if (req.method === "DELETE") {
    // Remove from favorites
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      user.favorites = user.favorites.filter((id) => id.toString() !== listingId);
      await user.save();

      return res
        .status(200)
        .json({ message: "Removed from favorites", favorites: user.favorites });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to remove from favorites" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
