const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    date: {
      type: String,
      required: true,
      default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      avatar: { type: String, default: 'https://i.pravatar.cc/150?img=33' }
    },
    vehicle: {
      name: { type: String, required: true },
      color: { type: String, default: 'White' },
      plate: { type: String, default: 'MH12 XX 9999' },
      img: { type: String, default: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=300' }
    },
    pickup: { type: String, required: true },
    returnDate: { type: String, required: true },
    duration: { type: String, default: '1 Day' },
    pickupLoc: { type: String, default: 'Main Branch' },
    returnLoc: { type: String, default: 'Main Branch' },
    driver: { type: String },
    amount: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Pending'],
      default: 'Paid'
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Confirmed'
    },
    cancellationReason: { type: String },
    cancellationComment: { type: String }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);