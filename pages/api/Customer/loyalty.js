import dbConnect from "@/middleware/mongoose";
import User from "@/models/CustomerUser";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { userId } = req.query;
      const user = await User.findById(userId).select("loyaltyPoints");

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.status(200).json({ success: true, loyaltyPoints: user.loyaltyPoints ||0});
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to fetch loyalty points" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
