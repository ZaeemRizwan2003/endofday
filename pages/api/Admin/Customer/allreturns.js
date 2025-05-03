import dbConnect from "@/middleware/mongoose";
import RefundRequest from "@/models/ReturnRequestModel";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    // Populate orderId to access totalAmount from the Order model
    const requests = await RefundRequest.find({ status: "Pending" })
      .sort({ createdAt: -1 })
      .populate({
        path: "orderId",
        select: "totalAmount", // Make sure this field exists in Order model
      });

    // Format response to include totalAmount directly
    const formatted = requests.map((req) => ({
      _id: req._id,
      orderId: req.orderId._id,
      userId: req.userId,
      reason: req.reason,
      details: req.details,
      images: req.images,
      status: req.status,
      contactNumber: req.contactNumber,
      createdAt: req.createdAt,
      totalAmount: req.orderId?.totalAmount || 0,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching refund requests:", error);
    res.status(500).json({ message: "Server error" });
  }
}
