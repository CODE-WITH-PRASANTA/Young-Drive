import React, { useState, useRef } from 'react';
import { 
  FiUser, 
  FiLock, 
  FiSettings, 
  FiCamera, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar, 
  FiShield, 
  FiClock, 
  FiArrowRight, 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiSave, 
  FiChevronLeft, 
  FiChevronRight 
} from 'react-icons/fi';
import './MyProfile.css';

const initialProfilesData = [
  { id: 1, name: 'Admin', email: 'admin@drivex.com', phone: '+1 202-555-0182', role: 'Super Admin', address: '123 DriveX Street, New York, NY 10001, USA', language: 'English', timeZone: '(UTC-05:00) Eastern Time (US & Canada)', bio: 'Administrator of DriveX car rental platform. Manage all operations and system settings.', status: 'Active', created: 'May 12, 2025, 10:30 AM', lastLogin: 'May 18, 2025, 09:15 AM', avatar: null }
];

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState('Profile Settings');
  const [profiles, setProfiles] = useState(initialProfilesData);
  const [currentProfile, setCurrentProfile] = useState(initialProfilesData[0]);
  
  // Form State for Profile Settings
  const [formData, setFormData] = useState({ ...currentProfile });
  
  // Change Password State
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });
  
  // Account Preferences State
  const [preferences, setPreferences] = useState({ emailNotif: true, smsNotif: false, darkMode: false, twoFactor: true });

  // Modal & Search States
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setCurrentProfile({ ...formData });
    alert('Profile updated successfully!');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPass !== passwordData.confirm) {
      alert("New passwords don't match!");
      return;
    }
    alert('Password changed successfully!');
    setPasswordData({ current: '', newPass: '', confirm: '' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
        setCurrentProfile(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="myprofile-container">
      {/* Header */}
      <div className="myprofile-header-wrapper">
        <div className="myprofile-title-group">
          <h1 className="myprofile-title">Settings</h1>
          <p className="myprofile-subtitle">Manage your profile and account security</p>
        </div>
        <div className="myprofile-header-right">
          <span className="myprofile-breadcrumb">Settings &gt; Profile &amp; Security</span>
          <button className="myprofile-add-btn" onClick={() => setShowAddModal(true)}>
            <FiPlus /> Add New Profile
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="myprofile-tabs-bar">
        {[
          { name: 'Profile Settings', icon: <FiUser /> },
          { name: 'Change Password', icon: <FiLock /> },
          { name: 'Account Preferences', icon: <FiSettings /> }
        ].map((tab) => (
          <button
            key={tab.name}
            className={`myprofile-tab-btn ${activeTab === tab.name ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* TAB 1: PROFILE SETTINGS */}
      {activeTab === 'Profile Settings' && (
        <div className={`myprofile-main-grid ${!isRightPanelVisible ? 'single-column' : ''}`}>
          
          {/* Left Form Section */}
          <div className="myprofile-form-card">
            <div className="myprofile-card-header">
              <h3>Profile Information</h3>
              <p>Update your personal information and profile details</p>
            </div>

            <form onSubmit={handleProfileUpdate} className="myprofile-form">
              <div className="myprofile-avatar-upload-section">
                <div className="myprofile-avatar-preview">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar" className="myprofile-avatar-img" />
                  ) : (
                    <div className="myprofile-avatar-fallback">{formData.name ? formData.name.charAt(0) : 'A'}</div>
                  )}
                  <button 
                    type="button" 
                    className="myprofile-camera-btn" 
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FiCamera />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/png, image/jpeg, image/webp" 
                    style={{ display: 'none' }} 
                  />
                </div>
                <span className="myprofile-upload-hint">JPG, PNG or WEBP. Max size 2MB.</span>
              </div>

              <div className="myprofile-form-row">
                <div className="myprofile-form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="myprofile-form-group">
                  <label>Email Address *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>

              <div className="myprofile-form-row">
                <div className="myprofile-form-group">
                  <label>Phone Number *</label>
                  <div className="myprofile-phone-input-wrap">
                    <select className="myprofile-country-code">
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+91">+91</option>
                    </select>
                    <input 
                      type="text" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                <div className="myprofile-form-group">
                  <label>Role</label>
                  <input 
                    type="text" 
                    value={formData.role} 
                    disabled 
                    className="myprofile-disabled-input" 
                  />
                </div>
              </div>

              <div className="myprofile-form-group">
                <label>Address</label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="myprofile-form-row">
                <div className="myprofile-form-group">
                  <label>Language</label>
                  <select 
                    name="language" 
                    value={formData.language} 
                    onChange={handleInputChange}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
                <div className="myprofile-form-group">
                  <label>Time Zone</label>
                  <select 
                    name="timeZone" 
                    value={formData.timeZone} 
                    onChange={handleInputChange}
                  >
                    <option value="(UTC-05:00) Eastern Time (US & Canada)">(UTC-05:00) Eastern Time (US & Canada)</option>
                    <option value="(UTC-08:00) Pacific Time (US & Canada)">(UTC-08:00) Pacific Time (US & Canada)</option>
                    <option value="(UTC+00:00) Greenwich Mean Time">(UTC+00:00) Greenwich Mean Time</option>
                  </select>
                </div>
              </div>

              <div className="myprofile-form-group">
                <label>Bio</label>
                <textarea 
                  name="bio" 
                  rows="3" 
                  value={formData.bio} 
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <button type="submit" className="myprofile-submit-btn">
                Update Profile
              </button>
            </form>
          </div>

          {/* Right Side Preview & Info Panels */}
          {isRightPanelVisible && (
            <div className="myprofile-right-panels">
              <button className="myprofile-close-panel-btn" onClick={() => setIsRightPanelVisible(false)}>
                <FiX />
              </button>
              
              {/* Profile Preview Card */}
              <div className="myprofile-preview-card">
                <h4>Profile Preview</h4>
                <p className="myprofile-preview-sub">This is how your profile appears</p>
                
                <div className="myprofile-preview-box">
                  <div className="myprofile-preview-avatar">
                    {currentProfile.avatar ? (
                      <img src={currentProfile.avatar} alt="Avatar" />
                    ) : (
                      <div className="myprofile-preview-fallback">{currentProfile.name.charAt(0)}</div>
                    )}
                  </div>
                  <h3>{currentProfile.name}</h3>
                  <span className="myprofile-role-pill">{currentProfile.role}</span>

                  <div className="myprofile-preview-details">
                    <p><FiMail /> {currentProfile.email}</p>
                    <p><FiPhone /> {currentProfile.phone}</p>
                    <p><FiMapPin /> {currentProfile.address}</p>
                  </div>

                  <div className="myprofile-preview-footer">
                    <FiCalendar /> Member since May 12, 2025
                  </div>
                </div>
              </div>

              {/* Account Information Card */}
              <div className="myprofile-info-card">
                <h4>Account Information</h4>
                <div className="myprofile-info-row">
                  <span><FiUser /> User ID</span>
                  <span className="myprofile-info-val">DRVX-ADM-001</span>
                </div>
                <div className="myprofile-info-row">
                  <span><FiCalendar /> Account Created</span>
                  <span className="myprofile-info-val">{currentProfile.created}</span>
                </div>
                <div className="myprofile-info-row">
                  <span><FiClock /> Last Login</span>
                  <span className="myprofile-info-val">{currentProfile.lastLogin}</span>
                </div>
                <div className="myprofile-info-row">
                  <span><FiShield /> Account Status</span>
                  <span className="myprofile-badge-active">Active</span>
                </div>
                <div className="myprofile-info-row">
                  <span><FiLock /> Two-Factor Authentication</span>
                  <span className="myprofile-badge-disabled">Disabled</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: CHANGE PASSWORD */}
      {activeTab === 'Change Password' && (
        <div className="myprofile-tab-content-card">
          <h3>Change Password</h3>
          <p>Ensure your account is using a long, random password to stay secure.</p>
          <form onSubmit={handlePasswordUpdate} className="myprofile-password-form">
            <div className="myprofile-form-group">
              <label>Current Password *</label>
              <input 
                type="password" 
                value={passwordData.current} 
                onChange={(e) => setPasswordData({...passwordData, current: e.target.value})} 
                required 
              />
            </div>
            <div className="myprofile-form-group">
              <label>New Password *</label>
              <input 
                type="password" 
                value={passwordData.newPass} 
                onChange={(e) => setPasswordData({...passwordData, newPass: e.target.value})} 
                required 
              />
            </div>
            <div className="myprofile-form-group">
              <label>Confirm New Password *</label>
              <input 
                type="password" 
                value={passwordData.confirm} 
                onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})} 
                required 
              />
            </div>
            <button type="submit" className="myprofile-submit-btn">Update Password</button>
          </form>
        </div>
      )}

      {/* TAB 3: ACCOUNT PREFERENCES */}
      {activeTab === 'Account Preferences' && (
        <div className="myprofile-tab-content-card">
          <h3>Account Preferences</h3>
          <p>Manage your notification settings and display options.</p>
          <div className="myprofile-preferences-list">
            <label className="myprofile-checkbox-label">
              <input 
                type="checkbox" 
                checked={preferences.emailNotif} 
                onChange={() => setPreferences({...preferences, emailNotif: !preferences.emailNotif})} 
              />
              Receive Email Notifications for system updates
            </label>
            <label className="myprofile-checkbox-label">
              <input 
                type="checkbox" 
                checked={preferences.smsNotif} 
                onChange={() => setPreferences({...preferences, smsNotif: !preferences.smsNotif})} 
              />
              Receive SMS Alerts for booking activities
            </label>
            <label className="myprofile-checkbox-label">
              <input 
                type="checkbox" 
                checked={preferences.darkMode} 
                onChange={() => setPreferences({...preferences, darkMode: !preferences.darkMode})} 
              />
              Enable Dark Mode Theme interface
            </label>
            <label className="myprofile-checkbox-label">
              <input 
                type="checkbox" 
                checked={preferences.twoFactor} 
                onChange={() => setPreferences({...preferences, twoFactor: !preferences.twoFactor})} 
              />
              Require Two-Factor Authentication on login
            </label>
          </div>
          <button className="myprofile-submit-btn" onClick={() => alert('Preferences saved!')}>Save Preferences</button>
        </div>
      )}

      {/* Quick Actions Footer Card */}
      <div className="myprofile-quick-actions-card">
        <h4>Quick Actions</h4>
        <p>Manage your account security and preferences</p>
        <div className="myprofile-quick-grid">
          <div className="myprofile-quick-item" onClick={() => setActiveTab('Change Password')}>
            <div className="myprofile-quick-icon"><FiLock /></div>
            <div>
              <h5>Change Password</h5>
              <p>Update your account password</p>
            </div>
            <FiArrowRight className="myprofile-arrow" />
          </div>
          <div className="myprofile-quick-item" onClick={() => alert('Security settings modal')}>
            <div className="myprofile-quick-icon"><FiShield /></div>
            <div>
              <h5>Security Settings</h5>
              <p>Manage 2FA and login security</p>
            </div>
            <FiArrowRight className="myprofile-arrow" />
          </div>
          <div className="myprofile-quick-item" onClick={() => alert('Login activity logs')}>
            <div className="myprofile-quick-icon"><FiClock /></div>
            <div>
              <h5>Login Activity</h5>
              <p>View recent login sessions</p>
            </div>
            <FiArrowRight className="myprofile-arrow" />
          </div>
        </div>
      </div>

      {/* Add New Profile Modal Popup */}
      {showAddModal && (
        <div className="myprofile-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="myprofile-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="myprofile-modal-header">
              <h3>Add New Profile</h3>
              <button onClick={() => setShowAddModal(false)}><FiX /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('New profile added successfully!');
              setShowAddModal(false);
            }} className="myprofile-modal-form">
              <input type="text" placeholder="Full Name *" required />
              <input type="email" placeholder="Email Address *" required />
              <input type="text" placeholder="Phone Number *" required />
              <select>
                <option value="Super Admin">Super Admin</option>
                <option value="Manager">Manager</option>
                <option value="Support">Support Agent</option>
              </select>
              <div className="myprofile-modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="myprofile-modal-save-btn">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;