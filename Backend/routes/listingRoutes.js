const express = require('express');
const router = express.Router();

const { 
  getListings, 
  createListing, 
  updateListing, 
  deleteListing 
} = require('../controllers/listingController');

// FIXED: Changed processImages to convertToWebp
const { upload, convertToWebp } = require('../middleware/upload');

router.get('/', getListings);
router.post('/', upload.array('images', 10), convertToWebp, createListing);
router.put('/:id', upload.array('images', 10), convertToWebp, updateListing);
router.delete('/:id', deleteListing);

module.exports = router;