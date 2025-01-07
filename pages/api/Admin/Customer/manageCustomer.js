import dbConnect from "@/middleware/mongoose";
import User from "@/models/CustomerUser";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { searchQuery } = req.query; // Get search query from the request

      // Build search filter if there's a search query
      const filter = searchQuery
        ? {
            usertype: "customer",
            $or: [
              { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive regex search for name
              { email: { $regex: searchQuery, $options: "i" } }, // Case-insensitive regex search for email
            ],
          }
        : { usertype: "customer" };


       const customers = await User.find(filter).select("name email createdAt");

      const customersWithOrders = await Promise.all(
        customers.map(async (customer) => {
          const orderCount = await Order.countDocuments({ userId: customer._id });
          return {
            ...customer._doc,
            orderCount,
          };
        })
      );

      return res.status(200).json({ success: true, customers : customersWithOrders });
    } catch (error) {
      console.error("Error fetching customers:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch customers" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
