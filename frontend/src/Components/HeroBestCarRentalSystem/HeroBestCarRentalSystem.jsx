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
    'Expert Certified Mechanics',
    'Get Reasonable Price',
    'Genuine Spares Parts',
  ];

  const featuresRight = [
    'First Class Services',
    '24/7 road assistance',
    'Free Pick-Up & Drop-Offs',
  ];

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            alt="Car Dealership Service"
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
            <span>Best Car Rental System</span>
          </div>

          {/* Heading */}
          <h1 className="hero-heading">
            Receive a Competitive Offer Sell Your Car to Us Today.
          </h1>

          {/* Subtitle Description */}
          <p className="hero-subtext">
            We are committed to delivering exceptional service, competitive pricing,
            and a diverse selection of options for our customers.
          </p>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="features-column">
              {featuresLeft.map((feature, index) => (
                <div className="feature-item" key={index}>
                  <div className="check-badge">✓</div>
                  <span className="feature-text">{feature}</span>
                </div>
              ))}
            </div>

            <div className="features-column">
              {featuresRight.map((feature, index) => (
                <div className="feature-item" key={index}>
                  <div className="check-badge">✓</div>
                  <span className="feature-text">{feature}</span>
                </div>
              ))}
            </div>
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
                title="YouTube Video Player"
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