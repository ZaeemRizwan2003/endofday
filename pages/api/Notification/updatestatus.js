// pages/api/notifications/updateStatus.js

import dbConnect from "@/middleware/mongoose";
import NotificationModel from "@/models/NotificationModel";
import User from "@/models/CustomerUser"; // Import User model
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "PUT") {
    const { id, status } = req.body;

    // Validate status input
    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    try {
      // Update the notification request
      const updatedNotification = await NotificationModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedNotification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      // Send emails to all users if status is approved
      if (status === "approved") {
        const users = await User.find({}, "email"); // Fetch all user emails
        const emails = users.map((user) => user.email);

        // Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
          service: "gmail", // Example: Gmail
          auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your email password or app password
          },
        });

        // Email content
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: emails.join(","), // Join all emails with commas
          subject: updatedNotification.title, // Fix template literal syntax
          text: updatedNotification.message, // Fix template literal syntax
        };

        // Send the email
        await transporter.sendMail(mailOptions);
      }

      return res.status(200).json({
        message: `Notification successfully ${status}`,
        notification: updatedNotification,
      });
    } catch (error) {
      console.error("Error updating notification status:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
