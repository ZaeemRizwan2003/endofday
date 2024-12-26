import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  addressLine: { type: String, required: true },
  area: { type: String },
  city: { type: String, required: true },
  postalCode: { type: String, default:"" },
  isDefault:{type:Boolean, default:false},
  lat: {type: Number},
  lng: {type: Number},
});

const CartItemSchema = new mongoose.Schema({
  itemId: String,
  title: String,
  price: Number,
  quantity: Number,
  bakeryId: String,
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide name"],
    },
    email: {
      type: String,
      required: [true, "please provie email"],
      unique: true,
      match: [/.+\@.+\..+/, "please provde valid email address"],
    },
    password: {
      type: String,
      required: [true, "please provide a password"],
      minlength: 6,
    },
    usertype: {
      type: String,
      default: "customer",
      immutable: true, // This makes sure the value can't be changed after creation
    },
    cart: [CartItemSchema],
    addresses: [AddressSchema],
    resetOtp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listings", 
      },
    ],
    loyaltyPoints: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
