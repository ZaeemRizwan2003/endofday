// pages/api/forgot-password.js
import nodemailer from 'nodemailer';
import dbConnect from '@/middleware/mongoose';
import RegisteredBakeries from '@/models/RBakerymodel';
import crypto from 'crypto'; // for OTP generation

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email } = req.body;

        await dbConnect(); // Connect to your database

        // Check if user exists
        const user = await RegisteredBakeries.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString().padStart(6, '0');

        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        // Store the OTP in the user's record (temporary) with an expiry of 10 minutes
        user.resetOtp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        // Create a transporter for sending emails
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Password Reset',
            text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'OTP sent to your email' });
        } catch (error) {
            res.status(500).json({ message: 'Error sending email', error });
        }
    } else {
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
