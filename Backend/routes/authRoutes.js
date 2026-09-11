const express = require("express");

const router = express.Router();

/* =====================================================
   UPLOAD MIDDLEWARE
   ===================================================== */

const {
  upload,
  convertAvatarToWebp,
} = require("../middleware/upload");

/* =====================================================
   AUTH CONTROLLER
   ===================================================== */

const {
  getMe,
  updateProfile,
  updatePassword,
  updatePreferences,
  createProfile,
  getLoginActivity,
  updateAvatar,
} = require("../controllers/authController");

/* =====================================================
   GET CURRENT SUPER ADMIN
   GET /api/auth/me
   ===================================================== */

router.get("/me", getMe);

/* =====================================================
   UPDATE PROFILE
   PUT /api/auth/profile
   ===================================================== */

router.put("/profile", updateProfile);

/* =====================================================
   UPDATE PASSWORD
   PUT /api/auth/password
   ===================================================== */

router.put("/password", updatePassword);

/* =====================================================
   UPDATE PREFERENCES
   PUT /api/auth/preferences
   ===================================================== */

router.put("/preferences", updatePreferences);

/* =====================================================
   CREATE PROFILE
   POST /api/auth/profiles
   ===================================================== */

router.post("/profiles", createProfile);

/* =====================================================
   LOGIN ACTIVITY
   GET /api/auth/login-activity
   ===================================================== */

router.get("/login-activity", getLoginActivity);

/* =====================================================
   UPDATE ADMIN AVATAR
   PUT /api/auth/avatar

   FormData field:
   image
   ===================================================== */

router.put(
  "/avatar",
  upload.single("image"),
  convertAvatarToWebp,
  updateAvatar
);

/* =====================================================
   EXPORT ROUTER
   ===================================================== */

module.exports = router;