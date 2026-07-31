import React, { useState } from 'react';
import { FaBars, FaBell, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';
// 1. Import your profile image from the src/assets folder
// (Adjust the relative path and file extension based on where your assets folder is located)
import profileImage from '../../assets/Screenshot 2026-07-22 102103.png'; 

const Topbar = ({ toggleSidebar, currentPath }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <h1 className="topbar-title">{currentPath || 'Dashboard'}</h1>
      </div>

      <div className="topbar-right">
        {/* Notification Section */}
        <div className="topbar-notification-wrapper">
          <button 
            className="topbar-notification-btn" 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
          >
            <FaBell />
            <span className="notification-badge">3</span>
          </button>

          {showNotifications && (
            <div className="notification-popup">
              <div className="notification-header">Notifications</div>
              <div className="notification-item">New user registered</div>
              <div className="notification-item">Server load high</div>
              <div className="notification-item">Payment received</div>
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="topbar-profile-wrapper">
          <button 
            className="topbar-profile-btn" 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
          >
            {/* 2. Use the imported variable inside the src attribute */}
            <img 
              src={profileImage} 
              alt="Profile" 
              className="topbar-profile-img" 
            />
            <span className="topbar-profile-name">John Doe</span>
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <a href="/profile" className="profile-dropdown-item">
                <FaUserCircle style={{ marginRight: '8px' }} /> Profile
              </a>
              <a href="/settings" className="profile-dropdown-item">
                <FaCog style={{ marginRight: '8px' }} /> Settings
              </a>
              <button 
                onClick={() => alert('Logged out!')} 
                className="profile-dropdown-item"
              >
                <FaSignOutAlt style={{ marginRight: '8px' }} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;