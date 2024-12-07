import dbConnect from "@/middleware/mongoose";
import Listings from "@/models/foodlistingmodel";
import Order from "@/models/Order";
import RegisteredBakeries from "@/models/RBakerymodel";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required." });
    }

    try {
      await dbConnect();

      // Fetch the order by ID
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ error: "Order not found." });
      }

      // Extract itemId from the order
      const itemId = order.items?.length > 0 ? order.items[0].itemId : null;

      if (!itemId) {
        return res.status(404).json({ error: "Item not found in this order." });
      }

      // Fetch bakeryowner from Listings collection
      const listing = await Listings.findById(itemId).select("bakeryowner");

      if (!listing) {
        return res.status(404).json({ error: "Listing not found." });
      }

      const bakeryowner = listing.bakeryowner;

      return res.status(200).json({ itemId, bakeryowner });
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ error: "An internal error occurred." });
    }
  }

  // Handle POST method for submitting reviews
  if (req.method === "POST") {
    const { itemId, userId, rating, review, bakeryowner } = req.body;

    // Validate required fields
    if (!itemId || !userId || !rating || !review || !bakeryowner) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Ensure rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "Rating must be a number between 1 and 5." });
    }

    try {
      await dbConnect();

      // Fetch the bakery using bakeryowner ID from RegisteredBakeries collection
      const bakery = await RegisteredBakeries.findById(bakeryowner);

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

      // Save the updated bakery document
      await bakery.save();

      return res
        .status(200)
        .json({ message: "Review submitted successfully." });
    } catch (error) {
      console.error("Error saving review:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while submitting the review." });
    }
  }

  // Handle unsupported methods
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
