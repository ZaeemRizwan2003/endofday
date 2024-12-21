import dbConnect from "@/middleware/mongoose";
import User from "@/models/CustomerUser";
import Listings from "@/models/foodlistingmodel";
export default async function handler(req, res) {
  await dbConnect(); // Ensure the database connection is established.

  if (req.method === "POST") {
    const { userId, cart } = req.body;

    // Validate input
    if (!userId || !Array.isArray(cart)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid input: userId must be provided, and cart must be an array.",
      });
    }

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      // Enrich cart with bakeryId using the listings collection

      const itemIds = cart.map((item) => item.itemId);
      const listings = await Listings.find({ _id: { $in: itemIds } });

      const enrichedCart = cart.map(async (item) => {
        const listing = listings.find(
          (listing) => listing._id.toString() === item.itemId
        );

        const bakeryId = listing?.bakeryowner || null; // Get the bakeryowner field

        // Debugging: Print the itemId and bakeryId to the console
        console.log(`Item ID: ${item.itemId}, Bakery ID: ${bakeryId}`);

        return {
          itemId: item.itemId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          bakeryId: listing?.bakeryowner, // Add bakeryId to the cart item
        };
      });

      // Save the enriched cart to the user
      user.cart = enrichedCart;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Cart synced successfully",
      });
    } catch (error) {
      console.error("Error syncing cart:", error);
      res.status(500).json({
        success: false,
        message: "Error syncing cart.",
        error: error.message,
      });
    }
  } else if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId query parameter is required.",
      });
    }

    try {
      const user = await User.findById(userId).select("cart");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      res.status(200).json({
        success: true,
        cart: user.cart || [],
      });
    } catch (error) {
      console.error("Error retrieving cart:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving cart.",
        error: error.message,
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: "Method not allowed.",
    });
  }
}
