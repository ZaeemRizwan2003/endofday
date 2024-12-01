import nodemailer from "nodemailer";
import dbConnect from "@/middleware/mongoose";
import RegisteredBakeries from "@/models/RBakerymodel";
import User from "@/models/CustomerUser";
import crypto from "crypto"; // for OTP generation

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    try {
      await dbConnect(); // Connect to the database
    } catch (error) {
      console.error("Database connection error:", error);
      return res.status(500).json({ message: "Database connection failed" });
    }

    try {
      // Fetch user and customer in parallel
      const [user, customer] = await Promise.all([
        RegisteredBakeries.findOne({ email }),
        User.findOne({ email }),
      ]);

      if (!user && !customer) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate OTP and expiry
      const otp = crypto.randomInt(100000, 999999).toString().padStart(6, "0");
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      console.log("Generated OTP:", otp);

      // Save OTP to the database in parallel
      const saveOperations = [];
      if (user) {
        user.resetOtp = otp;
        user.otpExpiry = otpExpiry;
        saveOperations.push(user.save());
      }
      if (customer) {
        customer.resetOtp = otp;
        customer.otpExpiry = otpExpiry;
        saveOperations.push(customer.save());
      }

      await Promise.all(saveOperations); // Save OTPs in parallel
      console.log("OTP saved for:", email);

      // Send OTP via email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for Password Reset",
        text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
      };

      await transporter.sendMail(mailOptions); // Send email
      console.log("OTP email sent to:", email);
      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
