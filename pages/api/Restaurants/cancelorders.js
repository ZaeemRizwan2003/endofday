import nodemailer from "nodemailer";
import dbConnect from "@/middleware/mongoose";
import Order from "@/models/Order";
import User from "@/models/CustomerUser";
export default async function handler(req, res) {
  if (req.method === "POST") {
    await dbConnect();

    const { orderId, reason } = req.body; // Get data from request body

    // Validate input
    if (!orderId || !reason) {
      return res
        .status(400)
        .json({ error: "Order ID and reason are required." });
    }

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found." });
      }

      // Extract userId from the order
      const userId = order.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Get the email of the user
      const userEmail = user.email;

      // Set up the email transporter
      const transporter = nodemailer.createTransport({
        service: "gmail", // Use your preferred email service
        auth: {
          user: process.env.EMAIL_USER, // Add this in your .env file
          pass: process.env.EMAIL_PASS, // Add this in your .env file
        },
      });

      // Email content
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        // Replace with the user's email address
        subject: `Order Cancellation - Order ID: ${orderId}`,
        text: `Your order with ID ${orderId} has been cancelled.\nReason: ${reason}`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      // Update order status to "Cancelled"
      await Order.findByIdAndUpdate(orderId, { status: "Cancelled" });

      // Respond with success message
      res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email." });
    }
  } else {
    // Method not allowed
    res.status(405).json({ error: "Method not allowed." });
  }
}
