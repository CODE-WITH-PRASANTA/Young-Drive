import React from 'react';
import './HomeFeatureList.css';

// Import your own images here (placeholders used below)
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
                
                {/* PERFECTED OVERLAPPING RATING BADGE */}
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

                  <button className="book-now-btn">
                    Book Now
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HomeFeatureList;