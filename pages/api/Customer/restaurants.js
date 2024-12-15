import dbConnect from "@/middleware/mongoose";
import RegisteredBakeries from "@/models/RBakerymodel";
import Listings from "@/models/foodlistingmodel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { type = "all", search = "", page = 1, limit = 10 } = req.query;

      const skip = (page - 1) * limit;
      
      let bakeryFilter = {};
      if (search) {
        bakeryFilter.$or= [
            { restaurantName: { $regex: search, $options: "i" } }, // Search by restaurant name
            { address: { $regex: search, $options: "i" } }, // Search by address
          ];
        }
      

      if (type !== "all") {
        bakeryFilter.option = type; // Filter by type
      }

      if (search) {
        const listingFilter = { itemname: { $regex: search, $options: "i" } };
        const matchingListings = await Listings.find(listingFilter).select("bakeryowner").lean();
        const matchingBakeryIds = matchingListings.map((listing) => listing.bakeryowner);

        if (matchingBakeryIds.length > 0) {
          bakeryFilter.$or.push({ _id: { $in: matchingBakeryIds } });
        }
      }
      // Step 3: Fetch bakeries with the combined filter
      const restaurants = await RegisteredBakeries.find(bakeryFilter)
        .populate("menu") // Populate menu for detailed results
        .skip(skip)
        .limit(parseInt(limit));

      // Calculate the average rating for each restaurant
      const restaurantsWithAvgRating = restaurants.map((restaurant) => {
        const totalRatings = restaurant.reviews.reduce(
          (acc, review) => acc + review.rating,
          0
        );
        const avgRating =
          restaurant.reviews.length > 0
            ? (totalRatings / restaurant.reviews.length).toFixed(1)
            : 0; // Average rounded to 1 decimal place
        return { ...restaurant.toObject(), avgRating };
      });

      const totalRestaurants = await RegisteredBakeries.countDocuments(bakeryFilter);

    res.status(200).json({
        success: true,
        data: {
          restaurants: restaurantsWithAvgRating,
        },
        meta: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalRestaurants,
        },
      });
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
