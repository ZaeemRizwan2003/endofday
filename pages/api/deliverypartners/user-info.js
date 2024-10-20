import dbConnect from '@/middleware/mongoose';
import { deliveryPartnersSchema } from '@/models/DeliveryPartner';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect(); 

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authorization.split(' ')[1]; 

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const partner = await deliveryPartnersSchema.findById(decoded.userId).select('-password'); // Exclude password
    if (!partner) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the delivery partner's data
    res.status(200).json({ user: partner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
