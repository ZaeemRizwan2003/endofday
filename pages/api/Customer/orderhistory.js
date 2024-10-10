import dbConnect from '@/middleware/mongoose';
import Order from '@/models/Order';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        const { userId } = req.query; // Get the user ID from the query
        try {
            const orders = await Order.find({ userId }); // Fetch all orders for the user
            if (orders.length === 0) {
                return res.status(404).json({ message: 'No orders found for this user' });
            }
            return res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching orders', error });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
