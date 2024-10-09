import dbConnect from '../../lib/dbconnect';
import User from '../../models/CustomerUser';

export default async function handler(req, res) {
  const { userId } = req.query;

  await dbConnect();

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
