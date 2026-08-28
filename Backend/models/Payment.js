const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      uppercase: true,
    },

    bookingId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    method: {
      type: String,
      required: true,
      enum: [
        "UPI",
        "Credit Card",
        "Debit Card",
        "PayPal",
        "Net Banking",
        "Cash",
      ],
    },

    details: {
      type: String,
      trim: true,
      default: "",
    },

    brand: {
      type: String,
      trim: true,
      default: "payment",
    },

    status: {
      type: String,
      required: true,
      enum: [
        "Successful",
        "Pending",
        "Failed",
        "Refunded",
      ],
      default: "Pending",
    },

    paymentDate: {
      type: Date,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ customerName: 1 });
paymentSchema.index({ customerEmail: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ method: 1 });
paymentSchema.index({ paymentDate: -1 });

module.exports = mongoose.model("Payment", paymentSchema);