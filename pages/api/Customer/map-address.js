import dbConnect from "@/middleware/mongoose";
import User from "@/models/CustomerUser";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();
  console.log("Received method:", method);

  if (method === "GET") {
    return res.status(200).json({
      message:
        "This endpoint is for POST requests only. Use POST to send data.",
    });
  } else if (method === "POST") {
    const { userId, location } = req.body;

    console.log("Received payload:", req.body);

    if (!userId || !location || !location.lat || !location.lng) {
      console.error("Invalid payload:", { userId, location });
      return res
        .status(400)
        .json({ success: false, message: "Invalid location" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        console.error("User not found:", userId);
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const extractAreaFromAddress = (addressLine) => {
        if (!addressLine) return "Unknown Area";
        const parts = addressLine.split(",");
        if (parts.length >= 3) {
          return parts[parts.length - 3].trim();
        }
        return "Unknown Area";
      };

      const newAddress = {
        addressLine: location.address,
        city: location.city || "Unknown",
        area: location.area || extractAreaFromAddress(location.address),
        postalCode: location.postalCode || "",
        lat: location.lat,
        lng: location.lng,
        isDefault: false,
      };

      console.log("Adding new address:", newAddress);

      const duplicate = user.addresses.some(
        (addr) => addr.lat === newAddress.lat && addr.lng === newAddress.lng
      );
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Address already exists in the user's address book.",
        });
      }

      user.addresses.push(newAddress);
      await user.save();

      const savedAddress = user.addresses[user.addresses.length - 1];

      res.status(200).json({ success: true, newAddress: savedAddress });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error saving address" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
