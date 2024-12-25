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

      const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ message: "Email must be a valid Gmail address." });
      }

      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long." });
      }

      if (password !== confirmpassword) {
        return res.status(400).json({ message: "Passwords don't match." });
      }

      const existingRestaurant = await RegisteredBakeries.findOne({ email });
      if (existingRestaurant) {
        return res
          .status(400)
          .json({ message: "Restaurant with this email already exists." });
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
        status: "pending",
        resetOtp: null,
        otpExpiry: null,
      });

      const savedBakery = await newBakery.save();
      console.log("Saved Bakery:", savedBakery);
      res.status(200).json({
        message: "Signup successful!",
        userId: savedBakery._id,
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
