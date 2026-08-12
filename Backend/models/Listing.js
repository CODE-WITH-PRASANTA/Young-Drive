const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    fuelType: { type: String },
    transmission: { type: String },
    seats: { type: String },
    doors: { type: String },
    driveType: { type: String },
    mileage: { type: String },
    status: { type: String, default: 'Active' },
    order: { type: Number, default: 1 },
    shortDesc: { type: String },
    fullDesc: { type: String },
    images: [{ type: String }] // Array of image URLs
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);