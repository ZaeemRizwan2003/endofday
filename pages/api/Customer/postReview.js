import dbConnect from "@/middleware/mongoose";
import RegisteredBakeries from "@/models/RBakerymodel";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { bakeryId, userId, rating, review } = req.body;

    if (!bakeryId || !userId || !rating || !review) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "Rating must be a number between 1 and 5." });
    }

    try {
      await dbConnect(); // Connect to the database

      // Update the bakery's reviews field by adding the new review
      const updatedBakery = await RegisteredBakeries.findByIdAndUpdate(
        bakeryId,
        {
          $push: {
            reviews: {
              userId,
              rating,
              review,
              createdAt: new Date(),
            },
          },
        },
        { new: true } // Return the updated document
      );

      if (!updatedBakery) {
        return res.status(404).json({ error: "Bakery not found." });
      }

      return res
        .status(200)
        .json({ message: "Review added successfully", updatedBakery });
    } catch (error) {
      console.error("Error saving review:", error);
      return res.status(500).json({ error: "An error occurred." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
