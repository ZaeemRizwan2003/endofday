// pages/api/getnotifications.js
import dbConnect from "@/middleware/mongoose";
import NotificationRequests from "@/models/NotificationModel"; // Import NotificationRequests model

export default async function handler(req, res) {
  const { id } = req.query; // Extract the bakeryOwnerId (or id) from the query parameter
  await dbConnect(); // Connect to the database

  if (req.method === "GET") {
    try {
      // Fetch notification requests where bakeryOwnerId matches the id passed in query parameter
      const notifications = await NotificationRequests.find({
        bakeryOwnerId: id,
      })
        .sort({ createdAt: -1 })
        .lean();

      if (notifications.length > 0) {
        return res.status(200).json({ notifications });
      } else {
        return res.status(404).json({ message: "No notifications found." });
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
