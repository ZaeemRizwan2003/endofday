import dbConnect from "@/middleware/mongoose";
import Order from "@/models/Order";

export default async function handler(req, res) {
  if (req.method == "PUT") {
    const { orderId, statusType, status } = req.body;

    if (!orderId || !statusType || !status) {
      return res.status(400).json({
        message: "Order ID, status type, and status are required.",
      });
    }

    const validStatusTypes = ["restaurantStatus", "deliveryStatus", "reviewStatus"];
    if (!validStatusTypes.includes(statusType)) {
      return res.status(400).json({
        message: "Invalid status type. Valid types are: restaurantStatus, deliveryStatus, reviewStatus.",
      });
    }

    try {
      await dbConnect();
      const updatedOrder = await Order.updateOne(
        {
          _id: orderId,
        },
        { 
          $set: { [statusType]: status } 
        }
        
      );

      if (updatedOrder.modifiedCount === 0) {
        return res
          .status(404)
          .json({ message: "Order not found or status is the same." });
      }

      return res
        .status(200)
        .json({ message: `${statusType} updated successfully to ${status}` 
        });
    } catch (error) {
      console.error("Error updating order status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
