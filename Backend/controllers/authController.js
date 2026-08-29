const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const setupAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const cleanUsername = username.trim().toLowerCase();

    if (cleanUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters",
      });
    }

    if (password.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 5 characters",
      });
    }

    const existingAdmin = await Admin.findOne();

    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        setupCompleted: true,
        adminExists: true,
        message: "Admin account has already been created",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      username: cleanUsername,
      password: hashedPassword,
      name: "Admin User",
      email: "",
      phone: "",
      role: "Super Admin",
      address: "",
      language: "English",
      timeZone: "(UTC+05:30) India Standard Time",
      bio: "",
      avatar: "",
      isActive: true,
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
      message: "Admin account created successfully",
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("SETUP ADMIN ERROR:", error);

    if (error.code === 11000) {
      return res.status(403).json({
        success: false,
        setupCompleted: true,
        adminExists: true,
        message: "Admin account has already been created",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while creating admin",
    });
  }
};

const getSetupStatus = async (req, res) => {
  try {
    const admin = await Admin.findOne().select("_id");

    return res.status(200).json({
      success: true,
      setupCompleted: !!admin,
      adminExists: !!admin,
    });
  } catch (error) {
    console.error("SETUP STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to check setup status",
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const cleanUsername = username.trim().toLowerCase();

    const admin = await Admin.findOne({
      username: cleanUsername,
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    if (admin.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Admin account is disabled",
      });
    }

    const passwordMatched = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured on server",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id.toString(),
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const loginRecord = {
      loginAt: new Date(),
      ipAddress:
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "",
      userAgent: req.headers["user-agent"] || "",
    };

    admin.loginActivity = [
      loginRecord,
      ...(admin.loginActivity || []),
    ].slice(0, 20);

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        avatar: admin.avatar,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const adminId = req.admin.id || req.admin._id;

    const admin = await Admin.findById(adminId).select(
      "-password"
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get admin information",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const adminId = req.admin.id || req.admin._id;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const {
      name,
      email,
      phone,
      address,
      language,
      timeZone,
      bio,
      avatar,
    } = req.body;

    if (name !== undefined) {
      admin.name = String(name).trim();
    }

    if (email !== undefined) {
      admin.email = String(email).trim().toLowerCase();
    }

    if (phone !== undefined) {
      admin.phone = String(phone).trim();
    }

    if (address !== undefined) {
      admin.address = String(address).trim();
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

    if (avatar !== undefined) {
      admin.avatar = avatar;
    }

    await admin.save();

    const updatedAdmin = await Admin.findById(
      admin._id
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const adminId = req.admin.id || req.admin._id;

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

    if (newPassword.length < 5) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 5 characters",
      });
    }

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const passwordMatched = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const samePassword = await bcrypt.compare(
      newPassword,
      admin.password
    );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password",
      });
    }

    admin.password = await bcrypt.hash(
      newPassword,
      12
    );

    await admin.save();

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please login again.",
    });
  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const adminId = req.admin.id || req.admin._id;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const {
      emailNotif,
      smsNotif,
      darkMode,
      twoFactor,
    } = req.body;

    admin.preferences = {
      emailNotif:
        emailNotif !== undefined
          ? Boolean(emailNotif)
          : admin.preferences?.emailNotif ?? true,

      smsNotif:
        smsNotif !== undefined
          ? Boolean(smsNotif)
          : admin.preferences?.smsNotif ?? false,

      darkMode:
        darkMode !== undefined
          ? Boolean(darkMode)
          : admin.preferences?.darkMode ?? false,

      twoFactor:
        twoFactor !== undefined
          ? Boolean(twoFactor)
          : admin.preferences?.twoFactor ?? false,
    };

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Preferences saved successfully",
      preferences: admin.preferences,
    });
  } catch (error) {
    console.error(
      "UPDATE PREFERENCES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to save preferences",
    });
  }
};

const getLoginActivity = async (req, res) => {
  try {
    const adminId = req.admin.id || req.admin._id;

    const admin = await Admin.findById(adminId)
      .select("loginActivity")
      .lean();

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const activity = (
      admin.loginActivity || []
    )
      .sort(
        (a, b) =>
          new Date(b.loginAt) -
          new Date(a.loginAt)
      )
      .slice(0, 20);

    return res.status(200).json({
      success: true,
      activity,
    });
  } catch (error) {
    console.error(
      "GET LOGIN ACTIVITY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch login activity",
    });
  }
};

module.exports = {
  setupAdmin,
  getSetupStatus,
  loginAdmin,
  getMe,
  updateProfile,
  updatePassword,
  updatePreferences,
  getLoginActivity,
};