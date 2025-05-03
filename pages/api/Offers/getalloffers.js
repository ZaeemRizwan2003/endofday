import dbConnect from "@/middleware/mongoose";
import OffersModel from "@/models/OffersModel";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const offers = await OffersModel.find().populate("createdBy", "restaurantName email");
    res.status(200).json({ success: true, offers });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ success: false, message: "Failed to fetch offers" });
  }
}
