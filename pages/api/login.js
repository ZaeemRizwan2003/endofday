import dbConnect from "@/middleware/mongoose";
import bcrypt from "bcrypt";
import RegisteredBakeries from "@/models/RBakerymodel";
import User from "@/models/CustomerUser";
import DeliveryPartner from "@/models/DeliveryPartner";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      // Execute all searches in parallel
      //   , deliveryUser
      const [bakeryUser, listingUser] = await Promise.all([
        RegisteredBakeries.findOne({ email }),
        User.findOne({ email }),
        DeliveryPartner.findOne({ email }),
        // DeliveryPartner.findOne({ email }),
      ]);

      // Determine which user was found and set the user type
      let user = bakeryUser || listingUser || deliveryUser;
      //   || deliveryUser;
      let userType = null;

      if (bakeryUser) {
        userType = "bakery";
      } else if (listingUser) {
        userType = "listing";
      } else if (deliveryUser) {
        userType = "delivery";
      }

      // If no user is found, return 404
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found. Try Signing Up." });
      }

      // Verify password
      const correctPass = await bcrypt.compare(password, user.password);
      if (!correctPass) {
        return res
          .status(401)
          .json({ message: "Invalid credentials. Try again." });
      }

      // Sign JWT token with user type
      const token = jwt.sign(
        { userId: user._id, userType }, // Include userType in the token
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Set cookies for auth token, userId, and userType
      res.setHeader("Set-Cookie", [
        cookie.serialize("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600,
          sameSite: "strict",
          path: "/",
        }),
        cookie.serialize("userId", user._id.toString(), {
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600,
          sameSite: "strict",
          path: "/",
        }),
        cookie.serialize("userType", userType, {
          // Store user type in a cookie
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600,
          sameSite: "strict",
          path: "/",
        }),
      ]);

      // Return token and userId in response
      res.status(200).json({ token, userId: user._id, userType });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
