import dbConnect from "@/middleware/mongoose";
import NotificationRequest from "@/models/NotificationModel";
import RegisteredBakeries from "@/models/RBakerymodel";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      // Step 1: Extract userId from headers
      const userId = req.headers.userid;

      if (!userId) {
        return res.status(401).json({ error: "User ID is missing" });
      }

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid User ID format" });
      }

      // Step 2: Validate request body
      const { title, message } = req.body;
      if (!title || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Step 3: Fetch the bakery name using userId
      const bakery = await RegisteredBakeries.findById(userId);

      if (!bakery) {
        return res
          .status(404)
          .json({ error: "Bakery not found for the provided user ID" });
      }

      // Step 4: Create the notification request with bakeryOwnerName
      const newRequest = await NotificationRequest.create({
        bakeryOwnerId: userId,
        bakeryOwnerName: bakery.restaurantName, // Store bakery name
        title,
        message,
      });

      res
        .status(201)
        .json({
          message: "Notification request created successfully",
          newRequest,
        });
    } catch (error) {
      console.error("Error creating notification request:", error);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
