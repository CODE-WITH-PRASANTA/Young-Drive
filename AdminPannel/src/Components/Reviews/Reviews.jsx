import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiEye, 
  FiStar, 
  FiChevronLeft, 
  FiChevronRight,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiX
} from 'react-icons/fi';
import './Reviews.css';

const API_BASE_URL = 'http://localhost:5000/api/reviews';

const Reviews = () => {
  const [reviewsData, setReviewsData] = useState([]);
  const [activeTab, setActiveTab] = useState('All Reviews');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 4;

  // Fetch all reviews from backend database
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/all`);
      const data = await response.json();
      if (response.ok) {
        setReviewsData(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch reviews:', data.message);
      }
    } catch (error) {
      console.error('Error connecting to server:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Compute pending badge count
  const pendingCount = useMemo(() => {
    return reviewsData.filter(r => r.status === 'Pending').length;
  }, [reviewsData]);

  // Filter reviews by Tab and Search Query
  const filteredReviews = useMemo(() => {
    return reviewsData.filter((review) => {
      const matchesTab = 
        activeTab === 'All Reviews' || 
        (review.status && review.status.toLowerCase() === activeTab.toLowerCase());
      
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        (review._id && review._id.toLowerCase().includes(searchLower)) ||
        (review.customerName && review.customerName.toLowerCase().includes(searchLower)) ||
        (review.customerEmail && review.customerEmail.toLowerCase().includes(searchLower)) ||
        (review.vehicleName && review.vehicleName.toLowerCase().includes(searchLower)) ||
        (review.title && review.title.toLowerCase().includes(searchLower));

      return matchesTab && matchesSearch;
    });
  }, [reviewsData, activeTab, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const currentTableData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Status Change Logic (Approve / Reject)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (response.ok) {
        fetchReviews(); // Refresh table data
      } else {
        alert(`Failed to update status: ${data.message}`);
      }
    } catch (error) {
      console.error('Failed to update review status:', error);
      alert('Error connecting to backend server.');
    }
  };

  // Delete Review Logic
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently remove this review?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchReviews();
      } else {
        alert('Failed to delete review.');
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  // Edit Form Submit Logic
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/${editingReview._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingReview)
      });

      if (response.ok) {
        setEditingReview(null);
        fetchReviews();
      } else {
        alert('Failed to save changes.');
      }
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  // Export to CSV Logic
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Customer Name,Customer Email,Vehicle Name,Rating,Title,Review Text,Status,Date"]
      .concat(filteredReviews.map(e => 
        `"${e._id}","${e.customerName}","${e.customerEmail}","${e.vehicleName}",${e.rating},"${e.title}","${e.reviewText}","${e.status}","${new Date(e.createdAt).toLocaleDateString()}"`
      ))
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
      {/* HEADER SECTION */}
      <div className="reviews-header-wrapper">
        <div className="reviews-title-group">
          <h1 className="reviews-title">Reviews</h1>
          <p className="reviews-subtitle">Manage customer reviews, approvals, and moderations</p>
        </div>
        <button className="reviews-export-btn" onClick={handleExport}>
          <FiDownload /> Export CSV
        </button>
      </div>

      {/* CONTROLS BAR: TABS AND SEARCH */}
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
              placeholder="Search by customer, vehicle, or title..."
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

      {/* FILTER DROPDOWN */}
      {showFilterDropdown && (
        <div className="reviews-filter-dropdown">
          <p><strong>Quick Filter:</strong></p>
          <div className="reviews-filter-chips">
            <span onClick={() => { setActiveTab('All Reviews'); setShowFilterDropdown(false); }}>Show All</span>
            <span onClick={() => { setActiveTab('Pending'); setShowFilterDropdown(false); }}>Show Pending Only</span>
          </div>
        </div>
      )}

      {/* TABLE SECTION */}
      <div className="reviews-table-container">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Rating</th>
              <th>Review Text</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="reviews-no-data">Loading reviews...</td>
              </tr>
            ) : currentTableData.length > 0 ? (
              currentTableData.map((rev) => (
                <tr key={rev._id}>
                  <td className="reviews-id">#{rev._id ? rev._id.substring(rev._id.length - 6) : 'N/A'}</td>
                  <td>
                    <div className="reviews-customer-info">
                      <div className="reviews-avatar-placeholder">
                        {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="reviews-customer-text">
                        <span className="reviews-customer-name">{rev.customerName}</span>
                        <span className="reviews-customer-email">{rev.customerEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="reviews-vehicle-info">
                      <span className="reviews-vehicle-name">{rev.vehicleName || 'Toyota Camry'}</span>
                      <span className="reviews-vehicle-type">{rev.vehicleType || 'Sedan'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="reviews-stars">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={`reviews-star-icon ${i < Number(rev.rating) ? 'filled' : ''}`} 
                        />
                      ))}
                    </div>
                  </td>
                  <td className="reviews-text-cell" title={rev.reviewText}>
                    <strong>{rev.title}</strong>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>{rev.reviewText}</p>
                  </td>
                  <td className="reviews-date">
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <span className={`reviews-status-badge ${rev.status ? rev.status.toLowerCase() : 'pending'}`}>
                      {rev.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="reviews-action-buttons">
                      {/* APPROVE / REJECT OPTIONS FOR PENDING REVIEWS */}
                      {rev.status === 'Pending' ? (
                        <>
                          <button 
                            type="button"
                            className="reviews-approve-btn"
                            onClick={() => handleStatusChange(rev._id, 'Approved')}
                            title="Accept Review"
                          >
                            <FiCheck /> Approve
                          </button>
                          <button 
                            type="button"
                            className="reviews-reject-btn"
                            onClick={() => handleStatusChange(rev._id, 'Rejected')}
                            title="Reject Review"
                          >
                            <FiX /> Reject
                          </button>
                        </>
                      ) : (
                        <span className="reviews-action-done">
                          {rev.status}
                        </span>
                      )}

                      {/* VIEW DETAILS BUTTON */}
                      <button 
                        type="button"
                        className="reviews-view-btn"
                        onClick={() => setSelectedReview(rev)}
                        title="View Details"
                      >
                        <FiEye />
                      </button>

                      {/* EDIT BUTTON */}
                      <button 
                        type="button"
                        className="reviews-edit-btn"
                        onClick={() => setEditingReview(rev)}
                        title="Edit Review"
                      >
                        <FiEdit2 />
                      </button>

                      {/* DELETE BUTTON */}
                      <button 
                        type="button"
                        className="reviews-delete-btn"
                        onClick={() => handleDelete(rev._id)}
                        title="Delete Review"
                      >
                        <FiTrash2 />
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

      {/* PAGINATION FOOTER */}
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
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              type="button"
              className={`reviews-page-number-btn ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
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

      {/* VIEW DETAILS MODAL */}
      {selectedReview && (
        <div className="reviews-modal-overlay" onClick={() => setSelectedReview(null)}>
          <div className="reviews-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Review Details (#{selectedReview._id.substring(selectedReview._id.length - 6)})</h3>
            <div className="reviews-modal-body">
              <p><strong>Customer:</strong> {selectedReview.customerName} ({selectedReview.customerEmail})</p>
              <p><strong>Vehicle:</strong> {selectedReview.vehicleName} - {selectedReview.vehicleType}</p>
              <p><strong>Rating:</strong> {selectedReview.rating} Stars</p>
              <p><strong>Title:</strong> {selectedReview.title}</p>
              <p><strong>Review:</strong> "{selectedReview.reviewText}"</p>
              <p><strong>Date:</strong> {new Date(selectedReview.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedReview.status}</p>
              {selectedReview.image && (
                <div style={{ marginTop: '10px' }}>
                  <strong>Attached Photo:</strong><br />
                  <img src={selectedReview.image} alt="Attached review" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '8px', borderRadius: '6px' }} />
                </div>
              )}
            </div>
            <button type="button" className="reviews-modal-close-btn" onClick={() => setSelectedReview(null)}>Close</button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingReview && (
        <div className="reviews-modal-overlay" onClick={() => setEditingReview(null)}>
          <div className="reviews-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Review</h3>
            <form onSubmit={handleEditSubmit} className="reviews-edit-form">
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Customer Name:</label>
                <input 
                  type="text" 
                  value={editingReview.customerName || ''} 
                  onChange={(e) => setEditingReview({ ...editingReview, customerName: e.target.value })}
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Rating (1-5):</label>
                <input 
                  type="number" 
                  min="1" 
                  max="5" 
                  value={editingReview.rating || 5} 
                  onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Review Title:</label>
                <input 
                  type="text" 
                  value={editingReview.title || ''} 
                  onChange={(e) => setEditingReview({ ...editingReview, title: e.target.value })}
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Review Text:</label>
                <textarea 
                  rows="3" 
                  value={editingReview.reviewText || ''} 
                  onChange={(e) => setEditingReview({ ...editingReview, reviewText: e.target.value })}
                  required 
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button type="submit" className="reviews-approve-btn">Save Changes</button>
                <button type="button" className="reviews-modal-close-btn" onClick={() => setEditingReview(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;