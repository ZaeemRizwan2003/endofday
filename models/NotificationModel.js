import mongoose from "mongoose";

const NotificationRequestSchema = new mongoose.Schema({
  bakeryOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BakeryOwner",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

export default mongoose.models.NotificationRequest ||
  mongoose.model("NotificationRequest", NotificationRequestSchema);
