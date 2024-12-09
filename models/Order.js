import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  itemId: String,
  bakeryId: String,
  title: String,
  price: Number,
  quantity: Number,
});

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "Pending", // Possible values: Pending, Completed, Cancelled
    },
    deliveryBoy_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "deliverypartners",
    },
    reviewStatus: {
      type: String,
      enum: ["Reviewed", "Not Reviewed"],
      default: "Not Reviewed",
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
