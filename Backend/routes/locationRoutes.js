const express = require("express");

const router = express.Router();

const {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} = require("../controllers/locationController");


// =====================================================
// GET ALL + CREATE
// =====================================================

router
  .route("/")
  .get(getLocations)
  .post(createLocation);


// =====================================================
// UPDATE + DELETE
// =====================================================

router
  .route("/:id")
  .put(updateLocation)
  .delete(deleteLocation);


module.exports = router;