// /pages/api/restaurant-dashboard.js
import dbConnect from "@/middleware/mongoose";
import Listings from "@/models/foodlistingmodel"; // assuming Listings model
import Order from "@/models/Order";
import RegisteredBakeries from "@/models/RBakerymodel";

export default async function handler(req, res) {
  await dbConnect();

  const { bakeryId } = req.query; // get bakery id from query params

  if (!bakeryId) {
    return res.status(400).json({ message: "Bakery ID is required" });
  }

  try {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Fetch Bakery Info once
    const bakery = await RegisteredBakeries.findById(bakeryId).select("restaurantName reviews");
    
    if (!bakery) {
      return res.status(404).json({ message: "Bakery not found" });
    }

    // 1. Current Listings
    const currentListingsCount = await Listings.countDocuments({
      bakeryowner: bakeryId,
      updatedAt: { $gte: yesterday },
    });

    // 2. Total Orders
    const totalOrdersCount = await Order.countDocuments({
      bakeryId: bakeryId,
    });

    // 3. Current Orders
    const currentOrdersCount = await Order.countDocuments({
      bakeryId: bakeryId,
      restaurantStatus: { $in: ["Pending", "Preparing"] },
    });

    // 4. Total Reviews
    const totalReviewsCount = bakery.reviews.length || 0;

    // 5. Total Earnings
    const completedOrders = await Order.find({
      bakeryId: bakeryId,
      restaurantStatus: "Done",
    }).select("totalAmount");

    const totalEarnings = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Final Response
    return res.status(200).json({
      bakeryName: bakery.restaurantName, // <--- Added bakery name here
      currentListings: currentListingsCount,
      totalOrders: totalOrdersCount,
      currentOrders: currentOrdersCount,
      totalReviews: totalReviewsCount,
      totalEarnings: totalEarnings.toFixed(2),
    });
  } catch (error) {
    console.error("Error in dashboard API:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
