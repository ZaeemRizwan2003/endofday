import dbConnect from "@/middleware/mongoose";
import NotificationModel from "@/models/NotificationModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      // Extract 'status' query parameter, default to 'pending'
      const { status = "pending" } = req.query;

      // Validate the status
      const validStatuses = ["pending", "approved", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status provided" });
      }

      // Fetch notifications based on the given status
      const notifications = await NotificationModel.find({ status }).lean();

      return res.status(200).json({ notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
