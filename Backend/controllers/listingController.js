const Listing = require("../models/Listing");
const CarCategory = require("../models/carCategoryModel");
const fs = require("fs");
const path = require("path");

// =====================================================
// DELETE IMAGE FILE
// =====================================================

const deleteImageFile = (imagePath) => {
  try {
    if (!imagePath) {
      return;
    }

    const cleanPath = imagePath
      .replace(/^\/+/, "")
      .replace(/\//g, path.sep);

    const fullPath = path.join(
      process.cwd(),
      cleanPath
    );

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error(
      "DELETE IMAGE ERROR:",
      error
    );
  }
};

// =====================================================
// GET ALL LISTINGS
// GET /api/listings
// =====================================================

exports.getListings = async (
  req,
  res
) => {
  try {
    const listings =
      await Listing.find()
        .populate({
          path: "category",
          select:
            "name description image status",
        })
        .sort({
          order: 1,
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    console.error(
      "GET LISTINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch listings.",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE LISTING
// GET /api/listings/:id
// =====================================================

exports.getListingById = async (
  req,
  res
) => {
  try {
    const listing =
      await Listing.findById(
        req.params.id
      ).populate({
        path: "category",
        select:
          "name description image status",
      });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message:
          "Listing not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error(
      "GET LISTING ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch listing.",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE LISTING
// POST /api/listings
// =====================================================

exports.createListing = async (
  req,
  res
) => {
  try {
    

    const {
      name,
      location,
      category,
      listingType,
      price,
      offerPrice,
      rating,
      reviewsCount,
      fuelType,
      transmission,
      seats,
      doors,
      driveType,
      mileage,
      status,
      order,
      shortDesc,
      fullDesc,
    } = req.body;

    // =================================================
    // REQUIRED VALIDATION
    // =================================================

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Vehicle name is required.",
      });
    }

    if (
      !location ||
      !location.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Location is required.",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message:
          "Car category is required.",
      });
    }

    if (
      !listingType ||
      ![
        "Featured Listings Cars",
        "Most Searched Cars",
      ].includes(listingType)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid listing type is required.",
      });
    }

    if (
      price === undefined ||
      price === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Price is required.",
      });
    }

    // =================================================
    // CHECK CATEGORY
    // =================================================

    const categoryExists =
      await CarCategory.findById(
        category
      );

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message:
          "Selected car category not found.",
      });
    }

    // =================================================
    // CHECK CATEGORY STATUS
    // =================================================

    if (
      categoryExists.status ===
      "Inactive"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Selected car category is inactive.",
      });
    }

    // =================================================
    // IMAGES
    // =================================================

    let images = [];

    if (
      req.processedImages &&
      req.processedImages.length > 0
    ) {
      images =
        req.processedImages;
    }

    // =================================================
    // CREATE DATA
    // =================================================

    const listingData = {
      name: name.trim(),

      location:
        location.trim(),

      category,

      listingType,

      price: Number(price),

      offerPrice:
        offerPrice !== undefined &&
        offerPrice !== ""
          ? Number(offerPrice)
          : null,

      rating:
        rating !== undefined &&
        rating !== ""
          ? Number(rating)
          : 0,

      reviewsCount:
        reviewsCount !== undefined &&
        reviewsCount !== ""
          ? Number(reviewsCount)
          : 0,

      fuelType:
        fuelType || "",

      transmission:
        transmission || "",

      seats:
        seats || "",

      doors:
        doors || "",

      driveType:
        driveType || "",

      mileage:
        mileage || "",

      status:
        status === "Inactive"
          ? "Inactive"
          : "Active",

      order:
        order !== undefined &&
        order !== ""
          ? Number(order)
          : 1,

      shortDesc:
        shortDesc || "",

      fullDesc:
        fullDesc || "",

      images,
    };

    // =================================================
    // CREATE
    // =================================================

    const newListing =
      await Listing.create(
        listingData
      );

    // =================================================
    // POPULATE CATEGORY
    // =================================================

    const populatedListing =
      await Listing.findById(
        newListing._id
      ).populate({
        path: "category",
        select:
          "name description image status",
      });

    return res.status(201).json({
      success: true,
      message:
        "Listing created successfully.",
      data: populatedListing,
    });
  } catch (error) {
    console.error(
      "CREATE LISTING ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create listing.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE LISTING
// PUT /api/listings/:id
// =====================================================

exports.updateListing = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    


    // =================================================
    // FIND LISTING
    // =================================================

    const listing =
      await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message:
          "Listing not found.",
      });
    }

    const {
      name,
      location,
      category,
      listingType,
      price,
      offerPrice,
      rating,
      reviewsCount,
      fuelType,
      transmission,
      seats,
      doors,
      driveType,
      mileage,
      status,
      order,
      shortDesc,
      fullDesc,
    } = req.body;

    // =================================================
    // VALIDATE CATEGORY
    // =================================================

    if (category) {
      const categoryExists =
        await CarCategory.findById(
          category
        );

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message:
            "Selected car category not found.",
        });
      }

      if (
        categoryExists.status ===
        "Inactive"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Selected car category is inactive.",
        });
      }

      listing.category =
        category;
    }

    // =================================================
    // LISTING TYPE
    // =================================================

    if (listingType !== undefined) {
      if (
        ![
          "Featured Listings Cars",
          "Most Searched Cars",
        ].includes(listingType)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid listing type.",
        });
      }

      listing.listingType =
        listingType;
    }

    // =================================================
    // BASIC DATA
    // =================================================

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Vehicle name cannot be empty.",
        });
      }

      listing.name =
        name.trim();
    }

    if (location !== undefined) {
      if (!location.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Location cannot be empty.",
        });
      }

      listing.location =
        location.trim();
    }

    // =================================================
    // PRICE
    // =================================================

    if (price !== undefined) {
      if (price === "") {
        return res.status(400).json({
          success: false,
          message:
            "Price cannot be empty.",
        });
      }

      listing.price =
        Number(price);
    }

    if (
      offerPrice !== undefined
    ) {
      listing.offerPrice =
        offerPrice === ""
          ? null
          : Number(offerPrice);
    }

    // =================================================
    // RATING
    // =================================================

    if (
      rating !== undefined
    ) {
      listing.rating =
        rating === ""
          ? 0
          : Number(rating);
    }

    if (
      reviewsCount !==
      undefined
    ) {
      listing.reviewsCount =
        reviewsCount === ""
          ? 0
          : Number(
              reviewsCount
            );
    }

    // =================================================
    // SPECIFICATIONS
    // =================================================

    if (
      fuelType !== undefined
    ) {
      listing.fuelType =
        fuelType;
    }

    if (
      transmission !==
      undefined
    ) {
      listing.transmission =
        transmission;
    }

    if (
      seats !== undefined
    ) {
      listing.seats =
        seats;
    }

    if (
      doors !== undefined
    ) {
      listing.doors =
        doors;
    }

    if (
      driveType !==
      undefined
    ) {
      listing.driveType =
        driveType;
    }

    if (
      mileage !== undefined
    ) {
      listing.mileage =
        mileage;
    }

    // =================================================
    // STATUS
    // =================================================

    if (
      status !== undefined
    ) {
      listing.status =
        status === "Inactive"
          ? "Inactive"
          : "Active";
    }

    // =================================================
    // ORDER
    // =================================================

    if (
      order !== undefined
    ) {
      listing.order =
        order === ""
          ? 1
          : Number(order);
    }

    // =================================================
    // DESCRIPTION
    // =================================================

    if (
      shortDesc !== undefined
    ) {
      listing.shortDesc =
        shortDesc;
    }

    if (
      fullDesc !== undefined
    ) {
      listing.fullDesc =
        fullDesc;
    }

    // =================================================
    // EXISTING IMAGES
    // =================================================

    let existingImages = [];

    if (
      req.body.existingImages
    ) {
      try {
        existingImages =
          JSON.parse(
            req.body.existingImages
          );

        if (
          !Array.isArray(
            existingImages
          )
        ) {
          existingImages = [];
        }
      } catch (error) {
        console.error(
          "EXISTING IMAGES PARSE ERROR:",
          error
        );

        existingImages = [];
      }
    } else {
      // If frontend does not send existingImages,
      // keep the old images.
      existingImages =
        listing.images || [];
    }

    // =================================================
    // NEW IMAGES
    // =================================================

    const newImages =
      req.processedImages || [];

    // =================================================
    // DETECT REMOVED OLD IMAGES
    // =================================================

    const oldImages =
      listing.images || [];

    const removedImages =
      oldImages.filter(
        (oldImage) =>
          !existingImages.includes(
            oldImage
          )
      );

    // =================================================
    // DELETE REMOVED FILES
    // =================================================

    removedImages.forEach(
      (image) => {
        deleteImageFile(
          image
        );
      }
    );

    // =================================================
    // FINAL IMAGES
    // =================================================

    listing.images = [
      ...existingImages,
      ...newImages,
    ];

    // =================================================
    // SAVE
    // =================================================

    await listing.save();

    // =================================================
    // POPULATE CATEGORY
    // =================================================

    const updatedListing =
      await Listing.findById(
        listing._id
      ).populate({
        path: "category",
        select:
          "name description image status",
      });

    return res.status(200).json({
      success: true,
      message:
        "Listing updated successfully.",
      data: updatedListing,
    });
  } catch (error) {
    console.error(
      "UPDATE LISTING ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update listing.",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE LISTING
// DELETE /api/listings/:id
// =====================================================

exports.deleteListing = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const listing =
      await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message:
          "Listing not found.",
      });
    }

    // =================================================
    // DELETE ALL IMAGES
    // =================================================

    if (
      Array.isArray(
        listing.images
      )
    ) {
      listing.images.forEach(
        (image) => {
          deleteImageFile(
            image
          );
        }
      );
    }

    // =================================================
    // DELETE LISTING
    // =================================================

    await Listing.findByIdAndDelete(
      id
    );

    return res.status(200).json({
      success: true,
      message:
        "Listing deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE LISTING ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete listing.",
      error: error.message,
    });
  }
};