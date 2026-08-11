import React, { useState, useMemo } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiEye, 
  FiStar, 
  FiChevronLeft, 
  FiChevronRight 
} from 'react-icons/fi';
import './Reviews.css';

const initialReviews = [
  { 
    id: 'REV1258', 
    customerName: 'John Doe', 
    customerEmail: 'john@gmail.com', 
    vehicleName: 'BMW 5 Series', 
    vehicleType: 'Sedan', 
    rating: 5, 
    reviewText: 'Excellent car and very smooth booking experience. The car was clean...', 
    date: '20 May 2025, 10:30 AM', 
    status: 'Pending' 
  },
  { 
    id: 'REV1257', 
    customerName: 'Sarah Smith', 
    customerEmail: 'sarah@gmail.com', 
    vehicleName: 'Volvo S60', 
    vehicleType: 'Sedan', 
    rating: 4, 
    reviewText: 'Great service and nice car. Only suggestion is to improve pickup time.', 
    date: '19 May 2025, 04:15 PM', 
    status: 'Approved' 
  },
  { 
    id: 'REV1256', 
    customerName: 'Michael Johnson', 
    customerEmail: 'michael@gmail.com', 
    vehicleName: 'Audi Q7', 
    vehicleType: 'SUV', 
    rating: 5, 
    reviewText: 'Amazing experience! Will definitely rent again. Highly recommended.', 
    date: '19 May 2025, 11:20 AM', 
    status: 'Pending' 
  },
  { 
    id: 'REV1255', 
    customerName: 'Emily Davis', 
    customerEmail: 'emily@gmail.com', 
    vehicleName: 'Lexus IS 300h', 
    vehicleType: 'Sedan', 
    rating: 3, 
    reviewText: 'Car was good but had minor cleanliness issues.', 
    date: '18 May 2025, 09:10 AM', 
    status: 'Rejected' 
  },
  { 
    id: 'REV1254', 
    customerName: 'Alex Turner', 
    customerEmail: 'alex@gmail.com', 
    vehicleName: 'Mercedes C-Class', 
    vehicleType: 'Sedan', 
    rating: 5, 
    reviewText: 'Outstanding vehicle and prompt support team.', 
    date: '17 May 2025, 02:00 PM', 
    status: 'Approved' 
  }
];

const Reviews = () => {
  const [reviewsData, setReviewsData] = useState(initialReviews);
  const [activeTab, setActiveTab] = useState('All Reviews');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const itemsPerPage = 4;

  const pendingCount = reviewsData.filter(r => r.status === 'Pending').length;

  const filteredReviews = useMemo(() => {
    return reviewsData.filter((review) => {
      const matchesTab = 
        activeTab === 'All Reviews' || 
        review.status.toLowerCase() === activeTab.toLowerCase();
      
      const matchesSearch = 
        review.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.vehicleName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [reviewsData, activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const currentTableData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleStatusChange = (id, newStatus) => {
    setReviewsData(prev => 
      prev.map(item => item.id === id ? { ...item, status: newStatus } : item)
    );
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Review ID,Customer,Vehicle,Rating,Review,Date,Status"]
      .concat(filteredReviews.map(e => `${e.id},${e.customerName},${e.vehicleName},${e.rating},"${e.reviewText}",${e.date},${e.status}`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customer_reviews.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="reviews-container">
      <div className="reviews-header-wrapper">
        <div className="reviews-title-group">
          <h1 className="reviews-title">Reviews</h1>
          <p className="reviews-subtitle">Manage customer reviews and approvals</p>
        </div>
        <button className="reviews-export-btn" onClick={handleExport}>
          <FiDownload /> Export
        </button>
      </div>

      <div className="reviews-controls-bar">
        <div className="reviews-tabs">
          {[
            { name: 'All Reviews' },
            { name: 'Pending', count: pendingCount },
            { name: 'Approved' },
            { name: 'Rejected' }
          ].map((tab) => (
            <button
              key={tab.name}
              type="button"
              className={`reviews-tab-btn ${activeTab === tab.name ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.name)}
            >
              {tab.name}
              {tab.count > 0 && <span className="reviews-tab-badge-count">{tab.count}</span>}
            </button>
          ))}
        </div>

        <div className="reviews-search-filter-group">
          <div className="reviews-search-box">
            <FiSearch className="reviews-search-icon" />
            <input
              type="text"
              placeholder="Search by customer, vehicle, rating..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="reviews-search-input"
            />
          </div>
          <button 
            type="button"
            className={`reviews-filter-btn ${showFilterDropdown ? 'active' : ''}`}
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      {showFilterDropdown && (
        <div className="reviews-filter-dropdown">
          <p><strong>Quick Filter:</strong></p>
          <div className="reviews-filter-chips">
            <span onClick={() => { setActiveTab('All Reviews'); setShowFilterDropdown(false); }}>Show All</span>
            <span onClick={() => { setActiveTab('Pending'); setShowFilterDropdown(false); }}>Show Pending Only</span>
          </div>
        </div>
      )}

      <div className="reviews-table-container">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>Review ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentTableData.length > 0 ? (
              currentTableData.map((rev) => (
                <tr key={rev.id}>
                  <td className="reviews-id">{rev.id}</td>
                  <td>
                    <div className="reviews-customer-info">
                      <div className="reviews-avatar-placeholder">
                        {rev.customerName.charAt(0)}
                      </div>
                      <div className="reviews-customer-text">
                        <span className="reviews-customer-name">{rev.customerName}</span>
                        <span className="reviews-customer-email">{rev.customerEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="reviews-vehicle-info">
                      <span className="reviews-vehicle-name">{rev.vehicleName}</span>
                      <span className="reviews-vehicle-type">{rev.vehicleType}</span>
                    </div>
                  </td>
                  <td>
                    <div className="reviews-stars">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={`reviews-star-icon ${i < rev.rating ? 'filled' : ''}`} 
                        />
                      ))}
                    </div>
                  </td>
                  <td className="reviews-text-cell" title={rev.reviewText}>
                    {rev.reviewText}
                  </td>
                  <td className="reviews-date">
                    <div>{rev.date.split(',')[0]}</div>
                    <div className="reviews-time">{rev.date.split(',')[1]}</div>
                  </td>
                  <td>
                    <span className={`reviews-status-badge ${rev.status.toLowerCase()}`}>
                      {rev.status}
                    </span>
                  </td>
                  <td>
                    <div className="reviews-action-buttons">
                      {rev.status === 'Pending' ? (
                        <>
                          <button 
                            type="button"
                            className="reviews-approve-btn"
                            onClick={() => handleStatusChange(rev.id, 'Approved')}
                          >
                            Approve
                          </button>
                          <button 
                            type="button"
                            className="reviews-reject-btn"
                            onClick={() => handleStatusChange(rev.id, 'Rejected')}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="reviews-action-done">
                          {rev.status}
                        </span>
                      )}
                      <button 
                        type="button"
                        className="reviews-view-btn"
                        onClick={() => setSelectedReview(rev)}
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="reviews-no-data">No reviews found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="reviews-pagination-footer">
        <div className="reviews-pagination-info">
          Showing {filteredReviews.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredReviews.length)} of {filteredReviews.length} entries
        </div>
        <div className="reviews-pagination-controls">
          <button 
            type="button"
            className="reviews-page-nav-btn"
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
                  type="button"
                  className={`reviews-page-number-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
              return <span key={pageNum} className="reviews-page-dots">...</span>;
            }
            return null;
          })}

          <button 
            type="button"
            className="reviews-page-nav-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {selectedReview && (
        <div className="reviews-modal-overlay" onClick={() => setSelectedReview(null)}>
          <div className="reviews-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Review Details ({selectedReview.id})</h3>
            <div className="reviews-modal-body">
              <p><strong>Customer:</strong> {selectedReview.customerName} ({selectedReview.customerEmail})</p>
              <p><strong>Vehicle:</strong> {selectedReview.vehicleName} - {selectedReview.vehicleType}</p>
              <p><strong>Rating:</strong> {selectedReview.rating} Stars</p>
              <p><strong>Review:</strong> "{selectedReview.reviewText}"</p>
              <p><strong>Date:</strong> {selectedReview.date}</p>
              <p><strong>Status:</strong> {selectedReview.status}</p>
            </div>
            <button type="button" className="reviews-modal-close-btn" onClick={() => setSelectedReview(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;