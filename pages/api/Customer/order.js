import dbConnect from "@/middleware/mongoose";
import Order from "@/models/Order";
import User from "@/models/CustomerUser";
import DeliveryPartner from "@/models/DeliveryPartner";

const Fuse = require("fuse.js");

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { id, status } = req.query;

    try {
      // ✅ Fetch a specific order by ID
      if (id) {
        const order = await Order.findById(id).populate({
          path: "userId",
          populate: { path: "addresses", model: "User" },
        });

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
        const ongoingOrder = await Order.findOne({
          status: { $in: ["Pending", "Confirmed", "On The Way"] },
        }).sort({ createdAt: -1 }); // Get the latest ongoing order

        if (!ongoingOrder) {
          return res.status(404).json({ message: "No ongoing orders found" });
        }

        return res.status(200).json({ ongoingOrder });
      }

      return res.status(400).json({ message: "Invalid query parameters" });
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ message: "Error fetching order", error });
    }
  }

  // ✅ Create a new order
  else if (req.method === "POST") {
    const { userId, items, totalAmount, addressId, contact } = req.body;

    if (!userId || !items || !totalAmount || !addressId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const selectedAddress = user.addresses.id(addressId);

      if (!selectedAddress) {
        return res.status(404).json({ message: "Address not found" });
      }

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

      const newOrder = new Order({
        userId,
        items,
        totalAmount,
        address: selectedAddress._id,
        contact: req.body.contact,
        deliveryBoy_id: assignedRider._id,
      });

      const savedOrder = await newOrder.save();
      assignedRider.orderId.push(savedOrder._id);
      await assignedRider.save();

      res.status(201).json(savedOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ message: "Error creating order", error });
    }
  }

  // ✅ Delete an order
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
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
