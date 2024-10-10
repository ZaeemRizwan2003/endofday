import dbConnect from '@/lib/dbconnect';
import Order from '@/models/Order';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
    await dbConnect();

    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'POST') {
        const { items, totalAmount, address } = req.body;

        const newOrder = new Order({
            userId: session.user.id,
            items,
            totalAmount,
            address,
        });

        try {
            const savedOrder = await newOrder.save();
            res.status(201).json(savedOrder);
        } catch (error) {
            res.status(500).json({ message: 'Error creating order', error });
        }
    } else if (req.method === 'GET') {
        try {
            const orders = await Order.find({ userId: session.user.id });
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching orders', error });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
