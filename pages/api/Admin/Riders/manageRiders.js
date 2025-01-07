import dbConnect from "@/middleware/mongoose";
import DeliveryPartner from "@/models/DeliveryPartner";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { searchQuery } = req.query;
      const filter = searchQuery
        ? {
            $or: [
              { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive regex search for name
              { contact: { $regex: searchQuery, $options: "i" } }, // Case-insensitive regex search for contact
              { area: { $regex: searchQuery, $options: "i" } }, // Case-insensitive regex search for area
              { city: { $regex: searchQuery, $options: "i" } }, // Case-insensitive regex search for city
            ],
          }
        : {}; // If no search query, fetch all riders

      // Fetch delivery partners based on the filter
      const deliveryPartners = await DeliveryPartner.find(filter).select(
        "name contact area city createdAt"
      );

      // Add order count for each delivery partner
      const deliveryPartnersWithOrders = await Promise.all(
        deliveryPartners.map(async (partner) => {
          const orderCount = await Order.countDocuments({
            deliveryBoy_id: partner._id,
          });
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
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch delivery partners" });
    }
  }

  if (req.method === "PUT") {
    const { partnerId, name, contact, area, city } = req.body;

    if (!partnerId || !name || !contact || !area || !city) {
      return res.status(400).json({
        success: false,
        message: "All fields are required for updating the rider.",
      });
    }

    const updatedPartner = await DeliveryPartner.findByIdAndUpdate(
      partnerId,
      { name, contact, area, city },
      { new: true, runValidators: true }
    );

    if (!updatedPartner) {
      return res.status(404).json({
        success: false,
        message: "Rider not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rider updated successfully.",
      updatedPartner,
    });
  }

  if (req.method === "DELETE") {
    const { partnerId: deletePartnerId } = req.query;

    if (!deletePartnerId) {
      return res.status(400).json({
        success: false,
        message: "Partner ID is required for deletion.",
      });
    }

    const deletedPartner = await DeliveryPartner.findByIdAndDelete(
      deletePartnerId
    );

    if (!deletedPartner) {
      return res.status(404).json({
        success: false,
        message: "Rider not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rider deleted successfully.",
    });
  }
}
