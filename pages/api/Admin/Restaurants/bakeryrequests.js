import dbConnect from "@/middleware/mongoose";
import RegisteredBakeries from "@/models/RBakerymodel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      // Fetch all bakeries regardless of status
      const bakeries = await RegisteredBakeries.find({}).lean();

      if (bakeries.length === 0) {
        return res.status(404).json({
          message: "No bakeries found",
          bakeries: [],
        });
      }

      return res.status(200).json({ bakeries });
    } catch (error) {
      console.error("Error fetching bakeries:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
