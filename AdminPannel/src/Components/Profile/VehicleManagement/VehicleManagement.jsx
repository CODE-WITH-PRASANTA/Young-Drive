import React, { useState } from 'react';
import { 
  FaCar, FaCloudUploadAlt, FaTimes, FaSave, FaUndo, 
  FaSearch, FaFilter, FaEdit, FaTrash, FaChevronLeft, FaChevronRight,
  FaBold, FaItalic, FaListUl, FaListOl, FaLink, FaImage, FaGasPump, FaCogs, FaUser
} from 'react-icons/fa';
import './VehicleManagement.css';

const initialVehicleList = [
  {
    id: 1,
    name: 'Audi A3 1.6 TDI S line',
    brand: 'Audi',
    model: 'A3',
    year: '2022',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seats: 5,
    doors: 4,
    luggage: '2 Bags',
    mileage: '25.30 miles/ltr',
    carType: 'Sedan',
    color: 'Grey',
    price: 498.25,
    offerPrice: 498.25,
    status: 'Active',
    images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80'],
    shortDesc: 'Premium compact sedan with advanced features.',
    fullDesc: 'Detailed description about the Audi A3 S Line.',
    features: ['Bluetooth', 'GPS Navigation', 'USB Port', 'Air Conditioning']
  },
  {
    id: 2,
    name: 'Mercedes-Benz C220d',
    brand: 'Mercedes',
    model: 'C220d',
    year: '2021',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seats: 5,
    doors: 4,
    luggage: '3 Bags',
    mileage: '22.10 miles/ltr',
    carType: 'Sedan',
    color: 'Silver',
    price: 498.25,
    offerPrice: 498.25,
    status: 'Active',
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80'],
    shortDesc: 'Luxury driving experience with sleek styling.',
    fullDesc: 'Detailed description about Mercedes C220d.',
    features: ['Bluetooth', 'Heated Seats', 'Apple CarPlay']
  },
  {
    id: 3,
    name: 'Volkswagen Golf GTD 2.0 TDI',
    brand: 'Volkswagen',
    model: 'Golf GTD',
    year: '2022',
    fuelType: 'Diesel',
    transmission: 'Manual',
    seats: 5,
    doors: 4,
    luggage: '2 Bags',
    mileage: '28.50 miles/ltr',
    carType: 'Hatchback',
    color: 'White',
    price: 498.25,
    offerPrice: 498.25,
    status: 'Active',
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80'],
    shortDesc: 'Sporty hatchback with impressive efficiency.',
    fullDesc: 'Detailed description about Golf GTD.',
    features: ['Bluetooth', 'GPS Navigation', 'Cruise Control']
  },
  {
    id: 4,
    name: 'Toyota RAV4 Hybrid',
    brand: 'Toyota',
    model: 'RAV4',
    year: '2023',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    seats: 5,
    doors: 5,
    luggage: '4 Bags',
    mileage: '35.00 miles/ltr',
    carType: 'SUV',
    color: 'Black',
    price: 598.50,
    offerPrice: 598.50,
    status: 'Active',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80'],
    shortDesc: 'Reliable hybrid SUV for family adventures.',
    fullDesc: 'Detailed description about Toyota RAV4 Hybrid.',
    features: ['GPS Navigation', 'Backup Camera', 'Apple CarPlay']
  },
  {
    id: 5,
    name: 'BMW 320d M Sport',
    brand: 'BMW',
    model: '320d',
    year: '2022',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seats: 5,
    doors: 4,
    luggage: '3 Bags',
    mileage: '24.00 miles/ltr',
    carType: 'Sedan',
    color: 'Black',
    price: 650.00,
    offerPrice: 650.00,
    status: 'Active',
    images: ['https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=400&q=80'],
    shortDesc: 'Dynamic sports sedan with high performance.',
    fullDesc: 'Detailed description about BMW 320d M Sport.',
    features: ['Heated Seats', 'Cruise Control', 'Backup Camera']
  },
  {
    id: 6,
    name: 'Honda CR-V 2.4L',
    brand: 'Honda',
    model: 'CR-V',
    year: '2021',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    doors: 5,
    luggage: '4 Bags',
    mileage: '19.50 miles/ltr',
    carType: 'SUV',
    color: 'Grey',
    price: 550.00,
    offerPrice: 550.00,
    status: 'Inactive',
    images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80'],
    shortDesc: 'Spacious crossover with smooth ride.',
    fullDesc: 'Detailed description about Honda CR-V.',
    features: ['Air Conditioning', 'USB Port']
  }
];

const availableFeatures = [
  'Bluetooth', 'GPS Navigation', 'USB Port', 'Air Conditioning',
  'Heated Seats', 'Cruise Control', 'Backup Camera', 'Apple CarPlay'
];

const emptyForm = {
  id: null,
  name: '',
  brand: '',
  model: '',
  year: '',
  fuelType: '',
  transmission: '',
  seats: '',
  doors: '',
  luggage: '',
  mileage: '',
  carType: '',
  color: '',
  price: '',
  offerPrice: '',
  status: 'Active',
  shortDesc: '',
  fullDesc: '',
  features: [],
  images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80']
};

export function VehicleManagement() {
  const [vehicles, setVehicles] = useState(initialVehicleList);
  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  
  // Table Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handle Form Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Feature Checkbox Toggle
  const handleFeatureToggle = (feature) => {
    setFormData((prev) => {
      const exists = prev.features.includes(feature);
      const newFeatures = exists
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature];
      return { ...prev, features: newFeatures };
    });
  };

  // Fully Functional Real Image Upload handler
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

  // Rich Text Editor Toolbar Actions
  const handleFormatText = (wrapperTag) => {
    const textarea = document.getElementById('fullDescTextarea');
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

  // Reset Form
  const handleResetForm = () => {
    setFormData(emptyForm);
    setIsEditing(false);
  };

  // Fully Functional Filter Reset Handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterType('All');
    setFilterStatus('All');
    setCurrentPage(1);
  };

  // Save / Update Vehicle
  const handleSaveVehicle = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.price) {
      alert('Please fill in all required fields (Vehicle Name, Brand, and Price)');
      return;
    }

    if (isEditing) {
      setVehicles((prev) =>
        prev.map((item) => (item.id === formData.id ? { ...formData, price: Number(formData.price), offerPrice: Number(formData.offerPrice || formData.price) } : item))
      );
      alert('Vehicle updated successfully!');
    } else {
      const newVehicle = {
        ...formData,
        id: Date.now(),
        price: Number(formData.price) || 0,
        offerPrice: Number(formData.offerPrice) || Number(formData.price) || 0,
        images: formData.images.length ? formData.images : ['https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=400&q=80']
      };
      setVehicles((prev) => [newVehicle, ...prev]);
      alert('New vehicle added successfully!');
    }
    handleResetForm();
  };

  // Edit Vehicle
  const handleEdit = (vehicle) => {
    setFormData(vehicle);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Single Vehicle
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Bulk Actions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(currentVehicles.map((v) => v.id));
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
    if (window.confirm(`Delete ${selectedIds.length} selected vehicle(s)?`)) {
      setVehicles((prev) => prev.filter((v) => !selectedIds.includes(v.id)));
      setSelectedIds([]);
    }
  };

  // Filter Logic
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || v.carType === filterType;
    const matchesStatus = filterStatus === 'All' || v.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="VehicleManagement-container">
      {/* Top Header */}
      <div className="VehicleManagement-header">
        <div>
          <h1>Vehicle Management Dashboard</h1>
          <p className="VehicleManagement-breadcrumb">
            Dashboard &gt; Vehicles &gt; <span>{isEditing ? 'Edit Vehicle' : 'Manage Inventory'}</span>
          </p>
        </div>
      </div>

      {/* Main Grid Content - 50% / 50% Split */}
      <div className="VehicleManagement-grid">
        
        {/* Left Column: Form Section */}
        <div className="VehicleManagement-card VehicleManagement-form-section">
          <div className="VehicleManagement-card-header">
            <h3><FaCar className="VehicleManagement-icon-accent" /> {isEditing ? `Edit Vehicle (#${formData.id})` : 'Add New Vehicle'}</h3>
          </div>

          <form onSubmit={handleSaveVehicle} className="VehicleManagement-form">
            
            {/* Real File Upload Dropzone */}
            <div className="VehicleManagement-field-group">
              <label className="VehicleManagement-label">Vehicle Images <span className="required">*</span></label>
              <label className="VehicleManagement-dropzone">
                <FaCloudUploadAlt className="VehicleManagement-drop-icon" />
                <p>Click to upload local images or drag &amp; drop</p>
                <small>Supports JPG, PNG, WEBP (Max 5MB)</small>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }} 
                />
              </label>

              {/* Uploaded Thumbnails */}
              <div className="VehicleManagement-image-thumbnails">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="VehicleManagement-thumb-box">
                    <img src={img} alt={`Thumbnail ${idx}`} />
                    <button type="button" className="VehicleManagement-thumb-remove" onClick={() => handleRemoveImage(idx)} title="Remove image">
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="VehicleManagement-form-grid">
              <div className="VehicleManagement-field">
                <label>Vehicle Name <span className="required">*</span></label>
                <input type="text" name="name" placeholder="e.g. Audi A3 1.6 TDI S line" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="VehicleManagement-field">
                <label>Brand <span className="required">*</span></label>
                <input type="text" name="brand" placeholder="e.g. Audi" value={formData.brand} onChange={handleInputChange} required />
              </div>

              <div className="VehicleManagement-field">
                <label>Model <span className="required">*</span></label>
                <input type="text" name="model" placeholder="e.g. A3" value={formData.model} onChange={handleInputChange} />
              </div>

              <div className="VehicleManagement-field">
                <label>Year <span className="required">*</span></label>
                <select name="year" value={formData.year} onChange={handleInputChange}>
                  <option value="">Select year</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>

              <div className="VehicleManagement-field">
                <label>Fuel Type <span className="required">*</span></label>
                <select name="fuelType" value={formData.fuelType} onChange={handleInputChange}>
                  <option value="">Select fuel type</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div className="VehicleManagement-field">
                <label>Transmission <span className="required">*</span></label>
                <select name="transmission" value={formData.transmission} onChange={handleInputChange}>
                  <option value="">Select transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div className="VehicleManagement-field">
                <label>Seating Capacity <span className="required">*</span></label>
                <input type="text" name="seats" placeholder="e.g. 5" value={formData.seats} onChange={handleInputChange} />
              </div>

              <div className="VehicleManagement-field">
                <label>Doors <span className="required">*</span></label>
                <input type="text" name="doors" placeholder="e.g. 4" value={formData.doors} onChange={handleInputChange} />
              </div>

              <div className="VehicleManagement-field">
                <label>Luggage Capacity <span className="required">*</span></label>
                <input type="text" name="luggage" placeholder="e.g. 2 Bags" value={formData.luggage} onChange={handleInputChange} />
              </div>

              <div className="VehicleManagement-field">
                <label>Mileage <span className="required">*</span></label>
                <input type="text" name="mileage" placeholder="e.g. 25.30 miles/ltr" value={formData.mileage} onChange={handleInputChange} />
              </div>

              <div className="VehicleManagement-field">
                <label>Car Type <span className="required">*</span></label>
                <select name="carType" value={formData.carType} onChange={handleInputChange}>
                  <option value="">Select car type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="MPV">MPV</option>
                  <option value="Crossover">Crossover</option>
                </select>
              </div>

              <div className="VehicleManagement-field">
                <label>Color <span className="required">*</span></label>
                <input type="text" name="color" placeholder="e.g. Grey" value={formData.color} onChange={handleInputChange} />
              </div>
            </div>

            {/* Checkbox Features */}
            <div className="VehicleManagement-field-group">
              <label className="VehicleManagement-label">Features <span className="required">*</span></label>
              <div className="VehicleManagement-checkbox-grid">
                {availableFeatures.map((feature) => (
                  <label key={feature} className="VehicleManagement-checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price & Status Group */}
            <div className="VehicleManagement-form-grid">
              <div className="VehicleManagement-field">
                <label>Daily Price <span className="required">*</span></label>
                <input type="number" name="price" placeholder="₹ 498.25" value={formData.price} onChange={handleInputChange} required />
              </div>
              <div className="VehicleManagement-field">
                <label>Offer Price</label>
                <input type="number" name="offerPrice" placeholder="₹ 498.25" value={formData.offerPrice} onChange={handleInputChange} />
              </div>
              <div className="VehicleManagement-field">
                <label>Status <span className="required">*</span></label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Descriptions */}
            <div className="VehicleManagement-field">
              <label>Short Description <span className="required">*</span></label>
              <input type="text" name="shortDesc" placeholder="e.g. Premium compact sedan with advanced features..." value={formData.shortDesc} onChange={handleInputChange} />
            </div>

            <div className="VehicleManagement-field">
              <label>Full Description <span className="required">*</span></label>
              <div className="VehicleManagement-editor-wrapper">
                <div className="VehicleManagement-editor-toolbar">
                  <button type="button" onClick={() => handleFormatText('bold')} title="Bold"><FaBold /></button>
                  <button type="button" onClick={() => handleFormatText('italic')} title="Italic"><FaItalic /></button>
                  <button type="button" onClick={() => handleFormatText('ul')} title="Bullet List"><FaListUl /></button>
                  <button type="button" onClick={() => handleFormatText('ol')} title="Numbered List"><FaListOl /></button>
                  <button type="button" onClick={() => handleFormatText('link')} title="Insert Link"><FaLink /></button>
                  <button type="button" onClick={() => handleFormatText('image')} title="Insert Image"><FaImage /></button>
                </div>
                <textarea
                  id="fullDescTextarea"
                  name="fullDesc"
                  rows="4"
                  placeholder="Write detailed description about the vehicle..."
                  value={formData.fullDesc}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="VehicleManagement-form-actions">
              <button type="submit" className="VehicleManagement-btn-save">
                <FaSave /> {isEditing ? 'Update Vehicle' : 'Save Vehicle'}
              </button>
              <button type="button" className="VehicleManagement-btn-reset" onClick={handleResetForm}>
                <FaUndo /> Reset
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Table List Section */}
        <div className="VehicleManagement-card VehicleManagement-table-section">
          
          {/* Table Header Controls */}
          <div className="VehicleManagement-table-controls">
            <div className="VehicleManagement-card-header">
              <h3><FaCar className="VehicleManagement-icon-accent" /> All Vehicles ({filteredVehicles.length})</h3>
            </div>

            <div className="VehicleManagement-filter-bar">
              <div className="VehicleManagement-search-box">
                <FaSearch className="VehicleManagement-search-icon" />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
              </div>

              <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}>
                <option value="All">All Types</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="MPV">MPV</option>
                <option value="Crossover">Crossover</option>
              </select>

              <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Fully functional Filter Reset Button */}
              <button type="button" className="VehicleManagement-btn-filter" onClick={handleResetFilters}>
                <FaFilter /> Reset Filters
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="VehicleManagement-table-wrapper">
            <table className="VehicleManagement-table">
              <thead>
                <tr>
                  <th style={{ width: '35px' }}>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={currentVehicles.length > 0 && currentVehicles.every((v) => selectedIds.includes(v.id))}
                    />
                  </th>
                  <th style={{ width: '30px' }}>#</th>
                  <th>Vehicle</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentVehicles.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="VehicleManagement-empty-cell">
                      No vehicles found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  currentVehicles.map((car, index) => (
                    <tr key={car.id} className={selectedIds.includes(car.id) ? 'selected-row' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(car.id)}
                          onChange={() => handleSelectOne(car.id)}
                        />
                      </td>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>
                        <div className="VehicleManagement-car-cell">
                          <img src={car.images[0]} alt={car.name} />
                          <div>
                            <h4>{car.name}</h4>
                            <p className="VehicleManagement-car-meta">
                              {car.brand} • {car.model} • {car.year}
                            </p>
                            <p className="VehicleManagement-car-specs">
                              <span><FaGasPump /> {car.fuelType}</span>
                              <span><FaCogs /> {car.transmission}</span>
                              <span><FaUser /> {car.seats} Seats</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="VehicleManagement-price-cell">
                        <strong>₹{Number(car.price).toFixed(2)}</strong>
                        <span>/ day</span>
                      </td>
                      <td>
                        <span className={`VehicleManagement-badge ${car.status.toLowerCase()}`}>
                          {car.status}
                        </span>
                      </td>
                      <td>
                        <div className="VehicleManagement-action-btns">
                          <button type="button" className="btn-edit" title="Edit" onClick={() => handleEdit(car)}>
                            <FaEdit />
                          </button>
                          <button type="button" className="btn-delete" title="Delete" onClick={() => handleDelete(car.id)}>
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
          <div className="VehicleManagement-table-footer">
            <div className="VehicleManagement-bulk-actions">
              {selectedIds.length > 0 && (
                <button type="button" className="VehicleManagement-btn-bulk-delete" onClick={handleBulkDelete}>
                  Delete Selected ({selectedIds.length})
                </button>
              )}
            </div>

            <div className="VehicleManagement-pagination-container">
              <span className="VehicleManagement-pagination-info">
                {filteredVehicles.length ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredVehicles.length)} of ${filteredVehicles.length}` : '0 results'}
              </span>

              <div className="VehicleManagement-pagination">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  <FaChevronLeft />
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
                  <FaChevronRight />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default VehicleManagement;