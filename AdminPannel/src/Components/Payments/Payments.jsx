import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  FiCreditCard, 
  FiDollarSign, 
  FiCheckCircle, 
  FiRotateCcw, 
  FiClock, 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiCalendar, 
  FiEye, 
  FiChevronLeft, 
  FiChevronRight 
} from 'react-icons/fi';
import './Payments.css';

const initialTransactions = [
  { id: 'TXN125487', bookingId: 'BK1258', customerName: 'John Doe', customerEmail: 'john@gmail.com', amount: 120.00, method: 'Credit Card', details: '•••• 4242', brand: 'visa', status: 'Successful', date: '20 May 2025, 10:30 AM' },
  { id: 'TXN125486', bookingId: 'BK1257', customerName: 'Sarah Smith', customerEmail: 'sarah@gmail.com', amount: 95.00, method: 'UPI', details: 'Google Pay', brand: 'google', status: 'Successful', date: '19 May 2025, 04:15 PM' },
  { id: 'TXN125485', bookingId: 'BK1256', customerName: 'Michael Johnson', customerEmail: 'michael@gmail.com', amount: 110.00, method: 'Debit Card', details: '•••• 5555', brand: 'mastercard', status: 'Successful', date: '19 May 2025, 11:20 AM' },
  { id: 'TXN125484', bookingId: 'BK1255', customerName: 'Emily Davis', customerEmail: 'emily@gmail.com', amount: 105.00, method: 'PayPal', details: 'PayPal', brand: 'paypal', status: 'Pending', date: '18 May 2025, 09:10 AM' },
  { id: 'TXN125483', bookingId: 'BK1254', customerName: 'David Wilson', customerEmail: 'david@gmail.com', amount: 80.00, method: 'UPI', details: 'PhonePe', brand: 'phonepe', status: 'Failed', date: '18 May 2025, 02:45 PM' },
  { id: 'TXN125482', bookingId: 'BK1253', customerName: 'Lisa Brown', customerEmail: 'lisa@gmail.com', amount: 130.00, method: 'Credit Card', details: '•••• 1111', brand: 'visa', status: 'Refunded', date: '17 May 2025, 05:30 PM' },
  { id: 'TXN125481', bookingId: 'BK1252', customerName: 'Alex Turner', customerEmail: 'alex@gmail.com', amount: 150.00, method: 'Credit Card', details: '•••• 9999', brand: 'visa', status: 'Successful', date: '16 May 2025, 01:00 PM' },
];

const Payments = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState('01 May 2025 - 20 May 2025');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const calendarRef = useRef(null);
  const itemsPerPage = 6;

  // Close calendar popup on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter((txn) => {
      const matchesTab = activeTab === 'All' || txn.status.toLowerCase() === activeTab.toLowerCase();
      const matchesSearch = 
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const currentTableData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Transaction ID,Booking ID,Customer,Amount,Status,Date"]
      .concat(filteredTransactions.map(e => `${e.id},${e.bookingId},${e.customerName},${e.amount},${e.status},${e.date}`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payments_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="payments-container">
      {/* Header Section */}
      <div className="payments-header-wrapper">
        <div className="payments-title-group">
          <h1 className="payments-title">Payments</h1>
          <p className="payments-subtitle">Manage all transactions and payments</p>
        </div>
        <div className="payments-header-actions" ref={calendarRef}>
          <div className="payments-date-picker" onClick={() => setShowCalendar(!showCalendar)}>
            <FiCalendar className="payments-date-icon" />
            <span className="payments-date-display">{dateRange}</span>
          </div>

          {/* Interactive Small Calendar Popup */}
          {showCalendar && (
            <div className="payments-calendar-popup">
              <div className="payments-calendar-header">
                <span>May 2025</span>
              </div>
              <div className="payments-calendar-grid">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <span key={d} className="payments-cal-day-name">{d}</span>
                ))}
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const isSelected = day >= 1 && day <= 20;
                  return (
                    <button 
                      key={day} 
                      className={`payments-cal-day ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setDateRange(`${day < 10 ? '0' + day : day} May 2025 - 20 May 2025`);
                        setShowCalendar(false);
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button className="payments-export-btn" onClick={handleExport}>
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="payments-stats-grid">
        <div className="payments-stat-card">
          <div className="payments-stat-content">
            <span className="payments-stat-label">Total Transactions</span>
            <h2 className="payments-stat-value">342</h2>
          </div>
          <div className="payments-stat-icon-box payments-purple">
            <FiCreditCard />
          </div>
        </div>

        <div className="payments-stat-card">
          <div className="payments-stat-content">
            <span className="payments-stat-label">Total Amount</span>
            <h2 className="payments-stat-value">$ 28,650.00</h2>
          </div>
          <div className="payments-stat-icon-box payments-green">
            <FiDollarSign />
          </div>
        </div>

        <div className="payments-stat-card">
          <div className="payments-stat-content">
            <span className="payments-stat-label">Successful Payments</span>
            <h2 className="payments-stat-value">298</h2>
          </div>
          <div className="payments-stat-icon-box payments-green">
            <FiCheckCircle />
          </div>
        </div>

        <div className="payments-stat-card">
          <div className="payments-stat-content">
            <span className="payments-stat-label">Refunds</span>
            <h2 className="payments-stat-value">$ 2,450.00</h2>
          </div>
          <div className="payments-stat-icon-box payments-pink">
            <FiRotateCcw />
          </div>
        </div>

        <div className="payments-stat-card">
          <div className="payments-stat-content">
            <span className="payments-stat-label">Pending Payments</span>
            <h2 className="payments-stat-value">18</h2>
          </div>
          <div className="payments-stat-icon-box payments-yellow">
            <FiClock />
          </div>
        </div>
      </div>

      {/* Controls Section (Tabs & Search) */}
      <div className="payments-controls-bar">
        <div className="payments-tabs">
          {['All', 'Successful', 'Pending', 'Failed', 'Refunded'].map((tab) => (
            <button
              key={tab}
              className={`payments-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="payments-filter-search-group">
          <div className="payments-search-box">
            <FiSearch className="payments-search-icon" />
            <input
              type="text"
              placeholder="Search by transaction ID, customer, booking ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="payments-search-input"
            />
          </div>
          <button 
            className={`payments-filter-btn ${showFilterModal ? 'active' : ''}`}
            onClick={() => setShowFilterModal(!showFilterModal)}
          >
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      {showFilterModal && (
        <div className="payments-filter-dropdown">
          <p><strong>Quick Filters:</strong></p>
          <div className="payments-filter-chips">
            <span onClick={() => { setActiveTab('All'); setShowFilterModal(false); }}>Reset Filters</span>
            <span onClick={() => { setSearchQuery('John'); setShowFilterModal(false); }}>Customer: John Doe</span>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentTableData.length > 0 ? (
              currentTableData.map((txn) => (
                <tr key={txn.id}>
                  <td className="payments-txn-id">{txn.id}</td>
                  <td className="payments-booking-id">{txn.bookingId}</td>
                  <td>
                    <div className="payments-customer-info">
                      <span className="payments-customer-name">{txn.customerName}</span>
                      <span className="payments-customer-email">{txn.customerEmail}</span>
                    </div>
                  </td>
                  <td className="payments-amount">${txn.amount.toFixed(2)}</td>
                  <td>
                    <div className="payments-method-info">
                      <span className={`payments-brand-badge ${txn.brand}`}>
                        {txn.brand.toUpperCase()}
                      </span>
                      <div className="payments-method-text">
                        <span className="payments-method-name">{txn.method}</span>
                        <span className="payments-method-details">{txn.details}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`payments-status-badge ${txn.status.toLowerCase()}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="payments-date">{txn.date}</td>
                  <td>
                    <button 
                      className="payments-action-view-btn"
                      onClick={() => setSelectedTxn(txn)}
                    >
                      <FiEye /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="payments-no-data">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Footer Info */}
      <div className="payments-pagination-footer">
        <div className="payments-pagination-info">
          Showing {filteredTransactions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} entries
        </div>
        <div className="payments-pagination-controls">
          <button 
            className="payments-page-nav-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </button>
          
          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
              return (
                <button
                  key={pageNum}
                  className={`payments-page-number-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
              return <span key={pageNum} className="payments-page-dots">...</span>;
            }
            return null;
          })}

          <button 
            className="payments-page-nav-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Action View Modal */}
      {selectedTxn && (
        <div className="payments-modal-overlay" onClick={() => setSelectedTxn(null)}>
          <div className="payments-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Transaction Details</h3>
            <div className="payments-modal-body">
              <p><strong>Transaction ID:</strong> {selectedTxn.id}</p>
              <p><strong>Booking ID:</strong> {selectedTxn.bookingId}</p>
              <p><strong>Customer:</strong> {selectedTxn.customerName} ({selectedTxn.customerEmail})</p>
              <p><strong>Amount:</strong> ${selectedTxn.amount.toFixed(2)}</p>
              <p><strong>Payment Method:</strong> {selectedTxn.method} ({selectedTxn.details})</p>
              <p><strong>Status:</strong> {selectedTxn.status}</p>
              <p><strong>Date:</strong> {selectedTxn.date}</p>
            </div>
            <button className="payments-modal-close-btn" onClick={() => setSelectedTxn(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;