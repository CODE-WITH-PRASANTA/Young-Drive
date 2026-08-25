const Enquiry = require("../models/enquiryModel");

/* =====================================================
   CREATE ENQUIRY
   POST /api/enquiries
===================================================== */

const createEnquiry = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      course,
      date,
      message,
    } = req.body;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course is required.",
      });
    }

    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    /* =====================================================
       PHONE VALIDATION
    ===================================================== */

    const cleanPhone = phone
      .trim()
      .replace(/\s+/g, "");

    if (!/^[+]?[\d-]{7,15}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    /* =====================================================
       CREATE ENQUIRY
    ===================================================== */

    const enquiry = await Enquiry.create({
      name: name.trim(),

      phone: cleanPhone,

      email: email.trim().toLowerCase(),

      course,

      date: date
        ? String(date).trim()
        : "",

      message: message
        ? message.trim()
        : "",

      status: "New",
    });

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(201).json({
      success: true,
      message:
        "Your enquiry has been submitted successfully.",

      data: enquiry,
    });
  } catch (error) {
    console.error(
      "CREATE ENQUIRY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to submit enquiry.",
      error: error.message,
    });
  }
};

/* =====================================================
   GET ALL ENQUIRIES
   GET /api/enquiries
===================================================== */

const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error(
      "GET ENQUIRIES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch enquiries.",
      error: error.message,
    });
  }
};

/* =====================================================
   GET SINGLE ENQUIRY
   GET /api/enquiries/:id
===================================================== */

const getEnquiryById = async (req, res) => {
  try {
    const enquiry =
      await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error(
      "GET ENQUIRY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch enquiry.",
      error: error.message,
    });
  }
};

/* =====================================================
   UPDATE ENQUIRY
   PUT /api/enquiries/:id
===================================================== */

const updateEnquiry = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      course,
      date,
      message,
      status,
    } = req.body;

    const enquiry =
      await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    /* =====================================================
       UPDATE FIELDS
    ===================================================== */

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty.",
        });
      }

      enquiry.name = name.trim();
    }

    if (phone !== undefined) {
      if (!phone.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Phone number cannot be empty.",
        });
      }

      enquiry.phone = phone
        .trim()
        .replace(/\s+/g, "");
    }

    if (email !== undefined) {
      if (!email.trim()) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty.",
        });
      }

      enquiry.email =
        email.trim().toLowerCase();
    }

    if (course !== undefined) {
      enquiry.course = course;
    }

    if (date !== undefined) {
      enquiry.date = date;
    }

    if (message !== undefined) {
      enquiry.message = message.trim();
    }

    if (status !== undefined) {
      enquiry.status = status;
    }

    await enquiry.save();

    return res.status(200).json({
      success: true,
      message:
        "Enquiry updated successfully.",
      data: enquiry,
    });
  } catch (error) {
    console.error(
      "UPDATE ENQUIRY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update enquiry.",
      error: error.message,
    });
  }
};

/* =====================================================
   DELETE ENQUIRY
   DELETE /api/enquiries/:id
===================================================== */

const deleteEnquiry = async (req, res) => {
  try {
    const enquiry =
      await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    await Enquiry.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Enquiry deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE ENQUIRY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete enquiry.",
      error: error.message,
    });
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
};