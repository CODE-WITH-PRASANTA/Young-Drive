const Admin = require("../models/Admin");

/* =====================================================
   FORMAT ADMIN RESPONSE
   ===================================================== */

const formatAdmin = (admin) => {
  if (!admin) {
    return null;
  }

  return {
    id: admin._id,
    _id: admin._id,

    name: admin.name || "",
    username: admin.username || "",
    email: admin.email || "",
    phone: admin.phone || "",

    role: admin.role || "Super Admin",

    address: admin.address || "",
    language: admin.language || "English",

    timeZone:
      admin.timeZone ||
      "(UTC+05:30) India Standard Time",

    bio: admin.bio || "",

    avatar: admin.avatar || null,

    isActive:
      admin.isActive !== undefined
        ? admin.isActive
        : true,

    preferences: {
      emailNotif:
        admin.preferences?.emailNotif !== undefined
          ? admin.preferences.emailNotif
          : true,

      smsNotif:
        admin.preferences?.smsNotif !== undefined
          ? admin.preferences.smsNotif
          : false,

      darkMode:
        admin.preferences?.darkMode !== undefined
          ? admin.preferences.darkMode
          : false,

      twoFactor:
        admin.preferences?.twoFactor !== undefined
          ? admin.preferences.twoFactor
          : false,
    },

    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
};

/* =====================================================
   GET CURRENT SUPER ADMIN
   GET /api/auth/me
   ===================================================== */

exports.getMe = async (req, res) => {
  try {
    let admin = await Admin.findOne({
      role: "Super Admin",
    });

    /* =================================================
       CREATE DEFAULT SUPER ADMIN IF NOT EXISTS
       ================================================= */

    if (!admin) {
      admin = await Admin.create({
        name: "Super Admin",

        username: "admin",

        email: "admin@youngdrive.com",

        phone: "0000000000",

        role: "Super Admin",

        password: "password123",

        address: "",

        language: "English",

        timeZone:
          "(UTC+05:30) India Standard Time",

        bio: "",

        avatar: null,

        isActive: true,

        preferences: {
          emailNotif: true,
          smsNotif: false,
          darkMode: false,
          twoFactor: false,
        },

        loginActivity: [],
      });

      console.log(
        "DEFAULT SUPER ADMIN CREATED:",
        admin.email
      );
    }

    return res.status(200).json({
      success: true,
      message: "Admin profile fetched successfully",
      admin: formatAdmin(admin),
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin profile",
      error: error.message,
    });
  }
};

/* =====================================================
   UPDATE PROFILE
   PUT /api/auth/profile
   ===================================================== */

exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      phone,
      address,
      language,
      timeZone,
      bio,
    } = req.body;

    const admin = await Admin.findOne({
      role: "Super Admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin not found",
      });
    }

    if (name !== undefined) {
      admin.name = name;
    }

    if (username !== undefined) {
      admin.username = username;
    }

    if (email !== undefined) {
      admin.email = email;
    }

    if (phone !== undefined) {
      admin.phone = phone;
    }

    if (address !== undefined) {
      admin.address = address;
    }

    if (language !== undefined) {
      admin.language = language;
    }

    if (timeZone !== undefined) {
      admin.timeZone = timeZone;
    }

    if (bio !== undefined) {
      admin.bio = bio;
    }

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin: formatAdmin(admin),
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

/* =====================================================
   UPDATE PASSWORD
   PUT /api/auth/password
   ===================================================== */

exports.updatePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required",
      });
    }

    const admin = await Admin.findOne({
      role: "Super Admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin not found",
      });
    }

    if (admin.password !== currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    admin.password = newPassword;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update password",
      error: error.message,
    });
  }
};

/* =====================================================
   UPDATE PREFERENCES
   PUT /api/auth/preferences
   ===================================================== */

exports.updatePreferences = async (req, res) => {
  try {
    const {
      emailNotif,
      smsNotif,
      darkMode,
      twoFactor,
    } = req.body;

    const admin = await Admin.findOne({
      role: "Super Admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin not found",
      });
    }

    if (!admin.preferences) {
      admin.preferences = {};
    }

    if (emailNotif !== undefined) {
      admin.preferences.emailNotif =
        emailNotif;
    }

    if (smsNotif !== undefined) {
      admin.preferences.smsNotif =
        smsNotif;
    }

    if (darkMode !== undefined) {
      admin.preferences.darkMode =
        darkMode;
    }

    if (twoFactor !== undefined) {
      admin.preferences.twoFactor =
        twoFactor;
    }

    await admin.save();

    return res.status(200).json({
      success: true,
      message:
        "Preferences updated successfully",
      admin: formatAdmin(admin),
    });
  } catch (error) {
    console.error(
      "UPDATE PREFERENCES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update preferences",
      error: error.message,
    });
  }
};

/* =====================================================
   CREATE PROFILE
   POST /api/auth/profiles
   ===================================================== */

exports.createProfile = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      phone,
      role,
      address,
      language,
      timeZone,
      bio,
      password,
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and phone are required",
      });
    }

    const existingAdmin =
      await Admin.findOne({
        email,
      });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message:
          "Admin with this email already exists",
      });
    }

    const admin = await Admin.create({
      name,
      username:
        username || "admin",
      email,
      phone,
      role:
        role || "Super Admin",
      address: address || "",
      language:
        language || "English",
      timeZone:
        timeZone ||
        "(UTC+05:30) India Standard Time",
      bio: bio || "",
      password:
        password || "password123",
      isActive: true,
      avatar: null,

      preferences: {
        emailNotif: true,
        smsNotif: false,
        darkMode: false,
        twoFactor: false,
      },

      loginActivity: [],
    });

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      admin: formatAdmin(admin),
    });
  } catch (error) {
    console.error("CREATE PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create profile",
      error: error.message,
    });
  }
};

/* =====================================================
   GET LOGIN ACTIVITY
   GET /api/auth/login-activity
   ===================================================== */

exports.getLoginActivity = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      role: "Super Admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      loginActivity:
        admin.loginActivity || [],
    });
  } catch (error) {
    console.error(
      "GET LOGIN ACTIVITY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch login activity",
      error: error.message,
    });
  }
};

/* =====================================================
   UPDATE ADMIN AVATAR
   PUT /api/auth/avatar
   ===================================================== */

exports.updateAvatar = async (req, res) => {
  try {
    console.log("=================================");
    console.log("ADMIN AVATAR UPDATE");
    console.log(
      "Processed Avatar:",
      req.processedAvatarImage
    );
    console.log("=================================");

    const imagePath =
      req.processedAvatarImage;

    if (!imagePath) {
      return res.status(400).json({
        success: false,
        message:
          "No image provided or image processing failed.",
      });
    }

    const admin = await Admin.findOne({
      role: "Super Admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Super Admin not found",
      });
    }

    /* ================================================
       SAVE AVATAR PATH TO MONGODB
       ================================================ */

    admin.avatar = imagePath;

    await admin.save();

    console.log(
      "ADMIN AVATAR SAVED:",
      admin.avatar
    );

    return res.status(200).json({
      success: true,
      message:
        "Avatar updated successfully!",
      avatar: admin.avatar,
      admin: formatAdmin(admin),
    });
  } catch (error) {
    console.error(
      "UPDATE AVATAR ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update avatar",
      error: error.message,
    });
  }
};