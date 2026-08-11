import React, { useState, useMemo } from 'react';
import { 
  FiMapPin, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiGrid, 
  FiSearch, 
  FiFilter, 
  FiEdit2, 
  FiTrash2, 
  FiChevronLeft, 
  FiChevronRight, 
  FiChevronUp, 
  FiPlus, 
  FiSave, 
  FiX, 
  FiInfo 
} from 'react-icons/fi';
import './Locations.css';

const initialLocations = [
  { id: 1, name: 'New York Downtown', address: '123 Manhattan Ave', city: 'New York', state: 'New York', country: 'United States', postalCode: '10001', type: 'Pickup & Drop', status: 'Active', mapLink: 'https://maps.google.com/...' },
  { id: 2, name: 'Los Angeles Airport', address: 'LAX Airport Terminal', city: 'Los Angeles', state: 'California', country: 'United States', postalCode: '90045', type: 'Pickup Only', status: 'Active', mapLink: 'https://maps.google.com/...' },
  { id: 3, name: 'Chicago Downtown', address: '500 Michigan Ave', city: 'Chicago', state: 'Illinois', country: 'United States', postalCode: '60611', type: 'Drop Only', status: 'Active', mapLink: 'https://maps.google.com/...' },
  { id: 4, name: 'Miami Beach', address: '789 Ocean Drive', city: 'Miami', state: 'Florida', country: 'United States', postalCode: '33139', type: 'Pickup & Drop', status: 'Active', mapLink: 'https://maps.google.com/...' },
  { id: 5, name: 'Houston Central', address: '321 Main St', city: 'Houston', state: 'Texas', country: 'United States', postalCode: '77002', type: 'Pickup & Drop', status: 'Active', mapLink: 'https://maps.google.com/...' },
  { id: 6, name: 'San Francisco Airport', address: 'SFO International', city: 'San Francisco', state: 'California', country: 'United States', postalCode: '94128', type: 'Pickup Only', status: 'Inactive', mapLink: 'https://maps.google.com/...' },
];

const Locations = () => {
  const [locationsData, setLocationsData] = useState(initialLocations);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', address: '', city: '', state: '', country: 'United States', postalCode: '', type: 'Pickup & Drop', status: 'Active', mapLink: ''
  });
  const [editingId, setEditingId] = useState(null);

  const itemsPerPage = 5;

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
  }, [filteredLocations, currentPage]);

  const handleDelete = (id) => {
    setLocationsData(prev => prev.filter(item => item.id !== id));
  };

  const handleEdit = (loc) => {
    setFormData(loc);
    setEditingId(loc.id);
    setIsFormVisible(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setLocationsData(prev => prev.map(item => item.id === editingId ? { ...formData, id: editingId } : item));
      setEditingId(null);
    } else {
      const newItem = { ...formData, id: Date.now() };
      setLocationsData(prev => [newItem, ...prev]);
    }
    setFormData({ name: '', address: '', city: '', state: '', country: 'United States', postalCode: '', type: 'Pickup & Drop', status: 'Active', mapLink: '' });
    setShowAddModal(false);
  };

  return (
    <div className="locations-container">
      {/* Top Header & Breadcrumb */}
      <div className="locations-header-wrapper">
        <div className="locations-title-group">
          <h1 className="locations-title">Locations</h1>
          <p className="locations-subtitle">Manage all pickup and drop-off locations</p>
        </div>
        <div className="locations-header-right">
          <span className="locations-breadcrumb">Master Data &gt; Locations</span>
          <button className="locations-add-main-btn" onClick={() => setShowAddModal(true)}>
            <FiPlus /> Add New Location
          </button>
        </div>
      </div>

      {/* Top Statistic Cards */}
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

      {/* Main Content Layout (Table Left, Form Right) */}
      <div className={`locations-main-layout ${!isFormVisible ? 'form-collapsed' : ''}`}>
        
        {/* Left Side Table Section */}
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
                onChange={(e) => setStatusFilter(e.target.value)}
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
                {currentTableData.length > 0 ? (
                  currentTableData.map((loc) => (
                    <tr key={loc.id}>
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
                        <span className={`locations-type-badge ${loc.type.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}>
                          {loc.type}
                        </span>
                      </td>
                      <td>
                        <span className={`locations-status-badge ${loc.status.toLowerCase()}`}>
                          {loc.status}
                        </span>
                      </td>
                      <td>
                        <div className="locations-action-btns">
                          <button className="locations-action-edit" onClick={() => handleEdit(loc)} title="Edit">
                            <FiEdit2 />
                          </button>
                          <button className="locations-action-delete" onClick={() => handleDelete(loc.id)} title="Delete">
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

          {/* Pagination Footer */}
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
              <select className="locations-per-page-select" defaultValue="10 / page">
                <option>10 / page</option>
                <option>20 / page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side Form Panel */}
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
                <small className="locations-help-text">Pickup & Drop, Pickup Only, or Drop Only</small>
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
                <button type="button" className="locations-btn-cancel" onClick={() => { setEditingId(null); setFormData({ name: '', address: '', city: '', state: '', country: 'United States', postalCode: '', type: 'Pickup & Drop', status: 'Active', mapLink: '' }); }}>
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

      {/* Bottom Management Tips Banner */}
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

      {/* Modal Add New Location Popup */}
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