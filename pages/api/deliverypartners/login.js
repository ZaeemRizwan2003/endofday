import dbConnect from "@/middleware/mongoose";
import DeliveryPartner from "@/models/DeliveryPartner";  // Assuming you have a model for DeliveryPartner
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";  // JWT for generating a token

export default async function handler(req, res) {
  if (req.method === "POST") {
    await dbConnect();  // Make sure to connect to the database

    const { mobile, password } = req.body;  // Assuming the login is based on mobile number and password

    try {
      // Find the delivery partner based on the mobile number
      const deliveryPartner = await DeliveryPartner.findOne({ contact: mobile });

      if (!deliveryPartner) {
        return res.status(404).json({ message: "Delivery partner not found" });
      }

      // Check if the password matches
      const isPasswordCorrect = await bcrypt.compare(password, deliveryPartner.password);

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate a JWT token for the authenticated rider
      const token = jwt.sign(
        { userId: deliveryPartner._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }  // The token expires in 1 hour
      );
      const userData = { ...deliveryPartner._doc };
      delete userData.password;
      // Return the response with the token and user details
      
      return res.status(200).json({ success:true,token, userData });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Handle invalid request methods
    res.status(405).json({ message: "Method not allowed" });
  }
}
