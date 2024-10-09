import dbConnect from "@/middleware/mongoose";
import bcrypt from "bcrypt";
import RegisteredBakeries from "@/models/signupmodel";
import jwt from "jsonwebtoken";
import cookie from 'cookie';
export default async function handler(req, res) {
    await dbConnect()

    if (req.method === "POST") {
        const { email, password } = req.body
        try {
            const exist = await RegisteredBakeries.findOne({ email });
            if (!exist) {
                return res.status(404).json({ message: "User not found. Try Signing Up." });
            }
            const correctpass = await bcrypt.compare(password, exist.password);
            if (!correctpass) {
                return res.status(401).json({ message: "Invalide Credentials. Try Again." })
            }
            const token = jwt.sign(
                { userId: exist._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.setHeader(
                'Set-Cookie',
                [cookie.serialize('authToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 3600,
                    sameSite: 'strict',
                    path: '/'
                }),
                cookie.serialize('userId', exist._id.toString(), {
                    // httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 3600,
                    sameSite: 'strict',
                    path: '/'
                })

                ])
            res.status(200).json({ token, userId: exist._id });
        }
        catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal server error' });

        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}