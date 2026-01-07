const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", 
      required: true,
    },
    orderId: {
      type: String, 
      required: true,
      unique: true,
    },
    paymentId: {
      type: String, 
      default: null,
    },
    signature: {
      type: String, 
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Successful", "Failed"],
      default: "Pending", 
    },
  },
  { timestamps: true }
);

const paymentModel = mongoose.models.payments || mongoose.model("payments", paymentSchema);
module.exports = paymentModel;