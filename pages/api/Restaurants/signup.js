import RegisteredBakeries from "@/models/RBakerymodel";
import dbConnect from "@/middleware/mongoose";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === "POST") {
    try {
      const {
        restaurantName,
        email,
        password,
        confirmpassword,
        address,
        number,
        option,
        image,
        contentType,
      } = req.body;

      if (
        !restaurantName ||
        !email ||
        !password ||
        !confirmpassword ||
        !address ||
        !number ||
        !option ||
        !image ||
        !contentType
      ) {
        return res.status(400).json({ message: "All fields are required." });
      }

      if (password !== confirmpassword) {
        return res.status(400).json({ message: "Passwords don't match." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newBakery = new RegisteredBakeries({
        restaurantName,
        email,
        password: hashedPassword,
        address,
        number,
        option: option === "both" ? ["pickup", "delivery"] : [option],
        image,
        imageContentType: contentType,
        status: "pending", // Add pending status for approval
        resetOtp: null,
        otpExpiry: null,
      });

      const savedBakery = await newBakery.save();
      console.log("Saved Bakery:", savedBakery);
      res.status(200).json({
        message: "Signup successful!",
        userId: savedBakery._id, // Return user ID for Stripe processing
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error. Please try again." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
