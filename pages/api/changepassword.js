// /pages/api/change-password.js

import dbConnect from "@/middleware/mongoose";
import bcrypt from "bcrypt";
import RegisteredBakeries from "@/models/signupmodel";
import jwt from "jsonwebtoken";
import cookie from 'cookie';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "POST") {
        try {
            // Parse cookies from the request headers
            const cookies = cookie.parse(req.headers.cookie || '');
            const token = cookies.authToken;

            console.log("Received token:", token); // Debugging

            if (!token) {
                console.warn("No authToken provided.");
                return res.status(401).json({ message: "Unauthorized. No token provided." });
            }

            // Verify JWT token
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (jwtError) {
                console.error("JWT verification failed:", jwtError);
                return res.status(401).json({ message: "Invalid token." });
            }

            const userId = decoded.userId;
            console.log("Decoded userId:", userId); // Debugging

            // Retrieve user from the database
            const user = await RegisteredBakeries.findById(userId);
            if (!user) {
                console.warn(`User with ID ${userId} not found.`);
                return res.status(404).json({ message: "User not found." });
            }

            const { currentPassword, newPassword, confirmNewPassword } = req.body;

            console.log("Received data:", { currentPassword, newPassword, confirmNewPassword }); // Debugging

            // Check if new passwords match
            if (newPassword !== confirmNewPassword) {
                console.warn("New passwords do not match.");
                return res.status(400).json({ message: "New passwords do not match." });
            }

            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                console.warn("Current password is incorrect.");
                return res.status(401).json({ message: "Current password is incorrect." });
            }

            // Hash the new password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            // Update the user's password in the database
            user.password = hashedPassword;
            await user.save();

            console.log("Password updated successfully for user ID:", userId);

            res.status(200).json({ message: "Password updated successfully." });
        } catch (error) {
            console.error("Internal server error:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    } else {
        res.status(405).json({ message: "Method not allowed." });
    }
}
