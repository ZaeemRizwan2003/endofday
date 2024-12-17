import dbConnect from "@/middleware/mongoose";
import User from "@/models/CustomerUser";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "DELETE") {
    const { userId } = req.query;

    try {
      const result = await User.findByIdAndDelete(userId);

      if (!result) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }

      return res.status(200).json({ success: true, message: "Customer deleted successfully" });
    } catch (error) {
      console.error("Error deleting customer:", error);
      return res.status(500).json({ success: false, message: "Failed to delete customer" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
