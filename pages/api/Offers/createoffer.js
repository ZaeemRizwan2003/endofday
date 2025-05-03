import dbConnect from "@/middleware/mongoose";
import OffersModel from "@/models/OffersModel";
import RegisteredBakeries from "@/models/RBakerymodel";
export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, message, startDate, endDate } = req.body;
    const userId = req.headers.userid;

    // Basic validation
    if (!title || !message || !startDate || !endDate || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate date logic
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ error: "End date must be after start date" });
    }

    // Verify that user exists
    const restaurant = await RegisteredBakeries.findById(userId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Create notification
    const newNotification = await OffersModel.create({
      title,
      message,
      startDate,
      endDate,
      createdBy: restaurant._id,
    });

    return res.status(201).json({
      message: "Offer submitted successfully",
      notification: newNotification,
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
