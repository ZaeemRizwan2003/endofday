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
        .populate({
          path: "userId",
          select: "name contact addresses",
        })
        .populate({
          path: "deliveryBoy_id",
          select: "name",
        });

      if (!orders || orders.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No orders assigned to this driver.",
          orders: [],
        });
      }

      const enrichedOrders = orders.map((order) => {
        let addressDetails = null;

        if (order.userId?.addresses && order.address) {
          addressDetails = order.userId.addresses.find(
            (addr) => addr._id.toString() === order.address.toString()
          );
        }
        return {
          _id: order._id,
          userId: {
            name: order.userId?.name || "User information not available",
            contact: order.contact ||order.userId?.contact || "N/A",
          },
          contact: order.contact || order.userId?.contact || "N/A",
          address: addressDetails
            ? {
                addressLine: addressDetails.addressLine || "N/A",
                area: addressDetails.area || "N/A",
                city: addressDetails.city || "N/A",
                postalCode: addressDetails.postalCode || "N/A",
                lat: addressDetails.lat || null,
                lng: addressDetails.lng || null,
              }
            : {
                addressLine: "Address not found",
                area: "N/A",
                city: "N/A",
                postalCode: "N/A",
                lat: null,
                lng: null,
              },
          totalAmount: order.totalAmount,
          status: order.status,
          items: order.items,
          createdAt: order.createdAt,
        };
      });

      return res.status(200).json({ success: true, orders: enrichedOrders });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching orders", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
