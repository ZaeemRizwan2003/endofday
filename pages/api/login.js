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
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

      if (isEmail) {
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
        user = await DeliveryPartner.findOne({ contact: identifier });
        userType = user ? "delivery" : null;
      }

      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found. Try Signing Up." });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res
          .status(401)
          .json({ message: "Invalid credentials. Try again." });
      }

      const token = jwt.sign(
        { userId: user._id, userType },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const userData = { ...user._doc };
      delete userData.password;

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
