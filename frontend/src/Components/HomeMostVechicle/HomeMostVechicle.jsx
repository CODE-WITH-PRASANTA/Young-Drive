import React, { useRef } from 'react';
import './HomeMostVechicle.css';

// Local Image Imports from src/assets/
import car1 from '../../assets/car-1.webp';
import car2 from '../../assets/car-2.webp';
import car3 from '../../assets/car-3.webp';
import car4 from '../../assets/car-4.webp';
import car5 from '../../assets/car-5.webp';
import car6 from '../../assets/car-6.webp';

const VEHICLES_DATA = [
  {
    id: 1,
    name: 'Audi A3 1.6 TDI S line',
    location: 'Manchester, England',
    rating: '4.96',
    reviews: '672',
    image: car1,
    mileage: '25,100 miles',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: '7 seats',
    price: '$498.25',
  },
  {
    id: 2,
    name: 'Mercedes-Benz C220d',
    location: 'Manchester, England',
    rating: '4.96',
    reviews: '672',
    image: car2,
    mileage: '25,100 miles',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: '7 seats',
    price: '$498.25',
  },
  {
    id: 3,
    name: 'Volkswagen Golf GTD 2.0 TDI',
    location: 'Manchester, England',
    rating: '4.96',
    reviews: '672',
    image: car3,
    mileage: '25,100 miles',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: '7 seats',
    price: '$498.25',
  },
  {
    id: 4,
    name: 'Volvo S60 D4 R-Design',
    location: 'New South Wales, Australia',
    rating: '4.96',
    reviews: '672',
    image: car4,
    mileage: '25,100 miles',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: '7 seats',
    price: '$498.25',
  },
  {
    id: 5,
    name: 'Jaguar XE 2.0d R-Sport',
    location: 'Manchester, England',
    rating: '4.96',
    reviews: '672',
    image: car5,
    mileage: '25,100 miles',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: '7 seats',
    price: '$498.25',
  },
  {
    id: 6,
    name: 'Lexus IS 300h F Sport',
    location: 'Manchester, England',
    rating: '4.96',
    reviews: '672',
    image: car6,
    mileage: '25,100 miles',
    transmission: 'Automatic',
    fuel: 'Diesel',
    seats: '7 seats',
    price: '$498.25',
  },
];

const HomeMostVechicle = () => {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="most-vehicles-section">
      <div className="most-vehicles-container">
        {/* --- SECTION HEADER --- */}
        <div className="section-header">
          <div className="header-text">
            <h2 className="section-title">Most Searched Vehicles</h2>
            <p className="section-subtitle">The world's leading car brands</p>
          </div>

          {/* Navigation Arrows with Smooth Hover Effect */}
          <div className="nav-buttons">
            <button
              className="nav-btn"
              onClick={() => handleScroll('left')}
              aria-label="Previous"
            >
              ←
            </button>
            <button
              className="nav-btn"
              onClick={() => handleScroll('right')}
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>

        {/* --- VEHICLES GRID --- */}
        <div className="vehicles-grid" ref={scrollContainerRef}>
          {VEHICLES_DATA.map((car) => (
            <div className="vehicle-card" key={car.id}>
              {/* Image Wrapper */}
              <div className="card-image-wrapper">
                <img src={car.image} alt={car.name} className="vehicle-image" />
                {/* Rating Badge */}
                <div className="rating-badge">
                  <span className="star-icon">★</span>
                  <span className="rating-score">{car.rating}</span>
                  <span className="reviews-count">({car.reviews} reviews)</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="card-content">
                <h3 className="vehicle-name">{car.name}</h3>
                <p className="vehicle-location">
                  <span className="location-icon">📍</span> {car.location}
                </p>

                <hr className="card-divider" />

                {/* Specs Grid */}
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-icon">🧭</span>
                    <span>{car.mileage}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-icon">⚙️</span>
                    <span>{car.transmission}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-icon">⛽</span>
                    <span>{car.fuel}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-icon">💺</span>
                    <span>{car.seats}</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="card-footer">
                  <div className="price-container">
                    <span className="price-label">From </span>
                    <span className="price-amount">{car.price}</span>
                  </div>
                  <button className="book-btn">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- LOAD MORE BUTTON --- */}
        <div className="load-more-container">
          <button className="load-more-btn">
            <span className="refresh-icon">🔄</span> Load More Cars
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeMostVechicle;