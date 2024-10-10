import dbConnect from '@/middleware/mongoose';
import User from '@/models/CustomerUser';

export default async function handler(req, res) {
    await dbConnect();

    // Handle GET request
    if (req.method === 'GET') {
        const { userId } = req.query;

        try {
            const user = await User.findById(userId).select('cart addresses name email');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({
                cart: user.cart,
                addresses: user.addresses,
                userInfo: {
                    name: user.name,
                    email: user.email,
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    // Handle POST request
    if (req.method === 'POST') {
        const { userId, cart } = req.body;

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.cart = cart;
            await user.save();

            return res.status(200).json({ success: true, message: 'Cart synced successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error syncing cart' });
        }
    }

    // Method Not Allowed
    return res.status(405).json({ message: 'Method not allowed' });
}
