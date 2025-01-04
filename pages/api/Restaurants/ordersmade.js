import dbConnect from "@/middleware/mongoose";
import Order from "@/models/Order";
import Listings from "@/models/foodlistingmodel";

export default async function handler(req, res) {
  await dbConnect();

  //   if (req.method !== "GET") {
  //     res.setHeader("Allow", ["GET"]);
  //     return res.status(405).end(`Method ${req.method} Not Allowed`);
  //   }

  const { userId } = req.query;

  // ✅ Validate userId
  if (!userId) {
    return res
      .status(400)
      .json({ message: "User ID is required in the query parameters" });
  }

  try {
    // ✅ Fetch all orders
    const orders = await Order.find({}).lean();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    // ✅ Filter orders by matching bakeryowner with userId
    const results = await Promise.all(
      orders.map(async (order) => {
        const filteredItems = await Promise.all(
          order.items.map(async (item) => {
            if (!item.itemId) return null;

            const listing = await Listings.findById(item.itemId).select(
              "bakeryowner"
            );

            if (listing.bakeryowner === userId) {
              return {
                itemId: item.itemId,
                bakeryowner: listing.bakeryowner,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
              };
            }
            return null; // Exclude items that don't match the bakeryowner
          })
        );

        const validItems = filteredItems.filter((item) => item !== null);

        if (validItems.length > 0) {
          return {
            orderId: order._id,
            userId: order.userId,
            items: validItems,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt,
          };
        }

        return null; // Exclude orders with no matching items
      })
    );

    const filteredOrders = results.filter((order) => order !== null);

    if (filteredOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this bakery owner" });
    }

    // ✅ Respond with filtered orders
    return res.status(200).json({
      success: true,
      message: `Fetched ${filteredOrders.length} orders for bakery owner ${userId}`,
      data: filteredOrders,
    });
  } catch (error) {
    console.error("Error filtering orders by bakery owner:", error);
    return res.status(500).json({ message: "Error filtering orders", error });
  }
}
