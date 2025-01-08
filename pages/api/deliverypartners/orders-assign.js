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

      const orders = await Order.find({ deliveryBoy_id: driverId , 
      deliveryStatus:{$nin:["Delivered", "Failed"]

      }
    })
        .populate({
          path: "userId",
          select: "name contact addresses",
        })
        .populate({
          path: "deliveryBoy_id",
          select: "name contact",
        })
        .populate({
          path: "bakeryId",
          select: "restaurantName number address"
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

        let estimatedDeliveryTime = null;
        if (order.estimatedReadyTime) {
          // Add 30 minutes to ready time for estimated delivery
          estimatedDeliveryTime = new Date(order.estimatedReadyTime);
          estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 30);
        }

        return {
          _id: order._id,
          userId: {
            name: order.userId?.name || "User information not available",
            contact: order.contact ||order.userId?.contact || "N/A",
          },
          contact: order.contact || order.userId?.contact || "N/A",
          restaurant: {
            name: order.bakeryId?.restaurantName || "Restaurant information not available",
            contact: order.bakeryId?.number || "N/A",
            address: order.bakeryId?.address || "N/A"
          },
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
          items: order.items,
          restaurantStatus: order.restaurantStatus,
          deliveryStatus: order.deliveryStatus,
          createdAt: order.createdAt,
          estimatedReadyTime: order.estimatedReadyTime,
          estimatedDeliveryTime: estimatedDeliveryTime,
          pickedUpTime: order.pickedUpTime,
          // Legacy status field for backward compatibility
          status: mapStatusesToLegacy(order.restaurantStatus, order.deliveryStatus),
          // Additional metadata
          isReadyForPickup: order.restaurantStatus === "Ready" && 
                          order.deliveryStatus === "Assigned",
          timesSinceUpdate: {
            created: getTimeDifference(order.createdAt),
            readyTime: order.estimatedReadyTime ? 
                      getTimeDifference(order.estimatedReadyTime) : null,
            pickedUp: order.pickedUpTime ? 
                     getTimeDifference(order.pickedUpTime) : null
          }
        };
      });

      return res.status(200).json({ success: true, orders: enrichedOrders ,
      summary: {
          total: enrichedOrders.length,
          readyForPickup: enrichedOrders.filter(o => o.isReadyForPickup).length,
          onTheWay: enrichedOrders.filter(o => o.deliveryStatus === "On the Way").length
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching orders", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function mapStatusesToLegacy(restaurantStatus, deliveryStatus) {
  if (deliveryStatus === "Delivered") return "Delivered";
  if (deliveryStatus === "Failed") return "Failed To Deliver";
  if (deliveryStatus === "On the Way") return "On the Way";
  if (restaurantStatus === "Ready" && deliveryStatus === "Assigned") return "Confirmed";
  if (restaurantStatus === "Preparing") return "Preparing";
  return "Pending";
}

// Helper function to calculate time differences
function getTimeDifference(timestamp) {
  if (!timestamp) return null;
  const now = new Date();
  const then = new Date(timestamp);
  const diffMinutes = Math.floor((now - then) / (1000 * 60));
  
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}