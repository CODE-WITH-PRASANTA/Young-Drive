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

const reviewRoutes = require('./routes/reviewRoutes');

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// INCREASE PAYLOAD LIMIT HERE (default is 1mb)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/reviews', reviewRoutes);

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/reviews_db')
  .then(() => {
    console.log('MongoDB Connected Successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));