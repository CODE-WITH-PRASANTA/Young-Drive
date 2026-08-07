import React, { useState, useEffect } from 'react';
import './AllBookings.css';
import API from '../../api/axios';

// React Icons
import { 
  FaCalendarAlt, FaDownload, FaPlus, FaSearch, 
  FaEye, FaEllipsisV, FaTimes, FaCar, FaUsers, 
  FaCheckCircle, FaClock, FaCalendarCheck, FaExclamationCircle,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

const AllBookings = () => {
  // Database State (No initial dummy data)
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDetailsTab, setActiveDetailsTab] = useState('Details');
  const [loading, setLoading] = useState(false);

  // Cancellation Sidebar Controls State
  const [showCancelBox, setShowCancelBox] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('Select reason');
  const [cancellationComment, setCancellationComment] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // 📡 1. Fetch Live Bookings from Express/MongoDB API
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await API.get('/bookings', {
        params: {
          status: activeTab !== 'All' ? activeTab : undefined,
          search: searchTerm || undefined
        }
      });

      if (response.data && response.data.success) {
        setBookings(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings from server:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab, searchTerm]);

  // 💰 Calculate Total Revenue dynamically from fetched database data
  const calculateTotalRevenue = (bookingList) => {
    const total = bookingList.reduce((sum, item) => {
      if (!item.amount) return sum;
      const numericVal = parseFloat(item.amount.toString().replace(/[^0-9.-]+/g, '')) || 0;
      return sum + numericVal;
    }, 0);

    return `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // 🔍 Client-side Filtered List
  const filteredBookings = bookings.filter((b) => {
    const matchesTab = activeTab === 'All' || b.status?.toLowerCase() === activeTab.toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      b.id?.toLowerCase().includes(search) ||
      b.customer?.name?.toLowerCase().includes(search) ||
      b.customer?.email?.toLowerCase().includes(search);

    return matchesTab && matchesSearch;
  });

  // 📄 Pagination Logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDisplayedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // 📥 Export CSV Functionality
  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      alert('No booking records available to export.');
      return;
    }

    const headers = ['Booking ID,Date,Customer Name,Email,Phone,Vehicle,Pickup,Return,Amount,Status\n'];
    const rows = filteredBookings.map((b) => 
      `"${b.id}","${b.date}","${b.customer?.name || ''}","${b.customer?.email || ''}","${b.customer?.phone || ''}","${b.vehicle?.name || ''}","${b.pickup || ''}","${b.returnDate || ''}","${b.amount || ''}","${b.status || ''}"`
    );

    const blob = new Blob([headers + rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `YoungDrive_Bookings_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Toggle Action Dropdown Menu
  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  // 🔄 Update Booking Status via API
  const handleStatusChange = async (id, newStatus, reason = '', comment = '') => {
    setActiveMenuId(null);

    try {
      const payload = { status: newStatus };
      if (reason) payload.cancellationReason = reason;
      if (comment) payload.cancellationComment = comment;

      const response = await API.patch(`/bookings/${encodeURIComponent(id)}/status`, payload);

      if (response.data && response.data.success) {
        fetchBookings();
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking(response.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to update booking status:', err.message);
    }
  };

  // ❌ Submit Cancellation Action from Sidebar Form
  const handleCancelBookingSubmit = () => {
    if (!selectedBooking) return;
    if (!cancellationReason || cancellationReason === 'Select reason') {
      alert('Please select a reason for cancellation.');
      return;
    }

    handleStatusChange(selectedBooking.id, 'Cancelled', cancellationReason, cancellationComment);
    setCancellationReason('Select reason');
    setCancellationComment('');
    setShowCancelBox(false);
    alert(`Booking ${selectedBooking.id} has been cancelled.`);
  };

  // ➕ Create New Booking via API
  const handleAddBookingSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/bookings', newBooking);

      if (response.data && response.data.success) {
        fetchBookings();
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
      }
    } catch (error) {
      alert('Failed to create booking. Please check your backend connection.');
      console.error('Create booking error:', error.message);
    }
  };

  return (
    <div className="AllBookings-container">
      {/* Header */}
      <header className="AllBookings-header">
        <div className="AllBookings-title-section">
          <h2>All Bookings <FaCalendarAlt className="AllBookings-title-icon" /></h2>
          <p className="AllBookings-breadcrumb">Dashboard &gt; Bookings &gt; <span>All Bookings</span></p>
        </div>
        <div className="AllBookings-top-actions">
          <button className="AllBookings-btn-export" onClick={handleExportCSV}>
            <FaDownload /> Export CSV
          </button>
          <button className="AllBookings-btn-primary" onClick={() => setIsModalOpen(true)}>
            <FaPlus /> New Booking
          </button>
        </div>
      </header>

      {/* Top Stat Cards Grid */}
      <div className="AllBookings-stats-grid">
        <div className="AllBookings-stat-card">
          <div className="AllBookings-stat-icon red"><FaUsers /></div>
          <div className="AllBookings-stat-info">
            <span className="AllBookings-stat-label">Total Bookings</span>
            <h3>{bookings.length}</h3>
            <span className="AllBookings-stat-growth positive">↑ 18.5% from last week</span>
          </div>
        </div>

        <div className="AllBookings-stat-card">
          <div className="AllBookings-stat-icon blue"><FaCar /></div>
          <div className="AllBookings-stat-info">
            <span className="AllBookings-stat-label">Total Revenue</span>
            <h3>{calculateTotalRevenue(bookings)}</h3>
            <span className="AllBookings-stat-growth positive">↑ 24.7% from last week</span>
          </div>
        </div>

        <div className="AllBookings-stat-card">
          <div className="AllBookings-stat-icon green"><FaCheckCircle /></div>
          <div className="AllBookings-stat-info">
            <span className="AllBookings-stat-label">Confirmed</span>
            <h3>{bookings.filter(b => b.status === 'Confirmed').length}</h3>
            <span className="AllBookings-stat-growth positive">↑ 12.3% from last week</span>
          </div>
        </div>

        <div className="AllBookings-stat-card">
          <div className="AllBookings-stat-icon orange"><FaClock /></div>
          <div className="AllBookings-stat-info">
            <span className="AllBookings-stat-label">Ongoing</span>
            <h3>{bookings.filter(b => b.status === 'Ongoing').length}</h3>
            <span className="AllBookings-stat-subtext">Currently Active</span>
          </div>
        </div>

        <div className="AllBookings-stat-card">
          <div className="AllBookings-stat-icon purple"><FaCalendarCheck /></div>
          <div className="AllBookings-stat-info">
            <span className="AllBookings-stat-label">Completed</span>
            <h3>{bookings.filter(b => b.status === 'Completed').length}</h3>
            <span className="AllBookings-stat-growth positive">↑ 8.2% from last week</span>
          </div>
        </div>

        <div className="AllBookings-stat-card">
          <div className="AllBookings-stat-icon light-red"><FaExclamationCircle /></div>
          <div className="AllBookings-stat-info">
            <span className="AllBookings-stat-label">Cancelled</span>
            <h3>{bookings.filter(b => b.status === 'Cancelled').length}</h3>
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
            {['All', 'Pending', 'Confirmed', 'Ongoing', 'Completed', 'Cancelled'].map((tab) => {
              const count = tab === 'All' ? bookings.length : bookings.filter(b => b.status?.toLowerCase() === tab.toLowerCase()).length;
              return (
                <button
                  key={tab}
                  className={`AllBookings-tab-btn ${tab.toLowerCase()} ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Input Bar */}
          <div className="AllBookings-filter-bar">
            <div className="AllBookings-search-input">
              <FaSearch />
              <input 
                type="text" 
                placeholder="Search by name, email, or booking ID..." 
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Bookings Data Table */}
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
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                      Loading bookings...
                    </td>
                  </tr>
                ) : currentDisplayedBookings.length > 0 ? (
                  currentDisplayedBookings.map((item) => (
                    <tr key={item.id} className={selectedBooking?.id === item.id ? 'selected-row' : ''}>
                      <td className="AllBookings-td-id">
                        <span className="AllBookings-id-text">{item.id}</span>
                        <span className="AllBookings-sub-text">{item.date}</span>
                      </td>
                      <td>
                        <div className="AllBookings-user-cell">
                          <div>
                            <strong>{item.customer?.name}</strong>
                            <span className="AllBookings-sub-text">{item.customer?.email}</span>
                            <span className="AllBookings-sub-text">{item.customer?.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="AllBookings-vehicle-cell">
                          <div>
                            <strong>{item.vehicle?.name}</strong>
                            <span className="AllBookings-sub-text">{item.vehicle?.color}</span>
                            <span className="AllBookings-plate-badge">{item.vehicle?.plate}</span>
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
                          <span className={`AllBookings-pay-badge ${item.paymentStatus ? item.paymentStatus.toLowerCase() : 'paid'}`}>
                            {item.paymentStatus || 'Paid'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`AllBookings-status-badge ${item.status ? item.status.toLowerCase() : 'confirmed'}`}>{item.status}</span>
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
                              <button onClick={() => handleStatusChange(item.id, 'Cancelled')}>Set Cancelled</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Dynamic Pagination Controls */}
          <div className="AllBookings-pagination-bar">
            <span>
              Showing {filteredBookings.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
            </span>

            <div className="AllBookings-pagination-controls">
              <button 
                className="AllBookings-page-btn" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`AllBookings-page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              <button 
                className="AllBookings-page-btn" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Details Panel */}
        {selectedBooking && (
          <div className="AllBookings-details-sidebar">
            <div className="AllBookings-details-header">
              <h3>Booking Details</h3>
              <button className="AllBookings-close-btn" onClick={() => setSelectedBooking(null)}>
                <FaTimes />
              </button>
            </div>

            {/* Vehicle Summary Box */}
            <div className="AllBookings-sidebar-car-card">
              <div className="AllBookings-car-card-info">
                <div>
                  <span className="AllBookings-meta-label">Booking ID</span>
                  <strong>{selectedBooking.id}</strong>
                </div>
                <div>
                  <span className="AllBookings-meta-label">Booking Date</span>
                  <strong>{selectedBooking.date}</strong>
                </div>
                <div>
                  <span className="AllBookings-meta-label">Payment Status</span>
                  <span className="AllBookings-pay-badge paid">{selectedBooking.paymentStatus || 'Paid'}</span>
                </div>
              </div>
            </div>

            {/* Details Tabs */}
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

            {/* Sidebar Tab Body */}
            <div className="AllBookings-sidebar-body">
              <div className="AllBookings-details-section">
                <h4>Booking Information</h4>
                <div className="AllBookings-info-group">
                  <label>Vehicle</label>
                  <p>{selectedBooking.vehicle?.name} ({selectedBooking.vehicle?.color})</p>
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
                <div className="AllBookings-price-row total">
                  <strong>Total Amount</strong>
                  <strong className="purple-text">{selectedBooking.amount}</strong>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons Grid */}
            <div className="AllBookings-sidebar-actions">
              <h4>Booking Actions</h4>
              <div className="AllBookings-action-buttons-grid">
                <button className="AllBookings-action-btn-green" onClick={() => handleStatusChange(selectedBooking.id, 'Confirmed')}>Mark Confirmed</button>
                <button className="AllBookings-action-btn-sky" onClick={() => handleStatusChange(selectedBooking.id, 'Ongoing')}>Mark Ongoing</button>
                <button className="AllBookings-action-btn-purple" onClick={() => handleStatusChange(selectedBooking.id, 'Completed')}>Mark Completed</button>
                <button className="AllBookings-action-btn-red" onClick={() => setShowCancelBox(!showCancelBox)}>
                  {showCancelBox ? 'Hide Cancel Form' : 'Cancel Booking'}
                </button>
              </div>

              {/* Cancel Booking Input Area (Toggles ON when Cancel Booking is clicked) */}
              {showCancelBox && (
                <div className="AllBookings-cancel-box" style={{ marginTop: '1rem' }}>
                  <h5>Cancel Booking</h5>
                  <div className="AllBookings-input-group">
                    <label>Reason for Cancellation *</label>
                    <select 
                      className="AllBookings-select full"
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                    >
                      <option>Select reason</option>
                      <option>Customer requested</option>
                      <option>Vehicle issue</option>
                      <option>Payment failed</option>
                    </select>
                  </div>
                  <div className="AllBookings-input-group">
                    <label>Comments (Optional)</label>
                    <textarea 
                      placeholder="Enter additional comments..." 
                      maxLength={200}
                      value={cancellationComment}
                      onChange={(e) => setCancellationComment(e.target.value)}
                    ></textarea>
                    <span className="AllBookings-char-count">{cancellationComment.length}/200</span>
                  </div>
                  <button 
                    type="button" 
                    className="AllBookings-action-btn-red" 
                    style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', cursor: 'pointer' }}
                    onClick={handleCancelBookingSubmit}
                  >
                    Submit Cancellation
                  </button>
                </div>
              )}
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