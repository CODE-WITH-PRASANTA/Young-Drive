const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Required Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON body data
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const bookingRoutes = require("./routes/bookingRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const listingRoutes = require('./routes/listingRoutes');

// Route Endpoints
app.use("/api/bookings", bookingRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use('/api/listings', listingRoutes);

const PORT = process.env.PORT || 5000;

// Database Connection & Server Listener
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB: Young-drive');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('❌ DB Error:', err));