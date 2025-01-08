import dbConnect from "@/middleware/mongoose";
import Order from "@/models/Order";
import RegisteredBakeries from "@/models/RBakerymodel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { restaurantId } = req.query;

    try {
      // Find the restaurant by ID
      const restaurant = await RegisteredBakeries.findById(restaurantId);

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Fetch all orders with status "Delivered" or "Completed"
      const orders = await Order.find({
        bakeryId: restaurantId,
        restaurantStatus: { $in: ["Done", "Completed"] },
      })
        .populate({
          path: "userId",
          select: "name contact addresses",
        })
        .populate({
          path: "bakeryId",
          select: "restaurantName number address",
        });

      if (!orders || orders.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No completed orders found.",
          orders: [],
        });
      }

      return res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching orders", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
