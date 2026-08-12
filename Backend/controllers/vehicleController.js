const Vehicle = require("../models/Vehicle");

/* =========================================================
   HELPER: PARSE PRICE
========================================================= */

const parsePrice = (value) => {
  if (typeof value === "number") {
    return value;
  }

  if (!value || value.toString().trim() === "") {
    return 0;
  }

  const cleaned = value
    .toString()
    .replace(/[^0-9.-]+/g, "");

  return parseFloat(cleaned) || 0;
};


/* =========================================================
   HELPER: PARSE KEY FEATURES
========================================================= */

const parseKeyFeatures = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }

      return [value];
    } catch (error) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};


/* =========================================================
   HELPER: PARSE YEAR
========================================================= */

const parseYear = (value) => {
  const year = Number(value);

  if (!value || Number.isNaN(year)) {
    return null;
  }

  return year;
};


/* =========================================================
   HELPER: PROCESS IMAGES
========================================================= */

const processImages = (files) => {
  if (!files || !files.length) {
    return [];
  }

  return files.map((file) => {

    /*
      convertToWebp middleware should already
      convert the uploaded file before this
      controller receives it.
    */

    const mimeType =
      file.mimetype || "image/webp";

    const buffer =
      file.buffer;

    if (!buffer) {
      return null;
    }

    return `data:${mimeType};base64,${buffer.toString(
      "base64"
    )}`;

  }).filter(Boolean);
};


/* =========================================================
   HELPER: CLEAN VEHICLE DATA
========================================================= */

const buildVehicleData = (
  body,
  images = []
) => {

  const parsedYear =
    parseYear(
      body.yearOfManufacture
    );


  return {

    vehicleBrand:
      body.vehicleBrand?.trim() || "",

    vehicleModel:
      body.vehicleModel?.trim() || "",

    variantLine:
      body.variantLine?.trim() || "",

    vehicleType:
      body.vehicleType?.trim() || "",

    fuelType:
      body.fuelType || "Petrol",

    transmission:
      body.transmission || "Automatic",

    yearOfManufacture:
      parsedYear,

    registrationNumber:
      body.registrationNumber?.trim() || "",

    seatingCapacity:
      body.seatingCapacity || "",

    color:
      body.color || "White",

    mileage:
      body.mileage || "",

    doors:
      body.doors || "4 Doors",

    description:
      body.description || "",

    keyFeatures:
      parseKeyFeatures(
        body.keyFeatures
      ),

    /* Insurance */

    insuranceProvider:
      body.insuranceProvider || "",

    policyNumber:
      body.policyNumber || "",

    validTill:
      body.validTill &&
      body.validTill.trim() !== ""
        ? new Date(body.validTill)
        : null,

    /* Pricing */

    dailyRentPrice:
      parsePrice(
        body.dailyRentPrice
      ),

    weeklyRentPrice:
      parsePrice(
        body.weeklyRentPrice
      ),

    monthlyRentPrice:
      parsePrice(
        body.monthlyRentPrice
      ),

    securityDeposit:
      parsePrice(
        body.securityDeposit
      ),

    extraKmCharge:
      parsePrice(
        body.extraKmCharge
      ),

    minimumBookingDays:
      body.minimumBookingDays ||
      "1 Day",

    availabilityStatus:
      body.availabilityStatus ||
      "Available",

    /* Images */

    images,

  };
};


/* =========================================================
   CREATE VEHICLE
   POST /api/vehicles
========================================================= */

exports.createVehicle =
  async (req, res) => {

    try {

      const body =
        req.body || {};


      console.log(
        "CREATE VEHICLE BODY:",
        body
      );


      /* -----------------------------------------------
         YEAR VALIDATION
      ----------------------------------------------- */

      const parsedYear =
        parseYear(
          body.yearOfManufacture
        );


      if (
        !body.yearOfManufacture ||
        parsedYear === null
      ) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Year of manufacture is required and must be a valid number.",

        });

      }


      /* -----------------------------------------------
         REGISTRATION VALIDATION
      ----------------------------------------------- */

      if (
        !body.registrationNumber ||
        !body.registrationNumber.trim()
      ) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Registration number is required.",

        });

      }


      /* -----------------------------------------------
         PROCESS IMAGES
      ----------------------------------------------- */

      const imagePaths =
        processImages(
          req.files
        );


      console.log(
        "Uploaded Images:",
        imagePaths.length
      );


      /* -----------------------------------------------
         BUILD DATA
      ----------------------------------------------- */

      const vehicleData =
        buildVehicleData(
          body,
          imagePaths
        );


      /* -----------------------------------------------
         CREATE
      ----------------------------------------------- */

      const newVehicle =
        new Vehicle(
          vehicleData
        );


      const savedVehicle =
        await newVehicle.save();


      return res.status(
        201
      ).json({

        success: true,

        message:
          "Vehicle added successfully!",

        data:
          savedVehicle,

      });

    } catch (error) {

      console.error(
        "CREATE VEHICLE ERROR:",
        error
      );


      /* Duplicate registration */

      if (
        error.code === 11000
      ) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Vehicle with this registration number already exists.",

        });

      }


      /* Mongoose validation */

      return res.status(
        400
      ).json({

        success: false,

        message:
          error.message ||
          "Failed to validate vehicle data.",

      });

    }

  };


/* =========================================================
   GET ALL VEHICLES
   GET /api/vehicles
========================================================= */

exports.getVehicles =
  async (req, res) => {

    try {

      const vehicles =
        await Vehicle.find()
          .sort({
            createdAt: -1,
          });


      return res.status(
        200
      ).json({

        success: true,

        count:
          vehicles.length,

        data:
          vehicles,

      });

    } catch (error) {

      console.error(
        "GET VEHICLES ERROR:",
        error
      );


      return res.status(
        500
      ).json({

        success: false,

        message:
          "Server Error: Unable to fetch vehicles",

        error:
          error.message,

      });

    }

  };


/* =========================================================
   GET SINGLE VEHICLE
   GET /api/vehicles/:id
========================================================= */

exports.getVehicleById =
  async (req, res) => {

    try {

      const vehicle =
        await Vehicle.findById(
          req.params.id
        );


      if (!vehicle) {

        return res.status(
          404
        ).json({

          success: false,

          message:
            "Vehicle not found.",

        });

      }


      return res.status(
        200
      ).json({

        success: true,

        data:
          vehicle,

      });

    } catch (error) {

      console.error(
        "GET VEHICLE ERROR:",
        error
      );


      return res.status(
        500
      ).json({

        success: false,

        message:
          error.message,

      });

    }

  };


/* =========================================================
   UPDATE VEHICLE
   PUT /api/vehicles/:id
========================================================= */

exports.updateVehicle =
  async (req, res) => {

    try {

      const body =
        req.body || {};


      /* -----------------------------------------------
         FIND VEHICLE
      ----------------------------------------------- */

      const existingVehicle =
        await Vehicle.findById(
          req.params.id
        );


      if (!existingVehicle) {

        return res.status(
          404
        ).json({

          success: false,

          message:
            "Vehicle not found.",

        });

      }


      /* -----------------------------------------------
         YEAR
      ----------------------------------------------- */

      let parsedYear =
        existingVehicle.yearOfManufacture;


      if (
        body.yearOfManufacture !==
        undefined
      ) {

        parsedYear =
          parseYear(
            body.yearOfManufacture
          );


        if (
          parsedYear === null
        ) {

          return res.status(
            400
          ).json({

            success: false,

            message:
              "Year of manufacture must be a valid number.",

          });

        }

      }


      /* -----------------------------------------------
         REGISTRATION
      ----------------------------------------------- */

      const registrationNumber =
        body.registrationNumber !==
        undefined
          ? body.registrationNumber.trim()
          : existingVehicle.registrationNumber;


      if (
        !registrationNumber
      ) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Registration number is required.",

        });

      }


      /* -----------------------------------------------
         NEW IMAGES
      ----------------------------------------------- */

      const newImages =
        processImages(
          req.files
        );


      /*
        If new images are uploaded,
        replace the old images.

        If no new images are uploaded,
        keep existing images.
      */

      let finalImages =
        existingVehicle.images || [];


      if (
        newImages.length > 0
      ) {

        finalImages =
          newImages;

      }


      /* -----------------------------------------------
         BUILD UPDATE DATA
      ----------------------------------------------- */

      const updateData = {

        vehicleBrand:
          body.vehicleBrand !==
          undefined
            ? body.vehicleBrand.trim()
            : existingVehicle.vehicleBrand,

        vehicleModel:
          body.vehicleModel !==
          undefined
            ? body.vehicleModel.trim()
            : existingVehicle.vehicleModel,

        variantLine:
          body.variantLine !==
          undefined
            ? body.variantLine.trim()
            : existingVehicle.variantLine,

        vehicleType:
          body.vehicleType !==
          undefined
            ? body.vehicleType.trim()
            : existingVehicle.vehicleType,

        fuelType:
          body.fuelType ||
          existingVehicle.fuelType,

        transmission:
          body.transmission ||
          existingVehicle.transmission,

        yearOfManufacture:
          parsedYear,

        registrationNumber,

        seatingCapacity:
          body.seatingCapacity ||
          existingVehicle.seatingCapacity,

        color:
          body.color ||
          existingVehicle.color,

        mileage:
          body.mileage !==
          undefined
            ? body.mileage
            : existingVehicle.mileage,

        doors:
          body.doors ||
          existingVehicle.doors,

        description:
          body.description !==
          undefined
            ? body.description
            : existingVehicle.description,

        keyFeatures:
          body.keyFeatures !==
          undefined
            ? parseKeyFeatures(
                body.keyFeatures
              )
            : existingVehicle.keyFeatures,

        /* Insurance */

        insuranceProvider:
          body.insuranceProvider !==
          undefined
            ? body.insuranceProvider
            : existingVehicle.insuranceProvider,

        policyNumber:
          body.policyNumber !==
          undefined
            ? body.policyNumber
            : existingVehicle.policyNumber,

        validTill:
          body.validTill !==
          undefined
            ? body.validTill &&
              body.validTill.trim() !== ""
              ? new Date(
                  body.validTill
                )
              : null
            : existingVehicle.validTill,

        /* Pricing */

        dailyRentPrice:
          body.dailyRentPrice !==
          undefined
            ? parsePrice(
                body.dailyRentPrice
              )
            : existingVehicle.dailyRentPrice,

        weeklyRentPrice:
          body.weeklyRentPrice !==
          undefined
            ? parsePrice(
                body.weeklyRentPrice
              )
            : existingVehicle.weeklyRentPrice,

        monthlyRentPrice:
          body.monthlyRentPrice !==
          undefined
            ? parsePrice(
                body.monthlyRentPrice
              )
            : existingVehicle.monthlyRentPrice,

        securityDeposit:
          body.securityDeposit !==
          undefined
            ? parsePrice(
                body.securityDeposit
              )
            : existingVehicle.securityDeposit,

        extraKmCharge:
          body.extraKmCharge !==
          undefined
            ? parsePrice(
                body.extraKmCharge
              )
            : existingVehicle.extraKmCharge,

        minimumBookingDays:
          body.minimumBookingDays ||
          existingVehicle.minimumBookingDays,

        availabilityStatus:
          body.availabilityStatus ||
          existingVehicle.availabilityStatus,

        /* Images */

        images:
          finalImages,

      };


      /* -----------------------------------------------
         UPDATE
      ----------------------------------------------- */

      const updatedVehicle =
        await Vehicle.findByIdAndUpdate(

          req.params.id,

          updateData,

          {
            new: true,

            runValidators:
              true,
          }

        );


      return res.status(
        200
      ).json({

        success: true,

        message:
          "Vehicle updated successfully!",

        data:
          updatedVehicle,

      });

    } catch (error) {

      console.error(
        "UPDATE VEHICLE ERROR:",
        error
      );


      if (
        error.code === 11000
      ) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Vehicle with this registration number already exists.",

        });

      }


      return res.status(
        400
      ).json({

        success: false,

        message:
          error.message ||
          "Failed to update vehicle.",

      });

    }

  };


/* =========================================================
   DELETE VEHICLE
   DELETE /api/vehicles/:id
========================================================= */

exports.deleteVehicle =
  async (req, res) => {

    try {

      const vehicle =
        await Vehicle.findByIdAndDelete(
          req.params.id
        );


      if (!vehicle) {

        return res.status(
          404
        ).json({

          success: false,

          message:
            "Vehicle not found.",

        });

      }


      return res.status(
        200
      ).json({

        success: true,

        message:
          "Vehicle deleted successfully.",

        data:
          vehicle,

      });

    } catch (error) {

      console.error(
        "DELETE VEHICLE ERROR:",
        error
      );


      return res.status(
        500
      ).json({

        success: false,

        message:
          error.message ||
          "Failed to delete vehicle.",

      });

    }

  };