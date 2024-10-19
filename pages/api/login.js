import dbConnect from "@/middleware/mongoose";
import bcrypt from "bcrypt";
import RegisteredBakeries from "@/models/RBakerymodel";
import User from '@/models/CustomerUser';
// import { deliveryPartnersSchema } from "../../../lib/deliverypartnersModel";

import jwt from "jsonwebtoken";
import cookie from 'cookie';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "POST") {
        const { email, password } = req.body; // No need for userType
        let user = null;
        let userType = null;

        try {
            // Search in RegisteredBakeries first
            user = await RegisteredBakeries.findOne({ email });
            if (user) {
                userType = "bakery";
            }

            // If not found, search in ListingUser
            if (!user) {
                user = await User.findOne({ email });
                if (user) {
                    userType = "listing";
                }
            }

            // If not found, search in DeliveryPartner
            // if (!user) {
            //     user = await DeliveryPartner.findOne({ email });
            //     if (user) {
            //         userType = "delivery";
            //     }
            // }

            // If user is still not found after all searches, return 404
            if (!user) {
                return res.status(404).json({ message: "User not found. Try Signing Up." });
            }

            // Verify password
            const correctPass = await bcrypt.compare(password, user.password);
            if (!correctPass) {
                return res.status(401).json({ message: "Invalid credentials. Try again." });
            }

            // Sign JWT token with user type
            const token = jwt.sign(
                { userId: user._id, userType }, // Include userType in the token
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Set cookies for auth token, userId, and userType
            res.setHeader(
                'Set-Cookie',
                [
                    cookie.serialize('authToken', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 3600,
                        sameSite: 'strict',
                        path: '/'
                    }),
                    cookie.serialize('userId', user._id.toString(), {
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 3600,
                        sameSite: 'strict',
                        path: '/'
                    }),
                    cookie.serialize('userType', userType, {  // Store user type in a cookie
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 3600,
                        sameSite: 'strict',
                        path: '/'
                    })
                ]
            );

            // Return token and userId in response
            res.status(200).json({ token, userId: user._id, userType });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
