import React, { useState } from 'react';
import { 
  FaCar, FaCloudUploadAlt, FaTimes, FaSave, FaUndo, 
  FaSearch, FaFilter, FaEdit, FaTrash, 
  FaBold, FaItalic, FaListUl, FaListOl, FaLink, FaImage, FaGasPump, FaCogs, FaUser,
  FaMapMarkerAlt, FaStar
} from 'react-icons/fa';
import './FeatureListing.css';

const initialListingList = [
  {
    id: 1,
    name: 'Volkswagen Golf GTD',
    location: 'Manchester, England',
    price: 6500,
    offerPrice: 6500,
    rating: 4.96,
    reviewsCount: 672,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seats: '7 seats',
    doors: '4 Doors',
    driveType: 'FWD',
    mileage: '25,100 miles',
    status: 'Active',
    order: 1,
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80'],
    shortDesc: 'Premium sedan with excellent fuel efficiency and comfort.',
    fullDesc: 'Detailed description about Volkswagen Golf GTD featured listing.'
  },
  {
    id: 2,
    name: 'Volvo S60 D4 R-Design',
    location: 'New South Wales, Australia',
    price: 7800,
    offerPrice: 7800,
    rating: 4.96,
    reviewsCount: 672,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seats: '7 seats',
    doors: '4 Doors',
    driveType: 'FWD',
    mileage: '25,100 miles',
    status: 'Active',
    order: 2,
    images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80'],
    shortDesc: 'Scandinavian luxury combined with dynamic performance.',
    fullDesc: 'Detailed description about Volvo S60 D4 R-Design.'
  },
  {
    id: 3,
    name: 'Jaguar XE 2.0d R-Sport',
    location: 'Manchester, England',
    price: 9000,
    offerPrice: 9000,
    rating: 4.96,
    reviewsCount: 672,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seats: '7 seats',
    doors: '4 Doors',
    driveType: 'FWD',
    mileage: '25,100 miles',
    status: 'Active',
    order: 3,
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80'],
    shortDesc: 'Agile sports sedan with breathtaking design.',
    fullDesc: 'Detailed description about Jaguar XE.'
  },
  {
    id: 4,
    name: 'Lexus IS 300h F Sport',
    location: 'Manchester, England',
    price: 8600,
    offerPrice: 8600,
    rating: 4.96,
    reviewsCount: 672,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seats: '7 seats',
    doors: '4 Doors',
    driveType: 'FWD',
    mileage: '25,100 miles',
    status: 'Active',
    order: 4,
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80'],
    shortDesc: 'Advanced self-charging hybrid with striking aesthetics.',
    fullDesc: 'Detailed description about Lexus IS 300h.'
  },
  {
    id: 5,
    name: 'BMW 320d M Sport',
    location: 'Birmingham, England',
    price: 8000,
    offerPrice: 8000,
    rating: 4.92,
    reviewsCount: 512,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seats: '7 seats',
    doors: '4 Doors',
    driveType: 'FWD',
    mileage: '25,100 miles',
    status: 'Active',
    order: 5,
    images: ['https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=400&q=80'],
    shortDesc: 'Dynamic sports sedan with high performance.',
    fullDesc: 'Detailed description about BMW 320d M Sport.'
  },
  {
    id: 6,
    name: 'Audi A4 35 TDI',
    location: 'London, England',
    price: 7000,
    offerPrice: 7000,
    rating: 4.91,
    reviewsCount: 421,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seats: '7 seats',
    doors: '4 Doors',
    driveType: 'FWD',
    mileage: '25,100 miles',
    status: 'Active',
    order: 6,
    images: ['https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=400&q=80'],
    shortDesc: 'Sophisticated executive business sedan.',
    fullDesc: 'Detailed description about Audi A4 35 TDI.'
  },
  {
    id: 7,
    name: 'Mercedes-Benz C220d',
    location: 'Manchester, England',
    price: 9800,
    offerPrice: 9800,
    rating: 4.97,
    reviewsCount: 892,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seats: '7 seats',
    doors: '4 Doors',
    driveType: 'FWD',
    mileage: '25,100 miles',
    status: 'Active',
    order: 7,
    images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=400&q=80'],
    shortDesc: 'Pure luxury and state-of-the-art cabin innovation.',
    fullDesc: 'Detailed description about Mercedes C220d.'
  },
  {
    id: 8,
    name: 'Ford Focus ST-Line',
    location: 'Liverpool, England',
    price: 6000,
    offerPrice: 6000,
    rating: 4.90,
    reviewsCount: 389,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seats: '7 seats',
    doors: '4 Doors',
    driveType: 'FWD',
    mileage: '25,100 miles',
    status: 'Inactive',
    order: 8,
    images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80'],
    shortDesc: 'Sporty and agile everyday hatchback.',
    fullDesc: 'Detailed description about Ford Focus ST-Line.'
  }
];

const emptyForm = {
  id: null,
  name: '',
  location: '',
  price: '',
  offerPrice: '',
  rating: '4.96',
  reviewsCount: '672',
  mileage: '25,100 miles',
  fuelType: 'Diesel',
  transmission: 'Automatic',
  seats: '7 seats',
  doors: '4 Doors',
  driveType: 'FWD',
  order: '',
  status: 'Active',
  shortDesc: '',
  fullDesc: '',
  images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80']
};

export function FeatureListing() {
  const [listings, setListings] = useState(initialListingList);
  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Display Order');
  
  // Selection & Pagination
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPageNum = 8;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImageUrls]
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleFormatText = (wrapperTag) => {
    const textarea = document.getElementById('FeatureListing-fullDescTextarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    let replacement = '';

    switch (wrapperTag) {
      case 'bold':
        replacement = `**${text.substring(start, end) || 'Bold text'}**`;
        break;
      case 'italic':
        replacement = `*${text.substring(start, end) || 'Italic text'}*`;
        break;
      case 'ul':
        replacement = `\n- ${text.substring(start, end) || 'List item'}`;
        break;
      case 'ol':
        replacement = `\n1. ${text.substring(start, end) || 'List item'}`;
        break;
      case 'link':
        replacement = `[${text.substring(start, end) || 'link text'}](https://example.com)`;
        break;
      case 'image':
        replacement = `![alt text](https://images.unsplash.com/photo-...)`;
        break;
      default:
        return;
    }

    const updatedText = text.substring(0, start) + replacement + text.substring(end);
    setFormData((prev) => ({ ...prev, fullDesc: updatedText }));
  };

  const handleResetForm = () => {
    setFormData(emptyForm);
    setIsEditing(false);
  };

  const handleSaveListing = (e, shouldAddAnother = false) => {
    if (e) e.preventDefault();
    if (!formData.name || !formData.location || !formData.price) {
      alert('Please fill in all required fields (Listing Name, Location, and Price)');
      return;
    }

    if (isEditing) {
      setListings((prev) =>
        prev.map((item) => (item.id === formData.id ? { 
          ...formData, 
          price: Number(formData.price), 
          offerPrice: Number(formData.offerPrice || formData.price),
          order: Number(formData.order) || item.order 
        } : item))
      );
      alert('Featured listing updated successfully!');
    } else {
      const newListing = {
        ...formData,
        id: Date.now(),
        price: Number(formData.price) || 0,
        offerPrice: Number(formData.offerPrice) || Number(formData.price) || 0,
        order: Number(formData.order) || listings.length + 1,
        images: formData.images.length ? formData.images : ['https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=400&q=80']
      };
      setListings((prev) => [newListing, ...prev]);
      alert('New featured listing added successfully!');
    }

    handleResetForm();
  };

  const handleEdit = (listing) => {
    setFormData(listing);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this featured listing?')) {
      setListings((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(currentListings.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} selected listing(s)?`)) {
      setListings((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
      setSelectedIds([]);
    }
  };

  // Filter & Sort Logic
  const filteredListings = listings.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || l.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'Display Order') return a.order - b.order;
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Rating') return b.rating - a.rating;
    return 0;
  });

  const totalPages = Math.ceil(filteredListings.length / itemsPerPageNum) || 1;
  const indexOfLastItem = currentPage * itemsPerPageNum;
  const indexOfFirstItem = indexOfLastItem - itemsPerPageNum;
  const currentListings = filteredListings.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="FeatureListing-container">
      {/* Top Header */}
      <div className="FeatureListing-header">
        <div>
          <h1>Featured Listings</h1>
          <p className="FeatureListing-breadcrumb">
            Dashboard &gt; Featured Listings &gt; <span>{isEditing ? 'Edit Listing' : 'Add / Manage'}</span>
          </p>
        </div>
      </div>

      {/* Main Grid Layout: Exactly 40% (Form) / 60% (Table) Split */}
      <div className="FeatureListing-grid">
        
        {/* Left Column: Form Section */}
        <div className="FeatureListing-card FeatureListing-form-section">
          <div className="FeatureListing-card-header">
            <h3><FaStar className="FeatureListing-icon-accent" /> {isEditing ? `Edit Featured Listing (#${formData.id})` : 'Add / Edit Featured Listing'}</h3>
          </div>

          <form onSubmit={(e) => handleSaveListing(e, false)} className="FeatureListing-form">
            
            {/* File Upload Dropzone */}
            <div className="FeatureListing-field-group">
              <label className="FeatureListing-label">Vehicle Images <span className="required">*</span></label>
              <label className="FeatureListing-dropzone">
                <FaCloudUploadAlt className="FeatureListing-drop-icon" />
                <p>Drag &amp; drop images here or</p>
                <span className="FeatureListing-browse-btn">Browse Files</span>
                <small>Recommended size: 800x500px (Max 2MB)</small>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }} 
                />
              </label>

              {/* Thumbnails */}
              <div className="FeatureListing-image-thumbnails">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="FeatureListing-thumb-box">
                    <img src={img} alt={`Thumbnail ${idx}`} />
                    <button type="button" className="FeatureListing-thumb-remove" onClick={() => handleRemoveImage(idx)} title="Remove image">
                      <FaTimes />
                    </button>
                  </div>
                ))}
                <label className="FeatureListing-thumb-add">
                  <span>+ Add</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="FeatureListing-field">
              <label>Vehicle Name <span className="required">*</span></label>
              <input type="text" name="name" placeholder="e.g. Volvo S60 D4 R-Design" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="FeatureListing-field">
              <label>Location <span className="required">*</span></label>
              <div className="FeatureListing-input-with-icon">
                <input type="text" name="location" placeholder="e.g. New South Wales, Australia" value={formData.location} onChange={handleInputChange} required />
                <FaMapMarkerAlt className="input-suffix-icon" />
              </div>
            </div>

            <div className="FeatureListing-form-grid-3">
              <div className="FeatureListing-field">
                <label>Price Per Day (₹) <span className="required">*</span></label>
                <input type="number" name="price" placeholder="₹ 7800" value={formData.price} onChange={handleInputChange} required />
              </div>
              <div className="FeatureListing-field">
                <label>Rating <span className="required">*</span></label>
                <input type="text" name="rating" placeholder="4.96" value={formData.rating} onChange={handleInputChange} />
              </div>
              <div className="FeatureListing-field">
                <label>Reviews Count <span className="required">*</span></label>
                <input type="text" name="reviewsCount" placeholder="672" value={formData.reviewsCount} onChange={handleInputChange} />
              </div>
            </div>

            {/* Specifications Section Header */}
            <div className="FeatureListing-specs-title">Specifications</div>
            
            <div className="FeatureListing-form-grid">
              <div className="FeatureListing-field">
                <label><FaGasPump className="spec-label-icon" /> Mileage</label>
                <input type="text" name="mileage" placeholder="25,100 miles" value={formData.mileage} onChange={handleInputChange} />
              </div>

              <div className="FeatureListing-field">
                <label><FaUser className="spec-label-icon" /> Seating Capacity</label>
                <div className="FeatureListing-select-wrapper">
                  <select name="seats" value={formData.seats} onChange={handleInputChange}>
                    <option value="5 seats">5 seats</option>
                    <option value="7 seats">7 seats</option>
                    <option value="9 seats">9 seats</option>
                  </select>
                </div>
              </div>

              <div className="FeatureListing-field">
                <label><FaCogs className="spec-label-icon" /> Fuel Type</label>
                <div className="FeatureListing-select-wrapper">
                  <select name="fuelType" value={formData.fuelType} onChange={handleInputChange}>
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>

              <div className="FeatureListing-field">
                <label><FaCar className="spec-label-icon" /> Doors</label>
                <div className="FeatureListing-select-wrapper">
                  <select name="doors" value={formData.doors} onChange={handleInputChange}>
                    <option value="2 Doors">2 Doors</option>
                    <option value="4 Doors">4 Doors</option>
                    <option value="5 Doors">5 Doors</option>
                  </select>
                </div>
              </div>

              <div className="FeatureListing-field">
                <label><FaCogs className="spec-label-icon" /> Transmission</label>
                <div className="FeatureListing-select-wrapper">
                  <select name="transmission" value={formData.transmission} onChange={handleInputChange}>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

              <div className="FeatureListing-field">
                <label><FaCar className="spec-label-icon" /> Drive Type</label>
                <div className="FeatureListing-select-wrapper">
                  <select name="driveType" value={formData.driveType} onChange={handleInputChange}>
                    <option value="FWD">FWD</option>
                    <option value="RWD">RWD</option>
                    <option value="AWD">AWD</option>
                    <option value="4WD">4WD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order & Status */}
            <div className="FeatureListing-form-grid">
              <div className="FeatureListing-field">
                <label>Display Order <span className="required">*</span></label>
                <input type="number" name="order" placeholder="2" value={formData.order} onChange={handleInputChange} />
                <small className="helper-text">Lower number shows first</small>
              </div>

              <div className="FeatureListing-field">
                <label>Status <span className="required">*</span></label>
                <div className="FeatureListing-select-wrapper">
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="FeatureListing-field">
              <label>Short Description</label>
              <input type="text" name="shortDesc" placeholder="e.g. Premium sedan with excellent fuel efficiency and comfort." value={formData.shortDesc} onChange={handleInputChange} />
            </div>

            <div className="FeatureListing-field">
              <label>Full Description</label>
              <div className="FeatureListing-editor-wrapper">
                <div className="FeatureListing-editor-toolbar">
                  <button type="button" onClick={() => handleFormatText('bold')} title="Bold"><FaBold /></button>
                  <button type="button" onClick={() => handleFormatText('italic')} title="Italic"><FaItalic /></button>
                  <button type="button" onClick={() => handleFormatText('ul')} title="Bullet List"><FaListUl /></button>
                  <button type="button" onClick={() => handleFormatText('ol')} title="Numbered List"><FaListOl /></button>
                  <button type="button" onClick={() => handleFormatText('link')} title="Insert Link"><FaLink /></button>
                  <button type="button" onClick={() => handleFormatText('image')} title="Insert Image"><FaImage /></button>
                </div>
                <textarea
                  id="FeatureListing-fullDescTextarea"
                  name="fullDesc"
                  rows="4"
                  placeholder="Write detailed description about the vehicle..."
                  value={formData.fullDesc}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            {/* Form Action Buttons Side by Side */}
            <div className="FeatureListing-form-actions">
              <button type="submit" className="FeatureListing-btn-save">
                <FaSave /> Save Listing
              </button>
              <button type="button" className="FeatureListing-btn-save-another" onClick={(e) => handleSaveListing(e, true)}>
                Save &amp; Add Another
              </button>
              <button type="button" className="FeatureListing-btn-reset" onClick={handleResetForm}>
                <FaUndo /> Reset
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Table List Section */}
        <div className="FeatureListing-card FeatureListing-table-section">
          
          {/* Table Header Controls */}
          <div className="FeatureListing-table-controls">
            <div className="FeatureListing-card-header">
              <h3><FaStar className="FeatureListing-icon-accent" /> All Featured Listings</h3>
            </div>

            <div className="FeatureListing-filter-bar">
              <div className="FeatureListing-search-box">
                <FaSearch className="FeatureListing-search-icon" />
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
              </div>

              <div className="FeatureListing-select-wrapper filter-select-wrap">
                <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="FeatureListing-sort-group">
                <span className="sort-label">Sort By</span>
                <div className="FeatureListing-select-wrapper sort-select-wrap">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="Display Order">Display Order</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                    <option value="Rating">Rating</option>
                  </select>
                </div>
              </div>

              <button type="button" className="FeatureListing-btn-filter" onClick={() => { setSearchQuery(''); setFilterStatus('All'); setSortBy('Display Order'); setCurrentPage(1); }}>
                <FaFilter /> Filter
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="FeatureListing-table-wrapper">
            <table className="FeatureListing-table">
              <thead>
                <tr>
                  <th style={{ width: '35px' }}>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={currentListings.length > 0 && currentListings.every((l) => selectedIds.includes(l.id))}
                    />
                  </th>
                  <th style={{ width: '30px' }}>#</th>
                  <th>Image</th>
                  <th>Vehicle</th>
                  <th>Location</th>
                  <th>Price / Day</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentListings.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="FeatureListing-empty-cell">
                      No featured listings found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  currentListings.map((item, index) => (
                    <tr key={item.id} className={selectedIds.includes(item.id) ? 'selected-row' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleSelectOne(item.id)}
                        />
                      </td>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>
                        <img src={item.images[0]} alt={item.name} className="FeatureListing-table-img" />
                      </td>
                      <td>
                        <div className="FeatureListing-car-cell">
                          <h4>{item.name}</h4>
                          <p className="FeatureListing-car-meta">
                            {item.fuelType} • {item.transmission} • {item.seats}
                          </p>
                          <p className="FeatureListing-car-submeta">
                            {item.mileage}
                          </p>
                        </div>
                      </td>
                      <td className="FeatureListing-location-cell">
                        <FaMapMarkerAlt className="location-pin" /> {item.location}
                      </td>
                      <td className="FeatureListing-price-cell">
                        <strong>₹{Number(item.price).toLocaleString('en-IN')}</strong>
                        <span>/day</span>
                      </td>
                      <td>
                        <div className="FeatureListing-rating-cell">
                          <span className="star-icon"><FaStar /></span>
                          <strong>{Number(item.rating).toFixed(2)}</strong>
                          <span className="reviews-count">({item.reviewsCount} reviews)</span>
                        </div>
                      </td>
                      <td>
                        <span className={`FeatureListing-badge ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <span className="FeatureListing-order-pill">{item.order}</span>
                      </td>
                      <td>
                        <div className="FeatureListing-action-btns">
                          <button type="button" className="btn-edit" title="Edit" onClick={() => handleEdit(item)}>
                            <FaEdit />
                          </button>
                          <button type="button" className="btn-delete" title="Delete" onClick={() => handleDelete(item.id)}>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="FeatureListing-table-footer">
            <div className="FeatureListing-bulk-actions">
              <div className="FeatureListing-select-wrapper bulk-select-wrap">
                <select defaultValue="" onChange={(e) => { if (e.target.value === 'delete') handleBulkDelete(); e.target.value = ''; }}>
                  <option value="" disabled>Bulk Actions</option>
                  <option value="delete">Delete Selected</option>
                </select>
              </div>
            </div>

            <div className="FeatureListing-pagination-container">
              <span className="FeatureListing-pagination-info">
                {filteredListings.length ? `Showing ${indexOfFirstItem + 1} to ${Math.min(indexOfLastItem, filteredListings.length)} of ${filteredListings.length} listings` : '0 results'}
              </span>

              <div className="FeatureListing-pagination">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    type="button"
                    key={i + 1}
                    className={currentPage === i + 1 ? 'active' : ''}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default FeatureListing;