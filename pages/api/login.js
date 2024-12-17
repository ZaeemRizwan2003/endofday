import dbConnect from "@/middleware/mongoose";
import bcrypt from "bcryptjs";
import RegisteredBakeries from "@/models/RBakerymodel";
import User from "@/models/CustomerUser";
import DeliveryPartner from "@/models/DeliveryPartner";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { identifier, password } = req.body;

    try {
      let user = null;
      let userType = null;
      let cart = [];

      // Determine if identifier is email or phone number
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

      if (isEmail) {
        // Check both RegisteredBakeries and Users collections
        const [bakeryUser, listingUser] = await Promise.all([
          RegisteredBakeries.findOne({ email: identifier }),
          User.findOne({ email: identifier }),
        ]);

        user = bakeryUser || listingUser;
        userType = bakeryUser ? "bakery" : "listing";

        if (userType === "listing" && listingUser) {
          cart = listingUser.cart || [];
        }
      } else {
        // Check DeliveryPartner collection by phone number
        const deliveryUser = await DeliveryPartner.findOne({
          contact: identifier,
        });

        if (!deliveryUser) {
          return res
            .status(404)
            .json({ message: "Delivery partner not found" });
        }

        user = deliveryUser;
        userType = "delivery";
      }

      // If no user found in any collection
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

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, userType },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Exclude password from user data response
      const userData = { ...user._doc };
      delete userData.password;

      // Set cookies for the client
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
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600,
          sameSite: "strict",
          path: "/",
        }),
      ]);

      // Return successful response
      return res.status(200).json({
        success: true,
        token,
        userId: user._id,
        userType,
        userData,
        cart,
      });
    } catch (error) {
      console.error("Login error: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
