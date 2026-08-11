import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, 
  MapPin, Clock, User, Mail, Phone, CreditCard, X, 
  CheckCircle2, Gauge, Fuel, Settings, Users, Filter, MoreVertical
} from 'lucide-react';
import './BookingCalender.css';

// Initial Mock Bookings Data
const INITIAL_BOOKINGS = [
  { id: 1, car: 'Toyota Camry', type: 'pickup-drop', time: '9:00 AM - May 5', date: 5, price: 75, location: 'New York Downtown', dropLocation: 'JFK Airport', status: 'Confirmed' },
  { id: 2, car: 'BMW X5', type: 'pickup-only', time: '10:00 AM - May 6', date: 6, price: 120, location: 'Manhattan Central', dropLocation: 'LaGuardia Airport', status: 'Confirmed' },
  { id: 3, car: 'Audi Q7', type: 'drop-only', time: '2:00 PM - May 7', date: 7, price: 110, location: 'Brooklyn Center', dropLocation: 'JFK Airport', status: 'Confirmed' },
  { id: 4, car: 'Honda Civic', type: 'partially', time: '11:00 AM - May 6', date: 4, price: 60, location: 'Queens Downtown', dropLocation: 'Manhattan', status: 'Confirmed' },
  { id: 5, car: 'Toyota Fortuner', type: 'pickup-drop', time: '12:00 PM - May 13', date: 11, price: 95, location: 'New York Downtown', dropLocation: 'Newark Airport', status: 'Confirmed' },
  { id: 6, car: 'Skoda Superb', type: 'pickup-only', time: '9:00 AM - May 14', date: 12, price: 80, location: 'Bronx Hub', dropLocation: 'JFK Airport', status: 'Confirmed' },
  { id: 7, car: 'Range Rover', type: 'partially', time: '10:00 AM - May 15', date: 13, price: 180, location: 'Manhattan Luxury Hub', dropLocation: 'Hamptons', status: 'Confirmed' },
  { id: 8, car: 'Thar 4x4', type: 'maintenance', time: '2:00 PM - May 16', date: 13, price: 0, location: 'Service Center', dropLocation: 'Service Center', status: 'Maintenance' },
  { id: 9, car: 'Toyota Camry', type: 'pickup-drop', time: '9:00 AM - May 17', date: 14, price: 75, location: '123 Manhattan Ave', dropLocation: 'JFK Airport, NY', status: 'Confirmed' },
  { id: 10, car: 'BMW X3', type: 'pickup-only', time: '1:00 PM - Jun 3', date: 30, price: 115, location: 'Queens Downtown', dropLocation: 'JFK Airport', status: 'Confirmed' },
  { id: 11, car: 'Mercedes GLC', type: 'pickup-only', time: '11:00 AM - May 21', date: 18, price: 130, location: 'Manhattan Central', dropLocation: 'Newark Airport', status: 'Confirmed' },
  { id: 12, car: 'Hyundai Tucson', type: 'pickup-drop', time: '9:00 AM - May 22', date: 19, price: 70, location: 'Brooklyn Center', dropLocation: 'LaGuardia Airport', status: 'Confirmed' },
  { id: 13, car: 'Jeep Compass', type: 'partially', time: '9:00 AM - May 31', date: 28, price: 85, location: 'Queens Hub', dropLocation: 'Manhattan', status: 'Confirmed' }
];

const UPCOMING_TABLE_DATA = [
  {
    date: 'May 14, 2025',
    time: '09:00 AM',
    vehicle: 'Toyota Camry',
    vehicleType: 'Sedan • Black',
    vehicleImg: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=120&auto=format&fit=crop&q=60',
    customer: 'John Smith',
    email: 'john@gmail.com',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=60',
    type: 'Pickup & Drop',
    typeBadgeClass: 'badge-pickup-drop',
    pickup: 'New York Downtown',
    pickupAddr: '123 Manhattan Ave',
    drop: 'JFK Airport',
    dropAddr: 'New York, NY',
    status: 'Confirmed'
  }
];

const BookingCalender = () => {
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 13)); // May 13, 2025
  const [selectedMiniDate, setSelectedMiniDate] = useState(13);

  // Filters State
  const [filterVehicle, setFilterVehicle] = useState('All Vehicles');
  const [filterLocation, setFilterLocation] = useState('All Locations');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [appliedFilters, setAppliedFilters] = useState({
    vehicle: 'All Vehicles',
    location: 'All Locations',
    status: 'All Status'
  });

  // Modal Popup State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Modal Form Inputs
  const [pickupLoc, setPickupLoc] = useState('Manchester, England');
  const [dropLoc, setDropLoc] = useState('Manchester, England');
  const [pickupDate, setPickupDate] = useState('2025-05-20');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [dropDate, setDropDate] = useState('2025-05-23');
  const [dropTime, setDropTime] = useState('10:00');
  
  const [driverName, setDriverName] = useState('');
  const [driverEmail, setDriverEmail] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverAge, setDriverAge] = useState('25');
  const [licenseNo, setLicenseNo] = useState('');

  // Additional Options Checkboxes
  const [optChildSeat, setOptChildSeat] = useState(false);
  const [optGps, setOptGps] = useState(false);
  const [optExtraDriver, setOptExtraDriver] = useState(false);

  // Filter Bookings
  const filteredBookings = useMemo(() => {
    return INITIAL_BOOKINGS.filter(item => {
      const matchVehicle = appliedFilters.vehicle === 'All Vehicles' || item.car.toLowerCase().includes(appliedFilters.vehicle.toLowerCase());
      const matchLocation = appliedFilters.location === 'All Locations' || item.location.toLowerCase().includes(appliedFilters.location.toLowerCase());
      const matchStatus = appliedFilters.status === 'All Status' || item.status.toLowerCase() === appliedFilters.status.toLowerCase();
      return matchVehicle && matchLocation && matchStatus;
    });
  }, [appliedFilters]);

  // Handle Apply Filter
  const handleApplyFilter = () => {
    setAppliedFilters({
      vehicle: filterVehicle,
      location: filterLocation,
      status: filterStatus
    });
  };

  // Open Modal Handler
  const handleOpenModal = (bookingObj = null) => {
    const defaultCar = bookingObj ? {
      name: bookingObj.car,
      pricePerDay: bookingObj.price || 80,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&auto=format&fit=crop&q=80',
      location: bookingObj.location || 'Manchester, England',
      mileage: '25,100 miles',
      fuel: 'Diesel',
      transmission: 'Automatic',
      seats: '7 seats'
    } : {
      name: 'Volkswagen Golf GTD',
      pricePerDay: 80,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&auto=format&fit=crop&q=80',
      location: 'Manchester, England',
      mileage: '25,100 miles',
      fuel: 'Diesel',
      transmission: 'Automatic',
      seats: '7 seats'
    };

    setModalData(defaultCar);
    setIsModalOpen(true);
  };

  // Price Calculation Logic
  const daysCount = 3; // Fixed 3 days duration for demo
  const basePrice = (modalData?.pricePerDay || 80) * daysCount;
  const optionsPrice = (optChildSeat ? 5 * daysCount : 0) + (optGps ? 7 * daysCount : 0) + (optExtraDriver ? 10 * daysCount : 0);
  const totalPrice = basePrice + optionsPrice;

  // Calendar Grid Days Generation (May 2025)
  const daysInMonth = 31;
  const startDayOffset = 4; // May 1, 2025 is Thursday (0:Sun, 1:Mon, 2:Tue, 3:Wed, 4:Thu)
  
  const calendarCells = [];
  // Previous month padding
  for (let i = 27; i <= 30; i++) {
    calendarCells.push({ day: i, isCurrentMonth: false });
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({ day: i, isCurrentMonth: true });
  }
  // Next month padding
  for (let i = 1; i <= 7; i++) {
    calendarCells.push({ day: i, isCurrentMonth: false });
  }

  return (
    <div className="bc-container">
      {/* Page Header */}
      <div className="bc-header">
        <div>
          <h2>Booking Calendar</h2>
          <p>View vehicle bookings and availability by date</p>
        </div>
        <div className="bc-breadcrumb">
          <span className="active-green">Bookings</span> &gt; <span>Calendar</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="bc-main-layout">
        
        {/* Left Side: Main Calendar */}
        <div className="bc-left-content">
          
          {/* Calendar Toolbar */}
          <div className="bc-toolbar">
            <div className="bc-month-nav">
              <button className="bc-icon-btn"><ChevronLeft size={16} /></button>
              <span className="bc-current-month">May 2025</span>
              <button className="bc-icon-btn"><ChevronRight size={16} /></button>
            </div>

            <div className="bc-toolbar-filters">
              <select 
                className="bc-select"
                value={filterVehicle}
                onChange={(e) => setFilterVehicle(e.target.value)}
              >
                <option value="All Vehicles">All Vehicles</option>
                <option value="Toyota">Toyota Camry</option>
                <option value="BMW">BMW X5</option>
                <option value="Audi">Audi Q7</option>
                <option value="Honda">Honda Civic</option>
              </select>

              <select 
                className="bc-select"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="All Locations">All Locations</option>
                <option value="New York">New York Downtown</option>
                <option value="Manhattan">Manhattan</option>
                <option value="Brooklyn">Brooklyn</option>
              </select>

              <button className="bc-btn-secondary" onClick={() => setSelectedMiniDate(13)}>Today</button>
              
              <button className="bc-btn-primary" onClick={() => handleOpenModal()}>
                <Plus size={16} />
                <span>New Booking</span>
              </button>
            </div>
          </div>

          {/* Large Month Calendar */}
          <div className="bc-calendar-card">
            <div className="bc-weekdays">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            <div className="bc-days-grid">
              {calendarCells.map((cell, index) => {
                const dayBookings = cell.isCurrentMonth ? filteredBookings.filter(b => b.date === cell.day) : [];
                const isSelected = cell.isCurrentMonth && cell.day === selectedMiniDate;

                return (
                  <div 
                    key={index} 
                    className={`bc-day-cell ${!cell.isCurrentMonth ? 'outside' : ''} ${isSelected ? 'selected-day' : ''}`}
                    onClick={() => cell.isCurrentMonth && setSelectedMiniDate(cell.day)}
                  >
                    <div className="bc-day-header">
                      <span className={`bc-day-number ${cell.day === 13 && cell.isCurrentMonth ? 'today-badge' : ''}`}>
                        {cell.day}
                      </span>
                    </div>

                    <div className="bc-events-list">
                      {dayBookings.map((event) => (
                        <div 
                          key={event.id} 
                          className={`bc-event-tag tag-${event.type}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(event);
                          }}
                        >
                          <span className="dot"></span>
                          <div className="event-info">
                            <strong>{event.car}</strong>
                            <small>{event.time}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calendar Legend Bar */}
            <div className="bc-legend-bar">
              <div className="legend-item"><span className="dot pickup-drop"></span> Pickup & Drop</div>
              <div className="legend-item"><span className="dot pickup-only"></span> Pickup Only</div>
              <div className="legend-item"><span className="dot drop-only"></span> Drop Only</div>
              <div className="legend-item"><span className="dot partially"></span> Partially Booked</div>
              <div className="legend-item"><span className="dot maintenance"></span> Maintenance / Blocked</div>
            </div>
          </div>

          {/* Upcoming Bookings Table */}
          <div className="bc-upcoming-card">
            <h3>Upcoming Bookings (Next 7 Days)</h3>
            <div className="table-responsive">
              <table className="bc-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>VEHICLE</th>
                    <th>CUSTOMER</th>
                    <th>TYPE</th>
                    <th>PICKUP LOCATION</th>
                    <th>DROP-OFF LOCATION</th>
                    <th>STATUS</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {UPCOMING_TABLE_DATA.map((row, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="bc-td-date">
                          <strong>{row.date}</strong>
                          <small>{row.time}</small>
                        </div>
                      </td>
                      <td>
                        <div className="bc-td-vehicle">
                          <img src={row.vehicleImg} alt={row.vehicle} />
                          <div>
                            <strong>{row.vehicle}</strong>
                            <small>{row.vehicleType}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="bc-td-customer">
                          <img src={row.customerAvatar} alt={row.customer} />
                          <div>
                            <strong>{row.customer}</strong>
                            <small>{row.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`bc-badge ${row.typeBadgeClass}`}>{row.type}</span>
                      </td>
                      <td>
                        <div className="bc-td-loc">
                          <MapPin size={12} className="text-green" />
                          <div>
                            <strong>{row.pickup}</strong>
                            <small>{row.pickupAddr}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="bc-td-loc">
                          <MapPin size={12} className="text-green" />
                          <div>
                            <strong>{row.drop}</strong>
                            <small>{row.dropAddr}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="bc-status-confirmed">{row.status}</span>
                      </td>
                      <td>
                        <button className="bc-icon-btn"><MoreVertical size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Side Panel */}
        <div className="bc-right-sidebar">
          
          {/* Mini Calendar Widget */}
          <div className="bc-panel-card">
            <div className="bc-panel-header">
              <h4>Mini Calendar</h4>
            </div>
            
            <div className="bc-mini-cal-header">
              <button className="bc-icon-btn"><ChevronLeft size={14} /></button>
              <strong>May 2025</strong>
              <button className="bc-icon-btn"><ChevronRight size={14} /></button>
            </div>

            <div className="bc-mini-grid">
              <div className="mini-day-name">Su</div>
              <div className="mini-day-name">Mo</div>
              <div className="mini-day-name">Tu</div>
              <div className="mini-day-name">We</div>
              <div className="mini-day-name">Th</div>
              <div className="mini-day-name">Fr</div>
              <div className="mini-day-name">Sa</div>

              {/* Prev month */}
              <div className="mini-date muted">27</div>
              <div className="mini-date muted">28</div>
              <div className="mini-date muted">29</div>
              <div className="mini-date muted">30</div>

              {/* May dates */}
              {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                <div 
                  key={d} 
                  className={`mini-date ${d === selectedMiniDate ? 'active-green' : ''}`}
                  onClick={() => setSelectedMiniDate(d)}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* Filters Widget */}
          <div className="bc-panel-card">
            <div className="bc-panel-header">
              <h4>Filters</h4>
            </div>

            <div className="bc-filter-form">
              <div className="form-group">
                <label>Vehicle</label>
                <select value={filterVehicle} onChange={(e) => setFilterVehicle(e.target.value)}>
                  <option value="All Vehicles">All Vehicles</option>
                  <option value="Toyota">Toyota Camry</option>
                  <option value="BMW">BMW X5</option>
                  <option value="Audi">Audi Q7</option>
                  <option value="Honda">Honda Civic</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location</label>
                <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
                  <option value="All Locations">All Locations</option>
                  <option value="New York">New York Downtown</option>
                  <option value="Manhattan">Manhattan</option>
                  <option value="Brooklyn">Brooklyn</option>
                </select>
              </div>

              <div className="form-group">
                <label>Booking Status</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="All Status">All Status</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <button className="bc-apply-filter-btn" onClick={handleApplyFilter}>
                <Filter size={14} />
                <span>Apply Filter</span>
              </button>
            </div>
          </div>

          {/* Calendar Legend Widget */}
          <div className="bc-panel-card">
            <div className="bc-panel-header">
              <h4>Calendar Legend</h4>
            </div>

            <div className="bc-side-legend-list">
              <div className="side-legend-item">
                <div className="badge-box tag-pickup-drop">Pickup & Drop</div>
                <span>Full day booking</span>
              </div>
              <div className="side-legend-item">
                <div className="badge-box tag-pickup-only">Pickup Only</div>
                <span>Vehicle picked up</span>
              </div>
              <div className="side-legend-item">
                <div className="badge-box tag-drop-only">Drop Only</div>
                <span>Vehicle drop off</span>
              </div>
              <div className="side-legend-item">
                <div className="badge-box tag-partially">Partially Booked</div>
                <span>Some hours booked</span>
              </div>
              <div className="side-legend-item">
                <div className="badge-box tag-maintenance">Maintenance / Blocked</div>
                <span>Not available</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Booking Details Modal Dialog */}
      {isModalOpen && (
        <div className="bc-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="bc-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="bc-modal-close-btn" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>

            {/* Modal Left Side: Car Info */}
            <div className="bc-modal-left">
              <div className="car-image-container">
                <img src={modalData.image} alt={modalData.name} />
              </div>

              <div className="car-details-card">
                <h3>{modalData.name}</h3>
                <p className="car-loc"><MapPin size={14} /> {modalData.location}</p>

                <div className="car-specs-grid">
                  <div><Gauge size={14} /> {modalData.mileage}</div>
                  <div><Fuel size={14} /> {modalData.fuel}</div>
                  <div><Settings size={14} /> {modalData.transmission}</div>
                  <div><Users size={14} /> {modalData.seats}</div>
                </div>

                <div className="car-pricing-banner">
                  <div className="price-tag">
                    <span className="amount">${modalData.pricePerDay}</span>
                    <span className="unit">/day</span>
                  </div>
                  <div className="subtotal">
                    <span>Total ({daysCount} days)</span>
                    <strong>${basePrice}</strong>
                  </div>
                </div>

                <div className="car-perks-list">
                  <div><CheckCircle2 size={16} className="text-green" /> Free Cancellation</div>
                  <div><CheckCircle2 size={16} className="text-green" /> No Hidden Charges</div>
                </div>
              </div>
            </div>

            {/* Modal Right Side: Booking Form */}
            <div className="bc-modal-right">
              <h2>Booking Details</h2>

              <div className="modal-form-section">
                <h4>1. Pick-up & Drop-off</h4>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Pick-up Location</label>
                    <div className="input-with-icon">
                      <MapPin size={16} />
                      <select value={pickupLoc} onChange={(e) => setPickupLoc(e.target.value)}>
                        <option value="Manchester, England">Manchester, England</option>
                        <option value="London, England">London, England</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Drop-off Location</label>
                    <div className="input-with-icon">
                      <MapPin size={16} />
                      <select value={dropLoc} onChange={(e) => setDropLoc(e.target.value)}>
                        <option value="Manchester, England">Manchester, England</option>
                        <option value="London, England">London, England</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Pick-up Date & Time</label>
                    <div className="dual-inputs">
                      <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
                      <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Drop-off Date & Time</label>
                    <div className="dual-inputs">
                      <input type="date" value={dropDate} onChange={(e) => setDropDate(e.target.value)} />
                      <input type="time" value={dropTime} onChange={(e) => setDropTime(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>2. Driver Details</h4>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-with-icon">
                      <User size={16} />
                      <input 
                        type="text" 
                        placeholder="Enter full name" 
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-with-icon">
                      <Mail size={16} />
                      <input 
                        type="email" 
                        placeholder="Enter email" 
                        value={driverEmail}
                        onChange={(e) => setDriverEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-with-icon">
                      <Phone size={16} />
                      <input 
                        type="text" 
                        placeholder="Enter phone number" 
                        value={driverPhone}
                        onChange={(e) => setDriverPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Driver Age</label>
                    <select value={driverAge} onChange={(e) => setDriverAge(e.target.value)}>
                      <option value="21">21 - 24</option>
                      <option value="25">25+</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Driving License No.</label>
                    <div className="input-with-icon">
                      <CreditCard size={16} />
                      <input 
                        type="text" 
                        placeholder="Enter license number" 
                        value={licenseNo}
                        onChange={(e) => setLicenseNo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>3. Additional Options</h4>
                <div className="options-checkbox-grid">
                  <label className={`checkbox-card ${optChildSeat ? 'checked' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={optChildSeat} 
                      onChange={(e) => setOptChildSeat(e.target.checked)} 
                    />
                    <span>Child Seat</span>
                    <strong className="text-green">$5 /day</strong>
                  </label>

                  <label className={`checkbox-card ${optGps ? 'checked' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={optGps} 
                      onChange={(e) => setOptGps(e.target.checked)} 
                    />
                    <span>GPS Navigation</span>
                    <strong className="text-green">$7 /day</strong>
                  </label>

                  <label className={`checkbox-card ${optExtraDriver ? 'checked' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={optExtraDriver} 
                      onChange={(e) => setOptExtraDriver(e.target.checked)} 
                    />
                    <span>Additional Driver</span>
                    <strong className="text-green">$10 /day</strong>
                  </label>
                </div>
              </div>

              <div className="modal-form-section">
                <h4>4. Payment Summary</h4>
                <div className="summary-pricing-card">
                  <div className="summary-details">
                    <div>
                      <span>${modalData.pricePerDay} x {daysCount} days</span>
                      <strong>${basePrice}</strong>
                    </div>
                    <div>
                      <span>Additional Options</span>
                      <strong>${optionsPrice}</strong>
                    </div>
                  </div>

                  <div className="total-highlight-box">
                    <span>Total Amount</span>
                    <strong className="total-price">${totalPrice}</strong>
                  </div>
                </div>
              </div>

              <div className="modal-footer-actions">
                <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="btn-confirm-green" onClick={() => setIsModalOpen(false)}>Confirm Booking</button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default BookingCalender;