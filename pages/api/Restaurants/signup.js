
import dbConnect from "@/middleware/mongoose";
import bcrypt from "bcrypt";
import RegisteredBakeries from "@/models/RBakerymodel";
export default async function handler(req, res) {
    if (req.method === "POST") {
        const { restrauntName, email, password, confirmpassword, address, number } = req.body
        console.log(req.body)
        await dbConnect()

        const exist = await RegisteredBakeries.findOne({ email });
        if (exist) {
            res.status(422).json({ message: 'User already exists.' });
        }

        if (password !== confirmpassword) {
            res.status(422).json({ message: 'Password and Confirm password do not match' });
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const u = new RegisteredBakeries({
            restrauntName,
            email,
            password: hashedPassword,
            address,
            number
        });

        await u.save();
        res.status(200).json({ message: 'Signed up successfully.' })
    } else {
        return res.status(400).json({
            error: 'this method is not allowed'
        });
    }
}















//         await connectDb();
//         const { name, email, password, address, number } = req.body;

//         if (!name || !email || !password || !address || !number) {
//             return res.status(400).json({ message: 'All fields are required.' });
//         }
//         try {
//             const newSignup = new signupSchema({
//                 restrauntName: name,
//                 email,
//                 password,
//                 address,
//                 number,
//             });
//             await newSignup.save();
//             console.log(newSignup);
//             return res.status(200).json({ message: 'Signed up successfully.' });
//         }
//         catch (error) {
//             return res.status(500).json({ message: error.message });
//         }
//     }
//     else {
//         return res.status(405
//         ).json({ message: 'Method not allowed' });

//     }
// }
