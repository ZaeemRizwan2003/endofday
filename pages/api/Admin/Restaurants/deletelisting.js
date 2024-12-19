import dbConnect from "@/middleware/mongoose";

import Listings from "@/models/foodlistingmodel";
export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    const result = await Listings.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Listing not found." });
    }

    res.status(200).json({ message: "Listing deleted successfully." });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
