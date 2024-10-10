// pages/api/verify-otp.js
import dbConnect from '@/middleware/mongoose';
import RegisteredBakeries from '@/models/RBakerymodel';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, otp } = req.body;

        await dbConnect(); // Connect to your database

        // Check if the user exists
        const user = await RegisteredBakeries.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Logging OTP details for debugging
        console.log(`User OTP: ${user.resetOtp}, Entered OTP: ${otp}`);
        console.log(`OTP Expiry Time: ${user.otpExpiry}, Current Time: ${Date.now()}`);
        console.log(`User OTP: ${user.resetOtp} (Type: ${typeof user.resetOtp})`);
        console.log(`Entered OTP: ${otp} (Type: ${typeof otp})`);

        // Ensure OTP is a string comparison, and check expiration
        if (user.resetOtp !== otp || Date.now() > user.otpExpiry) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // OTP is valid, proceed to password reset
        return res.status(200).json({ message: 'OTP verified successfully, proceed to reset password' });
    } else {
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
