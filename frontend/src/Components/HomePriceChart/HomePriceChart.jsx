import React, { useState } from 'react';
import { 
  FaCar, FaShieldAlt, FaHeadset, FaGasPump, FaIdCard, 
  FaUser, FaCogs, FaSnowflake, FaTimes, FaCheckCircle, 
  FaInfoCircle, FaStar, FaBolt, FaKey
} from 'react-icons/fa';
import './HomePriceChart.css';

const initialVehicles = [
  { id: 1, name: 'XUV 700', type: 'SUV', seats: 6, transmission: 'Manual', ac: 'AC', price: 4000, rating: 4.9, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80', location: 'Manchester, England', mileage: '25,100 miles', fuel: 'Diesel' },
  { id: 2, name: 'SCORPIO', type: 'SUV', seats: 7, transmission: 'Manual', ac: 'AC', price: 3500, rating: 4.8, image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80', location: 'Manchester, England', mileage: '25,100 miles', fuel: 'Diesel' },
  { id: 3, name: 'KIA CARENS', type: 'MPV', seats: 7, transmission: 'Manual', ac: 'AC', price: 3000, rating: 4.7, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80', location: 'Manchester, England', mileage: '25,100 miles', fuel: 'Diesel' },
  { id: 4, name: 'THAR', type: 'SUV', seats: 4, transmission: 'Manual', ac: 'AC', price: 3800, rating: 4.9, image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80', location: 'New South Wales, Australia', mileage: '18,500 miles', fuel: 'Petrol' },
  { id: 5, name: 'VERNA', type: 'SEDAN', seats: 5, transmission: 'Manual', ac: 'AC', price: 2500, rating: 4.6, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80', location: 'Manchester, England', mileage: '22,000 miles', fuel: 'Petrol' },
  { id: 6, name: 'HONDA CITY', type: 'SEDAN', seats: 5, transmission: 'Manual', ac: 'AC', price: 2400, rating: 4.7, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80', location: 'Manchester, England', mileage: '19,400 miles', fuel: 'Petrol' },
  { id: 7, name: 'I 20', type: 'HATCHBACK', seats: 5, transmission: 'Manual', ac: 'AC', price: 2000, rating: 4.5, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80', location: 'Manchester, England', mileage: '12,100 miles', fuel: 'Petrol' },
  { id: 8, name: 'SWIFT', type: 'HATCHBACK', seats: 5, transmission: 'Manual', ac: 'AC', price: 1900, rating: 4.6, image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80', location: 'Manchester, England', mileage: '15,000 miles', fuel: 'Petrol' },
  { id: 9, name: 'BALENO', type: 'HATCHBACK', seats: 5, transmission: 'Manual', ac: 'AC', price: 1900, rating: 4.5, image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=600&q=80', location: 'Manchester, England', mileage: '14,200 miles', fuel: 'Petrol' },
  { id: 10, name: 'VENUE', type: 'SUV', seats: 5, transmission: 'Manual', ac: 'AC', price: 2300, rating: 4.7, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80', location: 'Manchester, England', mileage: '17,900 miles', fuel: 'Diesel' },
  { id: 11, name: 'I 10 NIOS', type: 'HATCHBACK', seats: 5, transmission: 'Manual', ac: 'AC', price: 1700, rating: 4.4, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80', location: 'Manchester, England', mileage: '10,500 miles', fuel: 'Petrol' },
  { id: 12, name: 'TIGOR', type: 'SEDAN', seats: 5, transmission: 'Manual', ac: 'AC', price: 1800, rating: 4.5, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80', location: 'Manchester, England', mileage: '21,000 miles', fuel: 'Petrol' },
  { id: 13, name: 'TIAGO', type: 'HATCHBACK', seats: 5, transmission: 'Manual', ac: 'AC', price: 1600, rating: 4.4, image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80', location: 'Manchester, England', mileage: '11,300 miles', fuel: 'Petrol' },
  { id: 14, name: 'FRONX', type: 'CROSSOVER', seats: 5, transmission: 'Manual', ac: 'AC', price: 2000, rating: 4.8, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80', location: 'Manchester, England', mileage: '8,400 miles', fuel: 'Petrol' }
];

export function HomePriceChart() {
  const [filter, setFilter] = useState('ALL');
  const [selectedCar, setSelectedCar] = useState(null);

  // Form State for Booking Modal
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneCode: '+1',
    phone: '',
    pickupLocation: 'Manchester, England',
    pickupDate: '2025-05-18',
    pickupTime: '10:00 AM',
    dropoffDate: '2025-05-20',
    dropoffTime: '10:00 AM',
    message: ''
  });

  const filteredVehicles = filter === 'ALL' 
    ? initialVehicles 
    : initialVehicles.filter(car => car.type === filter);

  const handleOpenModal = (car, e) => {
    e.stopPropagation();
    setSelectedCar(car);
    setFormData(prev => ({
      ...prev,
      pickupLocation: car.location || 'Manchester, England'
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(`Booking confirmed successfully for ${selectedCar.name}! Details sent to ${formData.email || 'your email'}.`);
    setSelectedCar(null);
  };

  return (
    <div className="HomePriceChart-container">
      {/* Header Section */}
      <header className="HomePriceChart-header">
        <h1>PRICE <span>CHART</span></h1>
        <p>Choose your perfect ride from our wide range of premium vehicles.</p>
        
        {/* Filter Tabs */}
        <div className="HomePriceChart-filters">
          {['ALL', 'SUV', 'SEDAN', 'HATCHBACK', 'MPV', 'CROSSOVER'].map((category) => (
            <button
              key={category}
              className={`HomePriceChart-filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Grid Content */}
      <main className="HomePriceChart-grid">
        {filteredVehicles.map((car) => (
          <div 
            key={car.id} 
            className="HomePriceChart-card"
            onClick={(e) => handleOpenModal(car, e)}
          >
            <div className="HomePriceChart-card-top">
              <span className="HomePriceChart-badge">{car.type}</span>
              <span className="HomePriceChart-rating"><FaStar /> {car.rating}</span>
            </div>
            <div className="HomePriceChart-img-wrapper">
              <img src={car.image} alt={car.name} loading="lazy" />
            </div>
            <h3>{car.name}</h3>
            <div className="HomePriceChart-specs">
              <span><FaUser /> {car.seats} Seats</span>
              <span><FaCogs /> {car.transmission}</span>
              <span><FaSnowflake /> {car.ac}</span>
            </div>
            <div className="HomePriceChart-footer-row">
              <div className="HomePriceChart-price">
                <strong>₹{car.price.toLocaleString()}</strong> <span>/ 24h</span>
              </div>
              <button 
                className="HomePriceChart-book-trigger"
                onClick={(e) => handleOpenModal(car, e)}
              >
                <FaKey /> Book
              </button>
            </div>
          </div>
        ))}

        {/* Feature Highlights Card */}
        <div className="HomePriceChart-features-card">
          <div className="HomePriceChart-feature-item">
            <span className="HomePriceChart-feature-icon"><FaShieldAlt /></span>
            <div>
              <h4>INSURANCE</h4>
              <p>Fully Included</p>
            </div>
          </div>
          <div className="HomePriceChart-feature-item">
            <span className="HomePriceChart-feature-icon"><FaHeadset /></span>
            <div>
              <h4>24/7 SUPPORT</h4>
              <p>Roadside Help</p>
            </div>
          </div>
          <div className="HomePriceChart-feature-item">
            <span className="HomePriceChart-feature-icon"><FaGasPump /></span>
            <div>
              <h4>FUEL POLICY</h4>
              <p>Full to Full</p>
            </div>
          </div>
          <div className="HomePriceChart-feature-item">
            <span className="HomePriceChart-feature-icon"><FaIdCard /></span>
            <div>
              <h4>VERIFICATION</h4>
              <p>Valid ID Required</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="HomePriceChart-footer-note">
        <FaInfoCircle /> All prices are inclusive of insurance and applicable taxes.
      </footer>

      {/* Booking Modal Popup */}
      {selectedCar && (
        <div className="HomePriceChart-modal-backdrop" onClick={() => setSelectedCar(null)}>
          <div className="HomePriceChart-modal-container" onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <button className="HomePriceChart-modal-close" onClick={() => setSelectedCar(null)}>
              <FaTimes />
            </button>

            {/* Left Column: Car Overview */}
            <div className="HomePriceChart-modal-left">
              <div className="HomePriceChart-modal-img-box">
                <img src={selectedCar.image} alt={selectedCar.name} />
                <div className="HomePriceChart-dots">
                  <span className="dot active"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>

              <h2 className="HomePriceChart-modal-car-title">{selectedCar.name}</h2>
              <p className="HomePriceChart-modal-location">
                📍 {selectedCar.location || 'Manchester, England'}
              </p>

              <div className="HomePriceChart-modal-specs-grid">
                <div className="HomePriceChart-modal-spec">
                  🧭 {selectedCar.mileage || '25,100 miles'}
                </div>
                <div className="HomePriceChart-modal-spec">
                  ⚙️ {selectedCar.transmission}
                </div>
                <div className="HomePriceChart-modal-spec">
                  ⛽ {selectedCar.fuel || 'Diesel'}
                </div>
                <div className="HomePriceChart-modal-spec">
                  💺 {selectedCar.seats} seats
                </div>
              </div>

              <div className="HomePriceChart-modal-price-row">
                <span className="label">From</span>
                <span className="amount">₹{selectedCar.price.toLocaleString()}</span>
                <span className="unit">/ day</span>
              </div>

              <div className="HomePriceChart-modal-cancel-box">
                <div className="icon">ⓘ</div>
                <div>
                  <strong>Free Cancellation</strong>
                  <p>Cancel up to 24 hours before pick-up for a full refund.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Booking Form */}
            <div className="HomePriceChart-modal-right">
              <h2>Book Now</h2>
              <p className="subtitle">Fill in your details to book this vehicle</p>

              <form onSubmit={handleFormSubmit} className="HomePriceChart-form">
                <div className="HomePriceChart-form-row">
                  <div className="HomePriceChart-field">
                    <label>Full Name</label>
                    <div className="input-wrap">
                      <FaUser className="field-icon" />
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
                  <div className="HomePriceChart-field">
                    <label>Email Address</label>
                    <div className="input-wrap">
                      <span className="field-icon">✉️</span>
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

                <div className="HomePriceChart-field">
                  <label>Phone Number</label>
                  <div className="HomePriceChart-phone-group">
                    <div className="country-code-select">
                      <span>🇺🇸</span>
                      <select name="phoneCode" value={formData.phoneCode} onChange={handleInputChange}>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+91">+91</option>
                        <option value="+61">+61</option>
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

                <div className="HomePriceChart-field">
                  <label>Pick-up Location</label>
                  <div className="input-wrap">
                    <span className="field-icon">📍</span>
                    <select 
                      name="pickupLocation" 
                      value={formData.pickupLocation} 
                      onChange={handleInputChange}
                    >
                      <option value="Manchester, England">Manchester, England</option>
                      <option value="New South Wales, Australia">New South Wales, Australia</option>
                      <option value="London, United Kingdom">London, United Kingdom</option>
                    </select>
                  </div>
                </div>

                <div className="HomePriceChart-form-row">
                  <div className="HomePriceChart-field">
                    <label>Pick-up Date</label>
                    <div className="input-wrap">
                      <span className="field-icon">📅</span>
                      <input 
                        type="date" 
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="HomePriceChart-field">
                    <label>Pick-up Time</label>
                    <div className="input-wrap">
                      <span className="field-icon">🕒</span>
                      <select name="pickupTime" value={formData.pickupTime} onChange={handleInputChange}>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="HomePriceChart-form-row">
                  <div className="HomePriceChart-field">
                    <label>Drop-off Date</label>
                    <div className="input-wrap">
                      <span className="field-icon">📅</span>
                      <input 
                        type="date" 
                        name="dropoffDate"
                        value={formData.dropoffDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="HomePriceChart-field">
                    <label>Drop-off Time</label>
                    <div className="input-wrap">
                      <span className="field-icon">🕒</span>
                      <select name="dropoffTime" value={formData.dropoffTime} onChange={handleInputChange}>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="HomePriceChart-field">
                  <label>Additional Message (Optional)</label>
                  <textarea 
                    name="message"
                    rows="2" 
                    placeholder="Enter any special requests or notes..."
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="HomePriceChart-secure-box">
                  <FaShieldAlt className="shield" />
                  <div>
                    <strong>Secure Booking</strong>
                    <p>Your information is safe with us. We use secure encryption.</p>
                  </div>
                </div>

                <div className="HomePriceChart-modal-actions">
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={() => setSelectedCar(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="confirm-btn">
                    Confirm Booking →
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