import dbConnect from "@/middleware/mongoose";
import RegisteredBakeries from "@/models/RBakerymodel";
import User from "@/models/CustomerUser";

export default async function handler(req, res) {
  await dbConnect();
  const { id, userId } = req.query;

  try {
    // Fetch the restaurant details
    const restaurant = await RegisteredBakeries.findById(id).populate("menu");
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Fetch user's cart to adjust stock dynamically
    const user = await User.findById(userId).select("cart");
    const cartItems = user?.cart || [];

    // Update remaining stock dynamically based on user's cart
    const menuWithUpdatedStock = restaurant.menu.map((item) => {
      const cartItem = cartItems.find(
        (cart) => cart.itemId === item._id.toString()
      );
      const cartQuantity = cartItem ? cartItem.quantity : 0;
      const updatedRemainingItem = item.remainingitem - cartQuantity;

      return {
        ...item._doc,
        remainingitem: Math.max(updatedRemainingItem, 0),
        imageUrl: `data:${
          item.image.contentType
        };base64,${item.image.data.toString("base64")}`,
      };
    });

    res.status(200).json({
      ...restaurant._doc,
      menu: menuWithUpdatedStock,
    });
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    res.status(500).json({ message: "Failed to fetch restaurant details" });
  }
}
