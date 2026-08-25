const express = require("express");

const router = express.Router();

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/carCategoryController");

const {
  upload,
  convertCategoryToWebp,
} = require("../middleware/upload");

/* =====================================================
   DEBUG
   ===================================================== */

console.log(
  "createCategory:",
  typeof createCategory
);

console.log(
  "updateCategory:",
  typeof updateCategory
);

console.log(
  "upload:",
  typeof upload
);

console.log(
  "convertCategoryToWebp:",
  typeof convertCategoryToWebp
);

/* =====================================================
   GET ALL
   ===================================================== */

router.get(
  "/",
  getCategories
);

/* =====================================================
   GET ONE
   ===================================================== */

router.get(
  "/:id",
  getCategoryById
);

/* =====================================================
   CREATE
   ===================================================== */

router.post(
  "/",
  upload.single("image"),
  convertCategoryToWebp,
  createCategory
);

/* =====================================================
   UPDATE
   ===================================================== */

router.put(
  "/:id",
  upload.single("image"),
  convertCategoryToWebp,
  updateCategory
);

/* =====================================================
   DELETE
   ===================================================== */

router.delete(
  "/:id",
  deleteCategory
);

module.exports = router;