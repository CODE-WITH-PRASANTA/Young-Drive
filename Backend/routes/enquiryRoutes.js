const express = require("express");

const router = express.Router();

const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} = require("../controllers/enquiryController");

/* =====================================================
   CREATE ENQUIRY
===================================================== */

router.post(
  "/",
  createEnquiry
);

/* =====================================================
   GET ALL ENQUIRIES
===================================================== */

router.get(
  "/",
  getEnquiries
);

/* =====================================================
   GET SINGLE ENQUIRY
===================================================== */

router.get(
  "/:id",
  getEnquiryById
);

/* =====================================================
   UPDATE ENQUIRY
===================================================== */

router.put(
  "/:id",
  updateEnquiry
);

/* =====================================================
   DELETE ENQUIRY
===================================================== */

router.delete(
  "/:id",
  deleteEnquiry
);

module.exports = router;