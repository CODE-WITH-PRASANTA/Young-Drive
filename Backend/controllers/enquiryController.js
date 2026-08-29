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
      service,
      location,
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

    if (!service || !service.trim()) {
      return res.status(400).json({
        success: false,
        message: "Service type is required.",
      });
    }

    if (!location || !location.trim()) {
      return res.status(400).json({
        success: false,
        message: "Pickup location is required.",
      });
    }

    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address.",
        });
      }
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
       DATE VALIDATION
    ===================================================== */

    let enquiryDate = new Date();

    if (date) {
      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid date.",
        });
      }

      enquiryDate = parsedDate;
    }

    /* =====================================================
       CREATE ENQUIRY
    ===================================================== */

    const enquiry = await Enquiry.create({
      name: name.trim(),

      phone: cleanPhone,

      email: email
        ? email.trim().toLowerCase()
        : "",

      service: service.trim(),

      location: location.trim(),

      date: enquiryDate,

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
      message: "Your enquiry has been submitted successfully.",
      data: enquiry,
    });
  } catch (error) {
    console.error("CREATE ENQUIRY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit enquiry.",
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
    const enquiries = await Enquiry.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("GET ENQUIRIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries.",
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
    const enquiry = await Enquiry.findById(req.params.id);

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
    console.error("GET ENQUIRY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch enquiry.",
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
      service,
      location,
      date,
      message,
      status,
    } = req.body;

    /* =====================================================
       FIND ENQUIRY
    ===================================================== */

    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    /* =====================================================
       UPDATE NAME
    ===================================================== */

    if (name !== undefined) {
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty.",
        });
      }

      enquiry.name = name.trim();
    }

    /* =====================================================
       UPDATE PHONE
    ===================================================== */

    if (phone !== undefined) {
      if (!phone || !phone.trim()) {
        return res.status(400).json({
          success: false,
          message: "Phone number cannot be empty.",
        });
      }

      const cleanPhone = phone
        .trim()
        .replace(/\s+/g, "");

      if (!/^[+]?[\d-]{7,15}$/.test(cleanPhone)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid phone number.",
        });
      }

      enquiry.phone = cleanPhone;
    }

    /* =====================================================
       UPDATE EMAIL
    ===================================================== */

    if (email !== undefined) {
      if (email && email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
          return res.status(400).json({
            success: false,
            message: "Please enter a valid email address.",
          });
        }

        enquiry.email = email.trim().toLowerCase();
      } else {
        enquiry.email = "";
      }
    }

    /* =====================================================
       UPDATE SERVICE
    ===================================================== */

    if (service !== undefined) {
      if (!service || !service.trim()) {
        return res.status(400).json({
          success: false,
          message: "Service type cannot be empty.",
        });
      }

      enquiry.service = service.trim();
    }

    /* =====================================================
       UPDATE LOCATION
    ===================================================== */

    if (location !== undefined) {
      if (!location || !location.trim()) {
        return res.status(400).json({
          success: false,
          message: "Pickup location cannot be empty.",
        });
      }

      enquiry.location = location.trim();
    }

    /* =====================================================
       UPDATE DATE
    ===================================================== */

    if (date !== undefined) {
      if (!date) {
        return res.status(400).json({
          success: false,
          message: "Date cannot be empty.",
        });
      }

      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid date.",
        });
      }

      enquiry.date = parsedDate;
    }

    /* =====================================================
       UPDATE MESSAGE
    ===================================================== */

    if (message !== undefined) {
      enquiry.message = message
        ? message.trim()
        : "";
    }

    /* =====================================================
       UPDATE STATUS
    ===================================================== */

    if (status !== undefined) {
      const allowedStatuses = [
        "New",
        "Contacted",
        "Converted",
        "Closed",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status. Allowed values are New, Contacted, Converted, Closed.",
        });
      }

      enquiry.status = status;
    }

    /* =====================================================
       SAVE UPDATED ENQUIRY
    ===================================================== */

    await enquiry.save();

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(200).json({
      success: true,
      message: "Enquiry updated successfully.",
      data: enquiry,
    });
  } catch (error) {
    console.error("UPDATE ENQUIRY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update enquiry.",
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
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    await Enquiry.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE ENQUIRY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete enquiry.",
      error: error.message,
    });
  }
};

/* =====================================================
   EXPORT ALL CONTROLLERS
===================================================== */

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
};