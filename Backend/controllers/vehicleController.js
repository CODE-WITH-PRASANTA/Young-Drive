const Vehicle = require("../models/Vehicle");

// Helper to convert formatted currency strings (e.g. "4,500.00") to clean Numbers
const parsePrice = (value) => {
  if (typeof value === "number") return value;
  if (!value || value.toString().trim() === "") return 0;
  // Remove commas, symbols, and spaces
  const cleaned = value.toString().replace(/[^0-9.-]+/g, "");
  return parseFloat(cleaned) || 0;
};

// @desc    Create a new vehicle
// @route   POST /api/vehicles
exports.createVehicle = async (req, res) => {
  try {
    const body = req.body;

    // 1. Safely Parse keyFeatures
    let keyFeatures = [];
    if (body.keyFeatures) {
      if (typeof body.keyFeatures === "string") {
        try {
          keyFeatures = JSON.parse(body.keyFeatures);
        } catch (e) {
          keyFeatures = body.keyFeatures.split(",").map((f) => f.trim());
        }
      } else if (Array.isArray(body.keyFeatures)) {
        keyFeatures = body.keyFeatures;
      }
    }

    // 2. Safely Parse Year of Manufacture
    const parsedYear = Number(body.yearOfManufacture);
    if (!body.yearOfManufacture || isNaN(parsedYear)) {
      return res.status(400).json({
        success: false,
        message: "Year of manufacture is required and must be a valid number.",
      });
    }

    // 3. Process Multer Memory Buffer Files into Base64 Data Strings
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(
        (file) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
      );
    }

    // 4. Clean Payload Data
    const vehicleData = {
      vehicleBrand: body.vehicleBrand,
      vehicleModel: body.vehicleModel,
      variantLine: body.variantLine,
      vehicleType: body.vehicleType,
      fuelType: body.fuelType || "Petrol",
      transmission: body.transmission || "Automatic",
      yearOfManufacture: parsedYear,
      registrationNumber: body.registrationNumber,
      seatingCapacity: body.seatingCapacity,
      color: body.color || "White",
      mileage: body.mileage || "",
      doors: body.doors || "4 Doors",
      description: body.description || "",
      keyFeatures,

      // Insurance Details
      insuranceProvider: body.insuranceProvider || "",
      policyNumber: body.policyNumber || "",
      validTill: body.validTill && body.validTill.trim() !== "" ? new Date(body.validTill) : null,

      // Pricing & Charges (Sanitized to numbers)
      dailyRentPrice: parsePrice(body.dailyRentPrice),
      weeklyRentPrice: parsePrice(body.weeklyRentPrice),
      monthlyRentPrice: parsePrice(body.monthlyRentPrice),
      securityDeposit: parsePrice(body.securityDeposit),
      extraKmCharge: parsePrice(body.extraKmCharge),
      minimumBookingDays: body.minimumBookingDays || "1 Day",
      availabilityStatus: body.availabilityStatus || "Available",

      images: imagePaths,
    };

    const newVehicle = new Vehicle(vehicleData);
    const savedVehicle = await newVehicle.save();

    return res.status(201).json({
      success: true,
      message: "Vehicle added successfully!",
      data: savedVehicle,
    });
  } catch (error) {
    console.error("Backend Validation Error:", error);

    // Duplicate Registration Number Check
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Vehicle with this registration number already exists.",
      });
    }

    // Return detailed Mongoose validation message
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to validate vehicle data.",
    });
  }
};

// @desc    Get all vehicles (MISSING FUNCTION THAT CAUSED crash)
// @route   GET /api/vehicles
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch vehicles",
      error: error.message,
    });
  }
};