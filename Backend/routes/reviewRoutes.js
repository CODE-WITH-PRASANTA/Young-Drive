const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  getApprovedReviews,
  createReview,
  updateReviewStatus,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

router.get('/all', getAllReviews);
router.get('/approved', getApprovedReviews);
router.post('/create', createReview);
router.patch('/:id/status', updateReviewStatus);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;