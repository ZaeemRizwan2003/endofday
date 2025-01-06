import dbConnect from "@/middleware/mongoose";
import RegisteredBakeries from "@/models/RBakerymodel";
import Listings from "@/models/foodlistingmodel";
export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { id } = req.query;

  try {
    await dbConnect(); // Connect to the database

    const deletedRestaurant = await RegisteredBakeries.findByIdAndDelete(id);
    if (!deletedRestaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
    await Listings.deleteMany({ bakeryowner: id });

    res
      .status(200)
      .json({
        success: true,
        message: "Restaurant and its associated listings deleted successfully",
      });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
