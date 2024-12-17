import dbConnect from "@/middleware/mongoose";
import NotificationRequest from "@/models/NotificationModel";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Authorization token missing" });
      }

      // Verify and extract userId
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const bakeryOwnerId = decoded.userId;

      const { title, message } = req.body;

      if (!title || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const newRequest = await NotificationRequest.create({
        bakeryOwnerId,
        title,
        message,
      });

      res
        .status(201)
        .json({ message: "Notification request created", newRequest });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
