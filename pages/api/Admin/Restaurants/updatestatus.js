import dbConnect from "@/middleware/mongoose";
import nodemailer from "nodemailer";
import RegisteredBakeries from "@/models/RBakerymodel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "PUT") {
    const { id, status } = req.body;
    console.log(status);
    console.log(id);

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    try {
      const updateBakery = await RegisteredBakeries.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updateBakery) {
        return res.status(404).json({ message: "Bakery not found" });
      }

      const reciever = updateBakery.email;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      if (status === "approved") {
        const heheMailOptions = {
          from: process.env.EMAIL_USER,
          to: reciever,
          subject: `${
            status.charAt(0).toUpperCase() + status.slice(1)
          } your Request for Creating an Account on END OF DAY`,
          text: `Dear Bakery Owner,\n\nYour request for creating an account has been ${status}. You can log in to your account via http://localhost:3000/Login.\n\nBest regards,\nThe END OF DAY Team`,
        };

        await transporter.sendMail(heheMailOptions);

        return res.status(200).json({
          message: `Notification successfully sent: ${status}`,
          notification: updateBakery,
        });
      } else {
        return res.status(200).json({
          message: `Status successfully updated to ${status}`,
          notification: updateBakery,
        });
      }
    } catch (error) {
      console.error("Error fetching bakeries:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
