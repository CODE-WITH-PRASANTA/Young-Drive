const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema(
  {
    vehicleBrand: { type: String, required: true, trim: true },
    vehicleModel: { type: String, required: true, trim: true },
    variantLine: { type: String, required: true, trim: true },
    vehicleType: { type: String, required: true, trim: true },
    fuelType: {
      type: String,
      enum: ["Diesel", "Petrol", "Electric", "Hybrid"],
      default: "Diesel",
    },
    transmission: {
      type: String,
      enum: ["Automatic", "Manual"],
      default: "Automatic",
    },
    yearOfManufacture: { type: Number, required: true },
    registrationNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    seatingCapacity: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    mileage: { type: String, default: "" },
    doors: { type: String, default: "4 Doors" },
    description: { type: String, maxLength: 300 },
    keyFeatures: [{ type: String }],
    
    // Insurance Details
    insuranceProvider: { type: String, default: "" },
    policyNumber: { type: String, default: "" },
    validTill: { type: Date },

    // Pricing & Availability
    dailyRentPrice: { type: Number, required: true },
    weeklyRentPrice: { type: Number, default: 0 },
    monthlyRentPrice: { type: Number, default: 0 },
    securityDeposit: { type: Number, required: true },
    extraKmCharge: { type: Number, default: 0 },
    minimumBookingDays: { type: String, required: true, default: "1 Day" },
    availabilityStatus: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },

    // Vehicle Uploaded Images
    images: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", VehicleSchema);