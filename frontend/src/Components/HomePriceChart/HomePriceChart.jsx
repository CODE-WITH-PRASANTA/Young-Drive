import React, { useEffect, useState } from "react";

import {
  FaCar,
  FaShieldAlt,
  FaHeadset,
  FaGasPump,
  FaIdCard,
  FaUser,
  FaCogs,
  FaSnowflake,
  FaTimes,
  FaCheckCircle,
  FaInfoCircle,
  FaStar,
  FaBolt,
  FaKey,
} from "react-icons/fa";

import "./HomePriceChart.css";

import API from "../../api/axios";

export function HomePriceChart() {
  /*
   * =========================================================
   * VEHICLE STATE
   * =========================================================
   */

  const [filter, setFilter] =
    useState("ALL");

  const [selectedCar, setSelectedCar] =
    useState(null);

  const [vehicles, setVehicles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * =========================================================
   * LOCATION STATE
   * =========================================================
   */

  const [locations, setLocations] =
    useState([]);

  const [locationsLoading, setLocationsLoading] =
    useState(false);

  const [locationsError, setLocationsError] =
    useState("");

  /*
   * =========================================================
   * BOOKING STATE
   * =========================================================
   */

  const [bookingLoading, setBookingLoading] =
    useState(false);

  /*
   * =========================================================
   * FORM STATE
   * =========================================================
   */

  const [formData, setFormData] =
    useState({
      fullName: "",
      email: "",
      phoneCode: "+91",
      phone: "",

      pickupLocation: "",
      pickupDate: "",
      pickupTime: "10:00 AM",

      dropoffLocation: "",
      dropoffDate: "",
      dropoffTime: "10:00 AM",

      message: "",
    });

  /*
   * =========================================================
   * API BASE URL
   * =========================================================
   */

  const API_BASE_URL =
    API?.defaults?.baseURL ||
    "http://localhost:5000/api";

  const IMAGE_BASE_URL =
    API_BASE_URL.replace(
      /\/api\/?$/,
      ""
    );

  /*
   * =========================================================
   * IMAGE URL
   * =========================================================
   */

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("blob:")
    ) {
      return image;
    }

    return `${IMAGE_BASE_URL}/${image.replace(
      /^\/+/,
      ""
    )}`;
  };

  /*
   * =========================================================
   * VEHICLE IMAGE
   * =========================================================
   */

  const getVehicleImage = (vehicle) => {
    if (!vehicle) {
      return "";
    }

    if (
      Array.isArray(vehicle.images) &&
      vehicle.images.length > 0
    ) {
      return getImageUrl(
        vehicle.images[0]
      );
    }

    if (vehicle.image) {
      return getImageUrl(
        vehicle.image
      );
    }

    if (vehicle.imageUrl) {
      return getImageUrl(
        vehicle.imageUrl
      );
    }

    return "";
  };

  /*
   * =========================================================
   * VEHICLE TYPE
   * =========================================================
   */

  const getVehicleType = (vehicle) => {
    return (
      vehicle?.type ||
      vehicle?.vehicleType ||
      vehicle?.category ||
      "CAR"
    );
  };

  /*
   * =========================================================
   * FETCH VEHICLES
   * =========================================================
   */

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      console.log(
        "FETCHING VEHICLES: /listings"
      );

      const response =
        await API.get("/listings");

      console.log(
        "VEHICLES RESPONSE:",
        response.data
      );

      let data = [];

      if (
        Array.isArray(
          response.data
        )
      ) {
        data =
          response.data;
      } else if (
        Array.isArray(
          response.data?.data
        )
      ) {
        data =
          response.data.data;
      } else if (
        Array.isArray(
          response.data?.listings
        )
      ) {
        data =
          response.data.listings;
      } else if (
        Array.isArray(
          response.data?.vehicles
        )
      ) {
        data =
          response.data.vehicles;
      } else if (
        Array.isArray(
          response.data?.results
        )
      ) {
        data =
          response.data.results;
      }

      const activeVehicles =
        data.filter(
          (vehicle) => {
            if (!vehicle) {
              return false;
            }

            if (
              vehicle.status !==
              undefined
            ) {
              return (
                String(
                  vehicle.status
                ).toLowerCase() ===
                "active"
              );
            }

            return true;
          }
        );

      const formattedVehicles =
        activeVehicles.map(
          (vehicle) => {
            const price =
              Number(
                vehicle.offerPrice ??
                  vehicle.price ??
                  0
              );

            return {
              id:
                vehicle._id ||
                vehicle.id,

              name:
                vehicle.name ||
                "Vehicle",

              type:
                getVehicleType(
                  vehicle
                ),

              seats:
                vehicle.seats ||
                "N/A",

              transmission:
                vehicle.transmission ||
                "N/A",

              ac:
                vehicle.ac ||
                "AC",

              price,

              rating:
                Number(
                  vehicle.rating
                ) || 0,

              image:
                getVehicleImage(
                  vehicle
                ),

              location:
                vehicle.location ||
                "",

              mileage:
                vehicle.mileage ||
                "N/A",

              fuel:
                vehicle.fuelType ||
                vehicle.fuel ||
                "N/A",

              doors:
                vehicle.doors ||
                "",

              driveType:
                vehicle.driveType ||
                "",

              reviewsCount:
                vehicle.reviewsCount ||
                0,

              images:
                Array.isArray(
                  vehicle.images
                )
                  ? vehicle.images
                  : [],

              originalVehicle:
                vehicle,
            };
          }
        );

      setVehicles(
        formattedVehicles
      );
    } catch (err) {
      console.error(
        "FETCH VEHICLES ERROR:",
        err
      );

      console.error(
        "SERVER RESPONSE:",
        err?.response?.data
      );

      setVehicles([]);

      setError(
        err?.response?.data
          ?.message ||
          "Failed to load vehicles."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * FETCH LOCATIONS
   * =========================================================
   *
   * BACKEND:
   *
   * app.use("/api/locations", locationRoutes);
   *
   * Therefore:
   *
   * API.get("/locations")
   *
   * =========================================================
   */

  const fetchLocations = async () => {
    try {
      setLocationsLoading(true);

      setLocationsError("");

      console.log(
        "===================================="
      );

      console.log(
        "FETCHING LOCATIONS"
      );

      console.log(
        "GET /api/locations"
      );

      console.log(
        "===================================="
      );

      const response =
        await API.get(
          "/locations"
        );

      console.log(
        "LOCATION API RESPONSE:",
        response.data
      );

      /*
       * =====================================================
       * HANDLE DIFFERENT RESPONSE STRUCTURES
       * =====================================================
       */

      let locationData = [];

      if (
        Array.isArray(
          response.data
        )
      ) {
        locationData =
          response.data;
      } else if (
        Array.isArray(
          response.data?.data
        )
      ) {
        locationData =
          response.data.data;
      } else if (
        Array.isArray(
          response.data?.locations
        )
      ) {
        locationData =
          response.data.locations;
      } else if (
        Array.isArray(
          response.data?.results
        )
      ) {
        locationData =
          response.data.results;
      }

      console.log(
        "RAW LOCATIONS:",
        locationData
      );

      /*
       * =====================================================
       * NORMALIZE LOCATIONS
       * =====================================================
       *
       * Supports backend objects such as:
       *
       * {
       *   _id: "...",
       *   name: "Bhubaneswar"
       * }
       *
       * OR
       *
       * {
       *   location: "Bhubaneswar"
       * }
       *
       * OR
       *
       * {
       *   title: "Bhubaneswar"
       * }
       *
       * =====================================================
       */

      const normalizedLocations =
        locationData
          .map(
            (location) => {
              if (
                typeof location ===
                "string"
              ) {
                return {
                  id: location,
                  name: location,
                };
              }

              const name =
                location?.name ||
                location?.location ||
                location?.title ||
                location?.city ||
                location?.address ||
                "";

              return {
                id:
                  location?._id ||
                  location?.id ||
                  name,

                name:
                  String(
                    name
                  ).trim(),

                original:
                  location,
              };
            }
          )
          .filter(
            (location) =>
              location.name
          );

      /*
       * =====================================================
       * REMOVE DUPLICATE LOCATIONS
       * =====================================================
       */

      const uniqueLocations =
        normalizedLocations.filter(
          (
            location,
            index,
            array
          ) =>
            index ===
            array.findIndex(
              (item) =>
                item.name.toLowerCase() ===
                location.name.toLowerCase()
            )
        );

      console.log(
        "NORMALIZED LOCATIONS:",
        uniqueLocations
      );

      setLocations(
        uniqueLocations
      );

      /*
       * =====================================================
       * SET DEFAULT LOCATION
       * =====================================================
       */

      if (
        uniqueLocations.length >
        0
      ) {
        setFormData(
          (prev) => ({
            ...prev,

            pickupLocation:
              prev.pickupLocation ||
              uniqueLocations[0]
                .name,

            dropoffLocation:
              prev.dropoffLocation ||
              uniqueLocations[0]
                .name,
          })
        );
      }
    } catch (err) {
      console.error(
        "FETCH LOCATIONS ERROR:",
        err
      );

      console.error(
        "LOCATION SERVER RESPONSE:",
        err?.response?.data
      );

      setLocations([]);

      setLocationsError(
        err?.response?.data
          ?.message ||
          "Failed to load locations."
      );
    } finally {
      setLocationsLoading(
        false
      );
    }
  };

  /*
   * =========================================================
   * INITIAL FETCH
   * =========================================================
   */

  useEffect(() => {
    fetchVehicles();

    fetchLocations();
  }, []);

  /*
   * =========================================================
   * FILTER VEHICLES
   * =========================================================
   */

  const filteredVehicles =
    filter === "ALL"
      ? vehicles
      : vehicles.filter(
          (car) =>
            String(
              car.type
            ).toUpperCase() ===
            filter
        );

  /*
   * =========================================================
   * OPEN MODAL
   * =========================================================
   */

  const handleOpenModal = (
    car,
    e
  ) => {
    if (e) {
      e.stopPropagation();
    }

    console.log(
      "SELECTED VEHICLE:",
      car
    );

    setSelectedCar(car);

    /*
     * If vehicle has location and
     * that location exists in API,
     * use it as pickup location.
     */

    const vehicleLocation =
      car.location || "";

    const matchingLocation =
      locations.find(
        (location) =>
          location.name.toLowerCase() ===
          vehicleLocation.toLowerCase()
      );

    setFormData(
      (prev) => ({
        ...prev,

        pickupLocation:
          matchingLocation?.name ||
          prev.pickupLocation ||
          (locations.length > 0
            ? locations[0].name
            : vehicleLocation),

        dropoffLocation:
          prev.dropoffLocation ||
          (locations.length > 0
            ? locations[0].name
            : vehicleLocation),
      })
    );
  };

  /*
   * =========================================================
   * INPUT CHANGE
   * =========================================================
   */

  const handleInputChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };

  /*
   * =========================================================
   * TODAY DATE
   * =========================================================
   */

  const getTodayDate = () => {
    const today =
      new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        today.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /*
   * =========================================================
   * TOMORROW DATE
   * =========================================================
   */

  const getTomorrowDate = () => {
    const tomorrow =
      new Date();

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    const year =
      tomorrow.getFullYear();

    const month =
      String(
        tomorrow.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        tomorrow.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /*
   * =========================================================
   * DATE + TIME
   * =========================================================
   */

  const combineDateTime = (
    date,
    time
  ) => {
    if (!date) {
      return null;
    }

    if (!time) {
      return new Date(
        `${date}T10:00:00`
      );
    }

    let convertedTime =
      time;

    const match =
      String(time).match(
        /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i
      );

    if (match) {
      let hours =
        Number(
          match[1]
        );

      const minutes =
        match[2];

      const period =
        match[3]
          ? match[3].toUpperCase()
          : null;

      if (
        period === "PM" &&
        hours !== 12
      ) {
        hours += 12;
      }

      if (
        period === "AM" &&
        hours === 12
      ) {
        hours = 0;
      }

      convertedTime =
        `${String(
          hours
        ).padStart(
          2,
          "0"
        )}:${minutes}`;
    }

    return new Date(
      `${date}T${convertedTime}:00`
    );
  };

  /*
   * =========================================================
   * BOOKING SUBMIT
   * =========================================================
   */

  const handleFormSubmit =
    async (e) => {
      e.preventDefault();

      if (!selectedCar) {
        alert(
          "Please select a vehicle."
        );
        return;
      }

      if (
        !formData.fullName.trim()
      ) {
        alert(
          "Please enter your full name."
        );
        return;
      }

      if (
        !formData.email.trim()
      ) {
        alert(
          "Please enter your email."
        );
        return;
      }

      const cleanPhone =
        formData.phone.replace(
          /\D/g,
          ""
        );

      if (!cleanPhone) {
        alert(
          "Please enter your phone number."
        );
        return;
      }

      if (
        formData.phoneCode ===
          "+91" &&
        cleanPhone.length !==
          10
      ) {
        alert(
          "Please enter a valid 10 digit Indian mobile number."
        );
        return;
      }

      if (
        !formData.pickupLocation
      ) {
        alert(
          "Please select pickup location."
        );
        return;
      }

      if (
        !formData.dropoffLocation
      ) {
        alert(
          "Please select drop-off location."
        );
        return;
      }

      if (
        !formData.pickupDate
      ) {
        alert(
          "Please select pickup date."
        );
        return;
      }

      if (
        !formData.dropoffDate
      ) {
        alert(
          "Please select drop-off date."
        );
        return;
      }

      if (
        new Date(
          formData.dropoffDate
        ) <
        new Date(
          formData.pickupDate
        )
      ) {
        alert(
          "Drop-off date cannot be before pickup date."
        );
        return;
      }

      const pickupDateTime =
        combineDateTime(
          formData.pickupDate,
          formData.pickupTime
        );

      const dropoffDateTime =
        combineDateTime(
          formData.dropoffDate,
          formData.dropoffTime
        );

      const bookingPayload = {
        customerName:
          formData.fullName.trim(),

        fullName:
          formData.fullName.trim(),

        email:
          formData.email
            .trim()
            .toLowerCase(),

        phone:
          `${formData.phoneCode}${cleanPhone}`,

        vehicle:
          selectedCar.id,

        vehicleId:
          selectedCar.id,

        vehicleName:
          selectedCar.name,

        vehicleImage:
          selectedCar.image || "",

        bookingDate:
          new Date(),

        bookingTime:
          formData.pickupTime ||
          "10:00 AM",

        pickupDate:
          pickupDateTime,

        pickupTime:
          formData.pickupTime ||
          "10:00 AM",

        returnDate:
          dropoffDateTime,

        dropoffDate:
          dropoffDateTime,

        dropoffTime:
          formData.dropoffTime ||
          "10:00 AM",

        pickupLocation:
          formData.pickupLocation,

        pickupLoc:
          formData.pickupLocation,

        dropoffLocation:
          formData.dropoffLocation,

        dropLocation:
          formData.dropoffLocation,

        returnLoc:
          formData.dropoffLocation,

        amount:
          selectedCar.price ||
          0,

        status:
          "Pending",

        paymentStatus:
          "Unpaid",

        paymentMethod:
          "",

        additionalMessage:
          formData.message.trim(),
      };

      console.log(
        "FINAL BOOKING PAYLOAD:",
        bookingPayload
      );

      try {
        setBookingLoading(
          true
        );

        const response =
          await API.post(
            "/bookings",
            bookingPayload
          );

        console.log(
          "BOOKING RESPONSE:",
          response.data
        );

        if (
          response.status >=
            200 &&
          response.status < 300
        ) {
          alert(
            "Booking request submitted successfully!"
          );

          const defaultLocation =
            locations.length > 0
              ? locations[0].name
              : "";

          setFormData({
            fullName: "",
            email: "",
            phoneCode: "+91",
            phone: "",

            pickupLocation:
              defaultLocation,

            pickupDate:
              getTodayDate(),

            pickupTime:
              "10:00 AM",

            dropoffLocation:
              defaultLocation,

            dropoffDate:
              getTomorrowDate(),

            dropoffTime:
              "10:00 AM",

            message: "",
          });

          setSelectedCar(
            null
          );
        } else {
          alert(
            response.data
              ?.message ||
              "Failed to create booking."
          );
        }
      } catch (err) {
        console.error(
          "BOOKING ERROR:",
          err
        );

        console.error(
          "BOOKING SERVER RESPONSE:",
          err?.response?.data
        );

        alert(
          err?.response?.data
            ?.message ||
            "Failed to submit booking."
        );
      } finally {
        setBookingLoading(
          false
        );
      }
    };

  /*
   * =========================================================
   * LOCATION OPTIONS
   * ========================================================= */

  const renderLocationOptions =
    () => {
      if (
        locationsLoading
      ) {
        return (
          <option value="">
            Loading locations...
          </option>
        );
      }

      if (
        locations.length ===
        0
      ) {
        return (
          <option value="">
            No locations available
          </option>
        );
      }

      return locations.map(
        (location) => (
          <option
            key={
              location.id
            }
            value={
              location.name
            }
          >
            {
              location.name
            }
          </option>
        )
      );
    };

  /*
   * =========================================================
   * CATEGORIES
   * =========================================================
   */

  const categories = [
    "ALL",
    ...Array.from(
      new Set(
        vehicles
          .map(
            (vehicle) =>
              String(
                vehicle.type ||
                  ""
              ).toUpperCase()
          )
          .filter(Boolean)
      )
    ),
  ];

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div className="HomePriceChart-container">

      {/* Header Section */}

      <header className="HomePriceChart-header">

        <h1>
          PRICE{" "}
          <span>
            CHART
          </span>
        </h1>

        <p>
          Choose your perfect ride from our wide range of premium vehicles.
        </p>

        {/* Filter Tabs */}

        <div className="HomePriceChart-filters">

          {categories.map(
            (category) => (
              <button
                key={
                  category
                }
                className={`HomePriceChart-filter-btn ${
                  filter ===
                  category
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setFilter(
                    category
                  )
                }
              >
                {
                  category
                }
              </button>
            )
          )}

        </div>

      </header>

      {/* Grid Content */}

      <main className="HomePriceChart-grid">

        {loading && (
          <div>
            Loading vehicles...
          </div>
        )}

        {!loading &&
          error && (
            <div>
              {
                error
              }
            </div>
          )}

        {!loading &&
          !error &&
          filteredVehicles.length ===
            0 && (
            <div>
              No vehicles available.
            </div>
          )}

        {!loading &&
          !error &&
          filteredVehicles.map(
            (car) => (
              <div
                key={
                  car.id
                }
                className="HomePriceChart-card"
                onClick={(e) =>
                  handleOpenModal(
                    car,
                    e
                  )
                }
              >

                <div className="HomePriceChart-card-top">

                  <span className="HomePriceChart-badge">
                    {
                      car.type
                    }
                  </span>

                  <span className="HomePriceChart-rating">

                    <FaStar />{" "}

                    {
                      car.rating
                    }

                  </span>

                </div>

                <div className="HomePriceChart-img-wrapper">

                  {car.image ? (
                    <img
                      src={
                        car.image
                      }
                      alt={
                        car.name
                      }
                      loading="lazy"
                    />
                  ) : (
                    <div>
                      No Image
                    </div>
                  )}

                </div>

                <h3>
                  {
                    car.name
                  }
                </h3>

                <div className="HomePriceChart-specs">

                  <span>
                    <FaUser />{" "}
                    {
                      car.seats
                    }
                  </span>

                  <span>
                    <FaCogs />{" "}
                    {
                      car.transmission
                    }
                  </span>

                  <span>
                    <FaSnowflake />{" "}
                    {
                      car.ac
                    }
                  </span>

                </div>

                <div className="HomePriceChart-footer-row">

                  <div className="HomePriceChart-price">

                    <strong>
                      ₹
                      {Number(
                        car.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <span>
                      / 24h
                    </span>

                  </div>

                  <button
                    className="HomePriceChart-book-trigger"
                    onClick={(e) =>
                      handleOpenModal(
                        car,
                        e
                      )
                    }
                    type="button"
                  >
                    <FaKey />{" "}
                    Book
                  </button>

                </div>

              </div>
            )
          )}

        {/* Feature Highlights Card */}

        <div className="HomePriceChart-features-card">

          <div className="HomePriceChart-feature-item">

            <span className="HomePriceChart-feature-icon">
              <FaShieldAlt />
            </span>

            <div>
              <h4>
                INSURANCE
              </h4>

              <p>
                Fully Included
              </p>
            </div>

          </div>

          <div className="HomePriceChart-feature-item">

            <span className="HomePriceChart-feature-icon">
              <FaHeadset />
            </span>

            <div>
              <h4>
                24/7 SUPPORT
              </h4>

              <p>
                Roadside Help
              </p>
            </div>

          </div>

          <div className="HomePriceChart-feature-item">

            <span className="HomePriceChart-feature-icon">
              <FaGasPump />
            </span>

            <div>
              <h4>
                FUEL POLICY
              </h4>

              <p>
                Full to Full
              </p>
            </div>

          </div>

          <div className="HomePriceChart-feature-item">

            <span className="HomePriceChart-feature-icon">
              <FaIdCard />
            </span>

            <div>
              <h4>
                VERIFICATION
              </h4>

              <p>
                Valid ID Required
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* Footer Note */}

      <footer className="HomePriceChart-footer-note">

        <FaInfoCircle />{" "}
        All prices are inclusive of insurance and applicable taxes.

      </footer>

      {/* Booking Modal */}

      {selectedCar && (
        <div
          className="HomePriceChart-modal-backdrop"
          onClick={() =>
            setSelectedCar(
              null
            )
          }
        >

          <div
            className="HomePriceChart-modal-container"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Close Button */}

            <button
              className="HomePriceChart-modal-close"
              onClick={() =>
                setSelectedCar(
                  null
                )
              }
              type="button"
            >
              <FaTimes />
            </button>

            {/* Left Column */}

            <div className="HomePriceChart-modal-left">

              <div className="HomePriceChart-modal-img-box">

                {selectedCar.image ? (
                  <img
                    src={
                      selectedCar.image
                    }
                    alt={
                      selectedCar.name
                    }
                  />
                ) : (
                  <div>
                    No Image
                  </div>
                )}

                <div className="HomePriceChart-dots">

                  <span className="dot active"></span>

                  <span className="dot"></span>

                  <span className="dot"></span>

                </div>

              </div>

              <h2 className="HomePriceChart-modal-car-title">
                {
                  selectedCar.name
                }
              </h2>

              <p className="HomePriceChart-modal-location">
                📍{" "}
                {
                  selectedCar.location ||
                  "Location not available"
                }
              </p>

              <div className="HomePriceChart-modal-specs-grid">

                <div className="HomePriceChart-modal-spec">
                  🧭{" "}
                  {
                    selectedCar.mileage
                  }
                </div>

                <div className="HomePriceChart-modal-spec">
                  ⚙️{" "}
                  {
                    selectedCar.transmission
                  }
                </div>

                <div className="HomePriceChart-modal-spec">
                  ⛽{" "}
                  {
                    selectedCar.fuel
                  }
                </div>

                <div className="HomePriceChart-modal-spec">
                  💺{" "}
                  {
                    selectedCar.seats
                  }
                </div>

              </div>

              <div className="HomePriceChart-modal-price-row">

                <span className="label">
                  From
                </span>

                <span className="amount">
                  ₹
                  {Number(
                    selectedCar.price
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

                <span className="unit">
                  / day
                </span>

              </div>

              <div className="HomePriceChart-modal-cancel-box">

                <div className="icon">
                  ⓘ
                </div>

                <div>

                  <strong>
                    Free Cancellation
                  </strong>

                  <p>
                    Cancel up to 24 hours before pick-up for a full refund.
                  </p>

                </div>

              </div>

            </div>

            {/* Right Column */}

            <div className="HomePriceChart-modal-right">

              <h2>
                Book Now
              </h2>

              <p className="subtitle">
                Fill in your details to book this vehicle
              </p>

              <form
                onSubmit={
                  handleFormSubmit
                }
                className="HomePriceChart-form"
              >

                {/* Name + Email */}

                <div className="HomePriceChart-form-row">

                  <div className="HomePriceChart-field">

                    <label>
                      Full Name
                    </label>

                    <div className="input-wrap">

                      <FaUser className="field-icon" />

                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={
                          formData.fullName
                        }
                        onChange={
                          handleInputChange
                        }
                        required
                      />

                    </div>

                  </div>

                  <div className="HomePriceChart-field">

                    <label>
                      Email Address
                    </label>

                    <div className="input-wrap">

                      <span className="field-icon">
                        ✉️
                      </span>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={
                          formData.email
                        }
                        onChange={
                          handleInputChange
                        }
                        required
                      />

                    </div>

                  </div>

                </div>

                {/* Phone */}

                <div className="HomePriceChart-field">

                  <label>
                    Phone Number
                  </label>

                  <div className="HomePriceChart-phone-group">

                    <div className="country-code-select">

                      <span>
                        🇮🇳
                      </span>

                      <select
                        name="phoneCode"
                        value={
                          formData.phoneCode
                        }
                        onChange={
                          handleInputChange
                        }
                      >

                        <option value="+91">
                          +91
                        </option>

                        <option value="+1">
                          +1
                        </option>

                        <option value="+44">
                          +44
                        </option>

                        <option value="+61">
                          +61
                        </option>

                      </select>

                    </div>

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    />

                  </div>

                </div>

                {/* =================================================
                    PICKUP LOCATION
                    ================================================= */}

                <div className="HomePriceChart-field">

                  <label>
                    Pick-up Location
                  </label>

                  <div className="input-wrap">

                    <span className="field-icon">
                      📍
                    </span>

                    <select
                      name="pickupLocation"
                      value={
                        formData.pickupLocation
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    >

                      <option value="">
                        {locationsLoading
                          ? "Loading locations..."
                          : "Select pickup location"}
                      </option>

                      {renderLocationOptions()}

                    </select>

                  </div>

                </div>

                {/* Pickup Date + Time */}

                <div className="HomePriceChart-form-row">

                  <div className="HomePriceChart-field">

                    <label>
                      Pick-up Date
                    </label>

                    <div className="input-wrap">

                      <span className="field-icon">
                        📅
                      </span>

                      <input
                        type="date"
                        name="pickupDate"
                        value={
                          formData.pickupDate
                        }
                        onChange={
                          handleInputChange
                        }
                        required
                      />

                    </div>

                  </div>

                  <div className="HomePriceChart-field">

                    <label>
                      Pick-up Time
                    </label>

                    <div className="input-wrap">

                      <span className="field-icon">
                        🕒
                      </span>

                      <select
                        name="pickupTime"
                        value={
                          formData.pickupTime
                        }
                        onChange={
                          handleInputChange
                        }
                      >

                        <option value="09:00 AM">
                          09:00 AM
                        </option>

                        <option value="10:00 AM">
                          10:00 AM
                        </option>

                        <option value="11:00 AM">
                          11:00 AM
                        </option>

                        <option value="02:00 PM">
                          02:00 PM
                        </option>

                      </select>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    DROP-OFF LOCATION
                    ================================================= */}

                <div className="HomePriceChart-field">

                  <label>
                    Drop-off Location
                  </label>

                  <div className="input-wrap">

                    <span className="field-icon">
                      📍
                    </span>

                    <select
                      name="dropoffLocation"
                      value={
                        formData.dropoffLocation
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    >

                      <option value="">
                        {locationsLoading
                          ? "Loading locations..."
                          : "Select drop-off location"}
                      </option>

                      {renderLocationOptions()}

                    </select>

                  </div>

                </div>

                {/* Drop-off Date + Time */}

                <div className="HomePriceChart-form-row">

                  <div className="HomePriceChart-field">

                    <label>
                      Drop-off Date
                    </label>

                    <div className="input-wrap">

                      <span className="field-icon">
                        📅
                      </span>

                      <input
                        type="date"
                        name="dropoffDate"
                        value={
                          formData.dropoffDate
                        }
                        onChange={
                          handleInputChange
                        }
                        required
                      />

                    </div>

                  </div>

                  <div className="HomePriceChart-field">

                    <label>
                      Drop-off Time
                    </label>

                    <div className="input-wrap">

                      <span className="field-icon">
                        🕒
                      </span>

                      <select
                        name="dropoffTime"
                        value={
                          formData.dropoffTime
                        }
                        onChange={
                          handleInputChange
                        }
                      >

                        <option value="09:00 AM">
                          09:00 AM
                        </option>

                        <option value="10:00 AM">
                          10:00 AM
                        </option>

                        <option value="11:00 AM">
                          11:00 AM
                        </option>

                        <option value="02:00 PM">
                          02:00 PM
                        </option>

                      </select>

                    </div>

                  </div>

                </div>

                {/* Message */}

                <div className="HomePriceChart-field">

                  <label>
                    Additional Message (Optional)
                  </label>

                  <textarea
                    name="message"
                    rows="2"
                    placeholder="Enter any special requests or notes..."
                    value={
                      formData.message
                    }
                    onChange={
                      handleInputChange
                    }
                  ></textarea>

                </div>

                {/* Secure */}

                <div className="HomePriceChart-secure-box">

                  <FaShieldAlt className="shield" />

                  <div>

                    <strong>
                      Secure Booking
                    </strong>

                    <p>
                      Your information is safe with us. We use secure encryption.
                    </p>

                  </div>

                </div>

                {/* Actions */}

                <div className="HomePriceChart-modal-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() =>
                      setSelectedCar(
                        null
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="confirm-btn"
                    disabled={
                      bookingLoading ||
                      locationsLoading
                    }
                  >
                    {bookingLoading
                      ? "Booking..."
                      : "Confirm Booking →"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default HomePriceChart;