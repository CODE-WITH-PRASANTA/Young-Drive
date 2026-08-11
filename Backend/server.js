const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const locationRoutes = require('./routes/locationRoutes');

// Required Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON body data

// Import Routes
const bookingRoutes = require("./routes/bookingRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");

// Route Endpoints
app.use("/api/bookings", bookingRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use('/api/locations', locationRoutes);

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