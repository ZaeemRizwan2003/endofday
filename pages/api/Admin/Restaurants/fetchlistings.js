import dbConnect from "@/middleware/mongoose";
import Listings from "@/models/foodlistingmodel";
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    dbConnect();
    const listings = await Listings.find({ bakeryowner: id });

    if (!listings) {
      return res.status(404).json({ message: "No listings found." });
    }

    res.status(200).json({ listings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
