import React, { useState } from 'react';
import './HomeFeatureList.css';

// Import your own images here
import car1 from '../../assets/featuredcar1.webp';
import car2 from '../../assets/featuredcar2.webp';
import car3 from '../../assets/featuredcar3.webp';
import car4 from '../../assets/featuredcar4.webp';

const HomeFeatureList = () => {
  const listings = [
    {
      id: 1,
      title: 'Volkswagen Golf GTD',
      location: 'Manchester, England',
      rating: '4.96',
      reviews: '672',
      mileage: '25,100 miles',
      transmission: 'Automatic',
      fuel: 'Diesel',
      seats: '7 seats',
      price: '$80',
      period: '/ day',
      image: car1,
    },
    {
      id: 2,
      title: 'Volvo S60 D4 R-Design',
      location: 'New South Wales, Australia',
      rating: '4.96',
      reviews: '672',
      mileage: '25,100 miles',
      transmission: 'Automatic',
      fuel: 'Diesel',
      seats: '7 seats',
      price: '$95',
      period: '/ day',
      image: car2,
    },
    {
      id: 3,
      title: 'Jaguar XE 2.0d R-Sport',
      location: 'Manchester, England',
      rating: '4.96',
      reviews: '672',
      mileage: '25,100 miles',
      transmission: 'Automatic',
      fuel: 'Diesel',
      seats: '7 seats',
      price: '$110',
      period: '/ day',
      image: car3,
    },
    {
      id: 4,
      title: 'Lexus IS 300h F Sport',
      location: 'Manchester, England',
      rating: '4.96',
      reviews: '672',
      mileage: '25,100 miles',
      transmission: 'Automatic',
      fuel: 'Diesel',
      seats: '7 seats',
      price: '$105',
      period: '/ day',
      image: car4,
    },
  ];

  // State for managing selected vehicle for popup modal
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Form State for Booking
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    pickupLocation: 'Manchester, England',
    pickupDate: '2025-05-18',
    pickupTime: '10:00 AM',
    dropoffDate: '2025-05-20',
    dropoffTime: '10:00 AM',
    message: '',
  });

  const handleOpenModal = (car) => {
    setSelectedVehicle(car);
    setFormData((prev) => ({
      ...prev,
      pickupLocation: car.location || 'Manchester, England',
    }));
  };

  const handleCloseModal = () => {
    setSelectedVehicle(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    alert(`Booking confirmed for ${selectedVehicle.title}! Details sent to ${formData.email}`);
    handleCloseModal();
  };

  return (
    <section className="featured-listings-section">
      <div className="featured-listings-container">
        {/* HEADER */}
        <div className="featured-listings-header">
          <div className="header-text">
            <h2 className="section-title">Featured Listings</h2>
            <p className="section-subtitle">Find the perfect ride for any occasion</p>
          </div>

          <button className="view-more-btn">
            <span>View More</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        {/* CARDS GRID */}
        <div className="featured-cards-grid">
          {listings.map((car) => (
            <div className="featured-car-card" key={car.id}>
              {/* IMAGE SECTION */}
              <div className="car-image-container">
                <img
                  src={car.image || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800"}
                  alt={car.title}
                  className="car-image"
                />

                {/* OVERLAPPING RATING BADGE */}
                <div className="rating-badge-wrapper">
                  <div className="rating-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#22c55e" stroke="#22c55e" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="rating-score">{car.rating}</span>
                    <span className="rating-count">({car.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* CARD DETAILS */}
              <div className="car-card-body">
                <h3 className="car-name">{car.title}</h3>

                <div className="location-info">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{car.location}</span>
                </div>

                <hr className="card-divider" />

                {/* SPECS */}
                <div className="specs-grid">
                  <div className="spec-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 12l3-3" />
                    </svg>
                    <span>{car.mileage}</span>
                  </div>

                  <div className="spec-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                    </svg>
                    <span>{car.transmission}</span>
                  </div>

                  <div className="spec-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18" />
                      <path d="M13 10h4a2 2 0 0 1 2 2v6" />
                      <circle cx="18" cy="18" r="2" />
                    </svg>
                    <span>{car.fuel}</span>
                  </div>

                  <div className="spec-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>{car.seats}</span>
                  </div>
                </div>

                <hr className="card-divider" />

                {/* FOOTER */}
                <div className="card-footer">
                  <div className="price-wrapper">
                    <span className="price-amount">{car.price}</span>
                    <span className="price-period">{car.period}</span>
                  </div>

                  <button className="book-now-btn" onClick={() => handleOpenModal(car)}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- POPUP BOOKING MODAL --- */}
      {selectedVehicle && (
        <div className="booking-modal-overlay" onClick={handleCloseModal}>
          <div className="booking-modal-container" onClick={(e) => e.stopPropagation()}>
            
            {/* CLOSE BUTTON */}
            <button className="modal-close-icon-btn" onClick={handleCloseModal}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* LEFT COLUMN: VEHICLE INFORMATION */}
            <div className="modal-left-panel">
              <div className="modal-car-image-box">
                <img
                  src={selectedVehicle.image || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800"}
                  alt={selectedVehicle.title}
                />
                <div className="carousel-dots">
                  <span className="dot active"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>

              <h3 className="modal-vehicle-title">{selectedVehicle.title}</h3>
              
              <div className="modal-location-text">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{selectedVehicle.location}</span>
              </div>

              <div className="modal-specs-grid">
                <div className="modal-spec-cell">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 12l3-3" />
                  </svg>
                  <span>{selectedVehicle.mileage}</span>
                </div>
                <div className="modal-spec-cell">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                  </svg>
                  <span>{selectedVehicle.transmission}</span>
                </div>
                <div className="modal-spec-cell">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2">
                    <path d="M3 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18" />
                    <path d="M13 10h4a2 2 0 0 1 2 2v6" />
                    <circle cx="18" cy="18" r="2" />
                  </svg>
                  <span>{selectedVehicle.fuel}</span>
                </div>
                <div className="modal-spec-cell">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>{selectedVehicle.seats}</span>
                </div>
              </div>

              <div className="modal-price-line">
                <span className="price-lbl">From </span>
                <span className="price-val">{selectedVehicle.price}</span>
                <span className="price-sub"> {selectedVehicle.period}</span>
              </div>

              <div className="free-cancellation-banner">
                <div className="info-circle-icon">i</div>
                <div>
                  <h4>Free Cancellation</h4>
                  <p>Cancel up to 24 hours before pick-up for a full refund.</p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: BOOKING FORM */}
            <div className="modal-right-panel">
              <h2 className="modal-form-heading">Book Now</h2>
              <p className="modal-form-subheading">Fill in your details to book this vehicle</p>

              <form onSubmit={handleConfirmBooking} className="modal-booking-form">
                {/* NAME & EMAIL */}
                <div className="form-double-row">
                  <div className="form-field-group">
                    <label>Full Name</label>
                    <div className="input-icon-wrapper">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
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

                  <div className="form-field-group">
                    <label>Email Address</label>
                    <div className="input-icon-wrapper">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
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

                {/* PHONE NUMBER WITH COUNTRY SELECT */}
                <div className="form-field-group">
                  <label>Phone Number</label>
                  <div className="phone-input-combined">
                    <div className="country-code-picker">
                      <span className="flag-emoji">🇺🇸</span>
                      <select name="countryCode" value={formData.countryCode} onChange={handleInputChange}>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+61">+61</option>
                        <option value="+91">+91</option>
                      </select>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* PICKUP LOCATION */}
                <div className="form-field-group">
                  <label>Pick-up Location</label>
                  <div className="input-icon-wrapper select-field-wrapper">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <select
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                    >
                      <option value="Manchester, England">Manchester, England</option>
                      <option value="New South Wales, Australia">New South Wales, Australia</option>
                      <option value="London, England">London, England</option>
                    </select>
                  </div>
                </div>

                {/* PICKUP DATE & TIME */}
                <div className="form-double-row">
                  <div className="form-field-group">
                    <label>Pick-up Date</label>
                    <div className="input-icon-wrapper">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <input
                        type="date"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label>Pick-up Time</label>
                    <div className="input-icon-wrapper select-field-wrapper">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <select name="pickupTime" value={formData.pickupTime} onChange={handleInputChange}>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* DROPOFF DATE & TIME */}
                <div className="form-double-row">
                  <div className="form-field-group">
                    <label>Drop-off Date</label>
                    <div className="input-icon-wrapper">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <input
                        type="date"
                        name="dropoffDate"
                        value={formData.dropoffDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label>Drop-off Time</label>
                    <div className="input-icon-wrapper select-field-wrapper">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <select name="dropoffTime" value={formData.dropoffTime} onChange={handleInputChange}>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ADDITIONAL MESSAGE */}
                <div className="form-field-group">
                  <label>Additional Message (Optional)</label>
                  <textarea
                    name="message"
                    rows="3"
                    placeholder="Enter any special requests or notes..."
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                {/* SECURE BOOKING FOOTER BANNER */}
                <div className="secure-booking-banner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <div>
                    <h4>Secure Booking</h4>
                    <p>Your information is safe with us. We use secure encryption.</p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="modal-actions-row">
                  <button type="button" className="btn-modal-cancel" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-submit">
                    <span>Confirm Booking</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
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