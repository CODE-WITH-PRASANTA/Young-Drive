const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    postalCode: {
      type: String,
      trim: true,
    },

    type: {
      type: String,

      enum: [
        "Pickup & Drop",
        "Pickup Only",
        "Drop Only",
      ],

      default: "Pickup & Drop",
    },

    status: {
      type: String,

      enum: [
        "Active",
        "Inactive",
      ],

      default: "Active",
    },

    mapLink: {
      type: String,
      trim: true,
    },
  },

  {
    timestamps: true,
  }
);


module.exports =
  mongoose.model(
    "Location",
    locationSchema
  );