import dbConnect from "@/middleware/mongoose";
import DeliveryPartner from "@/models/DeliveryPartner";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required.",
        });
      }

      // Fetch rider details
      const rider = await DeliveryPartner.findById(userId);

      if (!rider) {
        return res.status(404).json({
          success: false,
          message: "Rider not found.",
        });
      }

      // Fetch rider's orders
      const orders = await Order.find({ deliveryBoy_id: userId }).select(
        "orderNumber status totalAmount createdAt"
      );

      return res.status(200).json({
        success: true,
        rider,
        orderCount: orders.length,
        orders,
      });
    } catch (error) {
      console.error("Error fetching rider details:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch rider details.",
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      message: "Method not allowed.",
    });
  }
}
