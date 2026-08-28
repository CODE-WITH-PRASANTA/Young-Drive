const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// =====================================================
// IMPORT ROUTES
// =====================================================

const bookingRoutes = require("./routes/bookingRoutes");

const vehicleRoutes = require("./routes/vehicleRoutes");

const listingRoutes = require("./routes/listingRoutes");

const locationRoutes = require("./routes/locationRoutes");

const reviewRoutes = require("./routes/reviewRoutes");
const carCategoryRoutes = require("./routes/carCategoryRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

require("dotenv").config();

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// =====================================================
// UPLOADS
// =====================================================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =====================================================
// ROUTES
// =====================================================

app.use("/api/bookings", bookingRoutes);

app.use("/api/vehicles", vehicleRoutes);

app.use("/api/listings", listingRoutes);

// IMPORTANT
// Frontend uses /api/locations
app.use("/api/locations", locationRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/car-categories", carCategoryRoutes);
app.use("/api/enquiries", enquiryRoutes);

app.use("/api/auth", authRoutes);
app.use(
  "/api/payments",
  paymentRoutes
);

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// =====================================================
// DATABASE
// =====================================================

const PORT = process.env.PORT || 5000;

mongoose
  .connect("mongodb://127.0.0.1:27017/reviews_db")

  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      console.log(`Locations API: http://localhost:${PORT}/api/locations`);
    });
  })

  .catch((err) => {
    console.error("Database connection error:", err);
  });
