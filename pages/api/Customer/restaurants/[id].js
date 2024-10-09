import dbConnect from "@/lib/dbconnect";
import Restaurant from "@/models/Restaurant";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  try {
    const restaurant = await Restaurant.findById(id).populate('menu');
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
