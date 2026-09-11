const mongoose = require("mongoose");

const loginActivitySchema = new mongoose.Schema(
  {
    loginAt: {
      type: Date,
      default: Date.now,
    },

    ipAddress: {
      type: String,
      default: "127.0.0.1",
      trim: true,
    },
  },
  {
    _id: true,
  }
);

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    username: {
      type: String,
      trim: true,
      lowercase: true,
      default: "admin",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      enum: [
        "Super Admin",
        "Manager",
        "Support Agent",
      ],
      default: "Super Admin",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    language: {
      type: String,
      trim: true,
      default: "English",
    },

    timeZone: {
      type: String,
      trim: true,
      default:
        "(UTC+05:30) India Standard Time",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    password: {
      type: String,
      required: true,
      default: "password123",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    /* ================================================
       ADMIN AVATAR
       ================================================ */

    avatar: {
      type: String,
      default: null,
    },

    preferences: {
      emailNotif: {
        type: Boolean,
        default: true,
      },

      smsNotif: {
        type: Boolean,
        default: false,
      },

      darkMode: {
        type: Boolean,
        default: false,
      },

      twoFactor: {
        type: Boolean,
        default: false,
      },
    },

    loginActivity: {
      type: [loginActivitySchema],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Admin",
  adminSchema
);