import dbConnect from "@/middleware/mongoose";
import RegisteredBakeries from "@/models/RBakerymodel";
import User from "@/models/CustomerUser";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await dbConnect(); // Ensure database is connected

  const { restaurantId } = req.query;

  try {
    // Validate restaurantId
    if (!restaurantId || restaurantId.length !== 24) {
      return res.status(400).json({ message: "Invalid Restaurant ID" });
    }

    // Find the bakery
    const bakery = await RegisteredBakeries.findById(restaurantId);

    if (!bakery || !bakery.reviews) {
      return res
        .status(404)
        .json({ reviews: [], message: "Bakery not found or no reviews" });
    }

    // Map through reviews and fetch user names
    const reviewsWithUserNames = await Promise.all(
      bakery.reviews.map(async (review) => {
        const user = await User.findById(review.userId).select("name");
        return {
          ...review._doc, // Include original review fields
          userName: user ? user.name : "Anonymous",
        };
      })
    );

    res.status(200).json({ reviews: reviewsWithUserNames });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
