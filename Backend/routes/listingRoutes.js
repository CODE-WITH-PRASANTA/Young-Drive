const express = require("express");

const router =
  express.Router();

const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} = require("../controllers/listingController");

const {
  upload,
  convertToWebp,
} = require("../middleware/upload");

// =====================================================
// GET ALL LISTINGS
// =====================================================

router.get(
  "/",
  getListings
);

// =====================================================
// GET SINGLE LISTING
// =====================================================

router.get(
  "/:id",
  getListingById
);

// =====================================================
// CREATE LISTING
// =====================================================

router.post(
  "/",
  upload.array("images", 10),
  convertToWebp,
  createListing
);

// =====================================================
// UPDATE LISTING
// =====================================================

router.put(
  "/:id",
  upload.array("images", 10),
  convertToWebp,
  updateListing
);

// =====================================================
// DELETE LISTING
// =====================================================

router.delete(
  "/:id",
  deleteListing
);

module.exports = router;