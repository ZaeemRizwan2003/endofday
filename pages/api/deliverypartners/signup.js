import dbConnect from "@/middleware/mongoose";
import DeliveryPartner from "@/models/DeliveryPartner";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === "POST") {
    try {
      const { name, contact, password, confirmPassword, area, city } = req.body;

      // Validate required fields
      if (!name || !contact || !password || !area || !city|| !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords don't match." });
      }

      // Check if contact number already exists
      const existingPartner = await DeliveryPartner.findOne({ contact });
      if (existingPartner) {
        return res.status(400).json({ message: "Contact number already exists." });
      }

      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new delivery partner instance
      const newDeliveryPartner = new DeliveryPartner({
        name,
        contact,
        area,
        city,
        password: hashedPassword,
      });

      // Save the new delivery partner to the database
      await newDeliveryPartner.save();

      res.status(200).json({ message: "Signup successful!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error. Please try again." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}


// import dbConnect from "@/middleware/mongoose";
// import DeliveryPartner from "@/models/DeliveryPartner";
// import bcrypt from "bcrypt";

// export default async function handler(req, res) {
//     const { method } = req;

//     await dbConnect();

//     if (method === 'POST') {
//         try {
//             const {
//                 name,
//                 contact,
//                 password,
//                 confirmPassword,
//                 area,
//             } = req.body;

//             // Validate required fields
//             if (!name || !contact || !password || !area  || !confirmPassword) {
//                 return res.status(400).json({ message: 'All fields are required.' });
//             }

//             // Check if passwords match
//             if (password !== confirmPassword) {
//                 return res.status(400).json({ message: "Passwords don't match." });
//             }
//             const existingPartner = await DeliveryPartner.findOne({ contact });
//             if (existingPartner) {
//                 return res.status(400).json({ message: "Contact number already exists." });
//             }

//             const salt = await bcrypt.genSalt(10)
//             const hashedPassword = await bcrypt.hash(password, salt)

//             // Create a new delivery partner instance
//             const newDeliveryPartner = new deli({
//                 name,
//                 contact,
//                 area,
//                 password: hashedPassword,
//                 // Add other fields as needed
//             });

//             // Save to database
//             await newDeliveryPartner.save();

//             res.status(200).json({ message: 'Signup successful!' });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ message: 'Server error. Please try again.' });
//         }
//     } else {
//         res.setHeader('Allow', ['POST']);
//         res.status(405).end(`Method ${method} Not Allowed`);
//     }
// }