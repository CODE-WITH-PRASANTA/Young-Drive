const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    // =====================================================
    // VEHICLE BASIC INFORMATION
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // CAR CATEGORY
    // =====================================================

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarCategory",
      required: true,
    },

    // =====================================================
    // LISTING TYPE
    // =====================================================

    listingType: {
      type: String,
      enum: [
        "Featured Listings Cars",
        "Most Searched Cars",
      ],
      default: "Featured Listings Cars",
    },

    // =====================================================
    // PRICE
    // =====================================================

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    offerPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    // =====================================================
    // RATING
    // =====================================================

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // VEHICLE SPECIFICATIONS
    // =====================================================

    fuelType: {
      type: String,
      trim: true,
    },

    transmission: {
      type: String,
      trim: true,
    },

    seats: {
      type: String,
      trim: true,
    },

    doors: {
      type: String,
      trim: true,
    },

    driveType: {
      type: String,
      trim: true,
    },

    mileage: {
      type: String,
      trim: true,
    },

    // =====================================================
    // STATUS
    // =====================================================

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
      ],
      default: "Active",
    },

    // =====================================================
    // DISPLAY ORDER
    // =====================================================

    order: {
      type: Number,
      default: 1,
    },

    // =====================================================
    // DESCRIPTION
    // =====================================================

    shortDesc: {
      type: String,
      trim: true,
    },

    fullDesc: {
      type: String,
      trim: true,
    },

    // =====================================================
    // IMAGES
    // =====================================================

    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Listing",
  listingSchema
);