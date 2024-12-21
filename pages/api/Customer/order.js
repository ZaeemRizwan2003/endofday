import dbConnect from "@/middleware/mongoose";
import Order from "@/models/Order";
import User from "@/models/CustomerUser";
import DeliveryPartner from "@/models/DeliveryPartner";

const Fuse = require("fuse.js");

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { id } = req.query;
    try {
      const order = await Order.findById(id).populate({
        path: "userId",
        populate: { path: "addresses", model: "User" },
      }); // Fetch the order by ID
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const selectedAddress = order.userId.addresses.find(
        (address) => address._id.toString() === order.address.toString()
      );

      return res.status(200).json({ ...order.toObject(), selectedAddress });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching order", error });
    }
  } else if (req.method === "POST") {
    const { userId, items, totalAmount, addressId, contact } = req.body;

    // Validate required fields
    if (!userId || !items || !totalAmount || !addressId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        console.error("User not found with ID:", userId);
        return res.status(404).json({ message: "User not found" });
      }
      const selectedAddress = user.addresses.id(addressId);

      if (!selectedAddress) {
        console.error("Selected address not found:", addressId);
        return res.status(404).json({ message: "Address not found" });
      }

      const { city, area, addressLine } = selectedAddress || {};
      const resolvedArea =
        area || extractAreaFromAddress(selectedAddress.addressLine || "");
      console.log("Selected Address:", selectedAddress);
      console.log("City:", city, "Area:", resolvedArea);

      const availableRiders = await DeliveryPartner.find({
        city,
      });

      if (availableRiders.length === 0) {
        return res
          .status(404)
          .json({ message: "No available riders in this area" });
      }

      // const fuse = new Fuse(availableRiders, {
      //   keys: ["area"],
      //   threshold: 0.3,
      // });

      // const ridersInArea = availableRiders.filter(
      //   (rider) => rider.area === area
      // );

      // const matchedRiders = fuse.search(area);

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
        console.log("Assigned Rider (Exact Match):", assignedRider);
      } else if (matchedRiders.length > 0) {
        assignedRider = matchedRiders[0].item;
        console.log("Assigned Rider (Fuzzy Match):", assignedRider);
      } else {
        assignedRider = availableRiders[0];
        console.log("Assigned Rider (Fallback):", assignedRider);
      }

      if (!assignedRider) {
        console.error("No rider could be assigned");
        return res.status(500).json({ message: "No rider could be assigned" });
      }

      console.log("Assigned Rider:", assignedRider);

      const newOrder = new Order({
        userId,
        items,
        totalAmount,
        address: selectedAddress._id,
        contact,
        deliveryBoy_id: assignedRider._id,
      });

      const savedOrder = await newOrder.save();
      assignedRider.orderId.push(savedOrder._id);
      await assignedRider.save();

      res.status(201).json(savedOrder); // Return the saved order
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ message: "Error creating order", error });
    }
  }
  // Handle DELETE request to delete an order by ID
  else if (req.method === "DELETE") {
    const { id } = req.query; // Get the order ID from the query
    try {
      const deletedOrder = await Order.findByIdAndDelete(id); // Delete the order by ID
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