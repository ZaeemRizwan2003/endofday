import dbConnect from '@/middleware/mongoose';
import RegisteredBakeries from '@/models/signupmodel';
import { verifyToken } from '@/middleware/auth';

export default async function handler(req, res) {
    await dbConnect();

    // Check if the request is a PUT request
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Verify the token and get user info
        const user = verifyToken(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Update user data
        const updatedUser = await RegisteredBakeries.findByIdAndUpdate(
            user.userId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the updated user data
        res.status(200).json({ user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
