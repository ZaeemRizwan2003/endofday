import dbConnect from "@/middleware/mongoose";
import RefundRequest from "@/models/ReturnRequestModel";
import User from "@/models/CustomerUser";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { requestId, status, refundAmount } = req.body;

  if (!requestId || !["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    await dbConnect();

    // Fetch refund request
    const request = await RefundRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Refund request not found" });
    }

    // Fetch user by userId from the refund request
    const user = await User.findById(request.userId);
    if (!user || !user.email) {
      return res.status(404).json({ message: "User not found or missing email" });
    }

    // Update refund request status
    request.status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    await request.save();

    // If approved, update user's loyaltyPoints
    if (status === "approved" && refundAmount) {
      const pointsToAdd = parseFloat(refundAmount);
      if (isNaN(pointsToAdd) || pointsToAdd < 0) {
        return res.status(400).json({ message: "Invalid refund amount" });
      }

      // Initialize loyaltyPoints if not already set
      if (!user.loyaltyPoints) {
        user.loyaltyPoints = 0;
      }

      user.loyaltyPoints += pointsToAdd;
      await user.save();
    }

    // Send email via nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"End of Day" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Refund Request ${status === "approved" ? "Approved" : "Rejected"}`,
      html: `
        <p>Dear ${user.name || "Customer"},</p>
        <p>Your refund request for order <strong>${request.orderId}</strong> has been <strong style="color:${status === "approved" ? "green" : "red"}">${status}</strong>.</p>
        ${
          status === "approved" && refundAmount
            ? `<p>We've credited <strong>${refundAmount} loyalty points</strong> to your account.</p>`
            : ""
        }
        <p>Thank you for your continued trust in us.</p>
        <p>Sincerely,<br/>End of Day Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: `Request ${status}` });
  } catch (error) {
    console.error("Error processing refund request:", error);
    res.status(500).json({ message: "Server error" });
  }
}
