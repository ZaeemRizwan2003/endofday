// pages/api/deliverypartners/orders-assign.js
import dbConnect from "@/middleware/mongoose";
import Order from "@/models/Order";
import DeliveryPartner from "@/models/DeliveryPartner";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "GET") {
        const { driverId } = req.query;

        try {
            // Find the driver by ID to get their area
            const driver = await DeliveryPartner.findById(driverId);
            if (!driver) {
                return res.status(404).json({ message: "Driver not found" });
            }

            // Find orders that match the driver's area
            const orders = await Order.find({ deliveryBoy_id: driverId, area: driver.area, status: 'Pending' })
                .populate('userId','name contact'); // Populate user data if needed

            return res.status(200).json({ success: true, orders });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching orders", error });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
