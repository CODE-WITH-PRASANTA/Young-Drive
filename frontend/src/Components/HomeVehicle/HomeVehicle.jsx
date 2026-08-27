import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import "./HomeVehicle.css";
import API from "../../api/axios";

// Brand logos
import acuraImg from "../../assets/acura.png";
import bugattiImg from "../../assets/bugatti.png";
import chevroletImg from "../../assets/chevrolet.png";
import hondaImg from "../../assets/honda.png";
import jaguarImg from "../../assets/jaguar.png";
import lexusImg from "../../assets/lexus.png";
import merImg from "../../assets/mer.png";
import toyotaImg from "../../assets/toyota.png";

const BRANDS = [
  { name: "Lexus", logo: lexusImg },
  { name: "Mercedes-Benz", logo: merImg },
  { name: "Bugatti", logo: bugattiImg },
  { name: "Jaguar", logo: jaguarImg },
  { name: "Honda", logo: hondaImg },
  { name: "Chevrolet", logo: chevroletImg },
  { name: "Acura", logo: acuraImg },
  { name: "Toyota", logo: toyotaImg },
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const HomeVehicle = () => {
  const [activeTab, setActiveTab] = useState("All cars");
  const [pickUpLocation, setPickUpLocation] = useState("Bhubaneswar, Odisha");
  const [dropOffLocation, setDropOffLocation] = useState("Bhubaneswar, Odisha");

  // Dates state
  const [pickUpDate, setPickUpDate] = useState("07/22/2026");
  const [returnDate, setReturnDate] = useState("07/22/2026");

  // Popover & API states
  const [activeDatePicker, setActiveDatePicker] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1));
  const [locations, setLocations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [locationVehicles, setLocationVehicles] = useState([]);
  const [showVehiclePopup, setShowVehiclePopup] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const fetchLocations = async () => {
    try {
      setLocationLoading(true);
      setLocationError("");
      const response = await API.get("/locations");
      const locationData = response.data?.data || [];
      const activeLocations = locationData.filter(
        (location) => location?.status === "Active"
      );
      setLocations(activeLocations);
    } catch (error) {
      console.error("FETCH LOCATIONS ERROR:", error);
      setLocations([]);
      setLocationError(
        error?.response?.data?.message || "Failed to load locations."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      setVehicleLoading(true);
      const response = await API.get("/listings");
      const vehicleData =
        response.data?.data ||
        response.data?.vehicles ||
        response.data?.listings ||
        response.data ||
        [];

      if (!Array.isArray(vehicleData)) {
        setVehicles([]);
        return;
      }

      const activeVehicles = vehicleData.filter(
        (vehicle) => vehicle?.status !== "Inactive"
      );
      setVehicles(activeVehicles);
    } catch (error) {
      console.error("FETCH VEHICLES ERROR:", error);
      setVehicles([]);
    } finally {
      setVehicleLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchVehicles();
  }, []);

  const handleFindVehicle = () => {
    if (!pickUpLocation || !pickUpLocation.trim()) {
      alert("Please select a pickup location.");
      return;
    }

    const selectedLocation = locations.find(
      (location) => location.name === pickUpLocation
    );

    if (!selectedLocation) {
      setLocationVehicles([]);
      setShowVehiclePopup(true);
      return;
    }

    const selectedCity = String(selectedLocation.city || "")
      .trim()
      .toLowerCase();

    const matchedVehicles = vehicles.filter((vehicle) => {
      const vehicleLocation = String(vehicle.location || "")
        .trim()
        .toLowerCase();
      return vehicleLocation === selectedCity;
    });

    setLocationVehicles(matchedVehicles);
    setShowVehiclePopup(true);
  };

  const getGroupedLocationVehicles = () => {
    const groups = {};
    locationVehicles.forEach((vehicle) => {
      const vehicleName = vehicle.name || vehicle.title || "Vehicle";
      const cleanName = String(vehicleName).trim();
      if (!groups[cleanName]) groups[cleanName] = [];
      groups[cleanName].push(vehicle);
    });

    return Object.entries(groups).map(([name, vehicleList]) => ({
      name,
      count: vehicleList.length,
      vehicles: vehicleList,
    }));
  };

  const toggleDatePicker = (type) => {
    setActiveDatePicker(activeDatePicker === type ? null : type);
  };

  const handleSelectDate = (dayNum) => {
    if (!dayNum) return;
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const day = String(dayNum).padStart(2, "0");
    const year = currentMonth.getFullYear();
    const formatted = `${month}/${day}/${year}`;

    if (activeDatePicker === "pickup") {
      setPickUpDate(formatted);
    } else if (activeDatePicker === "return") {
      setReturnDate(formatted);
    }
    setActiveDatePicker(null);
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const grid = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      grid.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push({ day: i, isCurrentMonth: true });
    }
    const remaining = 35 - grid.length;
    for (let i = 1; i <= remaining; i++) {
      grid.push({ day: i, isCurrentMonth: false });
    }
    return grid;
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "name": "Young Drives",
    "image": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2000&auto=format&fit=crop",
    "@id": "https://youngdrives.com",
    "url": "https://youngdrives.com",
    "telephone": "+919078455208",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plot No :-001, CRP square, Vanik road, Back side of Ama Bus Stand",
      "addressLocality": "Bhubaneswar",
      "addressRegion": "Odisha",
      "postalCode": "75011",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 20.2961,
      "longitude": 85.8245
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <div className="home-vehicle-wrapper">
      <Helmet>
        <title>Best Car Rental in Bhubaneswar | Self Drive & Chauffeur Cars - Young Drives</title>
        <meta
          name="description"
          content="Young Drives offers the best car rental in Bhubaneswar. Book self drive car rental, EV car rental, luxury wedding cars, & airport taxi services at the lowest prices."
        />
        <meta
          name="keywords"
          content="best car rental in bhubaneswar, best car rental in bhubaneswar airport, best car rental in bhubaneswar with driver, best self drive car rental in bhubaneswar, ev car rental bhubaneswar, cheapest car rental in bhubaneswar"
        />
        <link rel="canonical" href="https://youngdrives.com/" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="badge-subtitle">Young Drives • Premier Mobility Partner</span>
            <h1 className="hero-title">
              Best Car Rental in Bhubaneswar for Self Drive & Chauffeur Trips
            </h1>

            <div className="features-row">
              <div className="feature-item">
                <span className="check-icon">✓</span>
                Self Drive & Chauffeur Driven
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                Airport Delivery & EV Options
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                Zero Security Hassle & 24/7 Roadside Support
              </div>
            </div>
          </div>
        </div>

        {/* --- BOOKING CARD --- */}
        <div className="booking-card">
          <div className="booking-header">
            <div className="tabs">
              {["All cars", "Self Drive", "With Driver", "EV Cars"].map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <a href="tel:+919078455208" className="need-help">
              <span className="user-icon">📞</span> +91 90784 55208
            </a>
          </div>

          <div className="booking-form-grid">
            <div className="form-field">
              <label>Pick Up Location</label>
              <div className="field-input">
                <span className="icon-marker">📍</span>
                <select
                  value={pickUpLocation}
                  onChange={(e) => setPickUpLocation(e.target.value)}
                  disabled={locationLoading}
                >
                  <option value="">
                    {locationLoading ? "Loading locations..." : "Select pickup hub"}
                  </option>
                  <option value="Bhubaneswar Airport (BBI)">Bhubaneswar Airport (BBI)</option>
                  <option value="CRP Square Hub">CRP Square Hub</option>
                  {locations.map((location) => (
                    <option key={location._id} value={location.name}>
                      {location.name} - {location.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Drop Off Location</label>
              <div className="field-input">
                <span className="icon-marker">📍</span>
                <select
                  value={dropOffLocation}
                  onChange={(e) => setDropOffLocation(e.target.value)}
                  disabled={locationLoading}
                >
                  <option value="">
                    {locationLoading ? "Loading locations..." : "Select drop location"}
                  </option>
                  <option value="Bhubaneswar Airport (BBI)">Bhubaneswar Airport (BBI)</option>
                  <option value="CRP Square Hub">CRP Square Hub</option>
                  {locations.map((location) => (
                    <option key={location._id} value={location.name}>
                      {location.name} - {location.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field relative-field">
              <label>Pick Up Date & Time</label>
              <div
                className="field-input clickable"
                onClick={() => toggleDatePicker("pickup")}
              >
                <span className="icon-calendar">📅</span>
                <span>{pickUpDate}</span>
                <span className="chevron-down">⌄</span>
              </div>

              {activeDatePicker === "pickup" && (
                <div className="datepicker-modal">
                  <div className="datepicker-header">
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1,
                            1
                          )
                        )
                      }
                    >
                      ‹
                    </button>
                    <span>
                      {currentMonth.toLocaleString("default", { month: "long" })}{" "}
                      {currentMonth.getFullYear()}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1,
                            1
                          )
                        )
                      }
                    >
                      ›
                    </button>
                  </div>

                  <div className="datepicker-weekdays">
                    {DAYS.map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>

                  <div className="datepicker-days">
                    {renderCalendarDays().map((cell, idx) => {
                      const isSelected = cell.isCurrentMonth && cell.day === 22;
                      return (
                        <button
                          key={idx}
                          className={`day-cell ${
                            !cell.isCurrentMonth ? "outside" : ""
                          } ${isSelected ? "selected" : ""}`}
                          onClick={() =>
                            cell.isCurrentMonth && handleSelectDate(cell.day)
                          }
                        >
                          {cell.day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="form-field relative-field">
              <label>Return Date & Time</label>
              <div
                className="field-input clickable"
                onClick={() => toggleDatePicker("return")}
              >
                <span className="icon-calendar">📅</span>
                <span>{returnDate}</span>
                <span className="chevron-down">⌄</span>
              </div>

              {activeDatePicker === "return" && (
                <div className="datepicker-modal">
                  <div className="datepicker-header">
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1,
                            1
                          )
                        )
                      }
                    >
                      ‹
                    </button>
                    <span>
                      {currentMonth.toLocaleString("default", { month: "long" })}{" "}
                      {currentMonth.getFullYear()}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1,
                            1
                          )
                        )
                      }
                    >
                      ›
                    </button>
                  </div>

                  <div className="datepicker-weekdays">
                    {DAYS.map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>

                  <div className="datepicker-days">
                    {renderCalendarDays().map((cell, idx) => {
                      const isSelected = cell.isCurrentMonth && cell.day === 22;
                      return (
                        <button
                          key={idx}
                          className={`day-cell ${
                            !cell.isCurrentMonth ? "outside" : ""
                          } ${isSelected ? "selected" : ""}`}
                          onClick={() =>
                            cell.isCurrentMonth && handleSelectDate(cell.day)
                          }
                        >
                          {cell.day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button className="search-btn" onClick={handleFindVehicle}>
              <span className="search-icon">🔍</span> Check Availability
            </button>
          </div>
        </div>
      </section>

      {/* --- BRANDS SECTION --- */}
      <section className="brands-section">
        <div className="brands-header">
          <div>
            <h2 className="brands-title">Premium Fleet & Brands</h2>
            <p className="brands-subtitle">
              Choose from verified hatchbacks, sedans, SUVs, luxury wedding cars, and modern EVs.
            </p>
          </div>
          <a href="#fleet" className="show-all-link">
            Explore All Fleets →
          </a>
        </div>

        <div className="marquee-container">
          <div className="marquee-track">
            {BRANDS.map((item, index) => (
              <div className="brand-card" key={`b1-${index}`}>
                <img src={item.logo} alt={`${item.name} rental cars in Bhubaneswar`} />
              </div>
            ))}
            {BRANDS.map((item, index) => (
              <div className="brand-card" key={`b2-${index}`}>
                <img src={item.logo} alt={`${item.name} rental cars in Bhubaneswar`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SEO CONTENT & LOCAL AUTHORITY SECTION --- */}
      <section className="seo-content-section">
        <div className="seo-grid">
          <div className="seo-card">
            <h2>Best Self Drive Car Rental in Bhubaneswar Without Driver</h2>
            <p>
              Looking for freedom on the road? <strong>Young Drives</strong> delivers the <strong>best self drive car rental in Bhubaneswar price</strong> options with zero hidden costs. Whether you need an economic hatchback for daily commuting or an all-terrain SUV for outstation trips to Puri and Konark, our self-drive fleet gives you complete privacy and control.
            </p>
          </div>

          <div className="seo-card">
            <h2>Best Car Rental in Bhubaneswar Airport with Driver</h2>
            <p>
              Arriving at Biju Patnaik International Airport? Avoid taxi surges with our dedicated <strong>best car rental in Bhubaneswar airport</strong> service. Pick from executive sedans or book the <strong>best car rental in Bhubaneswar with driver</strong> for stress-free corporate meetings, family vacations, or guided temple tours.
            </p>
          </div>

          <div className="seo-card">
            <h2>Wedding Rentals, EV Fleet & Budget Solutions</h2>
            <p>
              Celebrate your special day with our luxury fleet offering the <strong>best car rental for wedding in Bhubaneswar</strong>. For eco-conscious travelers, our new <strong>EV car rental Bhubaneswar</strong> lineup lets you cruise the Smart City cleanly. Experience the <strong>cheapest car rental in Bhubaneswar</strong> backed by verified reliability.
            </p>
          </div>
        </div>

        {/* --- LOCAL NAP (NAME, ADDRESS, PHONE) & SCHEMA FOOTPRINT --- */}
        <div className="nap-container">
          <div className="nap-details">
            <h3>Young Drives - Best Car Rental Company in Bhubaneswar</h3>
            <p><strong>📍 Address:</strong> Plot No :-001, CRP square, Vanik road, Back side of Ama Bus Stand, Bhubaneswar, Odisha 75011</p>
            <p><strong>📞 Direct Hotline:</strong> <a href="tel:+919078455208">+91 90784 55208</a></p>
            <p><strong>⏰ Operational Hours:</strong> Open 24 Hours / 7 Days a Week</p>
          </div>
          <div className="nap-action">
            <a href="tel:+919078455208" className="contact-call-btn">
              Instant Booking Support
            </a>
          </div>
        </div>
      </section>

      {/* --- VEHICLE MODAL POPUP --- */}
      {showVehiclePopup && (
        <div className="video-modal-overlay" onClick={() => setShowVehiclePopup(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="video-close-btn"
              onClick={() => setShowVehiclePopup(false)}
              aria-label="Close Vehicle Popup"
            >
              ✕
            </button>

            <div>
              <h2>Available Fleets</h2>
              <p>{pickUpLocation}</p>

              {vehicleLoading ? (
                <p>Loading live fleet availability...</p>
              ) : locationVehicles.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px 10px" }}>
                  <h3>No Vehicles Currently Assigned</h3>
                  <p>
                    Call our dispatch center at <a href="tel:+919078455208">+91 90784 55208</a> for immediate express delivery to {pickUpLocation}.
                  </p>
                </div>
              ) : (
                <>
                  <div className="popup-status-badge">
                    <strong>{locationVehicles.length}</strong>{" "}
                    {locationVehicles.length === 1 ? "Vehicle" : "Vehicles"} Ready for Booking
                  </div>

                  <div>
                    {getGroupedLocationVehicles().map((vehicle) => (
                      <div key={vehicle.name} className="popup-vehicle-item">
                        <div>
                          <strong>{vehicle.name}</strong>
                        </div>
                        <span>
                          {vehicle.count}{" "}
                          {vehicle.count === 1 ? "Unit Available" : "Units Available"}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeVehicle;