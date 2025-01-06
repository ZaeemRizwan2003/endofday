import dbConnect from "@/middleware/mongoose";
import Order from "@/models/Order";
import User from "@/models/CustomerUser";
import DeliveryPartner from "@/models/DeliveryPartner";
import Listings from "@/models/foodlistingmodel";
import RegisteredBakeries from "@/models/RBakerymodel";
const Fuse = require("fuse.js");
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  // ✅ GET Requests
  if (req.method === "GET") {
    const { id, status } = req.query;

    try {
      // ✅ Fetch a specific order by ID
      if (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid order ID format." });
        }

        const order = await Order.findById(id)
          .populate({
            path: "userId",
            populate: { path: "addresses", model: "User" },
          })
          .populate("bakeryId"); // Populate bakeryId for details

        if (!order) {
          return res.status(404).json({ message: "Order not found" });
        }

        const selectedAddress = order.userId.addresses.find(
          (address) => address._id.toString() === order.address.toString()
        );

        return res.status(200).json({ ...order.toObject(), selectedAddress });
      }

      // ✅ Fetch ongoing orders
      if (status === "ongoing") {
        const ongoingOrders = await Order.find({
          status: { $in: ["Pending", "Confirmed", "On The Way"] },
        })
          .populate("bakeryId") // Populate bakery details
          .sort({ createdAt: -1 }); // Get all ongoing orders

        return res.status(200).json({ ongoingOrders }); // Always return 200
      }

      return res.status(400).json({ message: "Invalid query parameters" });
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ message: "Error fetching order", error });
    }
  }

  // ✅ POST Requests - Create a New Order
  else if (req.method === "POST") {
    const {
      userId,
      items,
      totalAmount,
      addressId,
      contact,
      pointsRedeemed = 0,
    } = req.body;

    if (!userId || !items || !totalAmount || !addressId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      // Validate user and address
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const selectedAddress = user.addresses.id(addressId);
      if (!selectedAddress) {
        return res.status(404).json({ message: "Address not found" });
      }

      // Validate and assign bakeryId
      let bakeryId = null;
      const something = await Listings.findById(items[0].itemId);
      bakeryId = something.bakeryowner;
      console.log(something);
      for (const item of items) {
        const listing = await Listings.findById(item.itemId);

        if (!listing) {
          return res
            .status(404)
            .json({ message: `Item with ID ${item.itemId} not found` });
        }

        // if (!bakeryId) {
        //   bakeryId = listing.bakeryowner; // Assign bakeryId from the first item
        // } else if (bakeryId.toString() !== listing.bakeryowner.toString()) {
        //   return res
        //     .status(400)
        //     .json({ message: "All items must belong to the same bakery." });
        // }

        if (listing.remainingitem < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for item ${listing.name}. Available: ${listing.remainingitem}`,
          });
        }

        listing.remainingitem -= item.quantity; // Update stock
        await listing.save();
      }

      // Assign delivery partner
      const { city, area, addressLine } = selectedAddress || {};
      const resolvedArea =
        area || extractAreaFromAddress(selectedAddress.addressLine || "");

      const availableRiders = await DeliveryPartner.find({ city });
      let assignedRider = null;

      const fuse = new Fuse(availableRiders, {
        keys: ["area"],
        threshold: 0.3,
      });
      const matchedRiders = fuse.search(resolvedArea);
      const ridersInArea = availableRiders.filter(
        (rider) => rider.area === resolvedArea
      );

      if (ridersInArea.length > 0) {
        assignedRider = ridersInArea[0];
      } else if (matchedRiders.length > 0) {
        assignedRider = matchedRiders[0].item;
      } else {
        assignedRider = availableRiders[0];
      }

      if (!assignedRider) {
        return res.status(500).json({ message: "No rider could be assigned" });
      }

      // Loyalty points processing
      if (pointsRedeemed > user.loyaltyPoints) {
        return res
          .status(400)
          .json({ message: "Insufficient loyalty points." });
      }

      const finalAmount = totalAmount - pointsRedeemed;
      user.loyaltyPoints -= pointsRedeemed;
      const loyaltyPointsEarned = Math.floor(finalAmount / 100);
      user.loyaltyPoints += loyaltyPointsEarned;

      await user.save();

      // Create order
      const newOrder = new Order({
        userId,
        bakeryId,
        items,
        totalAmount: finalAmount,
        address: selectedAddress._id,
        contact,
        deliveryBoy_id: assignedRider._id,
      });

      const savedOrder = await newOrder.save();
      assignedRider.orderId.push(savedOrder._id);
      await assignedRider.save();

      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order: savedOrder,
        loyaltyPointsEarned,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ message: "Error creating order", error });
    }
  }

  // ✅ DELETE Requests
  else if (req.method === "DELETE") {
    const { id } = req.query;
    try {
      const deletedOrder = await Order.findByIdAndDelete(id);
      if (!deletedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting order", error });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
