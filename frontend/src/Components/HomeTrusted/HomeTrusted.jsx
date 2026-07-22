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
            Trusted Expertise
          </div>

          <h1 className="home-trusted-title">
            Get a great deal for your vehicle sell to us now
          </h1>

          <p className="home-trusted-description">
            Get the best value for your vehicle with our transparent and straightforward selling process
          </p>

          <ul className="home-trusted-features">
            <li>
              <span className="home-trusted-check-icon">✓</span>
              <span className="home-trusted-feature-text">Experienced Professionals You Can Trust</span>
            </li>
            <li>
              <span className="home-trusted-check-icon">✓</span>
              <span className="home-trusted-feature-text">Clear and Transparent Pricing, No Hidden Fees</span>
            </li>
            <li>
              <span className="home-trusted-check-icon">✓</span>
              <span className="home-trusted-feature-text">Genuine Spares Parts</span>
            </li>
          </ul>

          <button className="home-trusted-btn">
            Get Started Now <span className="home-trusted-arrow">→</span>
          </button>
        </div>

        {/* Right Side Image Collage Grid */}
        <div className="home-trusted-right-grid">
          {/* Column 1 */}
          <div className="home-trusted-col home-trusted-col-1">
            <div className="home-trusted-card home-trusted-card-tall">
              <img src={trustimg1} alt="Car dealership consultation" />
            </div>
          </div>

          {/* Column 2 */}
          <div className="home-trusted-col home-trusted-col-2">
            <div className="home-trusted-card home-trusted-card-medium">
              <img src={trustimg2} alt="Evaluating car details" />
            </div>
            <div className="home-trusted-card home-trusted-card-medium">
              <img src={trustimg3} alt="Driver holding car key" />
            </div>
          </div>

          {/* Column 3 */}
          <div className="home-trusted-col home-trusted-col-3">
            <div className="home-trusted-card home-trusted-card-small">
              <img src={trustimg4} alt="Happy customer with key" />
            </div>
            <div className="home-trusted-card home-trusted-card-tall">
              <img src={trustimg5} alt="Car handoff discussion" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTrusted;