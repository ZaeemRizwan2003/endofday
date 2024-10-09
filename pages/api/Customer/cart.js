import dbConnect from "@/middleware/mongoose";
import User from "@/models/CustomerUser";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userId, cart } = req.body;

        try {
            await dbConnect();
            const user = await User.findById(userId);
            user.cart = cart;
            await user.save();
            res.status(200).json({ success: true, message: 'Cart synced successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error syncing cart' });
        }
    } else if (req.method === 'GET') {
        const { userId } = req.query;

        try {
            await dbConnect();
            const user = await User.findById(userId);
            res.status(200).json({ success: true, cart: user.cart });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error retrieving cart' });
        }
    }
}