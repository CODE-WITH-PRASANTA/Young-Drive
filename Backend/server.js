const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const bookingRoutes = require("./routes/bookingRoutes");

// Required Middlewares
app.use(cors());
app.use(express.json()); // <--- CRITICAL: Parses incoming JSON body data

// Import Routes

app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB: Young-drive');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('❌ DB Error:', err));