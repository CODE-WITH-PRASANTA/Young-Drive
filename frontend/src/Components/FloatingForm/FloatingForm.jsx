import React, { useEffect, useState } from "react";
import "./FloatingForm.css";
import API from "../../api/axios";

const FloatingForm = ({ isOpen: controlledIsOpen, onClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  /* =====================================================
     VEHICLES
  ===================================================== */

  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [vehicleError, setVehicleError] = useState("");

  /* =====================================================
     FORM
  ===================================================== */

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
    date: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const isVisible =
    controlledIsOpen !== undefined
      ? controlledIsOpen
      : internalIsOpen;

  /* =====================================================
     FETCH VEHICLES
  ===================================================== */

  const fetchVehicles = async () => {
    try {
      setLoadingVehicles(true);
      setVehicleError("");

      console.log("======================================");
      console.log("FETCHING VEHICLES FOR ENQUIRY FORM");
      console.log("======================================");

      const response = await API.get("/listings");

      console.log(
        "LISTINGS API RESPONSE:",
        response.data
      );

      const vehicleData =
        response.data?.data ||
        response.data?.listings ||
        response.data?.vehicles ||
        response.data ||
        [];

      if (!Array.isArray(vehicleData)) {
        setVehicles([]);
        return;
      }

      /* =====================================================
         ONLY ACTIVE VEHICLES
      ===================================================== */

      const activeVehicles = vehicleData.filter(
        (vehicle) =>
          vehicle &&
          typeof vehicle === "object" &&
          vehicle.status !== "Inactive"
      );

      /* =====================================================
         GET UNIQUE VEHICLE NAMES

         Example:

         Kia Sonet
         Kia Sonet
         Maruti Swift
         Maruti Swift

         becomes:

         Kia Sonet
         Maruti Swift
      ===================================================== */

      const uniqueVehicles = [];
      const usedNames = new Set();

      activeVehicles.forEach((vehicle) => {
        const vehicleName =
          vehicle.name ||
          vehicle.title ||
          vehicle.vehicleName ||
          "";

        const cleanName = String(vehicleName).trim();

        if (
          cleanName &&
          !usedNames.has(cleanName.toLowerCase())
        ) {
          usedNames.add(cleanName.toLowerCase());

          uniqueVehicles.push({
            id:
              vehicle._id ||
              vehicle.id ||
              cleanName,

            name: cleanName,
          });
        }
      });

      console.log(
        "UNIQUE VEHICLES:",
        uniqueVehicles
      );

      setVehicles(uniqueVehicles);
    } catch (error) {
      console.error(
        "FETCH VEHICLES ERROR:",
        error
      );

      console.error(
        "API ERROR:",
        error?.response?.data
      );

      setVehicles([]);

      setVehicleError(
        error?.response?.data?.message ||
          "Failed to load vehicles."
      );
    } finally {
      setLoadingVehicles(false);
    }
  };

  /* =====================================================
     LOAD VEHICLES WHEN FORM OPENS
  ===================================================== */

  useEffect(() => {
    if (isVisible) {
      fetchVehicles();
    }
  }, [isVisible]);

  /* =====================================================
     CLOSE
  ===================================================== */

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      if (onClose) {
        onClose();
      } else {
        setInternalIsOpen(false);
      }

      setIsClosing(false);
    }, 300);
  };

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitMessage("");
    setSubmitError("");
  };

  /* =====================================================
     SUBMIT FORM
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitMessage("");
      setSubmitError("");

      console.log(
        "======================================"
      );

      console.log(
        "SUBMITTING ENQUIRY"
      );

      console.log(
        "FORM DATA:",
        formData
      );

      console.log(
        "======================================"
      );

      const response = await API.post(
        "/enquiries",
        {
          name: formData.name.trim(),

          phone: formData.phone.trim(),

          email: formData.email.trim(),

          course: formData.course,

          date: formData.date,

          message: formData.message.trim(),
        }
      );

      console.log(
        "ENQUIRY RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        setSubmitMessage(
          response.data.message ||
            "Your enquiry has been submitted successfully."
        );

        /* =================================================
           RESET FORM
        ================================================= */

        setFormData({
          name: "",
          phone: "",
          email: "",
          course: "",
          date: "",
          message: "",
        });
      } else {
        setSubmitError(
          response.data?.message ||
            "Failed to submit enquiry."
        );
      }
    } catch (error) {
      console.error(
        "SUBMIT ENQUIRY ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error?.response?.data
      );

      setSubmitError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =====================================================
     HIDE
  ===================================================== */

  if (!isVisible && !isClosing) {
    return null;
  }

  return (
    <div
      className={`floating-form-overlay ${
        isClosing ? "closing" : ""
      }`}
    >
      <div
        className={`floating-form-card ${
          isClosing ? "closing" : ""
        }`}
      >
        {/* Overlapping Circular Yellow Car Badge */}

        <div className="floating-form-car-badge">
          <svg
            className="badge-car-svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5S16.67 13 17.5 13s1.5.67 1.5 1.5S18.33 16 17.5 16zM5 11l1.5-4.5h11L19 11H5z" />
          </svg>
        </div>

        {/* Close Button */}

        <button
          type="button"
          className="floating-form-close-btn"
          onClick={handleClose}
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
            ></line>

            <line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
            ></line>
          </svg>
        </button>

        {/* Header */}

        <div className="floating-form-header">
          <div className="floating-form-title-wrapper">
            <span className="floating-form-gold-line"></span>

            <h2 className="floating-form-title">
              ENQUIRE NOW
            </h2>

            <span className="floating-form-gold-line"></span>
          </div>

          <p className="floating-form-subtitle">
            Fill the form and we will
            <br />
            contact you soon.
          </p>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="floating-form-body"
        >
          {/* Name Field */}

          <div className="floating-form-field">
            <span className="floating-form-icon">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="15"
                height="15"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </span>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone Field */}

          <div className="floating-form-field">
            <span className="floating-form-icon">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="14"
                height="14"
              >
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </span>

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Field */}

          <div className="floating-form-field">
            <span className="floating-form-icon">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="15"
                height="15"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </span>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Vehicle Field */}

          <div className="floating-form-field">
            <span className="floating-form-icon">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="15"
                height="15"
              >
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              </svg>
            </span>

            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option
                value=""
                disabled
                hidden
              >
                {loadingVehicles
                  ? "Loading Vehicles..."
                  : "Select Vehicle"}
              </option>

              {!loadingVehicles &&
                vehicles.map((vehicle) => (
                  <option
                    key={vehicle.id}
                    value={vehicle.name}
                  >
                    {vehicle.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Vehicle Error */}

          {vehicleError && (
            <div
              style={{
                color: "#d32f2f",
                fontSize: "12px",
                marginTop: "-8px",
                marginBottom: "8px",
              }}
            >
              {vehicleError}
            </div>
          )}

          {/* Preferred Date Field */}

          <div className="floating-form-field">
            <span className="floating-form-icon">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="14"
                height="14"
              >
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" />
              </svg>
            </span>

            <input
              type="text"
              name="date"
              placeholder="Preferred Date"
              onFocus={(e) => {
                e.target.type = "date";
              }}
              onBlur={(e) => {
                if (!e.target.value) {
                  e.target.type = "text";
                }
              }}
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          {/* Message Textarea */}

          <div className="floating-form-field textarea-field">
            <span className="floating-form-icon textarea-icon">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="14"
                height="14"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </span>

            <textarea
              name="message"
              placeholder="Your Message"
              rows="3"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Success Message */}

          {submitMessage && (
            <div
              style={{
                color: "#198754",
                fontSize: "13px",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              {submitMessage}
            </div>
          )}

          {/* Error Message */}

          {submitError && (
            <div
              style={{
                color: "#d32f2f",
                fontSize: "13px",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              {submitError}
            </div>
          )}

          {/* Submit Button */}

          <button
            type="submit"
            className="floating-form-submit-btn"
            disabled={isSubmitting}
          >
            <span>
              {isSubmitting
                ? "SUBMITTING..."
                : "SUBMIT NOW"}
            </span>

            {!isSubmitting && (
              <svg
                className="submit-arrow"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            )}
          </button>

          {/* Privacy Note */}

          <div className="floating-form-privacy">
            <svg
              className="privacy-shield-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="16"
              height="16"
            >
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>

            <p>
              We respect your privacy.
              <br />
              Your details are safe with us.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FloatingForm;