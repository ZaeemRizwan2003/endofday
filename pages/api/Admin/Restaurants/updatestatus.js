import dbConnect from "@/middleware/mongoose";
import nodemailer from "nodemailer";
import RegisteredBakeries from "@/models/RBakerymodel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "PUT") {
    const { id, status } = req.body;
    console.log("Status:", status);
    console.log("ID:", id);

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    try {
      const bakery = await RegisteredBakeries.findById(id);

      if (!bakery) {
        return res.status(404).json({ message: "Bakery not found" });
      }

      const reciever = bakery.email;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        logger: true,
        debug: true,
      });

      // ✅ **Handle Rejected Status**
      if (status === "rejected") {
        try {
          console.log("Bakery listing deleted successfully.");

          const rejectionMailOptions = {
            from: process.env.EMAIL_USER,
            to: reciever,
            subject: `Your Request for Creating an Account on END OF DAY has been Rejected`,
            text: `Dear Bakery Owner,\n\nYour request for creating an account has been rejected.\n\nBest regards,\nThe END OF DAY Team`,
          };

          await transporter.sendMail(rejectionMailOptions);
          console.log("Rejection email sent successfully to", reciever);
          await RegisteredBakeries.findByIdAndDelete(id);
          return res.status(200).json({
            message: `Bakery listing deleted and notification sent to ${reciever}`,
          });
        } catch (error) {
          console.error(
            "Failed to delete bakery or send rejection email:",
            error
          );
          return res.status(500).json({
            message: "Failed to delete bakery or send rejection email",
          });
        }
      }

      // ✅ **Handle Approved Status**
      if (status === "approved") {
        try {
          const updatedBakery = await RegisteredBakeries.findByIdAndUpdate(
            id,
            { status },
            { new: true }
          );

          const approvalMailOptions = {
            from: process.env.EMAIL_USER,
            to: reciever,
            subject: `Your Request for Creating an Account on END OF DAY has been Approved`,
            text: `Dear Bakery Owner,\n\nYour request for creating an account has been approved.\nYou can log in to your account via http://localhost:3000/Login.\n\nBest regards,\nThe END OF DAY Team`,
          };

          await transporter.sendMail(approvalMailOptions);
          console.log("Approval email sent successfully to", reciever);

          return res.status(200).json({
            message: `Status successfully updated to ${status} and notification sent to ${reciever}`,
            notification: updatedBakery,
          });
        } catch (error) {
          console.error(
            "Failed to update status or send approval email:",
            error
          );
          return res.status(500).json({
            message: "Failed to update status or send approval email",
          });
        }
      }

      // ✅ **Handle Pending Status**
      return res.status(200).json({
        message: `Status successfully updated to ${status}`,
        notification: bakery,
      });
    } catch (error) {
      console.error("Error processing request:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
