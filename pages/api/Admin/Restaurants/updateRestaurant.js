import dbConnect from "@/middleware/mongoose";
import RegisteredBakeries from "@/models/RBakerymodel";
export default async function handler(req, res) {
  await dbConnect(); // Connect to database

  const { id } = req.query; // Get ID from query params

  if (req.method === "PUT") {
    try {
      // Update restaurant data
      const updatedRestaurant = await RegisteredBakeries.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!updatedRestaurant) {
        return res
          .status(404)
          .json({ success: false, message: "Restaurant not found" });
      }

      res.status(200).json(updatedRestaurant); // Return updated details
    } catch (error) {
      console.error("Error updating restaurant:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res
      .status(405)
      .json({ success: false, message: `Method ${req.method} not allowed` });
  }
}
