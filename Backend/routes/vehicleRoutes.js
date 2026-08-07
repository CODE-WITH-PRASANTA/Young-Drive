const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

// Destructure both 'upload' and 'convertToWebp' from middleware
const { upload, convertToWebp } = require("../middleware/upload");

// POST /api/vehicles - Upload -> Convert to WebP -> Controller
router.post(
  "/",
  upload.array("images", 10),
  convertToWebp,
  vehicleController.createVehicle
);

// GET /api/vehicles
router.get("/", vehicleController.getVehicles);

module.exports = router;