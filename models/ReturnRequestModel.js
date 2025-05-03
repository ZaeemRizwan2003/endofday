import mongoose from "mongoose";

const ReturnRequestSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
images:{
  type:String,
  required: true,
},
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    contactNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ReturnRequest =
  mongoose.models.ReturnRequest ||
  mongoose.model("ReturnRequest", ReturnRequestSchema);

export default ReturnRequest;
