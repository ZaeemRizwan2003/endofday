import dbConnect from "@/middleware/mongoose";
import User from "@/models/CustomerUser";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "PUT") {
    const { userId, name, email } = req.body;

    try {
      // Validate input
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "userId is required.",
        });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one field (name or email) must be provided for update.",
        });
      }

      // Find the user and update details
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { name, email },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, message: "Customer not found." });
      }

      return res.status(200).json({
        success: true,
        message: "Customer updated successfully.",
        updatedUser,
      });
    } catch (error) {
      console.error("Error updating customer:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update customer.",
        error: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    return res
      .status(405)
      .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
