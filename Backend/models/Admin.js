const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      default: "Admin User",
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["Super Admin", "Manager", "Support Agent"],
      default: "Super Admin",
    },

    address: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "English",
    },

    timeZone: {
      type: String,
      default: "(UTC+05:30) India Standard Time",
    },

    bio: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
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

    loginActivity: [
      {
        loginAt: {
          type: Date,
          default: Date.now,
        },

        ipAddress: {
          type: String,
          default: "",
        },

        userAgent: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);