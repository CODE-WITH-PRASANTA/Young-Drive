const CarCategory = require("../models/carCategoryModel");

const fs = require("fs");
const path = require("path");

/* =====================================================
   HELPER - DELETE IMAGE
   ===================================================== */

const deleteImageFile = (imagePath) => {
  try {
    if (!imagePath) {
      return;
    }

    const cleanPath = imagePath.replace(/^\/+/, "").replace(/\//g, path.sep);

    const fullPath = path.join(process.cwd(), cleanPath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log("CATEGORY IMAGE DELETED:", fullPath);
    }
  } catch (error) {
    console.error("DELETE IMAGE ERROR:", error);
  }
};

/* =====================================================
   GET ALL CATEGORIES
   GET /api/car-categories
   ===================================================== */

const getCategories = async (req, res) => {
  try {
    const categories = await CarCategory.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch car categories.",
      error: error.message,
    });
  }
};

/* =====================================================
   GET SINGLE CATEGORY
   GET /api/car-categories/:id
   ===================================================== */

const getCategoryById = async (req, res) => {
  try {
    const category = await CarCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Car category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("GET CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category.",
      error: error.message,
    });
  }
};

/* =====================================================
   CREATE CATEGORY
   POST /api/car-categories
   ===================================================== */

const createCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    console.log("CREATE CATEGORY BODY:", req.body);

    console.log("CATEGORY FILE:", req.file);

    console.log("PROCESSED CATEGORY IMAGE:", req.processedCategoryImage);

    /* =================================================
       VALIDATION
       ================================================= */

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    /* =================================================
       CHECK DUPLICATE
       ================================================= */

    const existingCategory = await CarCategory.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: "i",
      },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "A category with this name already exists.",
      });
    }

    /* =================================================
       IMAGE
       ================================================= */

    let image = "";

    /*
      Your multer uses memoryStorage().
      convertCategoryToWebp creates the WebP file.

      Therefore DO NOT use:

      req.file.filename

      Use:

      req.processedCategoryImage
    */

    if (req.processedCategoryImage) {
      image = req.processedCategoryImage;
    }

    /* =================================================
       CREATE CATEGORY
       ================================================= */

    const category = await CarCategory.create({
      name: name.trim(),

      description: description?.trim() || "",

      status: status === "Inactive" ? "Inactive" : "Active",

      image,
    });

    console.log("CATEGORY CREATED:", category);

    return res.status(201).json({
      success: true,
      message: "Car category created successfully.",
      data: category,
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    /* =================================================
       DUPLICATE KEY
       ================================================= */

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A category with this name already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create car category.",
      error: error.message,
    });
  }
};

/* =====================================================
   UPDATE CATEGORY
   PUT /api/car-categories/:id
   ===================================================== */

const updateCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    console.log("UPDATE CATEGORY ID:", req.params.id);

    console.log("UPDATE CATEGORY BODY:", req.body);

    console.log("UPDATE CATEGORY FILE:", req.file);

    console.log("PROCESSED CATEGORY IMAGE:", req.processedCategoryImage);

    /* =================================================
       FIND CATEGORY
       ================================================= */

    const category = await CarCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Car category not found.",
      });
    }

    /* =================================================
       NAME VALIDATION
       ================================================= */

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name cannot be empty.",
      });
    }

    /* =================================================
       DUPLICATE NAME CHECK
       ================================================= */

    if (
      name !== undefined &&
      name.trim().toLowerCase() !== category.name.trim().toLowerCase()
    ) {
      const duplicate = await CarCategory.findOne({
        name: {
          $regex: `^${name.trim()}$`,
          $options: "i",
        },

        _id: {
          $ne: req.params.id,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "A category with this name already exists.",
        });
      }
    }

    /* =================================================
       UPDATE NAME
       ================================================= */

    if (name !== undefined) {
      category.name = name.trim();
    }

    /* =================================================
       UPDATE DESCRIPTION
       ================================================= */

    if (description !== undefined) {
      category.description = description.trim();
    }

    /* =================================================
       UPDATE STATUS
       ================================================= */

    if (status !== undefined) {
      category.status = status === "Inactive" ? "Inactive" : "Active";
    }

    /* =================================================
       UPDATE IMAGE
       ================================================= */

    /*
      Only replace image when a new image
      was actually uploaded.

      Existing image remains untouched
      when editing without selecting
      a new image.
    */

    if (req.processedCategoryImage) {
      const oldImage = category.image;

      category.image = req.processedCategoryImage;

      /*
        Delete old image only AFTER
        a new image has been processed.
      */

      if (oldImage && oldImage !== req.processedCategoryImage) {
        deleteImageFile(oldImage);
      }
    }

    /* =================================================
       SAVE
       ================================================= */

    await category.save();

    console.log("CATEGORY UPDATED:", category);

    return res.status(200).json({
      success: true,
      message: "Car category updated successfully.",
      data: category,
    });
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);

    /* =================================================
       DUPLICATE KEY
       ================================================= */

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A category with this name already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update car category.",
      error: error.message,
    });
  }
};

/* =====================================================
   DELETE CATEGORY
   DELETE /api/car-categories/:id
   ===================================================== */

const deleteCategory = async (req, res) => {
  try {
    console.log("DELETE CATEGORY ID:", req.params.id);

    /* =================================================
       FIND CATEGORY
       ================================================= */

    const category = await CarCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Car category not found.",
      });
    }

    /* =================================================
       DELETE IMAGE
       ================================================= */

    if (category.image) {
      deleteImageFile(category.image);
    }

    /* =================================================
       DELETE CATEGORY
       ================================================= */

    await CarCategory.findByIdAndDelete(req.params.id);

    console.log("CATEGORY DELETED:", req.params.id);

    return res.status(200).json({
      success: true,
      message: "Car category deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete car category.",
      error: error.message,
    });
  }
};

/* =====================================================
   EXPORTS
   ===================================================== */

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
