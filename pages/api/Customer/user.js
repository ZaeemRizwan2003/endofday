import dbConnect from "@/lib/dbconnect";
import User from "@/models/CustomerUser";

export default async function handler(req, res) {
    await dbConnect();
    const { userId } = req.query;

    try {
        const user = await User.findById(userId).select('name email');
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'error fetching user details' });
    }
}