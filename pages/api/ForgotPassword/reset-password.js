// pages/api/reset-password.js
import bcrypt from 'bcrypt';
import dbConnect from '@/middleware/mongoose';
import RegisteredBakeries from '@/models/RBakerymodel';
import User from '@/models/CustomerUser';
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, newPassword } = req.body;

        await dbConnect();

        // Check if user exists
        const user = await RegisteredBakeries.findOne({ email });
        const customer = await User.findOne({ email });
        if (!user && !customer) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and clear OTP
        if (user) {
            user.password = hashedPassword;
            user.resetOtp = undefined;
            user.otpExpiry = undefined;
            await user.save();
            res.status(200).json({ message: 'Password reset successfully' });
        }

        if (customer) {
            customer.password = hashedPassword;
            customer.resetOtp = undefined;
            customer.otpExpiry = undefined;
            await customer.save();
            res.status(200).json({ message: 'Password reset successfully' });
        }

    } else {
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
