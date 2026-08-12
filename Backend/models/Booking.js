const mongoose = require("mongoose");

const bookingSchema =
  new mongoose.Schema(
    {
      bookingId: {
        type: String,
        unique: true,
        sparse: true,
      },

      customerName: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true,
      },

      vehicleName: {
        type: String,
        required: true,
        trim: true,
      },

      bookingDate: {
        type: Date,
        required: true,
      },

      bookingTime: {
        type: String,
        default: "10:00 AM",
      },

      pickupDate: {
        type: Date,
        required: true,
      },

      pickupTime: {
        type: String,
        default: "10:00 AM",
      },

      returnDate: {
        type: Date,
        required: true,
      },

      dropoffDate: {
        type: Date,
        required: true,
      },

      dropoffTime: {
        type: String,
        default: "10:00 AM",
      },

      pickupLocation: {
        type: String,
        required: true,
        trim: true,
      },

      dropoffLocation: {
        type: String,
        required: true,
        trim: true,
      },

      amount: {
        type: Number,
        default: 0,
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Confirmed",
          "Ongoing",
          "Completed",
          "Cancelled",
        ],
        default: "Pending",
      },

      paymentStatus: {
        type: String,
        enum: [
          "Paid",
          "Unpaid",
          "Pending",
          "Refunded",
        ],
        default: "Unpaid",
      },

      paymentMethod: {
        type: String,
        default: "",
      },

      additionalMessage: {
        type: String,
        default: "",
        trim: true,
      },

      cancellationReason: {
        type: String,
        default: "",
      },

      cancellationComment: {
        type: String,
        default: "",
      },
    },

    {
      timestamps: true,
    }
  );


module.exports =
  mongoose.model(
    "Booking",
    bookingSchema
  );