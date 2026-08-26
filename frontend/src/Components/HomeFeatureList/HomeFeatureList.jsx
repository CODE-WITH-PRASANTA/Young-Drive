import React, { useEffect, useState } from "react";
import "./HomeFeatureList.css";

import car1 from "../../assets/featuredcar1.webp";
import car2 from "../../assets/featuredcar2.webp";
import car3 from "../../assets/featuredcar3.webp";
import car4 from "../../assets/featuredcar4.webp";

import API from "../../api/axios";
import { IMG_URL } from "../../api/axios";

const HomeFeatureList = () => {
  /* =====================================================
     VEHICLE STATE
  ===================================================== */

  const [listings, setListings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =====================================================
     LOCATION STATE
  ===================================================== */

  const [locations, setLocations] = useState([]);

  const [locationsLoading, setLocationsLoading] = useState(false);

  /* =====================================================
     BOOKING LOADING
  ===================================================== */

  const [bookingLoading, setBookingLoading] = useState(false);

  /* =====================================================
     SELECTED VEHICLE
  ===================================================== */

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  /* =====================================================
     ACTIVE IMAGE
  ===================================================== */

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  /* =====================================================
     DATE HELPERS
  ===================================================== */

  const getTodayDate = () => {
    const today = new Date();

    return today.toISOString().split("T")[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow.toISOString().split("T")[0];
  };

  /* =====================================================
     BOOKING FORM
  ===================================================== */

  const [formData, setFormData] = useState({
    fullName: "",

    email: "",

    countryCode: "+91",

    phone: "",

    pickupLocation: "",
    dropoffLocation: "",

    pickupDate: getTodayDate(),

    pickupTime: "10:00",

    dropoffDate: getTomorrowDate(),

    dropoffTime: "18:00",

    message: "",
  });

  /* =====================================================
     IMAGE URL HELPER
  ===================================================== */

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${IMG_URL}/${image.replace(/^\/+/, "")}`;
  };

  /* =====================================================
     FETCH VEHICLES
  ===================================================== */

  const fetchVehicles = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await API.get("/listings");

      console.log("Vehicles API Response:", response.data);

      const vehicleData =
        response.data?.vehicles ||
        response.data?.listings ||
        response.data?.data ||
        response.data ||
        [];

      if (!Array.isArray(vehicleData)) {
        setListings([]);

        return;
      }

      /* =================================================
         FORMAT BACKEND DATA
      ================================================= */

      const formattedListings = vehicleData.map((vehicle, index) => {
        /* ---------------------------------------------
               ALL IMAGES
            --------------------------------------------- */

        let vehicleImages = [];

        if (Array.isArray(vehicle.images) && vehicle.images.length > 0) {
          vehicleImages = vehicle.images
            .filter(Boolean)
            .map((image) => getImageUrl(image));
        }

        /* ---------------------------------------------
               FALLBACK IMAGE
            --------------------------------------------- */

        if (vehicleImages.length === 0) {
          const fallbackImages = [car1, car2, car3, car4];

          vehicleImages = [fallbackImages[index % fallbackImages.length]];
        }

        /* ---------------------------------------------
               RETURN COMPLETE VEHICLE OBJECT
            --------------------------------------------- */

        return {
          id: vehicle._id || vehicle.id || index,

          title:
            vehicle.name || vehicle.title || vehicle.vehicleName || "Vehicle",

          name:
            vehicle.name || vehicle.title || vehicle.vehicleName || "Vehicle",

          location:
            vehicle.location ||
            vehicle.pickupLocation ||
            "Location not available",

          rating:
            vehicle.rating !== undefined && vehicle.rating !== null
              ? vehicle.rating
              : "0",

          reviews:
            vehicle.reviewsCount !== undefined && vehicle.reviewsCount !== null
              ? vehicle.reviewsCount
              : vehicle.reviews || 0,

          reviewsCount:
            vehicle.reviewsCount !== undefined && vehicle.reviewsCount !== null
              ? vehicle.reviewsCount
              : vehicle.reviews || 0,

          mileage: vehicle.mileage || vehicle.kilometers || "N/A",

          transmission: vehicle.transmission || "N/A",

          fuel: vehicle.fuelType || vehicle.fuel || "N/A",

          fuelType: vehicle.fuelType || vehicle.fuel || "N/A",

          seats: vehicle.seats || "N/A",

          doors: vehicle.doors || "N/A",

          driveType: vehicle.driveType || "N/A",

          price:
            vehicle.price !== undefined && vehicle.price !== null
              ? vehicle.price
              : 0,

          offerPrice:
            vehicle.offerPrice !== undefined && vehicle.offerPrice !== null
              ? vehicle.offerPrice
              : null,

          period: vehicle.period || "/ day",

          shortDesc: vehicle.shortDesc || "",

          fullDesc: vehicle.fullDesc || "",

          status: vehicle.status || "N/A",

          order:
            vehicle.order !== undefined && vehicle.order !== null
              ? vehicle.order
              : null,

          createdAt: vehicle.createdAt || null,

          updatedAt: vehicle.updatedAt || null,

          images: vehicleImages,

          image: vehicleImages[0],
        };
      });

      setListings(formattedListings);
    } catch (error) {
      console.error("Error fetching vehicles:", error);

      setError(error?.response?.data?.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FETCH LOCATIONS
  ===================================================== */

  const fetchLocations = async () => {
    try {
      setLocationsLoading(true);

      const response = await API.get("/locations");

      console.log("Locations API Response:", response.data);

      if (response.data?.success) {
        const locationData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        /* ---------------------------------------------
           ONLY ACTIVE LOCATIONS
        --------------------------------------------- */

        const activeLocations = locationData.filter(
          (location) => location.status === "Active",
        );

        setLocations(activeLocations);

        /* ---------------------------------------------
           SET FIRST LOCATION
        --------------------------------------------- */

        if (activeLocations.length > 0) {
          setFormData((prev) => ({
            ...prev,

            pickupLocation: prev.pickupLocation || activeLocations[0].name,
          }));
        }
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);

      console.error("Location server response:", error?.response?.data);

      setLocations([]);
    } finally {
      setLocationsLoading(false);
    }
  };

  /* =====================================================
     GET VEHICLES + LOCATIONS
  ===================================================== */

  useEffect(() => {
    fetchVehicles();

    fetchLocations();
  }, []);

  /* =====================================================
     AUTO IMAGE SLIDER
  ===================================================== */

  useEffect(() => {
    if (!selectedVehicle) {
      return;
    }

    if (!selectedVehicle.images || selectedVehicle.images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveImageIndex((prevIndex) => {
        return (prevIndex + 1) % selectedVehicle.images.length;
      });
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedVehicle]);

  /* =====================================================
     OPEN MODAL
  ===================================================== */

  const handleOpenModal = (car) => {
    setSelectedVehicle(car);
    setActiveImageIndex(0);

    setFormData((prev) => ({
      ...prev,

      pickupLocation:
        prev.pickupLocation ||
        (locations.length > 0 ? locations[0].name : car.location || ""),

      dropoffLocation:
        prev.dropoffLocation || (locations.length > 0 ? locations[0].name : ""),

      pickupDate: getTodayDate(),
      dropoffDate: getTomorrowDate(),

      pickupTime: "10:00",
      dropoffTime: "18:00",
    }));
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const handleCloseModal = () => {
    setSelectedVehicle(null);

    setActiveImageIndex(0);

    setBookingLoading(false);
  };

  /* =====================================================
     FORM INPUT CHANGE
  ===================================================== */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  /* =====================================================
     PHONE CHANGE
  ===================================================== */

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    /* ---------------------------------------------
       ONLY 10 DIGITS
    --------------------------------------------- */

    if (value.length <= 10) {
      setFormData((prev) => ({
        ...prev,

        phone: value,
      }));
    }
  };

  /* =====================================================
     BOOKING VALIDATION
  ===================================================== */

  const validateBooking = () => {
    if (!selectedVehicle) {
      alert("Please select a vehicle.");

      return false;
    }

    if (!formData.fullName.trim()) {
      alert("Please enter your full name.");

      return false;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email.");

      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      alert("Please enter a valid email address.");

      return false;
    }

    /* ---------------------------------------------
       INDIA MOBILE VALIDATION
    --------------------------------------------- */

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit Indian mobile number.");

      return false;
    }

    if (!formData.pickupLocation) {
      alert("Please select a pick-up location.");

      return false;
    }

    if (!formData.dropoffLocation) {
      alert("Drop-off location is required.");
      return false;
    }

    if (!formData.pickupDate) {
      alert("Please select pick-up date.");

      return false;
    }

    if (!formData.pickupTime) {
      alert("Please select pick-up time.");

      return false;
    }

    if (!formData.dropoffDate) {
      alert("Please select drop-off date.");

      return false;
    }

    if (!formData.dropoffTime) {
      alert("Please select drop-off time.");

      return false;
    }

    /* ---------------------------------------------
       DATE COMPARISON
    --------------------------------------------- */

    const pickupDateTime = new Date(
      `${formData.pickupDate}T${formData.pickupTime}`,
    );

    const dropoffDateTime = new Date(
      `${formData.dropoffDate}T${formData.dropoffTime}`,
    );

    if (Number.isNaN(pickupDateTime.getTime())) {
      alert("Invalid pick-up date or time.");

      return false;
    }

    if (Number.isNaN(dropoffDateTime.getTime())) {
      alert("Invalid drop-off date or time.");

      return false;
    }

    if (dropoffDateTime <= pickupDateTime) {
      alert("Drop-off date and time must be after pick-up date and time.");

      return false;
    }

    return true;
  };

  /* =====================================================
     CONFIRM BOOKING
  ===================================================== */
  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!validateBooking()) {
      return;
    }

    try {
      setBookingLoading(true);

      // =====================================================
      // CREATE DATE VALUES
      // =====================================================

      const pickupDateTime = new Date(
        `${formData.pickupDate}T${formData.pickupTime}:00`,
      );

      const returnDateTime = new Date(
        `${formData.dropoffDate}T${formData.dropoffTime}:00`,
      );

      // =====================================================
      // DATE VALIDATION
      // =====================================================

      if (Number.isNaN(pickupDateTime.getTime())) {
        alert("Invalid pickup date.");
        return;
      }

      if (Number.isNaN(returnDateTime.getTime())) {
        alert("Invalid return date.");
        return;
      }

      if (returnDateTime < pickupDateTime) {
        alert("Return date cannot be before pickup date.");
        return;
      }

      // =====================================================
      // VEHICLE VALIDATION
      // =====================================================

      if (!selectedVehicle?.id) {
        alert("Please select a vehicle.");
        return;
      }

      // =====================================================
      // LOCATION VALIDATION
      // =====================================================

      if (!formData.pickupLocation?.trim()) {
        alert("Please select pickup location.");
        return;
      }

      if (!formData.dropoffLocation?.trim()) {
        alert("Please select drop-off location.");
        return;
      }

      // =====================================================
      // FINAL BOOKING PAYLOAD
      // =====================================================

      const bookingPayload = {
        // ==============================
        // CUSTOMER
        // ==============================

        customerName: formData.fullName.trim(),

        email: formData.email.trim().toLowerCase(),

        phone: `${formData.countryCode}${formData.phone}`,

        // ==============================
        // VEHICLE
        // ==============================

        vehicle: selectedVehicle.id,

        vehicleName: selectedVehicle.name || selectedVehicle.title || "Vehicle",

        // ==============================
        // BOOKING DATE
        // ==============================

        bookingDate: new Date(),

        bookingTime: formData.pickupTime || "10:00",

        // ==============================
        // PICKUP
        // ==============================

        pickupDate: pickupDateTime,

        pickupTime: formData.pickupTime || "10:00",

        pickupLocation: formData.pickupLocation.trim(),

        // ==============================
        // RETURN / DROP-OFF
        // ==============================

        returnDate: returnDateTime,

        dropoffDate: returnDateTime,

        dropoffTime: formData.dropoffTime || "10:00",

        dropoffLocation: formData.dropoffLocation.trim(),

        // ==============================
        // DEFAULTS
        // ==============================

        amount: 0,

        status: "Pending",

        paymentStatus: "Unpaid",

        paymentMethod: "",

        additionalMessage: formData.message?.trim() || "",
      };

      // =====================================================
      // DEBUG
      // =====================================================

      console.log("====================================");

      console.log("FINAL BOOKING PAYLOAD:", bookingPayload);

      console.log("RETURN DATE:", bookingPayload.returnDate);

      console.log("RETURN DATE ISO:", bookingPayload.returnDate.toISOString());

      console.log("PICKUP DATE:", bookingPayload.pickupDate);

      console.log("PICKUP DATE ISO:", bookingPayload.pickupDate.toISOString());

      console.log("====================================");

      // =====================================================
      // API REQUEST
      // =====================================================

      const response = await API.post("/bookings", bookingPayload);

      console.log("Booking API Response:", response.data);

      // =====================================================
      // SUCCESS
      // =====================================================

      if (response.data?.success) {
        alert("Booking request submitted successfully!");

        setFormData({
          fullName: "",
          email: "",
          countryCode: "+91",
          phone: "",

          pickupLocation: locations.length > 0 ? locations[0].name : "",

          dropoffLocation: locations.length > 0 ? locations[0].name : "",

          pickupDate: getTodayDate(),

          pickupTime: "10:00",

          dropoffDate: getTomorrowDate(),

          dropoffTime: "18:00",

          message: "",
        });

        handleCloseModal();
      } else {
        alert(response.data?.message || "Failed to create booking.");
      }
    } catch (error) {
      console.error("BOOKING ERROR:", error);

      console.error("BOOKING SERVER RESPONSE:", error?.response?.data);

      alert(error?.response?.data?.message || "Failed to submit booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString();
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <section className="featured-listings-section">
        <div className="featured-listings-container">
          <div className="featured-listings-header">
            <div className="header-text">
              <h2 className="section-title">Featured Listings</h2>

              <p className="section-subtitle">
                Find the perfect ride for any occasion
              </p>
            </div>
          </div>

          <div className="featured-cards-grid">
            <p>Loading vehicles...</p>
          </div>
        </div>
      </section>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <section className="featured-listings-section">
        <div className="featured-listings-container">
          <div className="featured-listings-header">
            <div className="header-text">
              <h2 className="section-title">Featured Listings</h2>

              <p className="section-subtitle">{error}</p>
            </div>

            <button className="view-more-btn" onClick={fetchVehicles}>
              <span>View More</span>

              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />

                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <section className="featured-listings-section">
      <div className="featured-listings-container">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="featured-listings-header">
          <div className="header-text">
            <h2 className="section-title">Featured Listings</h2>

            <p className="section-subtitle">
              Find the perfect ride for any occasion
            </p>
          </div>

          <button className="view-more-btn" onClick={fetchVehicles}>
            <span>View More</span>

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />

              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        {/* =================================================
            CARDS GRID
        ================================================= */}

        <div className="featured-cards-grid">
          {listings.length === 0 ? (
            <p>No vehicles available.</p>
          ) : (
            listings.map((car) => (
              <div className="featured-car-card" key={car.id}>
                {/* =================================================
                    IMAGE
                ================================================= */}

                <div className="car-image-container">
                  <img
                    src={car.image || car1}
                    alt={car.title}
                    className="car-image"
                    onError={(e) => {
                      e.currentTarget.src = car1;
                    }}
                  />

                  {/* RATING */}

                  <div className="rating-badge-wrapper">
                    <div className="rating-badge">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="#22c55e"
                        stroke="#22c55e"
                        strokeWidth="1"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>

                      <span className="rating-score">{car.rating}</span>

                      <span className="rating-count">
                        ({car.reviewsCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    CARD DETAILS
                ================================================= */}

                <div className="car-card-body">
                  <h3 className="car-name">{car.title}</h3>

                  <div className="location-info">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />

                      <circle cx="12" cy="10" r="3" />
                    </svg>

                    <span>{car.location}</span>
                  </div>

                  <hr className="card-divider" />

                  {/* =================================================
                      SPECS
                  ================================================= */}

                  <div className="specs-grid">
                    {/* Mileage */}

                    <div className="spec-item">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="9" />

                        <path d="M12 12l3-3" />
                      </svg>

                      <span>{car.mileage}</span>
                    </div>

                    {/* Transmission */}

                    <div className="spec-item">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="3" />

                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                      </svg>

                      <span>{car.transmission}</span>
                    </div>

                    {/* Fuel */}

                    <div className="spec-item">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18" />

                        <path d="M13 10h4a2 2 0 0 1 2 2v6" />

                        <circle cx="18" cy="18" r="2" />
                      </svg>

                      <span>{car.fuelType}</span>
                    </div>

                    {/* Seats */}

                    <div className="spec-item">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />

                        <circle cx="12" cy="7" r="4" />
                      </svg>

                      <span>{car.seats}</span>
                    </div>
                  </div>

                  <hr className="card-divider" />

                  {/* =================================================
                      FOOTER
                  ================================================= */}

                  <div className="card-footer">
                    <div className="price-wrapper">
                      <span className="price-amount">
                        ₹{Number(car.price || 0).toLocaleString("en-IN")}
                      </span>

                      <span className="price-period">{car.period}</span>
                    </div>

                    <button
                      className="book-now-btn"
                      onClick={() => handleOpenModal(car)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* =====================================================
          BOOKING / VEHICLE DETAILS MODAL
      ===================================================== */}

      {selectedVehicle && (
        <div className="booking-modal-overlay" onClick={handleCloseModal}>
          <div
            className="booking-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* =================================================
                CLOSE BUTTON
            ================================================= */}

            <button
              className="modal-close-icon-btn"
              onClick={handleCloseModal}
              type="button"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />

                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* =================================================
                LEFT PANEL
            ================================================= */}

            <div className="modal-left-panel">
              {/* =================================================
                    IMAGE SLIDER
                ================================================= */}

              <div className="modal-car-image-box">
                <img
                  src={
                    selectedVehicle.images?.[activeImageIndex] ||
                    selectedVehicle.image ||
                    car1
                  }
                  alt={selectedVehicle.name}
                  onError={(e) => {
                    e.currentTarget.src = car1;
                  }}
                />

                {/* DYNAMIC DOTS */}

                <div className="carousel-dots">
                  {selectedVehicle.images?.map((image, index) => (
                    <span
                      key={`${image}-${index}`}
                      className={
                        index === activeImageIndex ? "dot active" : "dot"
                      }
                      onClick={() => setActiveImageIndex(index)}
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* =================================================
                    VEHICLE NAME
                ================================================= */}

              <h3 className="modal-vehicle-title">{selectedVehicle.name}</h3>

              {/* =================================================
                    LOCATION
                ================================================= */}

              <div className="modal-location-text">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2.2"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />

                  <circle cx="12" cy="10" r="3" />
                </svg>

                <span>{selectedVehicle.location}</span>
              </div>

              {/* =================================================
                    BASIC VEHICLE SPECS
                ================================================= */}

              <div className="modal-specs-grid">
                {/* Mileage */}

                <div className="modal-spec-cell">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#71717a"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="9" />

                    <path d="M12 12l3-3" />
                  </svg>

                  <span>{selectedVehicle.mileage}</span>
                </div>

                {/* Transmission */}

                <div className="modal-spec-cell">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#71717a"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="3" />

                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                  </svg>

                  <span>{selectedVehicle.transmission}</span>
                </div>

                {/* Fuel */}

                <div className="modal-spec-cell">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#71717a"
                    strokeWidth="2"
                  >
                    <path d="M3 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18" />

                    <path d="M13 10h4a2 2 0 0 1 2 2v6" />

                    <circle cx="18" cy="18" r="2" />
                  </svg>

                  <span>{selectedVehicle.fuelType}</span>
                </div>

                {/* Seats */}

                <div className="modal-spec-cell">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#71717a"
                    strokeWidth="2"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />

                    <circle cx="12" cy="7" r="4" />
                  </svg>

                  <span>{selectedVehicle.seats}</span>
                </div>

                {/* Doors */}

                <div className="modal-spec-cell">
                  <span>🚪</span>

                  <span>{selectedVehicle.doors}</span>
                </div>

                {/* Drive Type */}

                <div className="modal-spec-cell">
                  <span>⚙️</span>

                  <span>{selectedVehicle.driveType}</span>
                </div>

                {/* Rating */}

                <div className="modal-spec-cell">
                  <span>⭐</span>

                  <span>{selectedVehicle.rating}</span>
                </div>

                {/* Reviews */}

                <div className="modal-spec-cell">
                  <span>💬</span>

                  <span>{selectedVehicle.reviewsCount} reviews</span>
                </div>

                {/* Status */}

                <div className="modal-spec-cell">
                  <span>●</span>

                  <span>{selectedVehicle.status}</span>
                </div>
              </div>

              {/* =================================================
                    PRICE
                ================================================= */}

              <div className="modal-price-line">
                <span className="price-lbl">From</span>

                <span className="price-val">
                  ₹{Number(selectedVehicle.price || 0).toLocaleString("en-IN")}
                </span>

                <span className="price-sub">{selectedVehicle.period}</span>
              </div>

              {/* =================================================
                    OFFER PRICE
                ================================================= */}

              {selectedVehicle.offerPrice !== null && (
                <div className="modal-price-line">
                  <span className="price-lbl">Offer</span>

                  <span className="price-val">
                    ${selectedVehicle.offerPrice}
                  </span>

                  <span className="price-sub">{selectedVehicle.period}</span>
                </div>
              )}

              {/* =================================================
                    SHORT DESCRIPTION
                ================================================= */}

              {selectedVehicle.shortDesc && (
                <div className="free-cancellation-banner">
                  <div className="info-circle-icon">i</div>

                  <div>
                    <h4>Description</h4>

                    <p>{selectedVehicle.shortDesc}</p>
                  </div>
                </div>
              )}

              {/* =================================================
                    FULL DESCRIPTION
                ================================================= */}

              {selectedVehicle.fullDesc && (
                <div className="free-cancellation-banner">
                  <div className="info-circle-icon">i</div>

                  <div>
                    <h4>Full Details</h4>

                    <p>{selectedVehicle.fullDesc}</p>
                  </div>
                </div>
              )}

              {/* =================================================
                    CREATED / UPDATED
                ================================================= */}

              <div className="modal-specs-grid">
                <div className="modal-spec-cell">
                  <span>Created</span>

                  <span>{formatDate(selectedVehicle.createdAt)}</span>
                </div>

                <div className="modal-spec-cell">
                  <span>Updated</span>

                  <span>{formatDate(selectedVehicle.updatedAt)}</span>
                </div>

                <div className="modal-spec-cell">
                  <span>Order</span>

                  <span>
                    {selectedVehicle.order !== null
                      ? selectedVehicle.order
                      : "N/A"}
                  </span>
                </div>

                <div className="modal-spec-cell">
                  <span>Images</span>

                  <span>{selectedVehicle.images?.length || 0}</span>
                </div>
              </div>

              {/* =================================================
                    CANCELLATION
                ================================================= */}

              <div className="free-cancellation-banner">
                <div className="info-circle-icon">i</div>

                <div>
                  <h4>Free Cancellation</h4>

                  <p>Cancel up to 24 hours before pick-up for a full refund.</p>
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT PANEL - BOOKING FORM
            ================================================= */}

            <div className="modal-right-panel">
              <h2 className="modal-form-heading">Book Now</h2>

              <p className="modal-form-subheading">
                Fill in your details to book this vehicle
              </p>

              <form
                onSubmit={handleConfirmBooking}
                className="modal-booking-form"
              >
                {/* =================================================
                    NAME & EMAIL
                ================================================= */}

                <div className="form-double-row">
                  {/* Full Name */}

                  <div className="form-field-group">
                    <label>Full Name</label>

                    <div className="input-icon-wrapper">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />

                        <circle cx="12" cy="7" r="4" />
                      </svg>

                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}

                  <div className="form-field-group">
                    <label>Email Address</label>

                    <div className="input-icon-wrapper">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="2"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />

                        <polyline points="22,6 12,13 2,6" />
                      </svg>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* =================================================
                    PHONE
                ================================================= */}

                <div className="form-field-group">
                  <label>Phone Number</label>

                  <div className="phone-input-combined">
                    <div className="country-code-picker">
                      <span className="flag-emoji">🇮🇳</span>

                      <select
                        name="countryCode"
                        value="+91"
                        onChange={handleInputChange}
                      >
                        <option value="+91">+91</option>
                      </select>
                    </div>

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter 10 digit mobile number"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      maxLength="10"
                      inputMode="numeric"
                      required
                    />
                  </div>
                </div>

                {/* =================================================
                    PICKUP LOCATION
                ================================================= */}

                <div className="form-field-group">
                  <label>Pick-up Location</label>

                  <div className="input-icon-wrapper select-field-wrapper">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9ca3af"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />

                      <circle cx="12" cy="10" r="3" />
                    </svg>

                    <select
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">
                        {locationsLoading
                          ? "Loading locations..."
                          : "Select Pick-up Location"}
                      </option>

                      {locations.map((location) => (
                        <option key={location._id} value={location.name}>
                          {location.name}

                          {location.city ? ` - ${location.city}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* =================================================
                    DROPOFF LOCATION
                ================================================= */}

                <div className="form-field-group">
                  <label>Drop-off Location</label>

                  <div className="input-icon-wrapper select-field-wrapper">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9ca3af"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />

                      <circle cx="12" cy="10" r="3" />
                    </svg>

                    <select
                      name="dropoffLocation"
                      value={formData.dropoffLocation}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">
                        {locationsLoading
                          ? "Loading locations..."
                          : "Select Drop-off Location"}
                      </option>

                      {locations.map((location) => (
                        <option key={location._id} value={location.name}>
                          {location.name}

                          {location.city ? ` - ${location.city}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* =================================================
                    PICKUP DATE & TIME
                ================================================= */}

                <div className="form-double-row">
                  {/* Pickup Date */}

                  <div className="form-field-group">
                    <label>Pick-up Date</label>

                    <div className="input-icon-wrapper">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />

                        <line x1="16" y1="2" x2="16" y2="6" />

                        <line x1="8" y1="2" x2="8" y2="6" />

                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>

                      <input
                        type="date"
                        name="pickupDate"
                        min={getTodayDate()}
                        value={formData.pickupDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Pickup Time */}

                  <div className="form-field-group">
                    <label>Pick-up Time</label>

                    <div className="input-icon-wrapper">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />

                        <polyline points="12 6 12 12 16 14" />
                      </svg>

                      <input
                        type="time"
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* =================================================
                    DROPOFF DATE & TIME
                ================================================= */}

                <div className="form-double-row">
                  {/* Dropoff Date */}

                  <div className="form-field-group">
                    <label>Drop-off Date</label>

                    <div className="input-icon-wrapper">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />

                        <line x1="16" y1="2" x2="16" y2="6" />

                        <line x1="8" y1="2" x2="8" y2="6" />

                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>

                      <input
                        type="date"
                        name="dropoffDate"
                        min={formData.pickupDate || getTodayDate()}
                        value={formData.dropoffDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Dropoff Time */}

                  <div className="form-field-group">
                    <label>Drop-off Time</label>

                    <div className="input-icon-wrapper">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />

                        <polyline points="12 6 12 12 16 14" />
                      </svg>

                      <input
                        type="time"
                        name="dropoffTime"
                        value={formData.dropoffTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* =================================================
                    MESSAGE
                ================================================= */}

                <div className="form-field-group">
                  <label>Additional Message (Optional)</label>

                  <textarea
                    name="message"
                    rows="3"
                    placeholder="Enter any special requests or notes..."
                    value={formData.message}
                    onChange={handleInputChange}
                  />
                </div>

                {/* =================================================
                    SECURE BOOKING
                ================================================= */}

                <div className="secure-booking-banner">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>

                  <div>
                    <h4>Secure Booking</h4>

                    <p>
                      Your information is safe with us. We use secure
                      encryption.
                    </p>
                  </div>
                </div>

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                    onClick={handleCloseModal}
                    disabled={bookingLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-modal-submit"
                    disabled={bookingLoading}
                  >
                    <span>
                      {bookingLoading ? "Booking..." : "Confirm Booking"}
                    </span>

                    {!bookingLoading && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />

                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeFeatureList;
