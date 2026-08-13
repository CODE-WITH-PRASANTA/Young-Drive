const Listing = require('../models/Listing');

exports.getListings = async (req, res) => {
    try {
        const listings = await Listing.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createListing = async (req, res) => {
    try {
        const listingData = { ...req.body };
        
        // Attach processed WebP images
        if (req.processedImages && req.processedImages.length > 0) {
            listingData.images = req.processedImages;
        }

        const newListing = new Listing(listingData);
        await newListing.save();
        res.status(201).json(newListing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        
        // Parse existing images sent from frontend
        let finalImages = [];
        if (updateData.existingImages) {
            finalImages = JSON.parse(updateData.existingImages);
        }

        // Add newly uploaded WebP images
        if (req.processedImages && req.processedImages.length > 0) {
            finalImages = [...finalImages, ...req.processedImages];
        }

        updateData.images = finalImages;

       const updatedListing = await Listing.findByIdAndUpdate(
                id,
                updateData,
                { returnDocument: "after" }
                );
        res.status(200).json(updatedListing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};