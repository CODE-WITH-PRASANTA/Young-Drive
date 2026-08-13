import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiMapPin, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiGrid, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiChevronLeft, 
  FiChevronRight, 
  FiChevronUp, 
  FiSave, 
  FiX, 
  FiInfo 
} from 'react-icons/fi';
import './Locations.css';

const API_URL = 'http://localhost:5000/api/locations';

const Locations = () => {
  const [locationsData, setLocationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const initialFormState = {
    name: '',
    address: '',
    city: '',
    state: '',
    country: 'United States',
    postalCode: '',
    type: 'Pickup & Drop',
    status: 'Active',
    mapLink: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  // 1. Fetch All Locations from Backend
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const result = await res.json();
      if (result.success) {
        setLocationsData(result.data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Filter & Search Logic
  const filteredLocations = useMemo(() => {
    return locationsData.filter((loc) => {
      const matchesSearch = 
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.state.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'All Status' || loc.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [locationsData, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage) || 1;
  const currentTableData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLocations.slice(start, start + itemsPerPage);
  }, [filteredLocations, currentPage, itemsPerPage]);

  // Reset Form
  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  // 2. Delete Location
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
          setLocationsData(prev => prev.filter(item => item._id !== id));
          if (editingId === id) resetForm();
        }
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    }
  };

  // 3. Edit Handler (Populate Form)
  const handleEdit = (loc) => {
    setFormData({
      name: loc.name || '',
      address: loc.address || '',
      city: loc.city || '',
      state: loc.state || '',
      country: loc.country || 'United States',
      postalCode: loc.postalCode || '',
      type: loc.type || 'Pickup & Drop',
      status: loc.status || 'Active',
      mapLink: loc.mapLink || ''
    });
    setEditingId(loc._id);
    setIsFormVisible(true);
  };

  // 4. Submit Form (Save / Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (result.success) {
        if (editingId) {
          setLocationsData(prev =>
            prev.map(item => item._id === editingId ? result.data : item)
          );
        } else {
          setLocationsData(prev => [result.data, ...prev]);
        }
        resetForm();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  return (
    <div className="locations-container">
      {/* Header */}
      <div className="locations-header-wrapper">
        <div className="locations-title-group">
          <h1 className="locations-title">Locations</h1>
          <p className="locations-subtitle">Manage all pickup and drop-off locations</p>
        </div>
        <div className="locations-header-right">
          <span className="locations-breadcrumb">Master Data &gt; Locations</span>
        </div>
      </div>

      {/* Dynamic Statistics Cards */}
      <div className="locations-stats-grid">
        <div className="locations-stat-card">
          <div>
            <span className="locations-stat-label">Total Locations</span>
            <h2 className="locations-stat-value">{locationsData.length}</h2>
            <span className="locations-stat-sub">All Locations</span>
          </div>
          <div className="locations-stat-icon-box locations-pink"><FiMapPin /></div>
        </div>
        <div className="locations-stat-card">
          <div>
            <span className="locations-stat-label">Active Locations</span>
            <h2 className="locations-stat-value">{locationsData.filter(l => l.status === 'Active').length}</h2>
            <span className="locations-stat-sub">Currently Active</span>
          </div>
          <div className="locations-stat-icon-box locations-green"><FiCheckCircle /></div>
        </div>
        <div className="locations-stat-card">
          <div>
            <span className="locations-stat-label">Inactive Locations</span>
            <h2 className="locations-stat-value">{locationsData.filter(l => l.status === 'Inactive').length}</h2>
            <span className="locations-stat-sub">Currently Inactive</span>
          </div>
          <div className="locations-stat-icon-box locations-orange"><FiAlertCircle /></div>
        </div>
        <div className="locations-stat-card">
          <div>
            <span className="locations-stat-label">Cities Covered</span>
            <h2 className="locations-stat-value">{new Set(locationsData.map(l => l.city)).size}</h2>
            <span className="locations-stat-sub">Across All Locations</span>
          </div>
          <div className="locations-stat-icon-box locations-purple"><FiGrid /></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`locations-main-layout ${!isFormVisible ? 'form-collapsed' : ''}`}>
        
        {/* Table Section */}
        <div className="locations-left-content">
          <div className="locations-controls-bar">
            <div className="locations-search-box">
              <FiSearch className="locations-search-icon" />
              <input
                type="text"
                placeholder="Search by location name or city..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="locations-search-input"
              />
            </div>
            
            <div className="locations-filter-dropdown-wrapper">
              <select 
                value={statusFilter} 
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="locations-status-select"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="locations-table-container">
            <table className="locations-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>LOCATION NAME</th>
                  <th>CITY</th>
                  <th>STATE</th>
                  <th>TYPE</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="locations-no-data">Loading locations...</td></tr>
                ) : currentTableData.length > 0 ? (
                  currentTableData.map((loc) => (
                    <tr key={loc._id}>
                      <td><input type="checkbox" /></td>
                      <td>
                        <div className="locations-name-cell">
                          <FiMapPin className="locations-row-pin" />
                          <div>
                            <span className="locations-name-text">{loc.name}</span>
                            <span className="locations-address-sub">{loc.address}</span>
                          </div>
                        </div>
                      </td>
                      <td>{loc.city}</td>
                      <td>{loc.state}</td>
                      <td>
                        <span className={`locations-type-badge ${loc.type ? loc.type.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') : ''}`}>
                          {loc.type}
                        </span>
                      </td>
                      <td>
                        <span className={`locations-status-badge ${loc.status ? loc.status.toLowerCase() : ''}`}>
                          {loc.status}
                        </span>
                      </td>
                      <td>
                        <div className="locations-action-btns">
                          <button className="locations-action-edit" onClick={() => handleEdit(loc)} title="Edit">
                            <FiEdit2 />
                          </button>
                          <button className="locations-action-delete" onClick={() => handleDelete(loc._id)} title="Delete">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" className="locations-no-data">No locations found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="locations-pagination-footer">
            <div className="locations-pagination-info">
              Showing {filteredLocations.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLocations.length)} of {filteredLocations.length} entries
            </div>
            <div className="locations-pagination-controls">
              <button 
                className="locations-page-nav"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FiChevronLeft />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`locations-page-num ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                className="locations-page-nav"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <FiChevronRight />
              </button>
              <select 
                className="locations-per-page-select" 
                value={`${itemsPerPage} / page`}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value.split(' ')[0]));
                  setCurrentPage(1);
                }}
              >
                <option value="5 / page">5 / page</option>
                <option value="10 / page">10 / page</option>
                <option value="20 / page">20 / page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        {isFormVisible && (
          <div className="locations-right-form-panel">
            <div className="locations-form-header">
              <div className="locations-form-title-wrap">
                <FiMapPin className="locations-form-header-icon" />
                <h3>{editingId ? 'Edit Location' : 'Add New Location'}</h3>
              </div>
              <button className="locations-form-collapse-btn" onClick={() => setIsFormVisible(false)}>
                <FiChevronUp />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="locations-form-body">
              <div className="locations-form-group">
                <label>Location Name *</label>
                <input 
                  type="text" 
                  placeholder="Enter location name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>

              <div className="locations-form-group">
                <label>Address *</label>
                <input 
                  type="text" 
                  placeholder="Enter complete address" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required 
                />
              </div>

              <div className="locations-form-row">
                <div className="locations-form-group">
                  <label>City *</label>
                  <input 
                    type="text" 
                    placeholder="Enter city" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    required 
                  />
                </div>
                <div className="locations-form-group">
                  <label>State *</label>
                  <select 
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    required
                  >
                    <option value="">Select state</option>
                    <option value="New York">New York</option>
                    <option value="California">California</option>
                    <option value="Illinois">Illinois</option>
                    <option value="Florida">Florida</option>
                    <option value="Texas">Texas</option>
                  </select>
                </div>
              </div>

              <div className="locations-form-row">
                <div className="locations-form-group">
                  <label>Country *</label>
                  <select 
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
                <div className="locations-form-group">
                  <label>Postal Code</label>
                  <input 
                    type="text" 
                    placeholder="Enter postal code" 
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  />
                </div>
              </div>

              <div className="locations-form-group">
                <label>Location Type *</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Pickup & Drop">Pickup & Drop</option>
                  <option value="Pickup Only">Pickup Only</option>
                  <option value="Drop Only">Drop Only</option>
                </select>
              </div>

              <div className="locations-form-group">
                <label>Google Map Link</label>
                <input 
                  type="text" 
                  placeholder="https://maps.google.com/..." 
                  value={formData.mapLink}
                  onChange={(e) => setFormData({...formData, mapLink: e.target.value})}
                />
              </div>

              <div className="locations-form-group">
                <label>Status *</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="locations-form-buttons">
                <button type="button" className="locations-btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="locations-btn-save">
                  <FiSave /> {editingId ? 'Update Location' : 'Save Location'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="locations-tips-banner">
        <div className="locations-tips-header">
          <FiInfo className="locations-tips-icon" />
          <strong>Location Management Tips</strong>
        </div>
        <ul>
          <li>Add all your pickup and drop-off locations for better service management.</li>
          <li>Inactive locations will not be shown in the booking form.</li>
          <li>Make sure the address is accurate for smooth navigation.</li>
        </ul>
      </div>

      {/* Modal Popup */}
      {showAddModal && (
        <div className="locations-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="locations-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="locations-modal-header">
              <h3>Add New Location</h3>
              <button onClick={() => setShowAddModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="locations-modal-form">
              <input 
                type="text" placeholder="Location Name *" required 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
              />
              <input 
                type="text" placeholder="Address *" required 
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} 
              />
              <input 
                type="text" placeholder="City *" required 
                value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} 
              />
              <select value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required>
                <option value="">Select State *</option>
                <option value="New York">New York</option>
                <option value="California">California</option>
                <option value="Illinois">Illinois</option>
                <option value="Florida">Florida</option>
                <option value="Texas">Texas</option>
              </select>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="Pickup & Drop">Pickup & Drop</option>
                <option value="Pickup Only">Pickup Only</option>
                <option value="Drop Only">Drop Only</option>
              </select>
              <div className="locations-modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="locations-save-modal-btn">Save Location</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;