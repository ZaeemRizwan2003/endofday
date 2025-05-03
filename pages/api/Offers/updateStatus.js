import dbConnect from "@/middleware/mongoose";
import OfferSchema from "@/models/OffersModel"; // your Offer model
import RegisteredBakeries from "@/models/RBakerymodel";
import CustomerUser from "@/models/CustomerUser";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "PATCH") {
    const { id, status, reason } = req.body;

    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    try {
      let updatedOffer = await OfferSchema.findById(id);

      if (!updatedOffer) {
        return res.status(404).json({ message: "Offer not found" });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      if (status === "approved") {
        // Update offer to approved
        updatedOffer = await OfferSchema.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );

        // Send notification to customers
        const users = await CustomerUser.find({ receiveNotifications: true }, "email");
        const emails = users.map((user) => user.email);

        const userMailOptions = {
          from: process.env.EMAIL_USER,
          to: emails.join(","),
          subject: updatedOffer.title,
          text: `
            ${updatedOffer.message}

            Offer Start Date: ${new Date(updatedOffer.startDate).toLocaleDateString("en-GB")}
            Offer End Date: ${new Date(updatedOffer.endDate).toLocaleDateString("en-GB")}
          `,
        };

        await transporter.sendMail(userMailOptions);

        // Send notification to bakery owner about approval
        const bakeryOwner = await RegisteredBakeries.findById(updatedOffer.createdBy);

        if (bakeryOwner && bakeryOwner.email) {
          const bakeryOwnerMailOptions = {
            from: process.env.EMAIL_USER,
            to: bakeryOwner.email,
            subject: `Your Offer "${updatedOffer.title}" Was Approved`,
            text: `
              Dear Bakery Owner,

              Congratulations! Your offer "${updatedOffer.title}" has been approved.

              Details: ${updatedOffer.message}

              Offer Start Date: ${new Date(updatedOffer.startDate).toLocaleDateString("en-GB")}
              Offer End Date: ${new Date(updatedOffer.endDate).toLocaleDateString("en-GB")}
            `,
          };

          await transporter.sendMail(bakeryOwnerMailOptions);
        }

      } else if (status === "rejected") {
        // For rejected offers, delete offer
        await OfferSchema.findByIdAndDelete(id);

        const bakeryOwner = await RegisteredBakeries.findById(updatedOffer.createdBy);

        if (bakeryOwner && bakeryOwner.email) {
          const bakeryOwnerMailOptions = {
            from: process.env.EMAIL_USER,
            to: bakeryOwner.email,
            subject: `Your Offer "${updatedOffer.title}" Was Rejected`,
            text: `Dear Bakery Owner,

Your offer "${updatedOffer.title}" has been rejected.

Reason: ${reason || "No reason provided."}`,
          };

          await transporter.sendMail(bakeryOwnerMailOptions);
        }

        return res.status(200).json({ message: "Offer rejected and deleted successfully" });
      }

      return res.status(200).json({ message: `Offer ${status} successfully`, offer: updatedOffer });

    } catch (error) {
      console.error("Error updating offer status:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
