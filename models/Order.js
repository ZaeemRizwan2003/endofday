import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  itemId: String,
  // bakeryId: String,
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
    bakeryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisteredBakeries",
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
    restaurantStatus: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Cancelled","Done"],
      default: "Pending",
    },
    deliveryStatus: {
      type: String,
      enum: ["Unassigned", "Assigned", "Picked Up", "On the Way", "Delivered", "Failed","Done"],
      default: "Assigned",
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
    estimatedReadyTime: {
      type: Date,
    },
    pickedUpTime: {
      type: Date,
    },
    deliveredTime: {
      type: Date,
    }
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
