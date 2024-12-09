import dbConnect from "@/middleware/mongoose";
import Listings from "@/models/foodlistingmodel";
import Order from "@/models/Order";
import RegisteredBakeries from "@/models/RBakerymodel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required." });
    }

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ error: "Order not found." });
      }

      const itemId = order.items?.[0]?.itemId;

      if (!itemId) {
        return res.status(404).json({ error: "Item not found in this order." });
      }

      const listing = await Listings.findById(itemId).select("bakeryowner");

      if (!listing) {
        return res.status(404).json({ error: "Listing not found." });
      }

      const bakeryOwner = listing.bakeryowner;

      return res.status(200).json({ itemId, bakeryowner: bakeryOwner });
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ error: "An internal error occurred." });
    }
  }

  if (req.method === "POST") {
    const { orderId } = req.query;
    const { itemId, userId, rating, review, bakeryOwner } = req.body;

    if (!orderId || !itemId || !userId || !rating || !review || !bakeryOwner) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "Rating must be a number between 1 and 5." });
    }

    try {
      const bakery = await RegisteredBakeries.findById(bakeryOwner);

      if (!bakery) {
        return res.status(404).json({ error: "Bakery not found." });
      }

      // Add the review to the bakery's reviews array
      bakery.reviews.push({
        userId,
        rating,
        review,
        createdAt: new Date(),
      });

      await bakery.save();

      // Update the order's review status
      await Order.findByIdAndUpdate(orderId, { reviewStatus: "Reviewed" });

      return res
        .status(200)
        .json({ message: "Review submitted and order updated successfully." });
    } catch (error) {
      console.error("Error saving review:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while submitting the review." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).json({ error: `Method ${req.method} not allowed.` });
}
