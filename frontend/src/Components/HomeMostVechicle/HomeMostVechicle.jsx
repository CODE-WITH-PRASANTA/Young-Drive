import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./HomeMostVechicle.css";

import car1 from "../../assets/car-1.webp";
import car2 from "../../assets/car-2.webp";
import car3 from "../../assets/car-3.webp";
import car4 from "../../assets/car-4.webp";
import car5 from "../../assets/car-5.webp";
import car6 from "../../assets/car-6.webp";

import API, {
  IMG_URL,
} from "../../api/axios";

/*
 * =========================================================
 * FALLBACK VEHICLES
 * =========================================================
 *
 * These are only used if the listings API does not return
 * vehicles.
 *
 * For booking, the real backend listing ID is required.
 */
const VEHICLES_DATA = [
  {
    id: "",
    name: "Audi A3 1.6 TDI S line",
    location: "Manchester, England",
    rating: "4.96",
    reviews: "672",
    image: car1,
    mileage: "25,100 miles",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "7 seats",
    price: 498.25,
  },

  {
    id: "",
    name: "Mercedes-Benz C220d",
    location: "Manchester, England",
    rating: "4.96",
    reviews: "672",
    image: car2,
    mileage: "25,100 miles",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "7 seats",
    price: 498.25,
  },

  {
    id: "",
    name: "Volkswagen Golf GTD 2.0 TDI",
    location: "Manchester, England",
    rating: "4.96",
    reviews: "672",
    image: car3,
    mileage: "25,100 miles",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "7 seats",
    price: 498.25,
  },

  {
    id: "",
    name: "Volvo S60 D4 R-Design",
    location: "New South Wales, Australia",
    rating: "4.96",
    reviews: "672",
    image: car4,
    mileage: "25,100 miles",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "7 seats",
    price: 498.25,
  },

  {
    id: "",
    name: "Jaguar XE 2.0d R-Sport",
    location: "Manchester, England",
    rating: "4.96",
    reviews: "672",
    image: car5,
    mileage: "25,100 miles",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "7 seats",
    price: 498.25,
  },

  {
    id: "",
    name: "Lexus IS 300h F Sport",
    location: "Manchester, England",
    rating: "4.96",
    reviews: "672",
    image: car6,
    mileage: "25,100 miles",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "7 seats",
    price: 498.25,
  },
];

/*
 * =========================================================
 * DATE HELPERS
 * =========================================================
 */

const getTodayDate = () => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTomorrowDate = () => {
  const date = new Date();

  date.setDate(
    date.getDate() + 1
  );

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/*
 * =========================================================
 * CONVERT 12 HOUR TIME TO 24 HOUR
 * =========================================================
 */

const convertTo24Hour = (time) => {
  if (!time) {
    return "10:00";
  }

  const value = String(time)
    .trim()
    .toUpperCase();

  /*
   * Already 24-hour format
   */
  if (
    /^\d{2}:\d{2}$/.test(value)
  ) {
    return value;
  }

  const match = value.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
  );

  if (!match) {
    return "10:00";
  }

  let hour = Number(
    match[1]
  );

  const minute = match[2];

  const period = match[3];

  if (
    period === "AM" &&
    hour === 12
  ) {
    hour = 0;
  }

  if (
    period === "PM" &&
    hour !== 12
  ) {
    hour += 12;
  }

  return `${String(hour).padStart(
    2,
    "0"
  )}:${minute}`;
};

/*
 * =========================================================
 * COMBINE DATE + TIME
 * =========================================================
 */

const combineDateTime = (
  date,
  time
) => {
  if (!date) {
    return null;
  }

  const time24 =
    convertTo24Hour(time);

  const result = new Date(
    `${date}T${time24}:00`
  );

  if (
    Number.isNaN(
      result.getTime()
    )
  ) {
    return null;
  }

  return result;
};

/*
 * =========================================================
 * INR FORMATTER
 * =========================================================
 */

const formatINR = (value) => {
  const amount = Number(value);

  if (
    Number.isNaN(amount)
  ) {
    return "₹0.00";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(amount);
};

/*
 * =========================================================
 * IMAGE URL
 * =========================================================
 */

const getImageUrl = (
  image,
  fallback
) => {
  if (!image) {
    return fallback;
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  if (IMG_URL) {
    return `${IMG_URL}/${image.replace(
      /^\/+/,
      ""
    )}`;
  }

  return image;
};

/*
 * =========================================================
 * LOCATION NAME
 * =========================================================
 */

const getLocationName = (
  location
) => {
  if (!location) {
    return "";
  }

  if (
    typeof location === "string"
  ) {
    return location;
  }

  return (
    location.name ||
    location.locationName ||
    location.city ||
    location.address ||
    [
      location.address,
      location.city,
      location.state,
      location.country,
    ]
      .filter(Boolean)
      .join(", ") ||
    ""
  );
};

/*
 * =========================================================
 * NORMALIZE VEHICLE
 * =========================================================
 */

const normalizeVehicle = (
  vehicle,
  index
) => {
  if (!vehicle) {
    return null;
  }

  const fallbackImages = [
    car1,
    car2,
    car3,
    car4,
    car5,
    car6,
  ];

  const rawImage =
    Array.isArray(
      vehicle.images
    ) &&
    vehicle.images.length > 0
      ? vehicle.images[0]
      : vehicle.image ||
        vehicle.vehicleImage ||
        "";

  const image = getImageUrl(
    rawImage,
    fallbackImages[
      index %
        fallbackImages.length
    ]
  );

  const name =
    vehicle.title ||
    vehicle.name ||
    vehicle.vehicleName ||
    vehicle.model ||
    "Vehicle";

  const location =
    getLocationName(
      vehicle.location
    ) ||
    vehicle.city ||
    vehicle.address ||
    "Manchester, England";

  const mileage =
    vehicle.mileage ||
    vehicle.km ||
    vehicle.distance ||
    vehicle.mileageInfo ||
    "25,100 miles";

  const transmission =
    vehicle.transmission ||
    vehicle.gearType ||
    "Automatic";

  const fuel =
    vehicle.fuel ||
    vehicle.fuelType ||
    "Diesel";

  const seats =
    vehicle.seats ||
    vehicle.seatingCapacity ||
    vehicle.capacity ||
    "7 seats";

  const price =
    vehicle.price ??
    vehicle.dailyPrice ??
    vehicle.dailyRate ??
    vehicle.rentPerDay ??
    vehicle.amount ??
    0;

  return {
    ...vehicle,

    /*
     * IMPORTANT:
     * This must be MongoDB _id from /listings.
     */
    id:
      vehicle._id ||
      vehicle.id ||
      "",

    name,

    location,

    rating:
      vehicle.rating ||
      vehicle.averageRating ||
      "4.96",

    reviews:
      vehicle.reviews ||
      vehicle.reviewCount ||
      "0",

    image,

    mileage,

    transmission,

    fuel,

    seats,

    price: Number(price) || 0,
  };
};

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

const HomeMostVechicle = () => {
  const scrollContainerRef =
    useRef(null);

  /*
   * =======================================================
   * VEHICLES
   * =======================================================
   */

  const [
    vehicles,
    setVehicles,
  ] = useState(
    VEHICLES_DATA
  );

  const [
    loadingVehicles,
    setLoadingVehicles,
  ] = useState(false);

  /*
   * =======================================================
   * LOCATIONS
   * =======================================================
   */

  const [
    locations,
    setLocations,
  ] = useState([]);

  const [
    loadingLocations,
    setLoadingLocations,
  ] = useState(false);

  /*
   * =======================================================
   * SELECTED VEHICLE
   * =======================================================
   */

  const [
    selectedVehicle,
    setSelectedVehicle,
  ] = useState(null);

  /*
   * =======================================================
   * SUBMIT
   * =======================================================
   */

  const [
    bookingLoading,
    setBookingLoading,
  ] = useState(false);

  /*
   * =======================================================
   * FORM STATE
   * =======================================================
   */

  const [
    formData,
    setFormData,
  ] = useState({
    fullName: "",

    email: "",

    phoneCode: "+91",

    phone: "",

    pickupLocation: "",

    dropoffLocation: "",

    pickupDate:
      getTodayDate(),

    pickupTime:
      "10:00 AM",

    dropoffDate:
      getTomorrowDate(),

    dropoffTime:
      "10:00 AM",

    message: "",
  });

  /*
   * =======================================================
   * FETCH VEHICLES
   * =======================================================
   */

  const fetchVehicles =
    async () => {
      try {
        setLoadingVehicles(
          true
        );

        console.log(
          "FETCHING VEHICLES..."
        );

        const response =
          await API.get(
            "/listings"
          );

        console.log(
          "VEHICLES API RESPONSE:",
          response.data
        );

        let vehicleData = [];

        if (
          Array.isArray(
            response.data?.data
          )
        ) {
          vehicleData =
            response.data.data;
        } else if (
          Array.isArray(
            response.data?.vehicles
          )
        ) {
          vehicleData =
            response.data.vehicles;
        } else if (
          Array.isArray(
            response.data?.listings
          )
        ) {
          vehicleData =
            response.data.listings;
        } else if (
          Array.isArray(
            response.data
          )
        ) {
          vehicleData =
            response.data;
        }

        if (
          vehicleData.length > 0
        ) {
          const normalized =
            vehicleData
              .map(
                (
                  vehicle,
                  index
                ) =>
                  normalizeVehicle(
                    vehicle,
                    index
                  )
              )
              .filter(Boolean);

          setVehicles(
            normalized
          );
        }
      } catch (error) {
        console.error(
          "FETCH VEHICLES ERROR:",
          error
        );

        console.error(
          "VEHICLE SERVER RESPONSE:",
          error?.response?.data
        );

        /*
         * Keep fallback UI.
         */
      } finally {
        setLoadingVehicles(
          false
        );
      }
    };

  /*
   * =======================================================
   * FETCH LOCATIONS
   * =======================================================
   *
   * Backend:
   *
   * GET /api/locations
   *
   * =======================================================
   */

  const fetchLocations =
    async () => {
      try {
        setLoadingLocations(
          true
        );

        console.log(
          "FETCHING LOCATIONS..."
        );

        const response =
          await API.get(
            "/locations"
          );

        console.log(
          "LOCATIONS API RESPONSE:",
          response.data
        );

        let locationData = [];

        if (
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
            response.data
          )
        ) {
          locationData =
            response.data;
        }

        /*
         * Only use active locations
         * when status is available.
         */
        const normalizedLocations =
          locationData
            .filter(
              (location) => {
                if (
                  !location
                ) {
                  return false;
                }

                if (
                  !location.status
                ) {
                  return true;
                }

                return (
                  String(
                    location.status
                  ).toLowerCase() ===
                  "active"
                );
              }
            )
            .map(
              (location) => ({
                ...location,

                id:
                  location._id ||
                  location.id ||
                  "",

                name:
                  getLocationName(
                    location
                  ),
              })
            )
            .filter(
              (location) =>
                location.name
            );

        console.log(
          "NORMALIZED LOCATIONS:",
          normalizedLocations
        );

        setLocations(
          normalizedLocations
        );

        /*
         * Set default locations.
         */
        if (
          normalizedLocations.length >
          0
        ) {
          const firstLocation =
            normalizedLocations[0]
              .name;

          setFormData(
            (previous) => ({
              ...previous,

              pickupLocation:
                previous.pickupLocation ||
                firstLocation,

              dropoffLocation:
                previous.dropoffLocation ||
                firstLocation,
            })
          );
        }
      } catch (error) {
        console.error(
          "FETCH LOCATIONS ERROR:",
          error
        );

        console.error(
          "LOCATION SERVER RESPONSE:",
          error?.response?.data
        );

        setLocations([]);
      } finally {
        setLoadingLocations(
          false
        );
      }
    };

  /*
   * =======================================================
   * INITIAL API CALLS
   * =======================================================
   */

  useEffect(() => {
    fetchVehicles();
    fetchLocations();
  }, []);

  /*
   * =======================================================
   * SCROLL
   * =======================================================
   */

  const handleScroll = (
    direction
  ) => {
    if (
      scrollContainerRef.current
    ) {
      const scrollAmount =
        direction === "left"
          ? -380
          : 380;

      scrollContainerRef.current.scrollBy(
        {
          left: scrollAmount,
          behavior: "smooth",
        }
      );
    }
  };

  /*
   * =======================================================
   * OPEN MODAL
   * =======================================================
   */

  const handleOpenModal = (
    car
  ) => {
    setSelectedVehicle(
      car
    );

    const defaultLocation =
      locations.length > 0
        ? locations[0].name
        : car.location || "";

    /*
     * If vehicle location exists
     * in the API locations, use it.
     */
    const matchingLocation =
      locations.find(
        (location) =>
          location.name
            .toLowerCase() ===
          String(
            car.location || ""
          ).toLowerCase()
      );

    const pickupLocation =
      matchingLocation?.name ||
      defaultLocation;

    setFormData(
      (previous) => ({
        ...previous,

        pickupLocation,

        dropoffLocation:
          previous.dropoffLocation ||
          defaultLocation,

        pickupDate:
          previous.pickupDate ||
          getTodayDate(),

        dropoffDate:
          previous.dropoffDate ||
          getTomorrowDate(),
      })
    );
  };

  /*
   * =======================================================
   * CLOSE MODAL
   * =======================================================
   */

  const handleCloseModal =
    () => {
      if (
        bookingLoading
      ) {
        return;
      }

      setSelectedVehicle(
        null
      );

      setFormData({
        fullName: "",

        email: "",

        phoneCode: "+91",

        phone: "",

        pickupLocation:
          locations.length > 0
            ? locations[0].name
            : "",

        dropoffLocation:
          locations.length > 0
            ? locations[0].name
            : "",

        pickupDate:
          getTodayDate(),

        pickupTime:
          "10:00 AM",

        dropoffDate:
          getTomorrowDate(),

        dropoffTime:
          "10:00 AM",

        message: "",
      });
    };

  /*
   * =======================================================
   * INPUT CHANGE
   * =======================================================
   */

  const handleInputChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /*
   * =======================================================
   * CONFIRM BOOKING
   * =======================================================
   */

  const handleConfirmBooking =
    async (e) => {
      e.preventDefault();

      console.log(
        "===================================="
      );

      console.log(
        "BOOKING SUBMIT CLICKED"
      );

      console.log(
        "===================================="
      );

      /*
       * ==================================================
       * VEHICLE VALIDATION
       * ==================================================
       */

      if (
        !selectedVehicle
      ) {
        alert(
          "Please select a vehicle."
        );

        return;
      }

      /*
       * IMPORTANT:
       * Backend requires a real MongoDB ID.
       */
      const vehicleId =
        selectedVehicle.id ||
        selectedVehicle._id;

      if (
        !vehicleId ||
        !/^[0-9a-fA-F]{24}$/.test(
          String(vehicleId)
        )
      ) {
        console.error(
          "INVALID VEHICLE ID:",
          vehicleId
        );

        alert(
          "This vehicle is not connected to the backend. Please refresh the page and select a vehicle from the vehicle API."
        );

        return;
      }

      /*
       * ==================================================
       * CUSTOMER VALIDATION
       * ==================================================
       */

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

      if (
        !formData.phone.trim()
      ) {
        alert(
          "Please enter your phone number."
        );

        return;
      }

      const cleanPhone =
        formData.phone.replace(
          /\D/g,
          ""
        );

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

      /*
       * ==================================================
       * LOCATION VALIDATION
       * ==================================================
       */

      if (
        !formData.pickupLocation
      ) {
        alert(
          "Pickup location is required."
        );

        return;
      }

      if (
        !formData.dropoffLocation
      ) {
        alert(
          "Drop-off location is required."
        );

        return;
      }

      /*
       * ==================================================
       * DATE VALIDATION
       * ==================================================
       */

      if (
        !formData.pickupDate
      ) {
        alert(
          "Pickup date is required."
        );

        return;
      }

      if (
        !formData.dropoffDate
      ) {
        alert(
          "Drop-off date is required."
        );

        return;
      }

      const pickupDateObject =
        new Date(
          formData.pickupDate
        );

      const dropoffDateObject =
        new Date(
          formData.dropoffDate
        );

      if (
        Number.isNaN(
          pickupDateObject.getTime()
        )
      ) {
        alert(
          "Invalid pickup date."
        );

        return;
      }

      if (
        Number.isNaN(
          dropoffDateObject.getTime()
        )
      ) {
        alert(
          "Invalid drop-off date."
        );

        return;
      }

      if (
        dropoffDateObject <
        pickupDateObject
      ) {
        alert(
          "Drop-off date cannot be before pickup date."
        );

        return;
      }

      /*
       * ==================================================
       * DATE + TIME
       * ==================================================
       */

      const bookingDateTime =
        new Date();

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

      if (
        !pickupDateTime
      ) {
        alert(
          "Invalid pickup date/time."
        );

        return;
      }

      if (
        !dropoffDateTime
      ) {
        alert(
          "Invalid drop-off date/time."
        );

        return;
      }

      /*
       * ==================================================
       * PRICE
       * ==================================================
       *
       * Backend stores amount as Number.
       *
       * Price shown in UI is INR.
       */

      const amount =
        Number(
          selectedVehicle.price
        ) || 0;

      /*
       * ==================================================
       * FINAL PAYLOAD
       * ==================================================
       */

      const bookingPayload = {
        /*
         * CUSTOMER
         */
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

        /*
         * VEHICLE
         */
        vehicle:
          vehicleId,

        vehicleId:
          vehicleId,

        vehicleName:
          selectedVehicle.name,

        vehicleImage:
          selectedVehicle.image ||
          "",

        /*
         * BOOKING
         */
        bookingDate:
          bookingDateTime,

        bookingTime:
          formData.pickupTime ||
          "10:00 AM",

        /*
         * PICKUP
         */
        pickupDate:
          pickupDateTime,

        pickupTime:
          formData.pickupTime ||
          "10:00 AM",

        pickupLocation:
          formData.pickupLocation,

        pickupLoc:
          formData.pickupLocation,

        /*
         * DROP-OFF
         */
        dropoffDate:
          dropoffDateTime,

        dropoffTime:
          formData.dropoffTime ||
          "10:00 AM",

        returnDate:
          dropoffDateTime,

        dropoffLocation:
          formData.dropoffLocation,

        dropLocation:
          formData.dropoffLocation,

        returnLoc:
          formData.dropoffLocation,

        /*
         * AMOUNT
         */
        amount,

        price:
          amount,

        /*
         * DEFAULT BOOKING STATUS
         */
        status:
          "Pending",

        paymentStatus:
          "Unpaid",

        paymentMethod:
          "",

        /*
         * MESSAGE
         */
        additionalMessage:
          formData.message.trim(),

        message:
          formData.message.trim(),
      };

      console.log(
        "===================================="
      );

      console.log(
        "FINAL BOOKING PAYLOAD:",
        bookingPayload
      );

      console.log(
        "VEHICLE ID:",
        vehicleId
      );

      console.log(
        "PICKUP LOCATION:",
        formData.pickupLocation
      );

      console.log(
        "DROP-OFF LOCATION:",
        formData.dropoffLocation
      );

      console.log(
        "PICKUP DATE:",
        pickupDateTime
      );

      console.log(
        "RETURN DATE:",
        dropoffDateTime
      );

      console.log(
        "AMOUNT:",
        amount
      );

      console.log(
        "===================================="
      );

      /*
       * ==================================================
       * API REQUEST
       * ==================================================
       */

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
          "BOOKING API RESPONSE:",
          response.data
        );

        if (
          response.status >=
            200 &&
          response.status < 300
        ) {
          alert(
            response.data?.message ||
              "Booking confirmed successfully!"
          );

          handleCloseModal();

          return;
        }

        alert(
          response.data?.message ||
            "Failed to create booking."
        );
      } catch (error) {
        console.error(
          "===================================="
        );

        console.error(
          "BOOKING ERROR:",
          error
        );

        console.error(
          "STATUS:",
          error?.response?.status
        );

        console.error(
          "SERVER RESPONSE:",
          error?.response?.data
        );

        console.error(
          "===================================="
        );

        alert(
          error?.response?.data
            ?.message ||
            "Failed to submit booking."
        );
      } finally {
        setBookingLoading(
          false
        );
      }
    };

  return (
    <section className="most-vehicles-section">
      <div className="most-vehicles-container">

        {/* --- SECTION HEADER --- */}

        <div className="section-header">

          <div className="header-text">

            <h2 className="section-title">
              Most Searched Vehicles
            </h2>

            <p className="section-subtitle">
              The world's leading car brands
            </p>

          </div>

          {/* Navigation Arrows */}

          <div className="nav-buttons">

            <button
              className="nav-btn"
              onClick={() =>
                handleScroll(
                  "left"
                )
              }
              aria-label="Previous"
            >
              ←
            </button>

            <button
              className="nav-btn"
              onClick={() =>
                handleScroll(
                  "right"
                )
              }
              aria-label="Next"
            >
              →
            </button>

          </div>

        </div>

        {/* --- VEHICLES GRID --- */}

        <div
          className="vehicles-grid"
          ref={
            scrollContainerRef
          }
        >

          {loadingVehicles ? (
            <div
              style={{
                width: "100%",
                padding: "30px",
                textAlign:
                  "center",
              }}
            >
              Loading vehicles...
            </div>
          ) : (
            vehicles.map(
              (car) => (
                <div
                  className="vehicle-card"
                  key={
                    car.id ||
                    car.name
                  }
                >

                  {/* Image Wrapper */}

                  <div className="card-image-wrapper">

                    <img
                      src={car.image}
                      alt={car.name}
                      className="vehicle-image"
                      onError={(
                        e
                      ) => {
                        e.currentTarget.src =
                          car1;
                      }}
                    />

                    {/* Rating Badge */}

                    <div className="rating-badge">

                      <span className="star-icon">
                        ★
                      </span>

                      <span className="rating-score">
                        {car.rating}
                      </span>

                      <span className="reviews-count">
                        ({car.reviews} reviews)
                      </span>

                    </div>

                  </div>

                  {/* Card Content */}

                  <div className="card-content">

                    <h3 className="vehicle-name">
                      {car.name}
                    </h3>

                    <p className="vehicle-location">

                      <span className="location-icon">
                        📍
                      </span>

                      {car.location}

                    </p>

                    <hr className="card-divider" />

                    {/* Specs Grid */}

                    <div className="specs-grid">

                      <div className="spec-item">

                        <span className="spec-icon">
                          🧭
                        </span>

                        <span>
                          {car.mileage}
                        </span>

                      </div>

                      <div className="spec-item">

                        <span className="spec-icon">
                          ⚙️
                        </span>

                        <span>
                          {car.transmission}
                        </span>

                      </div>

                      <div className="spec-item">

                        <span className="spec-icon">
                          ⛽
                        </span>

                        <span>
                          {car.fuel}
                        </span>

                      </div>

                      <div className="spec-item">

                        <span className="spec-icon">
                          💺
                        </span>

                        <span>
                          {car.seats}
                        </span>

                      </div>

                    </div>

                    {/* Card Footer */}

                    <div className="card-footer">

                      <div className="price-container">

                        <span className="price-label">
                          From{" "}
                        </span>

                        <span className="price-amount">
                          {formatINR(
                            car.price
                          )}
                        </span>

                      </div>

                      <button
                        className="book-btn"
                        onClick={() =>
                          handleOpenModal(
                            car
                          )
                        }
                      >
                        Book Now
                      </button>

                    </div>

                  </div>

                </div>
              )
            )
          )}

        </div>

        {/* --- LOAD MORE BUTTON --- */}

        <div className="load-more-container">

          <button
            className="load-more-btn"
            type="button"
          >
            <span className="refresh-icon">
              🔄
            </span>

            Load More Cars
          </button>

        </div>

      </div>

      {/* --- BOOK NOW POPUP MODAL --- */}

      {selectedVehicle && (

        <div
          className="modal-backdrop"
          onClick={
            handleCloseModal
          }
        >

          <div
            className="modal-card"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Close Button */}

            <button
              className="modal-close-btn"
              onClick={
                handleCloseModal
              }
              type="button"
            >
              ✕
            </button>

            {/* Left Side: Vehicle Details Preview */}

            <div className="modal-left">

              <div className="modal-img-container">

                <img
                  src={
                    selectedVehicle.image
                  }
                  alt={
                    selectedVehicle.name
                  }
                  className="modal-car-img"
                  onError={(
                    e
                  ) => {
                    e.currentTarget.src =
                      car1;
                  }}
                />

                <div className="modal-carousel-dots">

                  <span className="dot active"></span>

                  <span className="dot"></span>

                  <span className="dot"></span>

                </div>

              </div>

              <h2 className="modal-car-title">
                {
                  selectedVehicle.name
                }
              </h2>

              <p className="modal-car-location">

                <svg
                  className="icon-svg"
                  viewBox="0 0 24 24"
                >

                  <path
                    fill="#059669"
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5-2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  />

                </svg>

                {
                  selectedVehicle.location
                }

              </p>

              <div className="modal-specs-grid">

                <div className="modal-spec-item">

                  <svg
                    className="icon-svg"
                    viewBox="0 0 24 24"
                  >

                    <path
                      fill="#6B7280"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                    />

                  </svg>

                  {
                    selectedVehicle.mileage
                  }

                </div>

                <div className="modal-spec-item">

                  <svg
                    className="icon-svg"
                    viewBox="0 0 24 24"
                  >

                    <path
                      fill="#6B7280"
                      d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.22.22.47.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                    />

                  </svg>

                  {
                    selectedVehicle.transmission
                  }

                </div>

                <div className="modal-spec-item">

                  <svg
                    className="icon-svg"
                    viewBox="0 0 24 24"
                  >

                    <path
                      fill="#6B7280"
                      d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-5h1v5.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V10.5c0-.98-.53-1.82-1.23-2.27zM18 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM5 19V5h6v14H5z"
                    />

                  </svg>

                  {
                    selectedVehicle.fuel
                  }

                </div>

                <div className="modal-spec-item">

                  <svg
                    className="icon-svg"
                    viewBox="0 0 24 24"
                  >

                    <path
                      fill="#6B7280"
                      d="M4 18v3h3v-3h10v3h3v-3c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2zm2-10h12v5H6V8z"
                    />

                  </svg>

                  {
                    selectedVehicle.seats
                  }

                </div>

              </div>

              <div className="modal-price-line">

                <span className="from-text">
                  From
                </span>

                <span className="price-bold">
                  {formatINR(
                    selectedVehicle.price
                  )}
                </span>

                <span className="per-day">
                  / day
                </span>

              </div>

              <div className="modal-cancellation-box">

                <span className="info-icon">
                  ⓘ
                </span>

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

            {/* Right Side: Booking Form */}

            <div className="modal-right">

              <h2 className="form-title">
                Book Now
              </h2>

              <p className="form-subtitle">
                Fill in your details to book this vehicle
              </p>

              <form
                onSubmit={
                  handleConfirmBooking
                }
                className="booking-form"
                noValidate
              >

                {/* Full Name & Email Row */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Full Name
                    </label>

                    <div className="input-with-icon">

                      <svg
                        className="input-icon"
                        viewBox="0 0 24 24"
                      >

                        <path
                          fill="#9CA3AF"
                          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                        />

                      </svg>

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

                  <div className="form-group">

                    <label>
                      Email Address
                    </label>

                    <div className="input-with-icon">

                      <svg
                        className="input-icon"
                        viewBox="0 0 24 24"
                      >

                        <path
                          fill="#9CA3AF"
                          d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                        />

                      </svg>

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

                {/* Phone Number */}

                <div className="form-group">

                  <label>
                    Phone Number
                  </label>

                  <div className="phone-input-wrapper">

                    <div className="country-select">

                      <span className="flag-icon">
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

                {/* Pick-up Location */}

                <div className="form-group">

                  <label>
                    Pick-up Location
                  </label>

                  <div className="input-with-icon select-wrapper">

                    <svg
                      className="input-icon"
                      viewBox="0 0 24 24"
                    >

                      <path
                        fill="#9CA3AF"
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5-2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                      />

                    </svg>

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
                        {loadingLocations
                          ? "Loading locations..."
                          : "Select pickup location"}
                      </option>

                      {locations.map(
                        (
                          location,
                          index
                        ) => (
                          <option
                            key={
                              location.id ||
                              `${location.name}-${index}`
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
                      )}

                    </select>

                  </div>

                </div>

                {/* Pick-up Date & Time */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Pick-up Date
                    </label>

                    <div className="input-with-icon">

                      <svg
                        className="input-icon"
                        viewBox="0 0 24 24"
                      >

                        <path
                          fill="#9CA3AF"
                          d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.11 0 2-.89 2-2V6c0-1.1-.89-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
                        />

                      </svg>

                      <input
                        type="date"
                        name="pickupDate"
                        value={
                          formData.pickupDate
                        }
                        min={
                          getTodayDate()
                        }
                        onChange={
                          handleInputChange
                        }
                        required
                      />

                    </div>

                  </div>

                  <div className="form-group">

                    <label>
                      Pick-up Time
                    </label>

                    <div className="input-with-icon select-wrapper">

                      <svg
                        className="input-icon"
                        viewBox="0 0 24 24"
                      >

                        <path
                          fill="#9CA3AF"
                          d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
                        />

                      </svg>

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

                {/* Drop-off Location */}

                <div className="form-group">

                  <label>
                    Drop-off Location
                  </label>

                  <div className="input-with-icon select-wrapper">

                    <svg
                      className="input-icon"
                      viewBox="0 0 24 24"
                    >

                      <path
                        fill="#9CA3AF"
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                      />

                    </svg>

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
                        {loadingLocations
                          ? "Loading locations..."
                          : "Select drop-off location"}
                      </option>

                      {locations.map(
                        (
                          location,
                          index
                        ) => (
                          <option
                            key={
                              location.id ||
                              `${location.name}-drop-${index}`
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
                      )}

                    </select>

                  </div>

                </div>

                {/* Drop-off Date & Time */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Drop-off Date
                    </label>

                    <div className="input-with-icon">

                      <svg
                        className="input-icon"
                        viewBox="0 0 24 24"
                      >

                        <path
                          fill="#9CA3AF"
                          d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
                        />

                      </svg>

                      <input
                        type="date"
                        name="dropoffDate"
                        value={
                          formData.dropoffDate
                        }
                        min={
                          formData.pickupDate ||
                          getTodayDate()
                        }
                        onChange={
                          handleInputChange
                        }
                        required
                      />

                    </div>

                  </div>

                  <div className="form-group">

                    <label>
                      Drop-off Time
                    </label>

                    <div className="input-with-icon select-wrapper">

                      <svg
                        className="input-icon"
                        viewBox="0 0 24 24"
                      >

                        <path
                          fill="#9CA3AF"
                          d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
                        />

                      </svg>

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

                {/* Additional Message */}

                <div className="form-group">

                  <label>
                    Additional Message (Optional)
                  </label>

                  <textarea
                    name="message"
                    rows="3"
                    placeholder="Enter any special requests or notes..."
                    value={
                      formData.message
                    }
                    onChange={
                      handleInputChange
                    }
                  ></textarea>

                </div>

                {/* Secure Booking Highlight */}

                <div className="secure-booking-banner">

                  <svg
                    className="shield-icon"
                    viewBox="0 0 24 24"
                  >

                    <path
                      fill="#059669"
                      d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
                    />

                  </svg>

                  <div>

                    <strong>
                      Secure Booking
                    </strong>

                    <p>
                      Your information is safe with us. We use secure encryption.
                    </p>

                  </div>

                </div>

                {/* Action Buttons */}

                <div className="form-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={
                      handleCloseModal
                    }
                    disabled={
                      bookingLoading
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="confirm-btn"
                    disabled={
                      bookingLoading ||
                      loadingVehicles ||
                      loadingLocations
                    }
                  >

                    {bookingLoading
                      ? "Submitting..."
                      : (
                        <>
                          Confirm Booking{" "}
                          <span>
                            →
                          </span>
                        </>
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

export default HomeMostVechicle;