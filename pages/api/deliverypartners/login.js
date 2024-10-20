import dbConnect from "@/middleware/mongoose";
import { deliveryPartnersSchema } from "@/models/DeliveryPartner";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const payload = req.body;
      await dbConnect();

      const { mobile, password } = payload;

      const result = await deliveryPartnersSchema.findOne({ contact: mobile });
      let success = false;

      if (result) {
        const isMatch = await bcrypt.compare(password, result.password); // Compare hashed password
        if (isMatch) {
          success = true;
          const { password, ...userData } = result._doc;
          return res.status(200).json({ result: userData, success });
        }
        return res.status(401).json({
          success: false,
          message: "Invalid mobile number or password.",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Mobile number not found.",
        });
      }
    } 
    catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  } 
  else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
