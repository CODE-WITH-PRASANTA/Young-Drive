const express = require("express");

const router = express.Router();

const vehicleController = require("../controllers/vehicleController");

const {
  upload,
  convertToWebp,
} = require("../middleware/upload");

/* =====================================================
   CREATE VEHICLE
   POST /api/vehicles

   Flow:
   Request
      ↓
   upload.array("images", 10)
      ↓
   convertToWebp
      ↓
   createVehicle
===================================================== */

router.post(
  "/",
  upload.array("images", 10),
  convertToWebp,
  vehicleController.createVehicle
);


/* =====================================================
   GET ALL VEHICLES
   GET /api/vehicles
===================================================== */

router.get(
  "/",
  vehicleController.getVehicles
);


/* =====================================================
   GET SINGLE VEHICLE
   GET /api/vehicles/:id
===================================================== */

router.get(
  "/:id",
  vehicleController.getVehicleById
);


/* =====================================================
   UPDATE VEHICLE
   PUT /api/vehicles/:id

   Supports:
   - Existing vehicle information
   - New images
   - WebP conversion
===================================================== */

router.put(
  "/:id",
  upload.array("images", 10),
  convertToWebp,
  vehicleController.updateVehicle
);


/* =====================================================
   DELETE VEHICLE
   DELETE /api/vehicles/:id
===================================================== */

router.delete(
  "/:id",
  vehicleController.deleteVehicle
);


module.exports = router;