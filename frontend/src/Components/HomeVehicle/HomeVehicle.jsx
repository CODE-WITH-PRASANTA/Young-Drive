import React, { useState } from 'react';
import './HomeVehicle.css';

// 1. Import all your brand images from src/assets/ using relative path '../../assets/'
import acuraImg from '../../assets/acura.png';
import bugattiImg from '../../assets/bugatti.png';
import chevroletImg from '../../assets/chevrolet.png';
import hondaImg from '../../assets/honda.png';
import jaguarImg from '../../assets/jaguar.png';
import lexusImg from '../../assets/lexus.png';
import merImg from '../../assets/mer.png';
import toyotaImg from '../../assets/toyota.png';

// 2. Assign the imported variables to your BRANDS array
const BRANDS = [
  { name: 'Lexus', logo: lexusImg },
  { name: 'Mercedes-Benz', logo: merImg },
  { name: 'Bugatti', logo: bugattiImg },
  { name: 'Jaguar', logo: jaguarImg },
  { name: 'Honda', logo: hondaImg },
  { name: 'Chevrolet', logo: chevroletImg },
  { name: 'Acura', logo: acuraImg },
  { name: 'Toyota', logo: toyotaImg },
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const HomeVehicle = () => {
  const [activeTab, setActiveTab] = useState('All cars');
  const [pickUpLocation, setPickUpLocation] = useState('New York, USA');
  const [dropOffLocation, setDropOffLocation] = useState('Delaware, USA');

  // Dates state
  const [pickUpDate, setPickUpDate] = useState('07/22/2026');
  const [returnDate, setReturnDate] = useState('07/22/2026');

  // Popover controls
  const [activeDatePicker, setActiveDatePicker] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1));

  const toggleDatePicker = (type) => {
    setActiveDatePicker(activeDatePicker === type ? null : type);
  };

  const handleSelectDate = (dayNum) => {
    if (!dayNum) return;
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const day = String(dayNum).padStart(2, '0');
    const year = currentMonth.getFullYear();
    const formatted = `${month}/${day}/${year}`;

    if (activeDatePicker === 'pickup') {
      setPickUpDate(formatted);
    } else if (activeDatePicker === 'return') {
      setReturnDate(formatted);
    }
    setActiveDatePicker(null);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const grid = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      grid.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      grid.push({ day: i, isCurrentMonth: true });
    }

    const remaining = 35 - grid.length;
    for (let i = 1; i <= remaining; i++) {
      grid.push({ day: i, isCurrentMonth: false });
    }

    return grid;
  };

  return (
    <div className="home-vehicle-wrapper">
      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="badge-subtitle">Find Your Perfect Car</span>
            <h1 className="hero-title">
              Looking for a vehicle?
              <br />
              You're in the perfect spot.
            </h1>

            <div className="features-row">
              <div className="feature-item">
                <span className="check-icon">✓</span>
                High quality at a low cost.
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                Premium services
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                24/7 roadside support.
              </div>
            </div>
          </div>
        </div>

        {/* --- BOOKING CARD --- */}
        <div className="booking-card">
          <div className="booking-header">
            <div className="tabs">
              {['All cars', 'New cars', 'Used cars'].map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <a href="#help" className="need-help">
              <span className="user-icon">👤</span> Need help?
            </a>
          </div>

          <div className="booking-form-grid">
            <div className="form-field">
              <label>Pick Up Location</label>
              <div className="field-input">
                <span className="icon-marker">📍</span>
                <input
                  type="text"
                  value={pickUpLocation}
                  onChange={(e) => setPickUpLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label>Drop Off Location</label>
              <div className="field-input">
                <span className="icon-marker">📍</span>
                <input
                  type="text"
                  value={dropOffLocation}
                  onChange={(e) => setDropOffLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="form-field relative-field">
              <label>Pick Up Date & Time</label>
              <div
                className="field-input clickable"
                onClick={() => toggleDatePicker('pickup')}
              >
                <span className="icon-calendar">📅</span>
                <span>{pickUpDate}</span>
                <span className="chevron-down">⌄</span>
              </div>

              {activeDatePicker === 'pickup' && (
                <div className="datepicker-modal">
                  <div className="datepicker-header">
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1,
                            1
                          )
                        )
                      }
                    >
                      ‹
                    </button>
                    <span>
                      {currentMonth.toLocaleString('default', {
                        month: 'long',
                      })}{' '}
                      {currentMonth.getFullYear()}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1,
                            1
                          )
                        )
                      }
                    >
                      ›
                    </button>
                  </div>

                  <div className="datepicker-weekdays">
                    {DAYS.map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>

                  <div className="datepicker-days">
                    {renderCalendarDays().map((cell, idx) => {
                      const isSelected =
                        cell.isCurrentMonth && cell.day === 22;
                      return (
                        <button
                          key={idx}
                          className={`day-cell ${
                            !cell.isCurrentMonth ? 'outside' : ''
                          } ${isSelected ? 'selected' : ''}`}
                          onClick={() =>
                            cell.isCurrentMonth && handleSelectDate(cell.day)
                          }
                        >
                          {cell.day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="form-field relative-field">
              <label>Return Date & Time</label>
              <div
                className="field-input clickable"
                onClick={() => toggleDatePicker('return')}
              >
                <span className="icon-calendar">📅</span>
                <span>{returnDate}</span>
                <span className="chevron-down">⌄</span>
              </div>

              {activeDatePicker === 'return' && (
                <div className="datepicker-modal">
                  <div className="datepicker-header">
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1,
                            1
                          )
                        )
                      }
                    >
                      ‹
                    </button>
                    <span>
                      {currentMonth.toLocaleString('default', {
                        month: 'long',
                      })}{' '}
                      {currentMonth.getFullYear()}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1,
                            1
                          )
                        )
                      }
                    >
                      ›
                    </button>
                  </div>

                  <div className="datepicker-weekdays">
                    {DAYS.map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>

                  <div className="datepicker-days">
                    {renderCalendarDays().map((cell, idx) => {
                      const isSelected =
                        cell.isCurrentMonth && cell.day === 22;
                      return (
                        <button
                          key={idx}
                          className={`day-cell ${
                            !cell.isCurrentMonth ? 'outside' : ''
                          } ${isSelected ? 'selected' : ''}`}
                          onClick={() =>
                            cell.isCurrentMonth && handleSelectDate(cell.day)
                          }
                        >
                          {cell.day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button className="search-btn">
              <span className="search-icon">🔍</span> Find a Vehicle
            </button>
          </div>
        </div>
      </section>

      {/* --- BRANDS SECTION --- */}
      <section className="brands-section">
        <div className="brands-header">
          <div>
            <h2 className="brands-title">Premium Brands</h2>
            <p className="brands-subtitle">
              Unveil the Finest Selection of High-End Vehicles
            </p>
          </div>
          <a href="#brands" className="show-all-link">
            Show All Brands →
          </a>
        </div>

        {/* Marquee Carousel */}
        <div className="marquee-container">
          <div className="marquee-track">
            {BRANDS.map((item, index) => (
              <div className="brand-card" key={`b1-${index}`}>
                <img src={item.logo} alt={item.name} />
              </div>
            ))}
            {BRANDS.map((item, index) => (
              <div className="brand-card" key={`b2-${index}`}>
                <img src={item.logo} alt={item.name} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default HomeVehicle;