import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, 
  MapPin, Clock, User, Mail, Phone, X, 
  Filter, MoreVertical, ShieldCheck, Car, Settings, Fuel, Users
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

const VEHICLE_LIST = [
  { id: 'camry', name: 'Toyota Camry', type: 'Sedan', category: 'Sedan • Black', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=120&auto=format&fit=crop&q=60', transmission: 'Automatic', fuel: 'Diesel', seats: '7 Seats' },
  { id: 'bmwx5', name: 'BMW X5', type: 'SUV', category: 'SUV • White', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=120&auto=format&fit=crop&q=60', transmission: 'Automatic', fuel: 'Petrol', seats: '5 Seats' },
  { id: 'audiq7', name: 'Audi Q7', type: 'SUV', category: 'SUV • Blue', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=120&auto=format&fit=crop&q=60', transmission: 'Automatic', fuel: 'Diesel', seats: '7 Seats' },
  { id: 'civic', name: 'Honda Civic', type: 'Sedan', category: 'Sedan • Red', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=120&auto=format&fit=crop&q=60', transmission: 'Manual', fuel: 'Petrol', seats: '5 Seats' }
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
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 13));
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

  // New Booking Modal Form Inputs State
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_LIST[0]);
  const [bookingDate, setBookingDate] = useState('2025-05-18');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [pickupDate, setPickupDate] = useState('2025-05-18');
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [dropoffDate, setDropoffDate] = useState('2025-05-20');
  const [dropoffTime, setDropoffTime] = useState('10:00 AM');

  const [pickupLocation, setPickupLocation] = useState('Manchester, England');
  const [dropoffLocation, setDropoffLocation] = useState('Manchester, England');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');

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
    if (bookingObj) {
      const matched = VEHICLE_LIST.find(v => v.name.toLowerCase().includes(bookingObj.car.toLowerCase())) || VEHICLE_LIST[0];
      setSelectedVehicle(matched);
      setPickupLocation(bookingObj.location || 'Manchester, England');
      setDropoffLocation(bookingObj.dropLocation || 'Manchester, England');
    }
    setIsModalOpen(true);
  };

  const handleVehicleChange = (e) => {
    const found = VEHICLE_LIST.find(v => v.id === e.target.value);
    if (found) setSelectedVehicle(found);
  };

  const handleCreateBookingSubmit = (e) => {
    e.preventDefault();
    alert(`New booking created successfully for ${selectedVehicle.name}!`);
    setIsModalOpen(false);
  };

  // Calendar Grid Days Generation (May 2025)
  const daysInMonth = 31;
  
  const calendarCells = [];
  for (let i = 27; i <= 30; i++) {
    calendarCells.push({ day: i, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({ day: i, isCurrentMonth: true });
  }
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

              <div className="mini-date muted">27</div>
              <div className="mini-date muted">28</div>
              <div className="mini-date muted">29</div>
              <div className="mini-date muted">30</div>

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

      {/* NEW BOOKING POPUP MODAL (MATCHING IMAGE DESIGN) */}
      {isModalOpen && (
        <div className="bc-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="new-booking-modal-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Close Cross Button */}
            <button className="new-booking-close-btn" onClick={() => setIsModalOpen(false)}>
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="new-booking-header">
              <div className="calendar-icon-badge">
                <CalendarIcon size={20} className="green-icon" />
              </div>
              <div>
                <h2>New Booking</h2>
                <p>Fill in the details to create a new vehicle booking</p>
              </div>
            </div>

            {/* Modal Grid Form Body */}
            <form onSubmit={handleCreateBookingSubmit}>
              <div className="new-booking-grid">
                
                {/* LEFT COLUMN */}
                <div className="nb-col">
                  
                  {/* Vehicle Information */}
                  <div className="nb-section-title">Vehicle Information</div>
                  
                  <div className="nb-form-group">
                    <label>Select Vehicle</label>
                    <div className="custom-vehicle-select-box">
                      <select value={selectedVehicle.id} onChange={handleVehicleChange}>
                        {VEHICLE_LIST.map(v => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>
                      <div className="selected-vehicle-preview">
                        <img src={selectedVehicle.image} alt={selectedVehicle.name} />
                        <div>
                          <strong>{selectedVehicle.name}</strong>
                          <span>{selectedVehicle.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="nb-form-group">
                    <label>Vehicle Type</label>
                    <div className="nb-display-input">
                      <Car size={16} className="green-icon" />
                      <span>{selectedVehicle.type}</span>
                    </div>
                  </div>

                  <div className="nb-dual-row">
                    <div className="nb-form-group">
                      <label>Transmission</label>
                      <div className="nb-display-input">
                        <Settings size={16} className="muted-icon" />
                        <span>{selectedVehicle.transmission}</span>
                      </div>
                    </div>
                    <div className="nb-form-group">
                      <label>Fuel Type</label>
                      <div className="nb-display-input">
                        <Fuel size={16} className="muted-icon" />
                        <span>{selectedVehicle.fuel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="nb-form-group">
                    <label>Seating Capacity</label>
                    <div className="nb-display-input">
                      <Users size={16} className="muted-icon" />
                      <span>{selectedVehicle.seats}</span>
                    </div>
                  </div>

                  {/* Booking Information */}
                  <div className="nb-section-title" style={{ marginTop: '20px' }}>Booking Information</div>

                  <div className="nb-dual-row">
                    <div className="nb-form-group">
                      <label>Booking Date</label>
                      <div className="input-with-icon-right">
                        <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
                      </div>
                    </div>
                    <div className="nb-form-group">
                      <label>Booking Time</label>
                      <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)}>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="nb-dual-row">
                    <div className="nb-form-group">
                      <label>Pick-up Date</label>
                      <div className="input-with-icon-right">
                        <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
                      </div>
                    </div>
                    <div className="nb-form-group">
                      <label>Pick-up Time</label>
                      <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="nb-dual-row">
                    <div className="nb-form-group">
                      <label>Drop-off Date</label>
                      <div className="input-with-icon-right">
                        <input type="date" value={dropoffDate} onChange={(e) => setDropoffDate(e.target.value)} />
                      </div>
                    </div>
                    <div className="nb-form-group">
                      <label>Drop-off Time</label>
                      <select value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)}>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="nb-col">
                  
                  {/* Location Details */}
                  <div className="nb-section-title">Location Details</div>

                  <div className="nb-form-group">
                    <label>Pick-up Location</label>
                    <div className="input-with-icon-left select-wrapper">
                      <MapPin size={16} className="input-icon" />
                      <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>
                        <option value="Manchester, England">Manchester, England</option>
                        <option value="New York Downtown">New York Downtown</option>
                        <option value="Manhattan">Manhattan</option>
                      </select>
                    </div>
                  </div>

                  <div className="nb-form-group">
                    <label>Drop-off Location</label>
                    <div className="input-with-icon-left select-wrapper">
                      <MapPin size={16} className="input-icon" />
                      <select value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)}>
                        <option value="Manchester, England">Manchester, England</option>
                        <option value="JFK Airport">JFK Airport</option>
                        <option value="LaGuardia Airport">LaGuardia Airport</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="nb-section-title" style={{ marginTop: '20px' }}>Customer Information</div>

                  <div className="nb-dual-row">
                    <div className="nb-form-group">
                      <label>Full Name</label>
                      <div className="input-with-icon-left">
                        <User size={16} className="input-icon" />
                        <input 
                          type="text" 
                          placeholder="Enter full name" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="nb-form-group">
                      <label>Email Address</label>
                      <div className="input-with-icon-left">
                        <Mail size={16} className="input-icon" />
                        <input 
                          type="email" 
                          placeholder="Enter email address" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="nb-form-group">
                    <label>Phone Number</label>
                    <div className="phone-picker-wrapper">
                      <div className="country-code-select">
                        <span className="flag">🇺🇸</span>
                        <select value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)}>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+91">+91</option>
                        </select>
                      </div>
                      <input 
                        type="tel" 
                        placeholder="Enter phone number" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="nb-form-group">
                    <label>Additional Message (Optional)</label>
                    <div className="textarea-wrapper">
                      <textarea 
                        rows="3" 
                        placeholder="Enter any special requests or notes..."
                        value={additionalMessage}
                        onChange={(e) => setAdditionalMessage(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  {/* Secure Booking Banner */}
                  <div className="nb-secure-banner">
                    <ShieldCheck size={20} className="shield-green" />
                    <div>
                      <strong>Secure Booking</strong>
                      <p>Your information is safe with us. We use secure encryption to protect your data.</p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Action Buttons */}
              <div className="nb-footer-actions">
                <button type="button" className="btn-nb-cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-nb-submit">
                  <CalendarIcon size={16} />
                  <span>Create Booking</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default BookingCalender;