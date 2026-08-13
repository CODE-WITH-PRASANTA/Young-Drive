const Booking = require('../models/Booking');

// Helper function to generate unique ID like #BK2489
const generateBookingId = () => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `#BK${randomDigits}`;
};

// @desc    Get all bookings (with optional status filtering & search)
// @route   GET /api/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status.toLowerCase() !== 'all') {
      query.status = new RegExp(`^${status}$`, 'i');
    }

    if (search) {
      query.$or = [
        { id: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new booking (POST)
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { customerName, email, phone, vehicle, pickupDate, returnDate, amount } = req.body;

    // Format input to match full booking object structure
    const newBookingData = {
      id: generateBookingId(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customer: {
        name: customerName,
        email: email,
        phone: phone,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
      },
      vehicle: {
        name: vehicle || 'Audi A3 1.6 TDI S line',
        color: 'White',
        plate: 'MH12 XX 9999',
        img: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=300'
      },
      pickup: pickupDate,
      returnDate: returnDate,
      duration: '3 Days',
      pickupLoc: 'Main Branch',
      returnLoc: 'Main Branch',
      driver: customerName,
      amount: amount.startsWith('$') ? amount : `$${amount}`,
      paymentStatus: 'Paid',
      status: 'Confirmed'
    };

    const booking = await Booking.create(newBookingData);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create booking', error: error.message });
  }
};

// @desc    Update booking status or cancellation details
// @route   PATCH /api/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, cancellationReason, cancellationComment } = req.body;
    const { id } = req.params;

    const updateFields = { status };
    if (cancellationReason) updateFields.cancellationReason = cancellationReason;
    if (cancellationComment) updateFields.cancellationComment = cancellationComment;

        const booking = await Booking.findOneAndUpdate(
      { id: id },
      { $set: updateFields },
      { returnDocument: "after", runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update booking status', error: error.message });
  }
};