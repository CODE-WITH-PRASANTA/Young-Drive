import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  Upload, 
  Send, 
  CheckCircle, 
  Calendar, 
  Car, 
  ThumbsUp, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  User,
  Mail,
  Tag,
  Edit3,
  X
} from 'lucide-react';
import './Testimonial.css';

const API_BASE_URL = 'http://localhost:5000/api/reviews';

const Testimonial = () => {
  const [reviews, setReviews] = useState([]);

  // Form States
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination & Sorting States
  const [sortOption, setSortOption] = useState('Most Recent');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const fetchApprovedReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/approved`);
      const data = await response.json();
      if (response.ok) {
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  const totalReviewsCount = reviews.length;

  const averageScore = useMemo(() => {
    if (reviews.length === 0) return '0.0';
    const total = reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const ratingBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rVal = Math.round(Number(r.rating) || 0);
      if (counts[rVal] !== undefined) counts[rVal]++;
    });

    return [5, 4, 3, 2, 1].map(stars => {
      const count = counts[stars];
      const percent = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
      return { stars, count, percent };
    });
  }, [reviews, totalReviewsCount]);

  const sortedReviews = useMemo(() => {
    let sorted = [...reviews];
    if (sortOption === 'Highest Rated') {
      sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortOption === 'Lowest Rated') {
      sorted.sort((a, b) => Number(a.rating) - Number(b.rating));
    } else {
      sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return sorted;
  }, [reviews, sortOption]);

  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage) || 1;
  const currentReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedReviews, currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const MAX_FILE_SIZE = 3 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert('Image file size exceeds 3MB limit.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedPhotos([reader.result]);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setUploadedPhotos([]);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const numericRating = Number(rating);

    if (!numericRating || numericRating < 1 || numericRating > 5) {
      alert('Please select a star rating between 1 and 5 stars!');
      return;
    }

    if (!name.trim() || !email.trim() || !title.trim() || !reviewText.trim()) {
      alert('Please fill out all required fields!');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customerName: name.trim(),
      customerEmail: email.trim(),
      vehicleName: 'Toyota Camry',
      vehicleType: 'Sedan',
      rating: numericRating,
      title: title.trim(),
      reviewText: reviewText.trim(),
      image: uploadedPhotos.length > 0 ? uploadedPhotos[0] : null
    };

    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Thank you! Your review has been submitted and is currently pending admin approval.');
        setRating(0);
        setName('');
        setEmail('');
        setTitle('');
        setReviewText('');
        setUploadedPhotos([]);
      } else {
        const errorDetail = data.details ? data.details.join(', ') : (data.message || 'Validation error');
        alert(`Submission Failed: ${errorDetail}`);
      }
    } catch (error) {
      alert('Unable to connect to backend server. Make sure node server.js is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="testimonial-section-wrapper">
      <div className="testimonial-container">
        <div className="testimonial-left-panel">
          <div className="left-panel-header">
            <div className="icon-badge">
              <Edit3 size={18} className="badge-icon" />
            </div>
            <div>
              <h2 className="panel-title">Write a Review</h2>
              <p className="panel-subtitle">Share your experience with this vehicle</p>
            </div>
          </div>

          <form onSubmit={handleSubmitReview} className="testimonial-form">
            <div className="form-group">
              <label className="field-label">Overall Rating *</label>
              <div className="star-picker">
                {[1, 2, 3, 4, 5].map((starIndex) => {
                  const activeStar = starIndex <= (hoverRating || rating);
                  return (
                    <button
                      type="button"
                      key={starIndex}
                      className={`star-btn ${activeStar ? 'active' : ''}`}
                      onClick={() => setRating(starIndex)}
                      onMouseEnter={() => setHoverRating(starIndex)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        size={22}
                        fill={activeStar ? '#059669' : 'none'}
                        color={activeStar ? '#059669' : '#d1d5db'}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="rating-hint">
                {rating > 0 ? `${rating} of 5 stars selected` : 'Click to rate'}
              </span>
            </div>

            <div className="form-group">
              <label className="field-label">Your Name *</label>
              <div className="input-icon-wrapper">
                <User size={16} className="field-icon" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">Your Email *</label>
              <div className="input-icon-wrapper">
                <Mail size={16} className="field-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">Review Title *</label>
              <div className="input-icon-wrapper">
                <Tag size={16} className="field-icon" />
                <input
                  type="text"
                  placeholder="Summarize your experience"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">Your Review *</label>
              <textarea
                rows="3"
                maxLength="500"
                placeholder="Share your detailed experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              ></textarea>
              <div className="char-count">{reviewText.length}/500</div>
            </div>

            <div className="form-group">
              <label className="field-label">Add Photo (Optional, Max 3MB)</label>
              <label className="upload-dropzone">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <Upload size={18} className="upload-icon" />
                <span className="upload-title">Click to upload photo</span>
                <span className="upload-sub">JPG, PNG up to 3MB</span>
              </label>

              {uploadedPhotos.length > 0 && (
                <div className="photo-previews-grid">
                  <div className="preview-item">
                    <img src={uploadedPhotos[0]} alt="Uploaded Preview" />
                    <button type="button" onClick={removePhoto}>
                      <X size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="submit-review-btn" disabled={isSubmitting}>
              <Send size={16} />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
            </button>
          </form>
        </div>

        <div className="testimonial-right-panel">
          <div className="right-panel-header">
            <h2 className="panel-title">Customer Reviews</h2>
            <div className="sort-dropdown-container">
              <div className="sort-select-wrapper">
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option value="Most Recent">Most Recent</option>
                  <option value="Highest Rated">Highest Rated</option>
                  <option value="Lowest Rated">Lowest Rated</option>
                </select>
                <ChevronDown size={14} className="sort-chevron" />
              </div>
            </div>
          </div>

          <div className="rating-summary-card">
            <div className="score-box">
              <div className="score-number">{averageScore}</div>
              <div className="score-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} fill="#059669" color="#059669" />
                ))}
              </div>
              <p className="based-count">Based on {totalReviewsCount} approved reviews</p>
            </div>

            <div className="breakdown-bars">
              {ratingBreakdown.map((row) => (
                <div key={row.stars} className="bar-row">
                  <span className="bar-label">{row.stars} Stars</span>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${row.percent}%` }}></div>
                  </div>
                  <span className="bar-count">{row.count}</span>
                </div>
              ))}
            </div>

            <div className="recommendation-box">
              <div className="thumbs-badge">
                <ThumbsUp size={20} className="thumb-icon" />
              </div>
              <div className="recommend-percent">98%</div>
              <p className="recommend-text">of customers recommend this vehicle</p>
            </div>
          </div>

          <div className="reviews-list">
            {currentReviews.length > 0 ? (
              currentReviews.map((rev) => {
                const initials = rev.customerName
                  ? rev.customerName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                  : 'U';

                return (
                  <div key={rev._id || rev.id} className="review-card">
                    <div className="review-card-main">
                      <div className="avatar-circle" style={{ backgroundColor: '#d1fae5', color: '#047857' }}>
                        {initials}
                      </div>

                      <div className="review-details">
                        <div className="review-author-line">
                          <span className="author-name">{rev.customerName || 'Anonymous'}</span>
                          {rev.verified !== false && (
                            <span className="verified-tag">
                              <CheckCircle size={12} /> Verified Buyer
                            </span>
                          )}
                        </div>

                        <div className="review-stars-line">
                          <div className="stars-group">
                            {[1, 2, 3, 4, 5].map((st) => (
                              <Star
                                key={st}
                                size={14}
                                fill={st <= Number(rev.rating) ? '#059669' : 'none'}
                                color={st <= Number(rev.rating) ? '#059669' : '#d1d5db'}
                              />
                            ))}
                          </div>
                          <span className="rating-numeric">{Number(rev.rating || 0).toFixed(1)}</span>
                        </div>

                        <h4 className="review-title">{rev.title}</h4>
                        <p className="review-comment">{rev.reviewText}</p>

                        <div className="review-meta-line">
                          <span className="meta-item">
                            <Calendar size={13} /> {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                          <span className="meta-divider">•</span>
                          <span className="meta-item">
                            <Car size={13} /> {rev.vehicleName || 'Toyota Camry'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {rev.image && (
                      <div className="review-media-box">
                        <img src={rev.image} alt="Vehicle Attachment" />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                No approved reviews found yet. Be the first to submit one!
              </div>
            )}
          </div>

          <div className="pagination-bar">
            <div className="page-buttons">
              <button 
                type="button"
                className="page-nav-btn" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  type="button"
                  key={index + 1}
                  className={`page-num ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button 
                type="button"
                className="page-nav-btn" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="per-page-select-wrapper">
              <select defaultValue="3 per page">
                <option value="3 per page">3 per page</option>
              </select>
              <ChevronDown size={14} className="per-page-chevron" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;