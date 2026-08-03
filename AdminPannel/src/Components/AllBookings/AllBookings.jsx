import React, { useState } from 'react';
import './AllBookings.css';

// React Icons
import { 
  FaCalendarAlt, FaDownload, FaPlus, FaSearch, FaFilter, 
  FaRedo, FaEye, FaEllipsisV, FaTimes, FaCar, FaUsers, 
  FaCheckCircle, FaClock, FaCalendarCheck, FaExclamationCircle,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

// Dummy Initial Data
const initialBookings = [
  {
    id: '#BK2489',
    date: 'May 18, 2025',
    customer: { name: 'John Smith', email: 'john.smith@email.com', phone: '+1 987 654 3210', avatar: 'https://i.pravatar.cc/150?img=11' },
    vehicle: { name: 'Audi A3 1.6 TDI S line', color: 'White', plate: 'MH12 AB 1234', img: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=300' },
    pickup: 'May 18, 10:00 AM',
    returnDate: 'May 22, 10:00 AM',
    duration: '4 Days',
    pickupLoc: 'New York City Airport (JFK)',
    returnLoc: 'New York City Airport (JFK)',
    driver: 'John Smith',
    amount: '$498.25',
    paymentStatus: 'Paid',
    status: 'Confirmed'
  },
  {
    id: '#BK2488',
    date: 'May 18, 2025',
    customer: { name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 912 345 6780', avatar: 'https://i.pravatar.cc/150?img=5' },
    vehicle: { name: 'Mercedes-Benz C220d', color: 'Silver', plate: 'MH12 CD 5678', img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300' },
    pickup: 'May 18, 02:00 PM',
    returnDate: 'May 21, 02:00 PM',
    duration: '3 Days',
    pickupLoc: 'Downtown Station',
    returnLoc: 'Downtown Station',
    driver: 'Sarah Johnson',
    amount: '$525.50',
    paymentStatus: 'Paid',
    status: 'Ongoing'
  },
  {
    id: '#BK2487',
    date: 'May 17, 2025',
    customer: { name: 'Michael Brown', email: 'michael.b@email.com', phone: '+1 876 543 2109', avatar: 'https://i.pravatar.cc/150?img=12' },
    vehicle: { name: 'Volkswagen Golf GTD', color: 'Gray', plate: 'MH12 EF 9012', img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=300' },
    pickup: 'May 17, 09:00 AM',
    returnDate: 'May 20, 09:00 AM',
    duration: '3 Days',
    pickupLoc: 'Airport Terminal 2',
    returnLoc: 'Airport Terminal 2',
    driver: 'Michael Brown',
    amount: '$450.75',
    paymentStatus: 'Paid',
    status: 'Completed'
  },
  {
    id: '#BK2486',
    date: 'May 17, 2025',
    customer: { name: 'David Wilson', email: 'david.w@email.com', phone: '+1 998 877 6655', avatar: 'https://i.pravatar.cc/150?img=13' },
    vehicle: { name: 'Volvo S60 D4 R-Design', color: 'Black', plate: 'MH12 GH 3456', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300' },
    pickup: 'May 17, 11:00 AM',
    returnDate: 'May 19, 11:00 AM',
    duration: '2 Days',
    pickupLoc: 'City Center Hub',
    returnLoc: 'City Center Hub',
    driver: 'David Wilson',
    amount: '$480.00',
    paymentStatus: 'Unpaid',
    status: 'Pending'
  },
  {
    id: '#BK2485',
    date: 'May 16, 2025',
    customer: { name: 'Emma Davis', email: 'emma.d@email.com', phone: '+1 765 432 1098', avatar: 'https://i.pravatar.cc/150?img=9' },
    vehicle: { name: 'Jaguar XE 2.0d R-Sport', color: 'Blue', plate: 'MH12 KL 2468', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300' },
    pickup: 'May 16, 01:00 PM',
    returnDate: 'May 23, 01:00 PM',
    duration: '7 Days',
    pickupLoc: 'East Suburb Hub',
    returnLoc: 'East Suburb Hub',
    driver: 'Emma Davis',
    amount: '$575.25',
    paymentStatus: 'Paid',
    status: 'Confirmed'
  },
  {
    id: '#BK2484',
    date: 'May 16, 2025',
    customer: { name: 'Daniel Miller', email: 'daniel.m@email.com', phone: '+1 654 321 0987', avatar: 'https://i.pravatar.cc/150?img=14' },
    vehicle: { name: 'Hyundai Creta SX', color: 'White', plate: 'MH12 LJ 7890', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300' },
    pickup: 'May 16, 09:30 AM',
    returnDate: 'May 18, 09:30 AM',
    duration: '2 Days',
    pickupLoc: 'Central Garage',
    returnLoc: 'Central Garage',
    driver: 'Daniel Miller',
    amount: '$350.00',
    paymentStatus: 'Paid',
    status: 'Completed'
  }
];

const AllBookings = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDetailsTab, setActiveDetailsTab] = useState('Details');

  // New Booking Form State
  const [newBooking, setNewBooking] = useState({
    customerName: '',
    email: '',
    phone: '',
    vehicle: 'Audi A3 1.6 TDI S line',
    pickupDate: '',
    returnDate: '',
    amount: ''
  });

  // Filter Bookings by tab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'All') return true;
    return b.status.toLowerCase() === activeTab.toLowerCase();
  });

  // Toggle 3-dots Menu
  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  // Change Status from 3-dots menu
  const handleStatusChange = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
    }
    setActiveMenuId(null);
  };

  // Handle New Booking Submission
  const handleAddBookingSubmit = (e) => {
    e.preventDefault();
    const createdBooking = {
      id: `#BK${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'May 18, 2025',
      customer: {
        name: newBooking.customerName || 'New User',
        email: newBooking.email || 'user@example.com',
        phone: newBooking.phone || '+1 000 000 0000',
        avatar: 'https://i.pravatar.cc/150?img=33'
      },
      vehicle: {
        name: newBooking.vehicle,
        color: 'White',
        plate: 'MH12 XX 9999',
        img: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=300'
      },
      pickup: newBooking.pickupDate || 'May 20, 10:00 AM',
      returnDate: newBooking.returnDate || 'May 25, 10:00 AM',
      duration: '5 Days',
      pickupLoc: 'Main Branch',
      returnLoc: 'Main Branch',
      driver: newBooking.customerName || 'New User',
      amount: `$${newBooking.amount || '500.00'}`,
      paymentStatus: 'Paid',
      status: 'Confirmed'
    };

    setBookings([createdBooking, ...bookings]);
    setIsModalOpen(false);
    setNewBooking({
      customerName: '',
      email: '',
      phone: '',
      vehicle: 'Audi A3 1.6 TDI S line',
      pickupDate: '',
      returnDate: '',
      amount: ''
    });
  };

  return (
    <div className="AllBookings-container">
      {/* Top Header */}
      <header className="AllBookings-header">
        <div className="AllBookings-title-section">
          <h2>All Bookings <FaCalendarAlt className="AllBookings-title-icon" /></h2>
          <p className="AllBookings-breadcrumb">Dashboard &gt; Bookings &gt; <span>All Bookings</span></p>
        </div>
        <div className="AllBookings-top-actions">
          <button className="AllBookings-btn-export"><FaDownload /> Export</button>
          <button className="AllBookings-btn-primary" onClick={() => setIsModalOpen(true)}>
            <FaPlus /> New Booking
          </button>
        </div>
      </header>

      {/* Top Stat Cards */}
      <div className="AllBookings-stats-grid">
        <div className="AllBookings-stat-card">
          <div className="AllBookings-stat-icon red"><FaUsers /></div>
          <div className="AllBookings-stat-info">
            <span className="AllBookings-stat-label">Total Bookings</span>
            <h3>128</h3>
            <span className="AllBookings-stat-growth positive">↑ 18.5% from last week</span>
          </div>
        </div>

        <div className="AllBookings-stat-card">
          <div className="AllBookings-stat-icon blue"><FaCar /></div>
          <div className="AllBookings-stat-info">
            <span className="AllBookings-stat-label">Total Revenue</span>
            <h3>$48,560</h3>
            <span className="AllBookings-stat-growth positive">↑ 24.7% from last week</span>
          </div>
        </div>

        <div className="AllBookings-stat-card">
          <div className="AllBookings-stat-icon green"><FaCheckCircle /></div>
          <div className="AllBookings-stat-info">
            <span className="AllBookings-stat-label">Confirmed</span>
            <h3>42</h3>
            <span className="AllBookings-stat-growth positive">↑ 12.3% from last week</span>
          </div>
        </div>

        <div className="AllBookings-stat-card">
          <div className="AllBookings-stat-icon orange"><FaClock /></div>
          <div className="AllBookings-stat-info">
            <span className="AllBookings-stat-label">Ongoing</span>
            <h3>32</h3>
            <span className="AllBookings-stat-subtext">Currently Active</span>
          </div>
        </div>

        <div className="AllBookings-stat-card">
          <div className="AllBookings-stat-icon purple"><FaCalendarCheck /></div>
          <div className="AllBookings-stat-info">
            <span className="AllBookings-stat-label">Completed</span>
            <h3>36</h3>
            <span className="AllBookings-stat-growth positive">↑ 8.2% from last week</span>
          </div>
        </div>

        <div className="AllBookings-stat-card">
          <div className="AllBookings-stat-icon light-red"><FaExclamationCircle /></div>
          <div className="AllBookings-stat-info">
            <span className="AllBookings-stat-label">Cancelled</span>
            <h3>18</h3>
            <span className="AllBookings-stat-growth positive">↑ 3.5% from last week</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="AllBookings-content-body">
        {/* Left Column: Data Table Container */}
        <div className={`AllBookings-table-wrapper ${selectedBooking ? 'with-sidebar' : 'full-width'}`}>
          {/* Status Tabs */}
          <div className="AllBookings-status-tabs">
            {['All', 'Pending', 'Confirmed', 'Ongoing', 'Completed', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                className={`AllBookings-tab-btn ${tab.toLowerCase()} ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab} {tab === 'All' ? '(128)' : tab === 'Pending' ? '(5)' : tab === 'Confirmed' ? '(42)' : tab === 'Ongoing' ? '(32)' : tab === 'Completed' ? '(36)' : '(18)'}
              </button>
            ))}
          </div>

          {/* Table Filters Toolbar */}
          <div className="AllBookings-filter-bar">
            <div className="AllBookings-search-input">
              <FaSearch />
              <input type="text" placeholder="Search by name, email, or booking ID..." />
            </div>
            <div className="AllBookings-filter-dropdowns">
              <select className="AllBookings-select">
                <option>All Vehicles</option>
                <option>Audi</option>
                <option>Mercedes</option>
                <option>Volkswagen</option>
              </select>
              <select className="AllBookings-select">
                <option>All Status</option>
                <option>Confirmed</option>
                <option>Ongoing</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
              <button className="AllBookings-btn-secondary"><FaCalendarAlt /> May 12 - May 18, 2025</button>
              <button className="AllBookings-btn-secondary"><FaFilter /> More Filters</button>
              <button className="AllBookings-btn-icon"><FaRedo /> Reset</button>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="AllBookings-table-responsive">
            <table className="AllBookings-table">
              <thead>
                <tr>
                  <th>BOOKING</th>
                  <th>CUSTOMER</th>
                  <th>VEHICLE</th>
                  <th>PICKUP / RETURN</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((item) => (
                  <tr key={item.id} className={selectedBooking?.id === item.id ? 'selected-row' : ''}>
                    <td className="AllBookings-td-id">
                      <span className="AllBookings-id-text">{item.id}</span>
                      <span className="AllBookings-sub-text">{item.date}</span>
                    </td>
                    <td>
                      <div className="AllBookings-user-cell">
                        <img src={item.customer.avatar} alt={item.customer.name} />
                        <div>
                          <strong>{item.customer.name}</strong>
                          <span className="AllBookings-sub-text">{item.customer.email}</span>
                          <span className="AllBookings-sub-text">{item.customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="AllBookings-vehicle-cell">
                        <img src={item.vehicle.img} alt={item.vehicle.name} />
                        <div>
                          <strong>{item.vehicle.name}</strong>
                          <span className="AllBookings-sub-text">{item.vehicle.color}</span>
                          <span className="AllBookings-plate-badge">{item.vehicle.plate}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="AllBookings-dates-cell">
                        <span>{item.pickup}</span>
                        <span>{item.returnDate}</span>
                        <span className="AllBookings-sub-text">{item.duration}</span>
                      </div>
                    </td>
                    <td>
                      <div className="AllBookings-amount-cell">
                        <strong>{item.amount}</strong>
                        <span className={`AllBookings-pay-badge ${item.paymentStatus.toLowerCase()}`}>{item.paymentStatus}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`AllBookings-status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                    </td>
                    <td className="AllBookings-td-actions">
                      <button className="AllBookings-action-btn view" onClick={() => setSelectedBooking(item)}>
                        <FaEye />
                      </button>
                      <div className="AllBookings-dropdown-container">
                        <button className="AllBookings-action-btn menu" onClick={(e) => toggleMenu(item.id, e)}>
                          <FaEllipsisV />
                        </button>
                        {activeMenuId === item.id && (
                          <div className="AllBookings-action-menu">
                            <button onClick={() => handleStatusChange(item.id, 'Confirmed')}>Set Confirmed</button>
                            <button onClick={() => handleStatusChange(item.id, 'Ongoing')}>Set Ongoing</button>
                            <button onClick={() => handleStatusChange(item.id, 'Completed')}>Set Completed</button>
                            <button onClick={() => handleStatusChange(item.id, 'Pending')}>Set Pending</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="AllBookings-pagination-bar">
            <span>Showing 1 to {filteredBookings.length} of 128 bookings</span>
            <div className="AllBookings-pagination-controls">
              <button className="AllBookings-page-btn"><FaChevronLeft /></button>
              <button className="AllBookings-page-btn active">1</button>
              <button className="AllBookings-page-btn">2</button>
              <button className="AllBookings-page-btn">3</button>
              <span>...</span>
              <button className="AllBookings-page-btn">22</button>
              <button className="AllBookings-page-btn"><FaChevronRight /></button>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Details Sidebar Panel (Appears on clicking Eye Icon) */}
        {selectedBooking && (
          <div className="AllBookings-details-sidebar">
            <div className="AllBookings-details-header">
              <h3>Booking Details</h3>
              <button className="AllBookings-close-btn" onClick={() => setSelectedBooking(null)}>
                <FaTimes />
              </button>
            </div>

            {/* Sidebar Vehicle Card */}
            <div className="AllBookings-sidebar-car-card">
              <img src={selectedBooking.vehicle.img} alt={selectedBooking.vehicle.name} />
              <div className="AllBookings-car-card-info">
                <div>
                  <span className="AllBookings-meta-label">Booking ID</span>
                  <strong>{selectedBooking.id}</strong>
                </div>
                <div>
                  <span className="AllBookings-meta-label">Booking Date</span>
                  <strong>{selectedBooking.date} at 09:15 AM</strong>
                </div>
                <div>
                  <span className="AllBookings-meta-label">Payment Status</span>
                  <span className="AllBookings-pay-badge paid">{selectedBooking.paymentStatus}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="AllBookings-sidebar-tabs">
              {['Details', 'Customer', 'Payment', 'History'].map((tab) => (
                <button
                  key={tab}
                  className={`AllBookings-sidebar-tab ${activeDetailsTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveDetailsTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Details Body */}
            <div className="AllBookings-sidebar-body">
              <div className="AllBookings-details-section">
                <h4>Booking Information</h4>
                <div className="AllBookings-info-group">
                  <label>Vehicle</label>
                  <p>{selectedBooking.vehicle.name} ({selectedBooking.vehicle.color})</p>
                </div>
                <div className="AllBookings-info-group">
                  <label>Pickup Date</label>
                  <p>{selectedBooking.pickup}</p>
                </div>
                <div className="AllBookings-info-group">
                  <label>Return Date</label>
                  <p>{selectedBooking.returnDate}</p>
                </div>
                <div className="AllBookings-info-group">
                  <label>Duration</label>
                  <p>{selectedBooking.duration}</p>
                </div>
                <div className="AllBookings-info-group">
                  <label>Pickup Location</label>
                  <p>{selectedBooking.pickupLoc}</p>
                </div>
                <div className="AllBookings-info-group">
                  <label>Return Location</label>
                  <p>{selectedBooking.returnLoc}</p>
                </div>
                <div className="AllBookings-info-group">
                  <label>Driver</label>
                  <p>{selectedBooking.driver}</p>
                </div>
              </div>

              <div className="AllBookings-pricing-section">
                <h4>Pricing Details</h4>
                <div className="AllBookings-price-row">
                  <span>Daily Rent Price</span>
                  <span>{selectedBooking.amount}</span>
                </div>
                <div className="AllBookings-price-row">
                  <span>Days</span>
                  <span>4</span>
                </div>
                <div className="AllBookings-price-row">
                  <span>Subtotal</span>
                  <span>$1,993.00</span>
                </div>
                <div className="AllBookings-price-row">
                  <span>Extra KM (120 km)</span>
                  <span>$24.00</span>
                </div>
                <div className="AllBookings-price-row">
                  <span>Security Deposit</span>
                  <span>$500.00</span>
                </div>
                <div className="AllBookings-price-row">
                  <span>Taxes & Fees (8%)</span>
                  <span>$201.36</span>
                </div>
                <div className="AllBookings-price-row total">
                  <strong>Total Amount</strong>
                  <strong className="purple-text">$2,718.36</strong>
                </div>
                <div className="AllBookings-paid-banner">
                  <span>Paid Amount</span>
                  <strong>$2,718.36</strong>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="AllBookings-sidebar-actions">
              <h4>Booking Actions</h4>
              <div className="AllBookings-action-buttons-grid">
                <button className="AllBookings-action-btn-green" onClick={() => handleStatusChange(selectedBooking.id, 'Confirmed')}>Mark as Confirmed</button>
                <button className="AllBookings-action-btn-sky" onClick={() => handleStatusChange(selectedBooking.id, 'Ongoing')}>Start Booking (Ongoing)</button>
                <button className="AllBookings-action-btn-purple" onClick={() => handleStatusChange(selectedBooking.id, 'Completed')}>Mark as Completed</button>
                <button className="AllBookings-action-btn-red" onClick={() => handleStatusChange(selectedBooking.id, 'Cancelled')}>Cancel Booking</button>
              </div>

              {/* Cancel Booking Input Area */}
              <div className="AllBookings-cancel-box">
                <h5>Cancel Booking</h5>
                <div className="AllBookings-input-group">
                  <label>Reason for Cancellation *</label>
                  <select className="AllBookings-select full">
                    <option>Select reason</option>
                    <option>Customer requested</option>
                    <option>Vehicle issue</option>
                  </select>
                </div>
                <div className="AllBookings-input-group">
                  <label>Comments (Optional)</label>
                  <textarea placeholder="Enter additional comments..." maxLength={200}></textarea>
                  <span className="AllBookings-char-count">0/200</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add New Booking Modal */}
      {isModalOpen && (
        <div className="AllBookings-modal-overlay">
          <div className="AllBookings-modal">
            <div className="AllBookings-modal-header">
              <h3>Add New Booking</h3>
              <button className="AllBookings-close-btn" onClick={() => setIsModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddBookingSubmit} className="AllBookings-modal-form">
              <div className="AllBookings-form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  required
                  value={newBooking.customerName}
                  onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
                />
              </div>
              <div className="AllBookings-form-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={newBooking.email}
                  onChange={(e) => setNewBooking({ ...newBooking, email: e.target.value })}
                />
              </div>
              <div className="AllBookings-form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  required
                  value={newBooking.phone}
                  onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })}
                />
              </div>
              <div className="AllBookings-form-group">
                <label>Vehicle</label>
                <select
                  value={newBooking.vehicle}
                  onChange={(e) => setNewBooking({ ...newBooking, vehicle: e.target.value })}
                >
                  <option>Audi A3 1.6 TDI S line</option>
                  <option>Mercedes-Benz C220d</option>
                  <option>Volkswagen Golf GTD</option>
                  <option>Volvo S60 D4 R-Design</option>
                </select>
              </div>
              <div className="AllBookings-form-row">
                <div className="AllBookings-form-group">
                  <label>Pickup Date</label>
                  <input
                    type="date"
                    required
                    onChange={(e) => setNewBooking({ ...newBooking, pickupDate: e.target.value })}
                  />
                </div>
                <div className="AllBookings-form-group">
                  <label>Return Date</label>
                  <input
                    type="date"
                    required
                    onChange={(e) => setNewBooking({ ...newBooking, returnDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="AllBookings-form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  required
                  value={newBooking.amount}
                  onChange={(e) => setNewBooking({ ...newBooking, amount: e.target.value })}
                />
              </div>
              <div className="AllBookings-modal-actions">
                <button type="button" className="AllBookings-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="AllBookings-btn-primary">Create Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookings;