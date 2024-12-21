// pages/api/deliverypartners/orders-assign.js
import dbConnect from "@/middleware/mongoose";
import Order from "@/models/Order";
import DeliveryPartner from "@/models/DeliveryPartner";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "GET") {
        const { driverId } = req.query;

        try {
            
            const driver = await DeliveryPartner.findById(driverId);

            if (!driver) {
                return res.status(404).json({ message: "Driver not found" });
            }

            const orders = await Order.find({ deliveryBoy_id: driverId })
                .populate('userId','name contact'); 

            return res.status(200).json({ success: true, orders: orders || [] });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching orders", error });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}