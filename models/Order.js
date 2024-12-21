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
    contact: { 
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending", 
    },
    deliveryBoy_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deliverypartner",
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
