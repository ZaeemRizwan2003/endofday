// pages/api/deliverypartners/update-order-status.js
import dbConnect from "@/middleware/mongoose";
import Order from "@/models/Order";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "PUT") {
        const { orderId, deliveryStatus } = req.body;

        try {
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            order.deliveryStatus = deliveryStatus;

            if (deliveryStatus === "Picked Up") {
                order.restaurantStatus = "Done";
              }
        
              if (deliveryStatus === "Delivered") {
                order.deliveryStatus = "Done";
              }

            await order.save(); // Save the changes

            return res.status(200).json({ message: "Order status updated successfully", order });
        } catch (error) {
            return res.status(500).json({ message: "Error updating order status", error });
        }
    } else {
        res.setHeader("Allow", ["PUT"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
