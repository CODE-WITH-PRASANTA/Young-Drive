import React, { useEffect, useState } from "react";

import "./HomeBrowseByType.css";

// API
import API from "../../api/axios";
import { IMG_URL } from "../../api/axios";

const HomeBrowseByType = () => {
  /*
   * =========================================================
   * VEHICLES STATE
   * =========================================================
   */

  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  

  const getResponseArray = (response) => {
    const data = response?.data;

    /*
     * Direct array
     */
    if (Array.isArray(data)) {
      return data;
    }

    /*
     * Common backend response structures
     */
    const candidates = [
      data?.data,
      data?.listings,
      data?.vehicles,
      data?.results,
      data?.result,
      data?.items,
      data?.list,
      data?.docs,
    ];

    for (const candidate of candidates) {
      /*
       * Direct array
       */
      if (Array.isArray(candidate)) {
        return candidate;
      }

      /*
       * Nested data
       */
      if (candidate && typeof candidate === "object") {
        if (Array.isArray(candidate.data)) {
          return candidate.data;
        }

        if (Array.isArray(candidate.results)) {
          return candidate.results;
        }

        if (Array.isArray(candidate.listings)) {
          return candidate.listings;
        }

        if (Array.isArray(candidate.vehicles)) {
          return candidate.vehicles;
        }

        if (Array.isArray(candidate.docs)) {
          return candidate.docs;
        }
      }
    }

    return [];
  };

  /*
   * =========================================================
   * GET VEHICLE NAME
   * =========================================================
   *
   * Backend can contain:
   *
   * vehicleBrand
   * vehicleModel
   * brand
   * model
   * name
   * title
   * vehicleName
   *
   * =========================================================
   */

  const getVehicleName = (vehicle) => {
    if (!vehicle) {
      return "Vehicle";
    }

    const brand = vehicle.vehicleBrand || vehicle.brand || vehicle.make || "";

    const model = vehicle.vehicleModel || vehicle.model || "";

    /*
     * Example:
     *
     * Toyota + Camry
     *
     * => Toyota Camry
     */

    const brandModel = [brand, model].filter(Boolean).join(" ").trim();

    if (brandModel) {
      return brandModel;
    }

    /*
     * Fallback fields
     */

    return (
      vehicle.name ||
      vehicle.title ||
      vehicle.vehicleName ||
      vehicle.carName ||
      "Vehicle"
    );
  };

  /*
   * =========================================================
   * GET VEHICLE IMAGE
   * =========================================================
   *
   * Supports:
   *
   * image
   * imageUrl
   * images[]
   *
   * =========================================================
   */

  const getVehicleImage = (vehicle) => {
    if (!vehicle) {
      return "";
    }

    let image = "";

    /*
     * Single image
     */

    if (vehicle.image && typeof vehicle.image === "string") {
      image = vehicle.image;
    } else if (vehicle.imageUrl && typeof vehicle.imageUrl === "string") {
      /*
       * imageUrl
       */
      image = vehicle.imageUrl;
    } else if (Array.isArray(vehicle.images) && vehicle.images.length > 0) {
      /*
       * Multiple images
       */
      const firstImage = vehicle.images[0];

      /*
       * If images is:
       *
       * ["car1.jpg"]
       */

      if (typeof firstImage === "string") {
        image = firstImage;
      } else if (firstImage && typeof firstImage === "object") {
        /*
         * If images is:
         *
         * [{ url: "car1.jpg" }]
         */
        image =
          firstImage.url ||
          firstImage.path ||
          firstImage.image ||
          firstImage.imageUrl ||
          "";
      }
    }

    /*
     * No image
     */

    if (!image) {
      return "";
    }

    /*
     * Already complete URL
     */

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("blob:")
    ) {
      return image;
    }

    /*
     * Backend relative path
     *
     * Example:
     *
     * /uploads/cars/car.jpg
     *
     * or
     *
     * uploads/cars/car.jpg
     */

    return `${IMG_URL}/${image.replace(/^\/+/, "")}`;
  };

  /*
   * =========================================================
   * FETCH ALL UPLOADED VEHICLES
   * =========================================================
   */
const fetchVehicles = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await API.get("/listings");

  

    /*
     * =================================================
     * GET ARRAY FROM RESPONSE
     * =================================================
     */
    const vehicleData =
      getResponseArray(response);

    

    /*
     * =================================================
     * KEEP ONLY VALID VEHICLES
     * =================================================
     */
    const validVehicles =
      vehicleData.filter(
        (vehicle) =>
          vehicle &&
          typeof vehicle === "object"
      );

    /*
     * =================================================
     * GROUP VEHICLES BY CAR NAME
     * =================================================
     *
     * Kia Sonet
     * kia sonet
     * KIA SONET
     *
     * All become ONE card.
     *
     * =================================================
     */

    const vehicleGroups = {};

    validVehicles.forEach((vehicle) => {
      const vehicleName =
        getVehicleName(vehicle);

      /*
       * Name shown in UI
       */
      const displayName = String(
        vehicleName || "Vehicle"
      ).trim();

      /*
       * Name used for grouping
       *
       * This prevents:
       *
       * Kia Sonet
       * kia sonet
       * KIA SONET
       *
       * from creating 3 cards.
       */
      const groupKey =
        displayName.toLowerCase();

      /*
       * Create group
       */
      if (!vehicleGroups[groupKey]) {
        vehicleGroups[groupKey] = {
          name: displayName,
          vehicles: [],
        };
      }

      /*
       * Add vehicle to group
       */
      vehicleGroups[groupKey].vehicles.push(
        vehicle
      );
    });

  


    /*
     * =================================================
     * CREATE UI VEHICLES
     * =================================================
     */

    const formattedVehicles =
      Object.entries(vehicleGroups).map(
        ([groupKey, group], index) => {

          /*
           * First vehicle is used for
           * card image.
           */
          const firstVehicle =
            group.vehicles[0];

          /*
           * Get image
           */
          const image =
            getVehicleImage(
              firstVehicle
            );

          /*
           * Total vehicles with
           * same name
           */
          const vehicleCount =
            group.vehicles.length;

          /*
           * Create safe group ID.
           *
           * IMPORTANT:
           * This is NOT MongoDB _id.
           */
          const groupId =
            `vehicle-group-${groupKey
              .trim()
              .replace(/\s+/g, "-")
              .replace(
                /[^a-z0-9-]/gi,
                ""
              )}`;

          return {
            /*
             * =================================================
             * GROUP ID
             * =================================================
             */
            id:
              groupId ||
              `vehicle-group-${index}`,

            /*
             * =================================================
             * DISPLAY NAME
             * =================================================
             */
            title: group.name,

            /*
             * =================================================
             * VEHICLE COUNT
             * =================================================
             */
            count: `${vehicleCount} ${
              vehicleCount === 1
                ? "Vehicle"
                : "Vehicles"
            }`,

            /*
             * =================================================
             * CARD IMAGE
             * =================================================
             */
            image,

            /*
             * =================================================
             * ALL VEHICLES OF SAME TYPE
             * =================================================
             *
             * Example:
             *
             * vehicles: [
             *   Kia Sonet listing 1,
             *   Kia Sonet listing 2,
             *   Kia Sonet listing 3
             * ]
             */
            vehicles:
              group.vehicles,

            /*
             * =================================================
             * FIRST VEHICLE
             * =================================================
             *
             * Used only as preview data.
             *
             * DO NOT use this _id for the grouped
             * card navigation.
             */
            originalVehicle:
              firstVehicle,
          };
        }
      );

    /*
     * =================================================
     * FINAL RESULT
     * =================================================
     */

  

    /*
     * =================================================
     * SET VEHICLES
     * =================================================
     */

    setVehicles(
      formattedVehicles
    );

  } catch (err) {
    console.error(
      "FETCH VEHICLES ERROR:",
      err
    );

    console.error(
      "API ERROR RESPONSE:",
      err?.response?.data
    );

    setVehicles([]);

    setError(
      err?.response?.data?.message ||
        "Failed to load vehicles."
    );

  } finally {
    setLoading(false);
  }
};

  /*
   * =========================================================
   * FETCH WHEN COMPONENT LOADS
   * =========================================================
   */

  useEffect(() => {
    fetchVehicles();
  }, []);

  /*
   * =========================================================
   * CAR CATEGORIES
   *
   * This now contains ALL uploaded vehicles.
   *
   * Example:
   *
   * [
   *   {
   *     id: "...",
   *     title: "Toyota Camry",
   *     count: "Sedan",
   *     image: "..."
   *   },
   *   {
   *     id: "...",
   *     title: "BMW X5",
   *     count: "SUV",
   *     image: "..."
   *   }
   * ]
   *
   * =========================================================
   */

  const carCategories = vehicles;

  /*
   * =========================================================
   * HOW IT WORKS
   * =========================================================
   */

  const steps = [
    {
      id: 1,

      title: "Choose a Location",

      description:
        "Select the ideal destination to begin your journey with ease",

      icon: (
        /* Pin Location Marker over Car Front */

        <svg
          width="52"
          height="52"
          viewBox="0 0 48 48"
          fill="none"
          stroke="#0f1216"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Map Pin Pinball */}

          <path d="M24 4C19.5 4 16 7.5 16 12C16 18 24 25 24 25C24 25 32 18 32 12C32 7.5 28.5 4 24 4Z" />

          <circle cx="24" cy="11" r="2.5" />

          {/* Front of Car */}

          <path d="M11 36H37" />

          <path d="M14 36V31C14 29 15.5 28 17 28H31C32.5 28 34 29 34 31V36" />

          <path d="M12 36C12 37.5 13 39 14.5 39C16 39 17 37.5 17 36" />

          <path d="M31 36C31 37.5 32 39 33.5 39C35 39 36 37.5 36 36" />

          <circle cx="18" cy="32" r="1.5" />

          <circle cx="30" cy="32" r="1.5" />
        </svg>
      ),
    },

    {
      id: 2,

      title: "Choose Your Vehicle",

      description: "Browse our fleet and find the perfect car for your needs",

      icon: (
        /* Clipboard with Car Sketch & Checkboxes */

        <svg
          width="52"
          height="52"
          viewBox="0 0 48 48"
          fill="none"
          stroke="#0f1216"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Clipboard Board */}

          <rect x="11" y="8" width="26" height="36" rx="3" />

          <path d="M19 5H29V9H19V5Z" />

          {/* Internal Car Line Art */}

          <path d="M16 23C16 21 17.5 20 20 20H28C30.5 20 32 21 32 23L33 26H15L16 23Z" />

          <rect x="15" y="26" width="18" height="6" rx="1" />

          <circle cx="18" cy="32" r="1.5" />

          <circle cx="30" cy="32" r="1.5" />

          {/* Checkboxes at bottom */}

          <path d="M16 37H19M16 39H23" />
        </svg>
      ),
    },

    {
      id: 3,

      title: "Verification",

      description: "Review your information and confirm your booking",

      icon: (
        /* Side-view SUV / Crossover */

        <svg
          width="52"
          height="52"
          viewBox="0 0 48 48"
          fill="none"
          stroke="#0f1216"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Side Roofline & Windows */}

          <path d="M10 24L14 15H29L35 24" />

          <path d="M22 15V24" />

          <path d="M29 15V24" />

          {/* Body Profile */}

          <path d="M6 24H40V31C40 32 39 33 38 33H36M12 33H22M30 33H38" />

          {/* Wheels */}

          <circle cx="14" cy="33" r="4" />

          <circle cx="34" cy="33" r="4" />
        </svg>
      ),
    },

    {
      id: 4,

      title: "Begin Your Journey",

      description: "Start your adventure with confidence and ease",

      icon: (
        /* Car Front with Key Above */

        <svg
          width="52"
          height="52"
          viewBox="0 0 48 48"
          fill="none"
          stroke="#0f1216"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Key Floating Top Left */}

          <path d="M13 10H22M20 10V13M17 10V12" />

          <circle cx="10" cy="10" r="3" />

          {/* Car Front View */}

          <path d="M14 22L17 16H31L34 22" />

          <rect x="12" y="22" width="24" height="11" rx="2" />

          <path d="M12 33V36M36 33V36" />

          <circle cx="17" cy="27" r="2" />

          <circle cx="31" cy="27" r="2" />

          <path d="M20 28H28" />
        </svg>
      ),
    },
  ];

  return (
    <section className="browse-type-section">
      <div className="browse-type-container">
        {/* --- HEADER SECTION --- */}

       <div className="browse-type-header">
        <div className="header-text-group">
          <h2 className="section-title">
            Browse By Type | Best Car Rental<br/> Service In Bhubaneswar
          </h2>

          <p className="section-subtitle">
            Find The Perfect Ride With EV Car Rental Bhubaneswar & Best Car Rental For Wedding In Bhubaneswar
          </p>
        </div>

        <a
          className="view-more-btn"
          href="tel:+919078455208"
        >
          <span>Contact More (+91 9078455208)</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
      </div>

        {/* --- CAR CATEGORIES GRID --- */}

        <div className="car-cards-grid">
          {loading ? (
            /*
             * LOADING
             */
            <div>Loading vehicles...</div>
          ) : carCategories.length === 0 ? (
            /*
             * NO VEHICLES
             */
            <div>No vehicles uploaded yet.</div>
          ) : (
            /*
             * ALL UPLOADED VEHICLES
             */
            carCategories.map((car) => (
              <div className="car-card" key={car.id}>
                {/* Image Container */}

                <div className="car-image-wrapper">
                  {car.image ? (
                    <img
                      src={car.image}
                      alt={car.title}
                      className="car-image"
                    />
                  ) : (
                    <div>No Image</div>
                  )}
                </div>

                {/* Title Header */}

                <h3 className="car-title">{car.title}</h3>

                {/* Footer info: Badge & Hover Arrow */}

                <div className="car-card-footer">
                  <span className="vehicle-count-badge">{car.count}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- ERROR --- */}

        {error && (
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: "red",
            }}
          >
            {error}
          </p>
        )}

        {/* --- HOW IT WORKS SECTION --- */}

       <div className="how-it-works-container">
  <span className="how-tag">
    How It Works •
  </span>

  <h2 className="how-title">
    Book The Best Self Drive <br/>Car Rental In Bhubaneswar Price
   
  </h2>

  <div className="steps-grid">
    {steps.map((step) => (
      <div className="step-item" key={step.id}>
        <div className="step-icon-wrapper">{step.icon}</div>

        <h3 className="step-title">{step.title}</h3>

        <p className="step-desc">{step.description}</p>
      </div>
    ))}
  </div>
</div>
      </div>
    </section>
  );
};

export default HomeBrowseByType;