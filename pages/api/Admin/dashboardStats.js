import User from "@/models/CustomerUser";
import RegisteredBakeries from "@/models/RBakerymodel";
import Order from "@/models/Order";
import DeliveryPartner from "@/models/DeliveryPartner";
import Blog from "@/models/Blog";
import dbConnect from "@/middleware/mongoose";

export default async function handler(req, res) {
  const { startDate, endDate, filter } = req.query; // Extract startDate and endDate

  try {
    // Connect to the database
    await dbConnect();

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const dateFilter = start && end ? { createdAt: { $gte: start, $lte: end } } : {};

    // Fetch data from the database
    const totalCustomers = await User.countDocuments(dateFilter);
    const totalRestaurants = await RegisteredBakeries.countDocuments(dateFilter);
    const totalOrders = await Order.countDocuments(dateFilter);
    const totalRiders = await DeliveryPartner.countDocuments(dateFilter);
    const totalBlogs = await Blog.countDocuments(dateFilter);

    let lastMonthOrders = 0;
    if (filter === "month") {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      lastMonthOrders = await Order.countDocuments({
        createdAt: { $gte: lastMonth },
      });
    }
    
      // New Order Metrics
      const pendingOrders = await Order.countDocuments({
        status: "pending",
        ...dateFilter,
      });
  
      const completedOrders = await Order.countDocuments({
        status: "Delivered",
        ...dateFilter,
      });
  
      // const cancelledOrders = await Order.countDocuments({
      //   status: "cancelled",
      //   ...dateFilter,
      // });
  
      const revenueGeneratedResult = await Order.aggregate([
        { $match: { status: "Delivered", ...dateFilter } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
      ]);
  
      const revenueGenerated = revenueGeneratedResult.length
        ? revenueGeneratedResult[0].totalRevenue
        : 0;

    res.status(200).json({
      totalCustomers,
      totalRestaurants,
      totalOrders,
      totalRiders,
      totalBlogs,
      lastMonthOrders,
      pendingOrders,
      completedOrders,
      // cancelledOrders,
      revenueGenerated,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}
