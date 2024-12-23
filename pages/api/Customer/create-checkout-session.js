import Order from "@/models/Order";
import Stripe from "stripe";
import User from "@/models/CustomerUser";
import DeliveryPartner from "@/models/DeliveryPartner";
const Fuse = require("fuse.js");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { items, totalAmount, userId, addressId, contact } = req.body;

    try {
      // Find user and address
      const user = await User.findById(userId);
      const selectedAddress = user?.addresses.id(addressId);
      if (!selectedAddress) {
        return res.status(400).json({ error: "Address not found" });
      }

      const { city, area, addressLine } = selectedAddress || {};
      const resolvedArea =
        area || extractAreaFromAddress(selectedAddress.addressLine || "");
      console.log("Selected Address:", selectedAddress);
      console.log("City:", city, "Area:", resolvedArea);

      // 🛵 **Step 2: Assign Rider**
      const availableRiders = await DeliveryPartner.find({
        city,
      });

      if (availableRiders.length === 0) {
        return res
          .status(404)
          .json({ message: "No available riders in this area" });
      }

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

      // Create new order in the database
      const newOrder = await Order.create({
        userId,
        items,
        totalAmount,
        address: selectedAddress,
        contact,
        deliveryBoy_id: assignedRider._id,
        status: "pending",
      });
      assignedRider.orderId.push(newOrder._id);
      await assignedRider.save();

      console.log("Assigned Rider:", assignedRider);

      const deliveryFee = 150;

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          ...items.map((item) => ({
            price_data: {
              currency: "pkr",
              product_data: {
                name: item.title,
              },
              unit_amount: item.price * 100, // Convert to smallest currency unit
            },
            quantity: item.quantity,
          })),
          {
            price_data: {
              currency: "pkr",
              product_data: {
                name: "Delivery Fee",
              },
              unit_amount: deliveryFee * 100, // Convert to smallest currency unit
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_URL}/Customer/OrderConfirm?id=${newOrder._id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/Customer/Cdashboard`,
        metadata: { userId, addressId, totalAmount: totalAmount + deliveryFee },
      });
      // Send response with session ID and order ID
      http: res.status(200).json({ id: session.id, orderId: newOrder._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Payment creation failed" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}