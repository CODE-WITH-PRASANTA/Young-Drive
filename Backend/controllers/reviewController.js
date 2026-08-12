const Review = require('../models/Review');

const getAllReviews = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All Reviews') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { customerName: searchRegex },
        { customerEmail: searchRegex },
        { vehicleName: searchRegex },
        { title: searchRegex }
      ];
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'Approved' }).sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch approved reviews', error: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      vehicleName, 
      vehicleType, 
      rating, 
      title, 
      reviewText, 
      image 
    } = req.body;

    // Validate required string inputs
    const missingFields = [];
    if (!customerName || !customerName.trim()) missingFields.push('customerName');
    if (!customerEmail || !customerEmail.trim()) missingFields.push('customerEmail');
    if (!title || !title.trim()) missingFields.push('title');
    if (!reviewText || !reviewText.trim()) missingFields.push('reviewText');

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Validation Failed',
        details: missingFields.map(field => `${field} is required.`)
      });
    }

    // Validate numerical rating range
    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        message: 'Validation Failed',
        details: ['Rating must be a valid number between 1 and 5 stars.']
      });
    }

    const newReview = new Review({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      vehicleName: vehicleName ? vehicleName.trim() : 'Toyota Camry',
      vehicleType: vehicleType ? vehicleType.trim() : 'Sedan',
      rating: numericRating,
      title: title.trim(),
      reviewText: reviewText.trim(),
      image: image || null,
      status: 'Pending'
    });

    const savedReview = await newReview.save();
    return res.status(201).json({
      message: 'Review submitted successfully! Pending approval.',
      review: savedReview
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation Failed', details: messages });
    }
    return res.status(400).json({ message: 'Failed to create review', error: error.message });
  }
};

const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    return res.status(200).json({ message: `Status updated to ${status}`, review: updatedReview });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update review status', error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.rating) {
      req.body.rating = Number(req.body.rating);
    }

    const updatedReview = await Review.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    return res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update review', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    return res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
};

module.exports = {
  getAllReviews,
  getApprovedReviews,
  createReview,
  updateReviewStatus,
  updateReview,
  deleteReview
};