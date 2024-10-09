import dbConnect from '@/middleware/mongoose';
import User from '@/models/CustomerUser';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect(); // Ensure the database is connected

  // Check if the request is a GET request
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Extract the token from the Authorization header
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authorization.split(' ')[1]; // Format: "Bearer <token>"

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    // Find the user by their ID from the token
    const user = await User.findById(decoded.userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user data
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
