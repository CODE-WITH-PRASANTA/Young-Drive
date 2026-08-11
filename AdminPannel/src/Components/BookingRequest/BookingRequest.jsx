import React, { useState, useMemo } from 'react';
import { 
  Search, Calendar, Filter, Eye, X, User, Car, 
  MapPin, ChevronLeft, ChevronRight, Check, Trash2, 
  RefreshCw, Clock, AlertCircle, MoreVertical, FileText, RotateCcw
} from 'lucide-react';
import './BookingRequest.css';

const INITIAL_DATA = [
  {
    id: '#BK25051801',
    customer: { name: 'John Smith', email: 'john@gmail.com', phone: '+1 202-555-0181', license: 'EJ123456788', address: '123 Main Street, Chicago, IL 60601, USA' },
    vehicle: { name: 'Toyota Camry', type: 'Sedan • Black', year: '2022', transmission: 'Automatic', fuel: 'Petrol', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=200&auto=format&fit=crop&q=60' },
    pickup: 'New York City',
    drop: 'Los Angeles',
    dates: 'May 20, 2025 - May 25, 2025',
    startDate: '2025-05-20',
    endDate: '2025-05-25',
    pickupDate: 'May 20, 2025 at 10:00 AM',
    dropoffDate: 'May 25, 2025 at 10:00 AM',
    duration: '5 Days',
    status: 'Pending',
    amount: '$350.00',
    bookedOn: 'May 18, 2025 at 10:30 AM',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Unpaid'
  },
  {
    id: '#BK25051802',
    customer: { name: 'Emily Johnson', email: 'emily@gmail.com', phone: '+1 202-555-0182', license: 'EJ123456789', address: '123 Main Street, Chicago, IL 60601, USA' },
    vehicle: { name: 'BMW X5', type: 'SUV • White', year: '2023', transmission: 'Automatic', fuel: 'Petrol', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&auto=format&fit=crop&q=60' },
    pickup: 'Chicago',
    drop: 'Miami',
    dates: 'May 22, 2025 - May 28, 2025',
    startDate: '2025-05-22',
    endDate: '2025-05-28',
    pickupDate: 'May 22, 2025 at 10:00 AM',
    dropoffDate: 'May 28, 2025 at 10:00 AM',
    duration: '6 Days',
    status: 'Pending',
    amount: '$720.00',
    bookedOn: 'May 18, 2025 at 10:30 AM',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Unpaid'
  },
  {
    id: '#BK25051803',
    customer: { name: 'Michael Brown', email: 'michael@gmail.com', phone: '+1 202-555-0183', license: 'MB987654321', address: '456 Oak Ave, Dallas, TX 75201, USA' },
    vehicle: { name: 'Honda Civic', type: 'Sedan • Gray', year: '2021', transmission: 'Manual', fuel: 'Hybrid', image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=200&auto=format&fit=crop&q=60' },
    pickup: 'Dallas',
    drop: 'Houston',
    dates: 'May 19, 2025 - May 21, 2025',
    startDate: '2025-05-19',
    endDate: '2025-05-21',
    pickupDate: 'May 19, 2025 at 09:00 AM',
    dropoffDate: 'May 21, 2025 at 09:00 AM',
    duration: '2 Days',
    status: 'Confirmed',
    amount: '$120.00',
    bookedOn: 'May 17, 2025 at 08:15 AM',
    paymentMethod: 'PayPal',
    paymentStatus: 'Paid'
  },
  {
    id: '#BK25051804',
    customer: { name: 'Sarah Wilson', email: 'sarah@gmail.com', phone: '+1 202-555-0184', license: 'SW456789123', address: '789 Pine St, San Francisco, CA 94101, USA' },
    vehicle: { name: 'Mercedes C-Class', type: 'Sedan • Silver', year: '2023', transmission: 'Automatic', fuel: 'Diesel', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200&auto=format&fit=crop&q=60' },
    pickup: 'San Francisco',
    drop: 'San Diego',
    dates: 'May 23, 2025 - May 27, 2025',
    startDate: '2025-05-23',
    endDate: '2025-05-27',
    pickupDate: 'May 23, 2025 at 11:00 AM',
    dropoffDate: 'May 27, 2025 at 11:00 AM',
    duration: '4 Days',
    status: 'Pending',
    amount: '$480.00',
    bookedOn: 'May 18, 2025 at 02:45 PM',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Unpaid'
  },
  {
    id: '#BK25051805',
    customer: { name: 'David Lee', email: 'david@gmail.com', phone: '+1 202-555-0185', license: 'DL654321987', address: '321 Maple Rd, Boston, MA 02108, USA' },
    vehicle: { name: 'Audi Q7', type: 'SUV • Black', year: '2022', transmission: 'Automatic', fuel: 'Petrol', image: 'https://images.unsplash.com/photo-1541348263662-e082662d82da?w=200&auto=format&fit=crop&q=60' },
    pickup: 'Boston',
    drop: 'Washington DC',
    dates: 'May 24, 2025 - May 30, 2025',
    startDate: '2025-05-24',
    endDate: '2025-05-30',
    pickupDate: 'May 24, 2025 at 08:00 AM',
    dropoffDate: 'May 30, 2025 at 08:00 AM',
    duration: '6 Days',
    status: 'Cancelled',
    amount: '$650.00',
    bookedOn: 'May 16, 2025 at 11:20 AM',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Refunded'
  },
  {
    id: '#BK25051806',
    customer: { name: 'Alex Turner', email: 'alex@gmail.com', phone: '+1 202-555-0186', license: 'AT112233445', address: '555 Cedar St, Seattle, WA 98101, USA' },
    vehicle: { name: 'Ford Mustang', type: 'Coupe • Red', year: '2021', transmission: 'Manual', fuel: 'Petrol', image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=200&auto=format&fit=crop&q=60' },
    pickup: 'Seattle',
    drop: 'Portland',
    dates: 'May 28, 2025 - Jun 01, 2025',
    startDate: '2025-05-28',
    endDate: '2025-06-01',
    pickupDate: 'May 28, 2025 at 10:00 AM',
    dropoffDate: 'Jun 01, 2025 at 10:00 AM',
    duration: '4 Days',
    status: 'Pending',
    amount: '$500.00',
    bookedOn: 'May 19, 2025 at 09:10 AM',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Unpaid'
  },
  {
    id: '#BK25051807',
    customer: { name: 'Lisa Ray', email: 'lisa@gmail.com', phone: '+1 202-555-0187', license: 'LR998877665', address: '777 Birch Ln, Denver, CO 80202, USA' },
    vehicle: { name: 'Tesla Model 3', type: 'Sedan • White', year: '2023', transmission: 'Automatic', fuel: 'Electric', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=200&auto=format&fit=crop&q=60' },
    pickup: 'Denver',
    drop: 'Aspen',
    dates: 'Jun 02, 2025 - Jun 05, 2025',
    startDate: '2025-06-02',
    endDate: '2025-06-05',
    pickupDate: 'Jun 02, 2025 at 12:00 PM',
    dropoffDate: 'Jun 05, 2025 at 12:00 PM',
    duration: '3 Days',
    status: 'Confirmed',
    amount: '$420.00',
    bookedOn: 'May 19, 2025 at 04:30 PM',
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid'
  }
];

const BookingRequest = () => {
  const [bookings, setBookings] = useState(INITIAL_DATA);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  // Filter Input States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Applied Filter States
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    status: 'All Status',
    start: '',
    end: ''
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Apply Filter Handler
  const handleApplyFilter = () => {
    setAppliedFilters({
      search: searchTerm,
      status: statusFilter,
      start: startDate,
      end: endDate
    });
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setSearchTerm('');
    setStatusFilter('All Status');
    setStartDate('');
    setEndDate('');
    setAppliedFilters({
      search: '',
      status: 'All Status',
      start: '',
      end: ''
    });
    setCurrentPage(1);
  };

  // Filtered Bookings Logic
  const filteredBookings = useMemo(() => {
    return bookings.filter(item => {
      const matchesSearch = 
        item.id.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        item.customer.name.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        item.customer.email.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        item.customer.phone.includes(appliedFilters.search);
        
      const matchesStatus = appliedFilters.status === 'All Status' || item.status.toLowerCase() === appliedFilters.status.toLowerCase();

      let matchesDate = true;
      if (appliedFilters.start) {
        matchesDate = matchesDate && new Date(item.startDate) >= new Date(appliedFilters.start);
      }
      if (appliedFilters.end) {
        matchesDate = matchesDate && new Date(item.endDate) <= new Date(appliedFilters.end);
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, appliedFilters]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'Pending').length;
    const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
    const cancelled = bookings.filter(b => b.status === 'Cancelled').length;
    return { total, pending, confirmed, cancelled };
  }, [bookings]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return filteredBookings.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredBookings]);

  // Update Status for Individual Row
  const updateStatus = (id, newStatus) => {
    setBookings(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking(prev => ({ ...prev, status: newStatus }));
    }
    setActiveDropdownId(null);
  };

  // Delete Individual Row
  const handleDeleteRow = (id) => {
    setBookings(prev => prev.filter(item => item.id !== id));
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking(null);
    }
    setActiveDropdownId(null);
  };

  return (
    <div className="booking-requests-container">
      {/* Top Header */}
      <div className="br-header">
        <div>
          <h2>Booking Requests</h2>
          <p>Manage and review all incoming booking requests</p>
        </div>
        <div className="br-breadcrumb">
          <span>Bookings</span> &gt; <span className="active">Booking Requests</span>
        </div>
      </div>

      {/* Main Grid Layout Container */}
      <div className="br-layout">
        
        {/* Left Side Content */}
        <div className="br-main-content">
          
          {/* Stat Cards */}
          <div className="br-stats-grid">
            <div className="stat-card">
              <div className="stat-icon green"><RefreshCw size={20} /></div>
              <div className="stat-info">
                <p>Total Requests</p>
                <h3>{stats.total}</h3>
                <span>This Month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon yellow"><Clock size={20} /></div>
              <div className="stat-info">
                <p>Pending Requests</p>
                <h3>{stats.pending}</h3>
                <span>Awaiting Action</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon dark-green"><Check size={20} /></div>
              <div className="stat-info">
                <p>Confirmed</p>
                <h3>{stats.confirmed}</h3>
                <span>This Month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon red"><AlertCircle size={20} /></div>
              <div className="stat-info">
                <p>Cancelled</p>
                <h3>{stats.cancelled}</h3>
                <span>This Month</span>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="br-filters-bar">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by name, email, phone, or booking ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All Status">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Functional Calendar Date Range Inputs */}
            <div className="date-picker-wrapper">
              <Calendar size={16} className="calendar-icon" />
              <input 
                type="date" 
                className="date-input" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="date-separator">to</span>
              <input 
                type="date" 
                className="date-input" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Filter Action Buttons */}
            <button className="filter-submit-btn" onClick={handleApplyFilter}>
              <Filter size={16} />
              <span>Filter</span>
            </button>

            <button className="filter-reset-btn" onClick={handleResetFilter} title="Reset Filter">
              <RotateCcw size={16} />
            </button>

            {/* Booking Details Option Right Side of Filter */}
            <button 
              className={`booking-details-toggle-btn ${selectedBooking ? 'active' : ''}`}
              onClick={() => {
                if (selectedBooking) {
                  setSelectedBooking(null);
                } else if (currentTableData.length > 0) {
                  setSelectedBooking(currentTableData[0]);
                }
              }}
            >
              <FileText size={16} />
              <span>Booking Details</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="table-card">
            <div className="table-responsive">
              <table className="br-table">
                <thead>
                  <tr>
                    <th>BOOKING ID</th>
                    <th>CUSTOMER</th>
                    <th>VEHICLE</th>
                    <th>PICKUP & DROP</th>
                    <th>DATES</th>
                    <th>STATUS</th>
                    <th>AMOUNT</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTableData.length > 0 ? (
                    currentTableData.map((row) => (
                      <tr key={row.id} className={selectedBooking?.id === row.id ? 'row-selected' : ''}>
                        <td className="font-bold">{row.id}</td>
                        <td>
                          <div className="customer-cell">
                            <span className="customer-name">{row.customer.name}</span>
                            <span className="sub-text">{row.customer.email}</span>
                            <span className="sub-text">{row.customer.phone}</span>
                          </div>
                        </td>
                        <td>
                          <div className="vehicle-cell">
                            <img src={row.vehicle.image} alt={row.vehicle.name} className="car-thumb" />
                            <div>
                              <span className="vehicle-name">{row.vehicle.name}</span>
                              <span className="sub-text">{row.vehicle.type}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="location-cell">
                            <div><MapPin size={12} className="pin-icon" /> {row.pickup}</div>
                            <div><MapPin size={12} className="pin-icon" /> {row.drop}</div>
                          </div>
                        </td>
                        <td>
                          <div className="dates-cell">
                            <span>{row.dates.split(' - ')[0]}</span>
                            <span>{row.dates.split(' - ')[1]}</span>
                            <span className="sub-text">{row.duration}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-${row.status.toLowerCase()}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="font-bold">{row.amount}</td>
                        <td>
                          <div className="action-buttons-group">
                            {/* Three Dot Options Dropdown */}
                            <div className="dropdown-container">
                              <button 
                                className="action-icon-btn"
                                onClick={() => setActiveDropdownId(activeDropdownId === row.id ? null : row.id)}
                              >
                                <MoreVertical size={18} />
                              </button>

                              {activeDropdownId === row.id && (
                                <div className="status-dropdown-menu">
                                  <button onClick={() => updateStatus(row.id, 'Pending')}>Set Pending</button>
                                  <button onClick={() => updateStatus(row.id, 'Confirmed')}>Set Confirmed</button>
                                  <button onClick={() => updateStatus(row.id, 'Cancelled')}>Set Cancelled</button>
                                  <div className="dropdown-divider"></div>
                                  <button className="text-red-option" onClick={() => handleDeleteRow(row.id)}>
                                    <Trash2 size={12} /> Delete Booking
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* View Eye Icon */}
                            <button 
                              className="action-icon-btn view-btn" 
                              onClick={() => setSelectedBooking(row)}
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="no-data">No bookings found matching your filter criteria</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cleaned Pagination Footer */}
            <div className="br-footer">
              <span className="entries-info">
                Showing {filteredBookings.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} entries
              </span>

              <div className="pagination-controls">
                <button 
                  className="page-nav" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page} 
                    className={`page-num ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  className="page-nav" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                >
                  <ChevronRight size={16} />
                </button>

                <select className="page-size-select" defaultValue="6">
                  <option value="6">6 / page</option>
                  <option value="10">10 / page</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side Part - Booking Details Sidebar */}
        {selectedBooking && (
          <div className="br-details-sidebar">
            <div className="details-header">
              <h3>Booking Details</h3>
              <button className="close-btn" onClick={() => setSelectedBooking(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="details-id-row">
              <h4>{selectedBooking.id}</h4>
              <span className={`badge badge-${selectedBooking.status.toLowerCase()}`}>
                {selectedBooking.status}
              </span>
            </div>
            <p className="booked-on">Booked on {selectedBooking.bookedOn}</p>

            <div className="details-scrollable-content">
              {/* Customer Info */}
              <div className="details-section">
                <div className="section-title">
                  <User size={16} />
                  <span>Customer Information</span>
                </div>
                <div className="info-grid">
                  <div><span>Name</span><strong>{selectedBooking.customer.name}</strong></div>
                  <div><span>Email</span><strong>{selectedBooking.customer.email}</strong></div>
                  <div><span>Phone</span><strong>{selectedBooking.customer.phone}</strong></div>
                  <div><span>License No.</span><strong>{selectedBooking.customer.license}</strong></div>
                  <div><span>Address</span><strong>{selectedBooking.customer.address}</strong></div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="details-section">
                <div className="section-title">
                  <Car size={16} />
                  <span>Vehicle Information</span>
                </div>
                <div className="vehicle-details-card">
                  <img src={selectedBooking.vehicle.image} alt={selectedBooking.vehicle.name} />
                  <div>
                    <strong>{selectedBooking.vehicle.name}</strong>
                    <p>{selectedBooking.vehicle.type}</p>
                  </div>
                </div>
                <div className="info-grid horizontal">
                  <div><span>Year</span><strong>{selectedBooking.vehicle.year}</strong></div>
                  <div><span>Transmission</span><strong>{selectedBooking.vehicle.transmission}</strong></div>
                  <div><span>Fuel Type</span><strong>{selectedBooking.vehicle.fuel}</strong></div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="details-section">
                <div className="section-title">
                  <MapPin size={16} />
                  <span>Trip Details</span>
                </div>
                <div className="info-grid">
                  <div><span>Pickup Location</span><strong>{selectedBooking.pickup}</strong></div>
                  <div><span>Drop-off Location</span><strong>{selectedBooking.drop}</strong></div>
                  <div><span>Pickup Date</span><strong>{selectedBooking.pickupDate}</strong></div>
                  <div><span>Drop-off Date</span><strong>{selectedBooking.dropoffDate}</strong></div>
                  <div><span>Duration</span><strong>{selectedBooking.duration}</strong></div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="details-section">
                <div className="section-title">
                  <Calendar size={16} />
                  <span>Payment Information</span>
                </div>
                <div className="info-grid">
                  <div><span>Total Amount</span><strong>{selectedBooking.amount}</strong></div>
                  <div><span>Payment Method</span><strong>{selectedBooking.paymentMethod}</strong></div>
                  <div>
                    <span>Payment Status</span>
                    <strong className={selectedBooking.paymentStatus === 'Paid' ? 'text-green' : 'text-red'}>
                      {selectedBooking.paymentStatus}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-actions">
              <button 
                className="btn-confirm-full"
                onClick={() => updateStatus(selectedBooking.id, 'Confirmed')}
              >
                Confirm Booking
              </button>
              <button 
                className="btn-reject-outline"
                onClick={() => updateStatus(selectedBooking.id, 'Cancelled')}
              >
                Reject Request
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingRequest;