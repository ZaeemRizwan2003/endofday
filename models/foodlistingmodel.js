import mongoose from 'mongoose';

const foodlistingSchema = new mongoose.Schema({
    itemname: { type: String, required: true },
    price: { type: Number, required: true },
    discountedprice: { type: Number, required: true },
    remainingitem: { type: Number },
    image: {
        data: Buffer, // Use Buffer to store binary image data
        contentType: String // Store the MIME type (e.g., 'image/jpeg', 'image/png')
    },
    manufacturedate: { type: String, required: true },
    description: { type: String, required: true },
    bakeryowner: {
        type: mongoose.Schema.Types.ObjectId, // ObjectId to reference 'RegisteredBakeries'
        ref: 'RegisteredBakeries', // Reference to the RegisteredBakeries model
        required: true
    }
}, { timestamps: true });

// Prevent model recompilation during hot reloads
const Listings = mongoose.models.Listings || mongoose.model('Listings', foodlistingSchema);

export default Listings;