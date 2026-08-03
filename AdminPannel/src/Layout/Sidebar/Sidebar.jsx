import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Car,
  Users,
  UserCheck,
  CreditCard,
  Star,
  Ticket,
  MapPin,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Crown,
  LogOut,
  X,
  ListFilter
} from "lucide-react";
import './Sidebar.css';

const MOBILE_BREAKPOINT = 768;

// All paths formatted cleanly to match App.jsx exactly
const menuConfig = [
  { type: 'link', icon: <LayoutDashboard size={20} />, text: 'Dashboard', path: '/dashboard' },
  { type: 'link', icon: <Car size={20} />, text: 'Vehicle Management', path: '/vehicle-management' },
  { type: 'link', icon: <ListFilter size={20} />, text: 'Feature Listing', path: '/feature-listing' },
  {
    type: 'dropdown',
    icon: <Calendar size={20} />,
    text: 'Bookings',
    badge: 12,
    children: [
      { text: 'Booking Requests', path: '/bookings/requests', badge: 5 },
      { text: 'All Bookings', path: '/bookings/all' },
      { text: 'Calendar', path: '/bookings/calendar' },
    ]
  },
  { type: 'link', icon: <Users size={20} />, text: 'Customers', path: '/customers' },
  { type: 'link', icon: <UserCheck size={20} />, text: 'Drivers', path: '/drivers' },
  { type: 'link', icon: <CreditCard size={20} />, text: 'Payments', path: '/payments' },
  { type: 'link', icon: <Star size={20} />, text: 'Reviews', path: '/reviews' },
  { type: 'link', icon: <Ticket size={20} />, text: 'Coupons', path: '/coupons' },
  { type: 'link', icon: <MapPin size={20} />, text: 'Locations', path: '/locations' },
  { type: 'link', icon: <BarChart3 size={20} />, text: 'Reports', path: '/reports' },
  { type: 'link', icon: <Settings size={20} />, text: 'Settings', path: '/settings' },
  { type: 'link', icon: <Car size={20} />, text: 'Vehiclelist', path: '/vechilelist' },
];

const Sidebar = ({
  isCollapsed = false,
  isMobileOpen = false,
  onLogout = () => {},
  onClose = () => {},
  onToggleCollapse = null,
}) => {
  const location = useLocation();

  const activeParent = menuConfig.find(
    (item) =>
      item.type === 'dropdown' &&
      item.children.some((child) => location.pathname === child.path)
  );

  const [openSubMenu, setOpenSubMenu] = useState(activeParent ? activeParent.text : null);
  const [flyout, setFlyout] = useState(null);

  useEffect(() => {
    const match = menuConfig.find(
      (item) =>
        item.type === 'dropdown' &&
        item.children.some((child) => location.pathname === child.path)
    );
    if (match) setOpenSubMenu(match.text);
  }, [location.pathname]);

  useEffect(() => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) onClose();
  }, [location.pathname, onClose]);

  const toggleSubMenu = (title) => {
    setOpenSubMenu((prev) => (prev === title ? null : title));
  };

  const handleNavClick = useCallback(() => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isMobileOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileOpen, onClose]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT && isMobileOpen) onClose();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen, onClose]);

  const isChildActive = (item) =>
    item.children?.some((child) => location.pathname === child.path);

  return (
    <>
      {isMobileOpen && <div className="Sidebar-backdrop" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`Sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
        aria-label="Main navigation"
      >
        <button
          type="button"
          className="Sidebar-close-btn"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="Sidebar-header">
          <div className="Sidebar-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 17H5M19 17C20.1046 17 21 16.1046 21 15V11C21 9.89543 20.1046 9 19 9H18.2807C17.587 9 16.9472 8.64131 16.5811 8.05562L15.1182 5.71495C14.5691 4.83637 13.6095 4.3 12.5736 4.3H11.4264C10.3905 4.3 9.43093 4.83637 8.88179 5.71495L7.41886 8.05562C7.0528 8.64131 6.41298 9 5.7193 9H5C3.89543 9 3 9.89543 3 11V15C3 16.1046 3.89543 17 5 17M19 17V18C19 18.5523 18.5523 19 18 19H17C16.4477 19 16 18.5523 16 18V17M5 17V18C5 18.5523 5.44772 19 6 19H7C7.55228 19 8 18.5523 8 18V17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7.5" cy="13.5" r="1.5" fill="#fff"/>
              <circle cx="16.5" cy="13.5" r="1.5" fill="#fff"/>
            </svg>
          </div>
          {!isCollapsed && (
            <div className="Sidebar-brand-text">
              <span className="brand-name">Drive<span className="brand-accent">X</span></span>
              <span className="brand-sub">Car Rental Admin</span>
            </div>
          )}

          {onToggleCollapse && (
            <button
              type="button"
              className="Sidebar-collapse-btn"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="Sidebar-nav">
          {menuConfig.map((item) => {
            if (item.type === 'link') {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.text}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`Sidebar-link ${isActive ? 'active' : ''}`}
                  title={isCollapsed ? item.text : undefined}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="Sidebar-icon">{item.icon}</span>
                  {!isCollapsed && <span className="Sidebar-text">{item.text}</span>}
                </Link>
              );
            }

            const isSubOpen = openSubMenu === item.text;
            const childActive = isChildActive(item);
            const showFlyout = isCollapsed && flyout === item.text;

            return (
              <div
                key={item.text}
                className={`Sidebar-dropdown-wrapper ${isSubOpen ? 'is-open' : ''}`}
                onMouseEnter={() => isCollapsed && setFlyout(item.text)}
                onMouseLeave={() => isCollapsed && setFlyout(null)}
              >
                <button
                  type="button"
                  className={`Sidebar-link ${childActive || isSubOpen ? 'parent-active' : ''}`}
                  onClick={() => !isCollapsed && toggleSubMenu(item.text)}
                  title={isCollapsed ? item.text : undefined}
                  aria-expanded={isSubOpen}
                >
                  <span className="Sidebar-icon">
                    {item.icon}
                    {isCollapsed && item.badge ? <span className="Sidebar-dot" /> : null}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="Sidebar-text">{item.text}</span>
                      {item.badge ? <span className="Sidebar-badge">{item.badge}</span> : null}
                      <ChevronDown size={15} className={`Sidebar-chevron ${isSubOpen ? 'rotated' : ''}`} />
                    </>
                  )}
                </button>

                {/* Submenu Dropdown */}
                {!isCollapsed && isSubOpen && (
                  <div className="Sidebar-submenu">
                    <div className="submenu-tree-line" />
                    {item.children.map((child) => {
                      const isSubActive = location.pathname === child.path;
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={handleNavClick}
                          className={`Sidebar-sublink ${isSubActive ? 'active' : ''}`}
                          aria-current={isSubActive ? 'page' : undefined}
                        >
                          <span className="sublink-text">{child.text}</span>
                          {child.badge ? <span className="Sidebar-badge sub-badge">{child.badge}</span> : null}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Collapsed Rail Flyout */}
                {showFlyout && (
                  <div className="Sidebar-flyout">
                    <div className="Sidebar-flyout-title">{item.text}</div>
                    {item.children.map((child) => {
                      const isSubActive = location.pathname === child.path;
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={handleNavClick}
                          className={`Sidebar-flyout-link ${isSubActive ? 'active' : ''}`}
                        >
                          {child.text}
                          {child.badge ? <span className="Sidebar-badge sub-badge">{child.badge}</span> : null}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Upgrade Card */}
        {!isCollapsed && (
          <div className="Sidebar-upgrade-card">
            <div className="upgrade-shine" aria-hidden="true" />
            <div className="upgrade-icon-wrap">
              <Crown size={22} />
            </div>
            <h4>Upgrade to Premium</h4>
            <p>Unlock all features and get more benefits.</p>
            <button type="button" className="upgrade-btn">Upgrade Now</button>
          </div>
        )}

        {/* Profile Footer */}
        <div className="Sidebar-footer">
          <div className="Sidebar-user-avatar">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="User Avatar"
            />
            <span className="Sidebar-status-dot" aria-hidden="true" />
          </div>
          {!isCollapsed && (
            <div className="Sidebar-user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">Super Admin</span>
            </div>
          )}
          <button
            type="button"
            className="logout-btn"
            onClick={onLogout}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;