import mongoose from "mongoose";

const signupSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    number: { type: String, required: true },
    option: { type: [String], required: true },
    image: {
      type: String,
      required: true,
    },
    imageContentType: {
      type: String,
      required: true,
    },
    // Adding a menu field that references Listings
    menu: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listings", // Reference the Listings model
      },
    ],
    usertype: {
      type: String,
      default: "bakery",
      immutable: true, // This makes sure the value can't be changed after creation
    },
    resetOtp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    // Adding reviews field
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users", // Reference the Users model for the user who left the review
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5, // Ensure rating is between 1 and 5
        },
        review: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now, // Automatically set the timestamp
        },
      },
    ],
  },
  { timestamps: true }
);

const RegisteredBakeries =
  mongoose.models.RegisteredBakeries ||
  mongoose.model("RegisteredBakeries", signupSchema);

export default RegisteredBakeries;
