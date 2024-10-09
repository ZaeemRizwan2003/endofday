import dbConnect from "@/lib/dbconnect";
import Restaurant from "../../models/Restaurant";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { type, search } = req.query;
      let filter = {};

      if (type && type !== "all") {
        filter.type = type;
      }
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { "menu.title" : { $regex: search, $options: "i" } },
        ];
      }

      const restaurants = await Restaurant.find(filter);

      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      res.status(200).json({ success: true, data: restaurants });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
