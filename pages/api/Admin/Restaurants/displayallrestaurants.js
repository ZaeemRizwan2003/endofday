import dbConnect from "@/middleware/mongoose";
import RegisteredBakeries from "@/models/RBakerymodel";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      
      await dbConnect(); 
      const { searchQuery } = req.query; // Get search query from query params

      // Build search filter if searchQuery exists
      const searchFilter = searchQuery
        ? {
            status: "approved",
            $or: [
              { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for name
              { location: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for location
            ],
          }
        : { status: "approved" };

       const restaurants = await RegisteredBakeries.find(searchFilter); // Fetch filtered restaurants
      const bakeryCount = await RegisteredBakeries.countDocuments(searchFilter);

      // Process the restaurants to include the base64 image format if necessary
      const processedRestaurants = restaurants.map((restaurant) => {
        if (
          restaurant.image &&
          restaurant.image.data &&
          restaurant.image.contentType
        ) {
          const base64Image = restaurant.image.data.toString("base64");
          restaurant.image = {
            data: base64Image,
            contentType: restaurant.image.contentType,
          };
        }
        return restaurant;
      });

      res
        .status(200)
        .json({ listings: processedRestaurants, count: bakeryCount }); // Send back the processed restaurants
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
