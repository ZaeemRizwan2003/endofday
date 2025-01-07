import dbConnect from "@/middleware/mongoose";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      // Get bakery ID from query or session
      const { bakeryId } = req.query;

      if (!bakeryId) {
        return res
          .status(400)
          .json({ success: false, message: "Bakery ID is required" });
      }

      // Find orders for the given bakeryId and populate listing and user data
      const orders = await Order.find({ bakeryId })
        .populate("userId", "email") // Populate user details
        .populate("deliveryBoy_id", "name email") // Populate listing details
        .exec();

      res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed." });
  }
}
