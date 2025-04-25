import Order from "@/models/Order";
import Stripe from "stripe";
import User from "@/models/CustomerUser";
import DeliveryPartner from "@/models/DeliveryPartner";
import Listings from "@/models/foodlistingmodel";
const Fuse = require("fuse.js");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      items,
      totalAmount,
      userId,
      addressId,
      contact,
      pointsRedeemed = 0,
    } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const selectedAddress = user?.addresses.id(addressId);
      if (!selectedAddress) {
        return res.status(400).json({ message: "Address not found" });
      }

      const { city, area, addressLine } = selectedAddress || {};
      const resolvedArea =
        area || extractAreaFromAddress(selectedAddress.addressLine || "");

      const availableRiders = await DeliveryPartner.find({ city });
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
      } else if (matchedRiders.length > 0) {
        assignedRider = matchedRiders[0].item;
      } else {
        assignedRider = availableRiders[0];
      }

      if (!assignedRider) {
        return res.status(500).json({ message: "No rider could be assigned" });
      }
      let bakeryId = null;
      const something = await Listings.findById(items[0].itemId);
      bakeryId = something.bakeryowner;
     
      for (const item of items) {
        const listing = await Listings.findById(item.itemId);
        if (!listing) {
          return res
            .status(404)
            .json({ message: `Item with ID ${item.itemId} not found` });
        }
        if (listing.remainingitem < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for item ${listing.name}. Available: ${listing.remainingitem}`,
          });
        }

        // Reserve Stock
        listing.remainingitem -= item.quantity;
        await listing.save();
      }

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

      // ✅ Create Order in Database
      const newOrder = await Order.create({
        userId,
        bakeryId,
        items,
        totalAmount: finalAmount,
        address: selectedAddress._id,
        contact,
        deliveryBoy_id: assignedRider._id,
        status: "Pending",
      });

      assignedRider.orderId.push(newOrder._id);
      await assignedRider.save();

      // ✅ Stripe Checkout Session
      const deliveryFee = 150;
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
              unit_amount: deliveryFee * 100,
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_URL}/Customer/OrderConfirm?id=${newOrder._id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/Customer/Cdashboard`,
        metadata: {
          userId,
          addressId,
          totalAmount: finalAmount + deliveryFee,
        },
      });

      // ✅ Respond to Client
      res.status(201).json({
        success: true,
        message: "Order placed successfully via Stripe Checkout",
        sessionId: session.id,
        orderId: newOrder._id,
        loyaltyPointsEarned,
      });
    } catch (error) {
      console.error("Error creating Stripe order:", error);

      // Rollback changes in case of failure
      for (const item of items) {
        const listing = await Listings.findById(item.itemId);
        if (listing) {
          listing.remainingitem += item.quantity; // Restore stock
          await listing.save();
        }
      }

      await User.findByIdAndUpdate(userId, {
        $inc: { loyaltyPoints: pointsRedeemed },
      });

      res.status(500).json({
        success: false,
        message: "Order creation via Stripe Checkout failed",
        error: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
  }
}
