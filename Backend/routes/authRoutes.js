const express = require("express");

const {
  setupAdmin,
  getSetupStatus,
  loginAdmin,
  getMe,
  updateProfile,
  updatePassword,
  updatePreferences,
  getLoginActivity,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/setup", setupAdmin);

router.get("/setup-status", getSetupStatus);

router.post("/login", loginAdmin);

router.get("/me", protect, getMe);

router.put("/profile", protect, updateProfile);

router.put("/password", protect, updatePassword);

router.put(
  "/preferences",
  protect,
  updatePreferences
);

router.get(
  "/login-activity",
  protect,
  getLoginActivity
);

module.exports = router;