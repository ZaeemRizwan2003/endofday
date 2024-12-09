import dbConnect from "@/middleware/mongoose";
import RegisteredBakeries from "@/models/RBakerymodel";
import User from "@/models/CustomerUser";
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await dbConnect(); // Ensure database is connected

  try {
    // Get the userId directly from the token (assumed to be sent in the Authorization header)
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
      return res.status(401).json({ message: "Token Missing" });
    }

    // The token itself is the userId
    const userId = token;

    // Validate userId format (assuming it should be a 24-character string, like Mongo ObjectId)
    if (!userId || userId.length !== 24) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const bakeries = await RegisteredBakeries.findById(userId);
    if (!bakeries || bakeries.length === 0) {
      return res
        .status(404)
        .json({ reviews: [], message: "No reviews found for this user" });
    }

    const reviewsWithUserNames = await Promise.all(
      bakeries.reviews.map(async (review) => {
        const user = await User.findById(review.userId).select("name");
        return {
          ...review._doc,
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
