import dbConnect from "@/middleware/mongoose";
import DeliveryPartner from "@/models/DeliveryPartner";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await dbConnect();

  try {
    switch (req.method) {
  
      case "GET":
        const deliveryPartners = await DeliveryPartner.find({}).select(
          "name contact area city createdAt"
        );

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

    
      case "PUT":
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

    
      case "DELETE":
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


      default:
        return res.status(405).json({
          success: false,
          message: "Method not allowed",
        });
    }
  } catch (error) {
    console.error("Error in Riders API:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
