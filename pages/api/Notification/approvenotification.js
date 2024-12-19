import dbConnect from "@/middleware/mongoose";
import NotificationModel from "@/models/NotificationModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      // Fetch all notifications without filtering by status
      const notifications = await NotificationModel.find({}).lean();

      if (notifications.length === 0) {
        return res
          .status(404)
          .json({ message: "No notifications found", notifications: [] });
      }

      return res.status(200).json({ notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
