import React from 'react';
import './HomeTrusted.css';

import trustimg1 from '../../assets/trustimg1.webp';
import trustimg2 from '../../assets/trustimg2.webp';
import trustimg3 from '../../assets/trustimg3.webp';
import trustimg4 from '../../assets/trustimg4.webp';
import trustimg5 from '../../assets/trustimg5.webp';

const HomeTrusted = () => {
  return (
    <div className="home-trusted-wrapper">
      <div className="home-trusted-container">
        {/* Curved Green Background Layer */}
        <div className="home-trusted-green-bg"></div>

        {/* Left Side Content */}
        <div className="home-trusted-left-content">
          <div className="home-trusted-badge">
            Young Drives Trusted Service
          </div>

          <h1 className="home-trusted-title">
            Best Self Drive Car Rental in Bhubaneswar With & Without Driver
          </h1>

          <p className="home-trusted-description">
            Get the cheapest car rental in Bhubaneswar and the best car rental deals in Bhubaneswar with zero security deposit hassle, doorstep delivery, and 24/7 roadside assistance from Young Drives.
          </p>

          <ul className="home-trusted-features">
            <li>
              <span className="home-trusted-check-icon">✓</span>
              <span className="home-trusted-feature-text">
                Best car rental in Bhubaneswar airport with instant terminal pickup
              </span>
            </li>
            <li>
              <span className="home-trusted-check-icon">✓</span>
              <span className="home-trusted-feature-text">
                Best self drive car rental in Bhubaneswar price with transparent daily rates
              </span>
            </li>
            <li>
              <span className="home-trusted-check-icon">✓</span>
              <span className="home-trusted-feature-text">
                Best car rental for wedding in Bhubaneswar & modern EV car rental Bhubaneswar fleet
              </span>
            </li>
          </ul>

          <div style={{ marginBottom: "22px", fontSize: "13.5px", color: "#444", lineHeight: "1.6" }}>
            <p style={{ margin: "3px 0" }}>
              <strong>📍 Address:</strong> Plot No :-001, CRP square, Vanik road, Back side of Ama Bus Stand, Bhubaneswar - 75011
            </p>
            <p style={{ margin: "3px 0" }}>
              <strong>📞 Phone:</strong> <a href="tel:+919078455208" style={{ color: "#059669", textDecoration: "none", fontWeight: "700" }}>+91 90784 55208</a>
            </p>
          </div>

          <button className="home-trusted-btn">
            Get Started Now <span className="home-trusted-arrow">→</span>
          </button>
        </div>

        {/* Right Side Image Collage Grid */}
        <div className="home-trusted-right-grid">
          {/* Column 1 */}
          <div className="home-trusted-col home-trusted-col-1">
            <div className="home-trusted-card home-trusted-card-tall">
              <img 
                src={trustimg1} 
                alt="Best car rental company in Bhubaneswar - Young Drives" 
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="home-trusted-col home-trusted-col-2">
            <div className="home-trusted-card home-trusted-card-medium">
              <img 
                src={trustimg2} 
                alt="Self driven car rental in Bhubaneswar price inspection" 
              />
            </div>
            <div className="home-trusted-card home-trusted-card-medium">
              <img 
                src={trustimg3} 
                alt="Best self drive car rental in Bhubaneswar without driver" 
              />
            </div>
          </div>

          {/* Column 3 */}
          <div className="home-trusted-col home-trusted-col-3">
            <div className="home-trusted-card home-trusted-card-small">
              <img 
                src={trustimg4} 
                alt="Happy customer renting car in Bhubaneswar with driver" 
              />
            </div>
            <div className="home-trusted-card home-trusted-card-tall">
              <img 
                src={trustimg5} 
                alt="Best car rental for wedding in Bhubaneswar handover" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTrusted;