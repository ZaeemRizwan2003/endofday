import dbConnect from "@/middleware/mongoose";
import ReturnRequest from "@/models/ReturnRequestModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    orderId,
    userId,
    reason,
    details,
    images, // this is now a base64 string, not a file
    contactNumber
  } = req.body;

  if (!orderId || !userId || !reason || !contactNumber || !images) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newRequest = new ReturnRequest({
      orderId,
      userId,
      reason,
      details,
      images, // Store the base64 string directly in MongoDB
      contactNumber
    });

    await newRequest.save();
    return res.status(201).json({ message: "Return request submitted successfully" });
  } catch (error) {
    console.error("Error saving return request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
