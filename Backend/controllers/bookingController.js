const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");

/* =========================================================
   HELPER: GET VEHICLE / LISTING NAME
========================================================= */

const getVehicleName = (vehicle) => {
  if (!vehicle) {
    return "Vehicle";
  }

  const brand = vehicle.vehicleBrand || vehicle.brand || vehicle.make || "";

  const model = vehicle.vehicleModel || vehicle.model || "";

  const brandModel = [brand, model].filter(Boolean).join(" ").trim();

  if (brandModel) {
    return brandModel;
  }

  return vehicle.name || vehicle.title || vehicle.vehicleName || "Vehicle";
};

/* =========================================================
   HELPER: GET VEHICLE IMAGE
========================================================= */

const getVehicleImage = (vehicle) => {
  if (!vehicle) {
    return "";
  }

  if (vehicle.image && typeof vehicle.image === "string") {
    return vehicle.image;
  }

  if (vehicle.imageUrl && typeof vehicle.imageUrl === "string") {
    return vehicle.imageUrl;
  }

  if (Array.isArray(vehicle.images) && vehicle.images.length > 0) {
    return vehicle.images[0];
  }

  return "";
};

/* =========================================================
   HELPER: NORMALIZE BOOKING
========================================================= */

const normalizeBooking = (booking) => {
  if (!booking) {
    return null;
  }

  const vehicle =
    booking.vehicle && typeof booking.vehicle === "object"
      ? booking.vehicle
      : null;

  /* =====================================================
     CUSTOMER
  ===================================================== */

  const customerName =
    booking.customerName ||
    booking.customer?.name ||
    booking.customer?.fullName ||
    booking.fullName ||
    booking.name ||
    "";

  const email = booking.email || booking.customer?.email || "";

  const phone = booking.phone || booking.customer?.phone || "";

  /* =====================================================
     VEHICLE
  ===================================================== */

  const vehicleName =
    booking.vehicleName || getVehicleName(vehicle) || "Vehicle";

  const vehicleImage = booking.vehicleImage || getVehicleImage(vehicle);

  /* =====================================================
     RETURN
  ===================================================== */

  return {
    ...booking,

    /* IDs */

    id: booking.bookingId || booking._id,

    bookingId: booking.bookingId || booking._id,

    /* CUSTOMER */

    customerName,

    email,

    phone,

    customer: {
      ...(booking.customer || {}),

      name: customerName,

      fullName: customerName,

      email,

      phone,
    },

    /* VEHICLE */

    vehicleName,

    vehicleImage,

    car: vehicleName,

    /* LOCATION */

    location:
      booking.pickupLocation || booking.pickupLoc || booking.location || "",

    dropLocation:
      booking.dropoffLocation ||
      booking.dropLocation ||
      booking.returnLoc ||
      "",

    /* DATES */

    fullPickupDate:
      booking.pickupDate || booking.startDate || booking.bookingDate || null,

    fullDropoffDate:
      booking.dropoffDate || booking.returnDate || booking.endDate || null,

    /* TIMES */

    pickupTime: booking.pickupTime || "10:00 AM",

    dropoffTime: booking.dropoffTime || "10:00 AM",

    /* STATUS */

    status: booking.status || "Pending",

    /* TYPE */

    type: booking.bookingType || booking.type || "pickup-drop",
  };
};

/* =========================================================
   GENERATE BOOKING ID
========================================================= */

const generateBookingId = async () => {
  const count = await Booking.countDocuments();

  const sequence = String(count + 1).padStart(5, "0");

  const year = new Date().getFullYear();

  return `BK-${year}-${sequence}`;
};

/* =========================================================
   GET ALL BOOKINGS
   GET /api/bookings
========================================================= */

exports.getBookings = async (req, res) => {
  try {
    const { status, search } = req.query;

    const query = {};

    /* =====================================================
       STATUS FILTER
    ===================================================== */

    if (status && status !== "All" && status !== "All Status") {
      query.status = status;
    }

    /* =====================================================
       SEARCH
    ===================================================== */

    if (search && search.trim()) {
      const searchText = search.trim();

      query.$or = [
        {
          bookingId: {
            $regex: searchText,
            $options: "i",
          },
        },

        {
          customerName: {
            $regex: searchText,
            $options: "i",
          },
        },

        {
          fullName: {
            $regex: searchText,
            $options: "i",
          },
        },

        {
          email: {
            $regex: searchText,
            $options: "i",
          },
        },

        {
          phone: {
            $regex: searchText,
            $options: "i",
          },
        },

        {
          vehicleName: {
            $regex: searchText,
            $options: "i",
          },
        },

        {
          pickupLocation: {
            $regex: searchText,
            $options: "i",
          },
        },

        {
          dropoffLocation: {
            $regex: searchText,
            $options: "i",
          },
        },
      ];
    }

    /* =====================================================
       GET BOOKINGS

       IMPORTANT:
       vehicle now references Listing
    ===================================================== */

    const bookings = await Booking.find(query)
      .populate({
        path: "vehicle",
        model: "Listing",
      })
      .sort({
        pickupDate: 1,
        createdAt: -1,
      })
      .lean();

    /* =====================================================
       NORMALIZE
    ===================================================== */

    const formatted = bookings.map(normalizeBooking);

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookings.",
    });
  }
};

/* =========================================================
   GET SINGLE BOOKING
   GET /api/bookings/:id
========================================================= */

exports.getBookingById = async (req, res) => {
  try {
    let booking = null;

    /* =====================================================
       FIND BY MONGODB ID
    ===================================================== */

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      booking = await Booking.findById(req.params.id)
        .populate({
          path: "vehicle",
          model: "Listing",
        })
        .lean();
    }

    /* =====================================================
       FIND BY BOOKING ID
    ===================================================== */

    if (!booking) {
      booking = await Booking.findOne({
        bookingId: req.params.id,
      })
        .populate({
          path: "vehicle",
          model: "Listing",
        })
        .lean();
    }

    /* =====================================================
       NOT FOUND
    ===================================================== */

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: normalizeBooking(booking),
    });
  } catch (error) {
    console.error("GET BOOKING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch booking.",
    });
  }
};

/* =========================================================
   CREATE BOOKING
   POST /api/bookings
========================================================= */

exports.createBooking = async (req, res) => {
  try {
   

    const {
      customerName,
      fullName,
      email,
      phone,

      vehicle,
      vehicleId,
      vehicleName,
      vehicleImage,

      bookingDate,
      bookingTime,

      pickupDate,
      pickupTime,

      returnDate,
      dropoffDate,
      dropoffTime,

      pickupLocation,
      pickupLoc,

      dropoffLocation,
      dropLocation,
      returnLoc,

      amount,
      price,

      status,
      paymentStatus,

      additionalMessage,
      message,
    } = req.body;

    /* =====================================================
       CUSTOMER
    ===================================================== */

    const finalCustomerName = customerName || fullName || "";

    if (!finalCustomerName || !finalCustomerName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required.",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required.",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer phone is required.",
      });
    }

    /* =====================================================
       VEHICLE / LISTING ID
    ===================================================== */

    const selectedVehicleId = vehicleId || vehicle || "";

    

    if (!selectedVehicleId) {
      return res.status(400).json({
        success: false,
        message: "Please select a vehicle.",
      });
    }

    /* =====================================================
       VALIDATE OBJECT ID
    ===================================================== */

    if (!mongoose.Types.ObjectId.isValid(selectedVehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Selected vehicle ID is not a valid MongoDB ID.",
      });
    }

    /* =====================================================
       FIND LISTING

       IMPORTANT:
       Your frontend vehicle dropdown is using
       /listings.

       Therefore we search Listing here.
    ===================================================== */

   
    const selectedListing = await Listing.findById(selectedVehicleId).lean();

   

    if (!selectedListing) {
      

      return res.status(404).json({
        success: false,
        message: "Selected listing/vehicle not found.",
      });
    }

    /* =====================================================
       VEHICLE NAME
    ===================================================== */

    const finalVehicleName = vehicleName || getVehicleName(selectedListing);

    /* =====================================================
       VEHICLE IMAGE
    ===================================================== */

    let finalVehicleImage = vehicleImage || "";

    if (!finalVehicleImage) {
      finalVehicleImage = getVehicleImage(selectedListing);
    }

    /* =====================================================
       LOCATION
    ===================================================== */

    const finalPickupLocation = pickupLocation || pickupLoc || "";

    const finalDropoffLocation =
      dropoffLocation || dropLocation || returnLoc || "";

    if (!finalPickupLocation) {
      return res.status(400).json({
        success: false,
        message: "Pickup location is required.",
      });
    }

    if (!finalDropoffLocation) {
      return res.status(400).json({
        success: false,
        message: "Drop-off location is required.",
      });
    }

    /* =====================================================
       PICKUP DATE
    ===================================================== */

    if (!pickupDate) {
      return res.status(400).json({
        success: false,
        message: "Pickup date is required.",
      });
    }

    /* =====================================================
       DROP-OFF DATE
    ===================================================== */

    const finalDropoffDate = dropoffDate || returnDate;

    if (!finalDropoffDate) {
      return res.status(400).json({
        success: false,
        message: "Drop-off date is required.",
      });
    }

    /* =====================================================
       DATE OBJECTS
    ===================================================== */

    const pickupDateObject = new Date(pickupDate);

    const dropoffDateObject = new Date(finalDropoffDate);

    if (Number.isNaN(pickupDateObject.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup date.",
      });
    }

    if (Number.isNaN(dropoffDateObject.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid drop-off date.",
      });
    }

    if (dropoffDateObject < pickupDateObject) {
      return res.status(400).json({
        success: false,
        message: "Drop-off date cannot be before pickup date.",
      });
    }

    /* =====================================================
       BOOKING DATE
    ===================================================== */

    let finalBookingDate = new Date();

    if (bookingDate) {
      const parsedBookingDate = new Date(bookingDate);

      if (!Number.isNaN(parsedBookingDate.getTime())) {
        finalBookingDate = parsedBookingDate;
      }
    }

    /* =====================================================
       AMOUNT
    ===================================================== */

    const finalAmount = Number(amount ?? price ?? 0);

    /* =====================================================
       BOOKING ID
    ===================================================== */

    const bookingId = await generateBookingId();

    /* =====================================================
       CREATE BOOKING DATA
    ===================================================== */

    const bookingData = {
      // =====================================================
      // CUSTOMER
      // =====================================================

      customerName: finalCustomerName.trim(),

      email: email.trim(),

      phone: phone.trim(),

      // =====================================================
      // VEHICLE
      // =====================================================

      vehicle: selectedListing._id,

      vehicleName: finalVehicleName,

      vehicleImage: finalVehicleImage,

      // =====================================================
      // BOOKING DATE
      // =====================================================

      bookingDate: finalBookingDate,

      bookingTime: bookingTime || "10:00 AM",

      // =====================================================
      // PICKUP
      // =====================================================

      pickupDate: pickupDateObject,

      pickupTime: pickupTime || "10:00 AM",

      pickupLocation: finalPickupLocation.trim(),

      // =====================================================
      // RETURN / DROP-OFF
      // =====================================================

      returnDate: dropoffDateObject,

      dropoffDate: dropoffDateObject,

      dropoffTime: dropoffTime || "10:00 AM",

      dropoffLocation: finalDropoffLocation.trim(),

      // =====================================================
      // PAYMENT / BOOKING
      // =====================================================

      amount: finalAmount,

      status: status || "Pending",

      paymentStatus: paymentStatus || "Unpaid",

      paymentMethod: req.body.paymentMethod || "",

      additionalMessage: additionalMessage || message || "",
    };
   

    /* =====================================================
       SAVE
    ===================================================== */

    const booking = await Booking.create(bookingData);

    

    /* =====================================================
       RETURN POPULATED BOOKING
    ===================================================== */

    const createdBooking = await Booking.findById(booking._id)
      .populate({
        path: "vehicle",
        model: "Listing",
      })
      .lean();

    return res.status(201).json({
      success: true,

      message: "Booking created successfully.",

      data: normalizeBooking(createdBooking),
    });
  } catch (error) {
    console.error("==============================================");

    console.error("CREATE BOOKING ERROR");

    console.error(error);

    console.error("==============================================");

    /* =====================================================
       DUPLICATE
    ===================================================== */

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate booking data.",
        error: error.message,
      });
    }

    /* =====================================================
       MONGOOSE VALIDATION
    ===================================================== */

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (item) => item.message,
      );

      return res.status(400).json({
        success: false,
        message: validationErrors.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create booking.",
    });
  }
};

/* =========================================================
   UPDATE BOOKING
   PUT /api/bookings/:id
========================================================= */

exports.updateBooking = async (req, res) => {
  try {
    const body = {
      ...(req.body || {}),
    };

    /* =====================================================
       CUSTOMER
    ===================================================== */

    if (body.customerName !== undefined) {
      body.customerName = String(body.customerName).trim();
    }

    if (body.fullName !== undefined) {
      body.fullName = String(body.fullName).trim();
    }

    if (body.email !== undefined) {
      body.email = String(body.email).trim();
    }

    if (body.phone !== undefined) {
      body.phone = String(body.phone).trim();
    }

    /* =====================================================
       VEHICLE / LISTING
    ===================================================== */

    const incomingVehicleId = body.vehicleId || body.vehicle;

    if (incomingVehicleId) {
      if (!mongoose.Types.ObjectId.isValid(incomingVehicleId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vehicle ID.",
        });
      }

      const listing = await Listing.findById(incomingVehicleId).lean();

      if (!listing) {
        return res.status(404).json({
          success: false,
          message: "Selected listing/vehicle not found.",
        });
      }

      body.vehicle = listing._id;

      body.vehicleId = listing._id;

      body.vehicleName =
        body.vehicleName && String(body.vehicleName).trim()
          ? String(body.vehicleName).trim()
          : getVehicleName(listing);

      if (!body.vehicleImage) {
        body.vehicleImage = getVehicleImage(listing);
      }
    }

    /* =====================================================
       AMOUNT
    ===================================================== */

    if (body.amount !== undefined) {
      body.amount = Number(body.amount) || 0;
    }

    if (body.price !== undefined) {
      body.price = Number(body.price) || 0;
    }

    /* =====================================================
       DATES
    ===================================================== */

    if (body.pickupDate) {
      const date = new Date(body.pickupDate);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid pickup date.",
        });
      }

      body.pickupDate = date;
    }

    if (body.dropoffDate) {
      const date = new Date(body.dropoffDate);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid drop-off date.",
        });
      }

      body.dropoffDate = date;

      body.returnDate = date;
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,

      body,

      {
        new: true,
        runValidators: true,
      },
    )
      .populate({
        path: "vehicle",
        model: "Listing",
      })
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message: "Booking updated successfully.",

      data: normalizeBooking(booking),
    });
  } catch (error) {
    console.error("UPDATE BOOKING ERROR:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update booking.",
    });
  }
};

/* =========================================================
   UPDATE STATUS
   PATCH /api/bookings/:id/status
========================================================= */

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, cancellationReason, cancellationComment } = req.body || {};

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Ongoing",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const update = {
      status,
    };

    if (cancellationReason !== undefined) {
      update.cancellationReason = cancellationReason;
    }

    if (cancellationComment !== undefined) {
      update.cancellationComment = cancellationComment;
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,

      update,

      {
        new: true,
        runValidators: true,
      },
    )
      .populate({
        path: "vehicle",
        model: "Listing",
      })
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message: "Booking status updated successfully.",

      data: normalizeBooking(booking),
    });
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update booking status.",
    });
  }
};

/* =========================================================
   DELETE BOOKING
   DELETE /api/bookings/:id
========================================================= */

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE BOOKING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete booking.",
    });
  }
};
