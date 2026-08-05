import React from 'react';
import { FaHome, FaUser, FaCog, FaChartBar, FaWallet } from 'react-icons/fa';
// 1. Import your logo image from the src/assets folder
// (Adjust the relative path and file extension based on where your assets folder is located)
import logoImage from '../../assets/Screenshot 2026-07-22 102103.png';

const Sidebar = ({ isCollapsed, isMobileOpen }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
    { name: 'Analytics', path: '/analytics', icon: <FaChartBar /> },
    { name: 'Users', path: '/users', icon: <FaUser /> },
    { name: 'Billing', path: '/billing', icon: <FaWallet /> },
    { name: 'Settings', path: '/settings', icon: <FaCog /> },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <a href="/dashboard" className="sidebar-logo">
          {/* 2. Use the imported variable inside the src attribute */}
          <img 
            src={logoImage} 
            alt="Logo" 
            className="sidebar-logo-img" 
          />
          <span className="sidebar-text">AdminPanel</span>
        </a>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index} className="sidebar-item">
            <a href={item.path} className="sidebar-link">
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-text">{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;