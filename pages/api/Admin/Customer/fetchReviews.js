import dbConnect from "@/middleware/mongoose";
import RegisteredBakeries from "@/models/RBakerymodel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { userId } = req.query;

    try {
      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
      }

      const reviews = await RegisteredBakeries.find({
        "reviews.userId": userId,
      }).select("restaurantName reviews");

      const userReviews = reviews.flatMap((bakery) =>
        bakery.reviews
          .filter((review) => review.userId.toString() === userId)
          .map((review) => ({
            bakeryName: bakery.restaurantName,
            rating: review.rating,
            review: review.review,
            createdAt: review.createdAt,
          }))
      );

      const totalReviews = userReviews.length;

      return res.status(200).json({
        success: true,
        reviews: userReviews,
        totalReviews,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch reviews" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
