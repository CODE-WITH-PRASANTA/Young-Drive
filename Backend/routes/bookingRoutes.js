const express = require("express");

const router = express.Router();

const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController");


/* CREATE */
router.post(
  "/",
  createBooking
);


/* GET ALL */
router.get(
  "/",
  getBookings
);


/* GET ONE */
router.get(
  "/:id",
  getBookingById
);


/* UPDATE */
router.put(
  "/:id",
  updateBooking
);


/* UPDATE STATUS */
router.put(
  "/:id/status",
  updateBookingStatus
);


/* DELETE */
router.delete(
  "/:id",
  deleteBooking
);


module.exports = router;