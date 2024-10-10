import RegisteredBakeries from '@/models/RBakerymodel';
import dbConnect from '@/middleware/mongoose';
import bcrypt from "bcrypt";
export default async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    if (method === 'POST') {
        try {
            const {
                restaurantName,
                email,
                password,
                confirmpassword,
                address,
                number,
                option,
                image,        // Base64 string
                contentType,  // MIME type
            } = req.body;

            // Validate required fields
            if (!restaurantName || !email || !password || !confirmpassword || !address || !number || !option || !image || !contentType) {
                return res.status(400).json({ message: 'All fields are required.' });
            }

            // Check if passwords match
            if (password !== confirmpassword) {
                return res.status(400).json({ message: "Passwords don't match." });
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            // Convert Base64 string to Buffer
            // const imageBuffer = Buffer.from(image, 'base64');

            // Create a new bakery instance
            const newBakery = new RegisteredBakeries({
                restaurantName,
                email,
                password: hashedPassword,
                address,
                number,
                option: option === 'both' ? ['pickup', 'delivery'] : [option,],
                image,
                imageContentType: contentType,
                resetOtp: null,
                otpExpiry: null,
            });

            // Save to database
            await newBakery.save();

            res.status(200).json({ message: 'Signup successful!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error. Please try again.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
