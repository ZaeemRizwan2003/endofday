import dbConnect from "@/middleware/mongoose";
import RegisteredBakeries from "@/models/RBakerymodel";
import Listings from "@/models/foodlistingmodel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { type, search } = req.query;
      let filter = {};
      let bakeryFilter = {};

      if (type && type !== "all") {
        bakeryFilter.option = type;
      }
      
      if (search) {
        bakeryFilter.$or = [
          { restaurantName: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } },
        ];
      }

      const restaurants = await RegisteredBakeries.find(bakeryFilter);

      let listingFilter = {};
      if (search) {
        listingFilter.itemname = { $regex: search, $options: "i" };
      }

      const listings = await Listings.find(listingFilter).populate('bakeryowner');

      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      res.status(200).json({ success: true, data: restaurants }) || res.status(200).json({ success: true, data: listings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
