import dbConnect from "@/middleware/mongoose";
import Order from "@/models/Order";
import ReturnRequest from "@/models/ReturnRequestModel";
export default async function handler(req, res) {
  await dbConnect();

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId in query" });
  }

  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const orders = await Order.find({
      userId,
      updatedAt: { $gte: twentyFourHoursAgo },
      deliveryStatus: "Done",
    })
      .populate("bakeryId", "restaurantName")
      .sort({ updatedAt: -1 });

    // Fetch return requests submitted by the user
    const returnRequests = await ReturnRequest.find({ userId }).select("orderId");

    // Create a Set of order IDs for which refund is already applied
    const refundedOrderIds = new Set(returnRequests.map((req) => req.orderId.toString()));

    // Append refundApplied flag to each order
    const enrichedOrders = orders.map((order) => ({
      ...order.toObject(),
      refundApplied: refundedOrderIds.has(order._id.toString()),
    }));

    return res.status(200).json({ orders: enrichedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
