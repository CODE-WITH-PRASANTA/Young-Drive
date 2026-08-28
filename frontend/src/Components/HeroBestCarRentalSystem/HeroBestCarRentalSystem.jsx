import React, { useState } from 'react';
import './HeroBestCarRentalSystem.css';

// Replace this path with your own image path
import heroCarImage from '../../assets/video.webp';

const HeroBestCarRentalSystem = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Replace with your preferred YouTube Embed URL
  const youtubeEmbedUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";

  const handleOpenVideo = () => {
    setIsVideoOpen(true);
  };

  const handleCloseVideo = () => {
    setIsVideoOpen(false);
  };

  const featuresLeft = [
    'Best self drive car rental in Bhubaneswar',
    'Best car rental in Bhubaneswar airport',
    'Cheapest car rental in Bhubaneswar',
  ];

  const featuresRight = [
    'Best car rental in Bhubaneswar with driver',
    'Best car rental for wedding in Bhubaneswar',
    'EV car rental Bhubaneswar fleet',
  ];

  return (
    <section className="hero-rental-section">
      <div className="hero-rental-container">
        {/* --- LEFT IMAGE SECTION WITH CENTERED PLAY BUTTON --- */}
        <div 
          className="hero-image-wrapper" 
          onClick={handleOpenVideo}
          role="button"
          tabIndex={0}
        >
          <img
            src={heroCarImage}
            alt="Best Car Rental Service in Bhubaneswar - Young Drives"
            className="hero-image"
          />
          <button 
            className="play-button" 
            aria-label="Play Video"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenVideo();
            }}
          >
            <span className="play-icon">▶</span>
          </button>
        </div>

        {/* --- RIGHT CONTENT SECTION --- */}
        <div className="hero-content">
          {/* Badge Tag */}
          <div className="badge-tag">
            <span>Young Drives • Premier Car Rental Company in Bhubaneswar</span>
          </div>

          {/* Primary Main Heading */}
          <h1 className="hero-heading">
            Best Car Rental in Bhubaneswar for Self Drive & Airport Trips
          </h1>

          {/* Descriptive Content converted into Styled H1 */}
          <h1 className="hero-sub-heading-seo">
            Looking for the best car rental deals in Bhubaneswar? Young Drives delivers the best self drive car rental in Bhubaneswar without driver with transparent pricing, zero security hassles, and doorstep delivery across the Smart City.
          </h1>

          {/* Features Grid with H1 Items */}
          <div className="features-grid">
            <div className="features-column">
              {featuresLeft.map((feature, index) => (
                <div className="feature-item" key={index}>
                  <div className="check-badge">✓</div>
                  <h1 className="feature-text-h1">{feature}</h1>
                </div>
              ))}
            </div>

            <div className="features-column">
              {featuresRight.map((feature, index) => (
                <div className="feature-item" key={index}>
                  <div className="check-badge">✓</div>
                  <h1 className="feature-text-h1">{feature}</h1>
                </div>
              ))}
            </div>
          </div>

          {/* NAP Information Block */}
          <div className="hero-nap-box">
            <h1 className="nap-title-h1">Young Drives Official Headquarters</h1>
            <p className="nap-item">
              <strong>📍 Address:</strong> Plot No :-001, CRP square, Vanik road, Back side of Ama Bus Stand, Bhubaneswar, Odisha - 75011
            </p>
            <p className="nap-item">
              <strong>📞 Direct Helpline:</strong> <a href="tel:+919078455208">+91 90784 55208</a> (24/7 Roadside Assistance)
            </p>
          </div>
        </div>
      </div>

      {/* --- YOUTUBE MODAL POPUP --- */}
      {isVideoOpen && (
        <div className="video-modal-overlay" onClick={handleCloseVideo}>
          <div 
            className="video-modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Highly Visible Cancel / Close Button */}
            <button 
              className="video-close-btn" 
              onClick={handleCloseVideo}
              aria-label="Close Video"
            >
              ✕
            </button>

            {/* YouTube Iframe Container */}
            <div className="iframe-container">
              <iframe
                src={youtubeEmbedUrl}
                title="Young Drives Best Car Rental Bhubaneswar Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroBestCarRentalSystem;