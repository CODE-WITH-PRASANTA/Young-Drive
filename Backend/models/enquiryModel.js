const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      default: "",
    },

    // Service selected by user
    service: {
      type: String,
      required: true,
      trim: true,
    },

    // Pickup location selected by user
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // Travel date / enquiry date
    date: {
      type: Date,
      default: Date.now,
    },

    // Trip details / requirements
    message: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Converted", "Closed"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Enquiry", enquirySchema);