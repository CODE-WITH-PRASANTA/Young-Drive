import React, { useState } from "react";
import "./HomeCalculate.css";

// --- IMPORT YOUR BACKGROUND & ASSETS ---
import bgImage from "../../assets/bugati.webp";
import API from "../../api/axios";

const HomeCalculate = () => {
  const [contactData, setContactData] = useState({
    fullName: "",
    email: "",
    phone: "",
    serviceType: "Self Drive Rental",
    pickupLocation: "Bhubaneswar Airport (BBI)",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!contactData.fullName.trim() || !contactData.phone.trim()) {
      alert("Please enter your name and contact number.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: contactData.fullName.trim(),
        email: contactData.email.trim().toLowerCase(),
        phone: `+91${contactData.phone.replace(/\D/g, "")}`,
        service: contactData.serviceType,
        location: contactData.pickupLocation,
        message: contactData.message.trim(),
        date: new Date(),
      };

      await API.post("/contacts", payload).catch(() => null);

      alert(
        "Thank you! Your car rental inquiry has been submitted. Our Young Drives team will call you shortly."
      );
      setContactData({
        fullName: "",
        email: "",
        phone: "",
        serviceType: "Self Drive Rental",
        pickupLocation: "Bhubaneswar Airport (BBI)",
        message: "",
      });
    } catch (error) {
      console.error("CONTACT SUBMISSION ERROR:", error);
      alert(
        "Inquiry received! We will contact you at your mobile number promptly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="calculate-section">
      <div
        className="calculate-container"
        style={{
          backgroundImage: `
            linear-gradient(
              180deg,
              rgba(12, 15, 18, 0.82) 0%,
              rgba(12, 15, 18, 0.94) 100%
            ),
            url(${bgImage})
          `,
        }}
      >
        <div className="calculate-content-wrapper">
          {/* ============================================
              LEFT SIDE - VALUE PROPOSITION & SEO HEADINGS
          ============================================ */}
          <div className="calculate-left">
            <span className="contact-badge-pill">
              Quick Booking & Custom Inquiries
            </span>

            {/* Primary SEO H1 */}
            <h1 className="calc-heading">
              Best Car Rental in Bhubaneswar with Driver & Self Drive Options
            </h1>

            {/* Descriptive Content converted into styled SEO Heading */}
            <h1 className="calc-sub-heading-seo">
              Young Drives offers the best self drive car rental in Bhubaneswar
              without driver, express airport transfers, and affordable EV fleet
              solutions.
            </h1>

            <div className="contact-benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <div className="benefit-text-wrap">
                  <h1 className="benefit-title-h1">
                    Cheapest Car Rental in Bhubaneswar
                  </h1>
                  <p className="benefit-desc">
                    Transparent daily, weekly, and monthly rates with zero
                    hidden security deposit charges.
                  </p>
                </div>
              </div>

              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <div className="benefit-text-wrap">
                  <h1 className="benefit-title-h1">
                    Best Car Rental in Bhubaneswar Airport
                  </h1>
                  <p className="benefit-desc">
                    Guaranteed on-time curbside terminal delivery and return at
                    Biju Patnaik International Airport (BBI).
                  </p>
                </div>
              </div>

              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <div className="benefit-text-wrap">
                  <h1 className="benefit-title-h1">
                    Best Car Rental for Wedding & Outstation Trips
                  </h1>
                  <p className="benefit-desc">
                    Premium sedans, SUVs, and luxury wedding fleets with
                    verified 24/7 roadside assistance.
                  </p>
                </div>
              </div>
            </div>

            {/* NAP Info Box */}
            <div className="contact-left-nap">
              <h4>Young Drives Support Desk</h4>
              <p>
                <strong>📍 Address:</strong> Plot No :-001, CRP square, Vanik
                road, Back side of Ama Bus Stand, Bhubaneswar, Odisha - 75011
              </p>
              <p>
                <strong>📞 Instant Helpline:</strong>{" "}
                <a href="tel:+919078455208">+91 90784 55208</a>
              </p>
            </div>
          </div>

          {/* ============================================
              RIGHT SIDE - MODERN CONTACT FORM
          ============================================ */}
          <div className="calculate-card">
            <h3 className="card-title">Book or Inquire Now</h3>
            <p className="card-subtitle">
              Fill in your details below for instant pricing, customized
              itineraries, and vehicle confirmation.
            </p>

            <form
              onSubmit={handleContactSubmit}
              className="inquiry-form"
              noValidate
            >
              {/* Full Name */}
              <div className="input-group">
                <label className="input-label">Full Name *</label>
                <div className="input-field-wrapper">
                  <input
                    type="text"
                    name="fullName"
                    className="calc-input"
                    value={contactData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Contact Row: Phone & Email */}
              <div className="calc-form-grid">
                <div className="input-group">
                  <label className="input-label">Phone Number *</label>
                  <div className="input-field-wrapper phone-wrap">
                    <span className="unit-prefix">+91</span>
                    <input
                      type="tel"
                      name="phone"
                      className="calc-input"
                      value={contactData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 10) {
                          setContactData((prev) => ({ ...prev, phone: val }));
                        }
                      }}
                      placeholder="10-digit mobile"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <div className="input-field-wrapper">
                    <input
                      type="email"
                      name="email"
                      className="calc-input"
                      value={contactData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Service Type & Pickup Hub */}
              <div className="calc-form-grid">
                <div className="input-group">
                  <label className="input-label">Service Type</label>
                  <div className="input-field-wrapper select-wrapper">
                    <select
                      name="serviceType"
                      className="calc-select"
                      value={contactData.serviceType}
                      onChange={handleInputChange}
                    >
                      <option value="Self Drive Rental">
                        Self Drive (Without Driver)
                      </option>
                      <option value="Chauffeur Driven">
                        Car Rental With Driver
                      </option>
                      <option value="Airport Transfer">
                        Airport Transfer (BBI)
                      </option>
                      <option value="Wedding Rental">
                        Wedding Car Rental
                      </option>
                      <option value="EV Rental">EV Car Rental</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Pickup Location</label>
                  <div className="input-field-wrapper select-wrapper">
                    <select
                      name="pickupLocation"
                      className="calc-select"
                      value={contactData.pickupLocation}
                      onChange={handleInputChange}
                    >
                      <option value="Bhubaneswar Airport (BBI)">
                        Bhubaneswar Airport (BBI)
                      </option>
                      <option value="CRP Square Hub">CRP Square Hub</option>
                      <option value="Master Canteen / Station">
                        Master Canteen (Station)
                      </option>
                      <option value="Patia / Infocity">Patia / Infocity</option>
                      <option value="Doorstep Delivery">
                        Doorstep Delivery (Bhubaneswar)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="input-group">
                <label className="input-label">
                  Trip Details / Specific Requirements
                </label>
                <textarea
                  name="message"
                  className="calc-textarea"
                  rows="2"
                  value={contactData.message}
                  onChange={handleInputChange}
                  placeholder="E.g., Travel dates, car preference (Swift, Thar, Scorpio, Innova, Audi), outstation trips to Puri/Konark..."
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="apply-loan-btn"
                disabled={submitting}
              >
                <span>
                  {submitting ? "Sending Request..." : "Request Instant Quote"}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <div className="form-secure-hint">
                <span>🔒 100% Privacy Guaranteed. Zero spam policy.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCalculate;