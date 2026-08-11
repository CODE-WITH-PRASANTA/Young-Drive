const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customerName: { 
    type: String, 
    required: [true, 'Customer name is required'], 
    trim: true 
  },
  customerEmail: { 
    type: String, 
    required: [true, 'Customer email is required'], 
    trim: true, 
    lowercase: true 
  },
  vehicleName: { 
    type: String, 
    default: 'Toyota Camry', 
    trim: true 
  },
  vehicleType: { 
    type: String, 
    default: 'Sedan', 
    trim: true 
  },
  rating: { 
    type: Number, 
    required: [true, 'Rating is required'], 
    min: [1, 'Rating must be at least 1 star'], 
    max: [5, 'Rating cannot exceed 5 stars'] 
  },
  title: { 
    type: String, 
    required: [true, 'Review title is required'], 
    trim: true 
  },
  reviewText: { 
    type: String, 
    required: [true, 'Review text is required'], 
    trim: true 
  },
  image: { 
    type: String, 
    default: null 
  },
  verified: { 
    type: Boolean, 
    default: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);