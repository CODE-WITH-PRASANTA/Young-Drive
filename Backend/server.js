const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

// =====================================================
// APP INITIALIZATION (Must be done first!)
// =====================================================

const app = express();

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
const dashboardRoutes = require("./routes/dashboardRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");

// =====================================================
// MIDDLEWARE (CORS & Body Parsers)
// =====================================================

const allowedOrigins = [
  "https://admin.youngdrives.in",
  "https://youngdrives.in",
  "http://localhost:3000" // for local testing
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// UPLOADS
// =====================================================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =====================================================
// ROUTES
// =====================================================

app.use("/api/bookings", bookingRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/car-categories", carCategoryRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Young Drive API Server is running",
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
// DATABASE & SERVER START
// =====================================================

const PORT = process.env.PORT || 6018;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("=================================");
    console.log("MongoDB Connected Successfully");
    console.log("Database:", mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Locations API: http://localhost:${PORT}/api/locations`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });