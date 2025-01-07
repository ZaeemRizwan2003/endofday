import dbConnect from "@/middleware/mongoose";
import RegisteredBakeries from "@/models/RBakerymodel";
export default async function handler(req, res) {
  await dbConnect(); // Connect to database

  const { id,searchQuery } = req.query; // Get ID from query params

  if (req.method === "GET") {
    try {
      let restaurant;

      if (id) {
        // If an ID is provided, find by ID
        restaurant = await RegisteredBakeries.findById(id);
      } else if (searchQuery) {
        // If search query is provided, search by name or location
        restaurant = await RegisteredBakeries.findOne({
          $or: [
            { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for name
            { location: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for location
          ],
        });
      }
      
      if (!restaurant) {
        return res
          .status(404)
          .json({ success: false, message: "Restaurant not found" });
      }

      res.status(200).json(restaurant); // Send restaurant details
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res
      .status(405)
      .json({ success: false, message: `Method ${req.method} not allowed` });
  }
}
