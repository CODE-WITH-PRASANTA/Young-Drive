const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  createBooking,
  updateBookingStatus
} = require('../controllers/bookingController');

// Booking endpoints
router.route('/')
  .get(getAllBookings)
  .post(createBooking);

router.route('/:id/status')
  .patch(updateBookingStatus);

module.exports = router;