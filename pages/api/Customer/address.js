import dbConnect from "@/middleware/mongoose";
import User from "@/models/CustomerUser";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === "GET") {
    const { userId } = req.query;
    try {
      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "user not found" });
      }

      return res.status(200).json({ success: true, addresses: user.addresses });

    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Error retrieving addresses" });
    }

  } else if (method === "POST") {
    const { userId, newAddress } = req.body;

    if (!newAddress || !newAddress.addressLine || !newAddress.city) {
      return res.status(400).json({ success: false, message: "Missing address fields" });
    }
    try {
      console.log(userId);
      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "user not found" });
      }

      user.addresses.push({
        addressLine: newAddress.addressLine,
        area: newAddress.area,
        city: newAddress.city,
        postalCode: newAddress.postalCode
      }); //add new address

      await user.save();

      const addedAddress = user.addresses[user.addresses.length - 1];

      return res
        .status(200)
        .json({ success: true, message: "Address added successfully", newAddress: addedAddress });

    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Error adding address" });
    }

  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
