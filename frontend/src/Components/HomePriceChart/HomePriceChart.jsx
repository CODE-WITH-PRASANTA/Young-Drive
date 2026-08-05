import React, { useState } from 'react';
import { 
  FaCar, FaShieldAlt, FaHeadset, FaGasPump, FaIdCard, 
  FaUser, FaCogs, FaSnowflake, FaTimes, FaCheckCircle, 
  FaInfoCircle, FaStar, FaBolt, FaKey
} from 'react-icons/fa';
import './HomePriceChart.css';

const initialVehicles = [
  { id: 1, name: 'XUV 700', type: 'SUV', seats: 6, transmission: 'Manual', ac: 'AC', price: 4000, rating: 4.9, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'SCORPIO', type: 'SUV', seats: 7, transmission: 'Manual', ac: 'AC', price: 3500, rating: 4.8, image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'KIA CARENS', type: 'MPV', seats: 7, transmission: 'Manual', ac: 'AC', price: 3000, rating: 4.7, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'THAR', type: 'SUV', seats: 4, transmission: 'Manual', ac: 'AC', price: 3800, rating: 4.9, image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80' },
  { id: 5, name: 'VERNA', type: 'SEDAN', seats: 5, transmission: 'Manual', ac: 'AC', price: 2500, rating: 4.6, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80' },
  { id: 6, name: 'HONDA CITY', type: 'SEDAN', seats: 5, transmission: 'Manual', ac: 'AC', price: 2400, rating: 4.7, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80' },
  { id: 7, name: 'I 20', type: 'HATCHBACK', seats: 5, transmission: 'Manual', ac: 'AC', price: 2000, rating: 4.5, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80' },
  { id: 8, name: 'SWIFT', type: 'HATCHBACK', seats: 5, transmission: 'Manual', ac: 'AC', price: 1900, rating: 4.6, image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80' },
  { id: 9, name: 'BALENO', type: 'HATCHBACK', seats: 5, transmission: 'Manual', ac: 'AC', price: 1900, rating: 4.5, image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=600&q=80' },
  { id: 10, name: 'VENUE', type: 'SUV', seats: 5, transmission: 'Manual', ac: 'AC', price: 2300, rating: 4.7, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80' },
  { id: 11, name: 'I 10 NIOS', type: 'HATCHBACK', seats: 5, transmission: 'Manual', ac: 'AC', price: 1700, rating: 4.4, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80' },
  { id: 12, name: 'TIGOR', type: 'SEDAN', seats: 5, transmission: 'Manual', ac: 'AC', price: 1800, rating: 4.5, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80' },
  { id: 13, name: 'TIAGO', type: 'HATCHBACK', seats: 5, transmission: 'Manual', ac: 'AC', price: 1600, rating: 4.4, image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80' },
  { id: 14, name: 'FRONX', type: 'CROSSOVER', seats: 5, transmission: 'Manual', ac: 'AC', price: 2000, rating: 4.8, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80' }
];

export function HomePriceChart() {
  const [filter, setFilter] = useState('ALL');
  const [selectedCar, setSelectedCar] = useState(null);

  const filteredVehicles = filter === 'ALL' 
    ? initialVehicles 
    : initialVehicles.filter(car => car.type === filter);

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
            onClick={() => setSelectedCar(car)}
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
              <button className="HomePriceChart-book-trigger"><FaKey /> Book</button>
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
        <div className="HomePriceChart-modal-overlay" onClick={() => setSelectedCar(null)}>
          <div className="HomePriceChart-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="HomePriceChart-close-btn" onClick={() => setSelectedCar(null)}>
              <FaTimes />
            </button>
            <div className="HomePriceChart-modal-header">
              <FaBolt className="HomePriceChart-modal-top-icon" /> <h2>Book {selectedCar.name}</h2>
            </div>
            <div className="HomePriceChart-modal-img-wrap">
              <img src={selectedCar.image} alt={selectedCar.name} />
            </div>
            <div className="HomePriceChart-modal-details">
              <p>Category: <span>{selectedCar.type}</span></p>
              <p>Transmission: <span>{selectedCar.transmission} ({selectedCar.seats} Seater)</span></p>
              <p>Daily Rate: <strong>₹{selectedCar.price.toLocaleString()} / 24 Hours</strong></p>
            </div>
            <button className="HomePriceChart-book-now" onClick={() => {
              alert(`Booking confirmed for ${selectedCar.name}!`);
              setSelectedCar(null);
            }}>
              <FaCheckCircle /> Confirm Instant Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePriceChart;