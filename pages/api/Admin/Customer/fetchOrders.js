import dbConnect from "@/middleware/mongoose";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { userId } = req.query;
    try {
      const orders = await Order.find({ userId }).populate("userId", "name email");
      const totalOrders = orders.length;

      return res.status(200).json({success: true,
        orders,
        totalOrders,});
        
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res
        .status(500)
        .json({ message: "Failed to fetch orders", error });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
