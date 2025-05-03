import dbConnect from "@/middleware/mongoose";
import User from "@/models/CustomerUser";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { receiveNotifications } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { receiveNotifications },
      { new: true }
    ).select("-password");

    res.status(200).json({ user });
  } catch (error) {
    console.error("Update notification error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
