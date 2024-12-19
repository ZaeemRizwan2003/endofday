import dbConnect from "@/middleware/mongoose";
import DeliveryPartner from "@/models/DeliveryPartner";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      // Fetch all delivery partners
      const deliveryPartners = await DeliveryPartner.find({}).select(
        "name contact area city createdAt"
      );

      // Add the count of orders for each delivery partner
      const deliveryPartnersWithOrders = await Promise.all(
        deliveryPartners.map(async (partner) => {
          const orderCount = await Order.countDocuments({ deliveryBoy_id: partner._id });
          return {
            ...partner._doc,
            orderCount,
          };
        })
      );

      return res.status(200).json({
        success: true,
        deliveryPartners: deliveryPartnersWithOrders,
      });
    } catch (error) {
      console.error("Error fetching delivery partners:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch delivery partners",
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }
}
