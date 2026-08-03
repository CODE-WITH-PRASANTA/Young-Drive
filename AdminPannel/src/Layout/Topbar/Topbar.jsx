import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  X,
  Bell,
  MessageSquare,
  ChevronDown,
  User,
  Settings,
  Shield,
  LogOut,
  Info,
  AlertTriangle,
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import './Topbar.css';

const DEFAULT_NOTIFICATIONS = [
  { id: 1, type: 'info', title: 'New Delivery', subtitle: 'Patia — Rahul Kumar', time: '10:30 AM' },
  { id: 2, type: 'warning', title: 'Low Stock Alert', subtitle: 'Only 20 jars remaining', time: '10:15 AM' },
  { id: 3, type: 'payment', title: 'Payment Due', subtitle: 'Amit Rout — ₹80', time: '09:45 AM' },
  { id: 4, type: 'order', title: 'New Order Received', subtitle: 'KIIT Square', time: '09:20 AM' },
];

const DEFAULT_MESSAGES = [
  { id: 1, name: 'Rahul Kumar', preview: 'Is my order out for delivery yet?', time: '2m', avatar: 'https://i.pravatar.cc/64?img=12' },
  { id: 2, name: 'Priya Singh', preview: 'Thanks, received it in perfect condition!', time: '18m', avatar: 'https://i.pravatar.cc/64?img=32' },
  { id: 3, name: 'Amit Rout', preview: 'Can I reschedule to tomorrow morning?', time: '1h', avatar: 'https://i.pravatar.cc/64?img=51' },
];

const NOTIF_ICON = {
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
  payment: <CreditCard size={18} />,
  order: <ShoppingBag size={18} />,
};

const Topbar = ({
  toggleSidebar = () => {},
  user = { name: 'Admin User', role: 'Super Admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  notifications = DEFAULT_NOTIFICATIONS,
  messages = DEFAULT_MESSAGES,
  onSearch = () => {},
  onLogout = null,
}) => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const searchRef = useRef(null);
  const searchTriggerRef = useRef(null);
  const notificationsRef = useRef(null);
  const messagesRef = useRef(null);
  const userRef = useRef(null);

  const closeAllPopovers = useCallback(() => {
    setNotificationsOpen(false);
    setMessagesOpen(false);
    setUserOpen(false);
  }, []);

  const closeMobileSearch = useCallback(() => {
    setMobileSearchOpen(false);
    searchTriggerRef.current?.focus();
  }, []);

  // Click-outside handling for every popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setMessagesOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ctrl/Cmd+K opens & focuses search, Escape closes whatever is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isSearchShortcut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
      if (isSearchShortcut) {
        e.preventDefault();
        closeAllPopovers();
        setMobileSearchOpen(true);
        requestAnimationFrame(() => searchRef.current?.focus());
        return;
      }
      if (e.key === 'Escape') {
        if (document.activeElement === searchRef.current) {
          setSearchValue('');
          searchRef.current.blur();
        }
        setMobileSearchOpen(false);
        closeAllPopovers();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeAllPopovers]);

  // Keep things sane if the window is resized past the mobile breakpoint
  // while the search overlay happens to be open
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 720 && mobileSearchOpen) {
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileSearchOpen]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue('');
    searchRef.current?.focus();
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setUserOpen(false);
    if (onLogout) {
      onLogout();
      return;
    }
    sessionStorage.removeItem('isAdminAuthenticated');
    sessionStorage.removeItem('deliveryPartner');
    navigate('/login', { replace: true });
  };

  const openOnly = (setter) => {
    closeAllPopovers();
    setMobileSearchOpen(false);
    setter(true);
  };

  // Placeholder nav items — swap hrefs for real routes; preventDefault stops
  // the "#" jump-scroll every anchor tag would otherwise trigger
  const handleMenuItemClick = (e) => {
    e.preventDefault();
    setUserOpen(false);
  };

  const handleFooterLinkClick = (e) => {
    e.preventDefault();
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="Topbar">
      <div className="Topbar-left">
        <button
          type="button"
          className="Topbar-icon-btn Topbar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className={`Topbar-search ${mobileSearchOpen ? 'mobile-active' : ''}`}>
          <Search size={17} className="Topbar-search-icon" />
          <input
            ref={searchRef}
            type="text"
            className="Topbar-search-input"
            placeholder="Search here..."
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={() => setMobileSearchOpen(true)}
            aria-label="Search"
          />
          {searchValue ? (
            <button type="button" className="Topbar-search-clear" onClick={clearSearch} aria-label="Clear search">
              <X size={14} />
            </button>
          ) : (
            <kbd className="Topbar-kbd">Ctrl + K</kbd>
          )}
          <button
            type="button"
            className="Topbar-search-close"
            onClick={closeMobileSearch}
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>

        <button
          ref={searchTriggerRef}
          type="button"
          className={`Topbar-icon-btn Topbar-search-trigger ${mobileSearchOpen ? 'is-hidden' : ''}`}
          onClick={() => {
            closeAllPopovers();
            setMobileSearchOpen(true);
            requestAnimationFrame(() => searchRef.current?.focus());
          }}
          aria-label="Open search"
        >
          <Search size={19} />
        </button>
      </div>

      <div className={`Topbar-right ${mobileSearchOpen ? 'is-hidden' : ''}`}>
        {/* Notifications */}
        <div className="Topbar-popover-wrap" ref={notificationsRef}>
          <button
            type="button"
            className={`Topbar-icon-btn ${notificationsOpen ? 'is-active' : ''}`}
            onClick={() => (notificationsOpen ? setNotificationsOpen(false) : openOnly(setNotificationsOpen))}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell size={19} />
            {notifications.length > 0 && <span className="Topbar-badge">{notifications.length}</span>}
          </button>

          <div className={`Topbar-popover Topbar-notifications ${notificationsOpen ? 'is-open' : ''}`}>
            <div className="Topbar-popover-header">
              <h3>Notifications</h3>
              <span className="Topbar-popover-count">{notifications.length} new</span>
            </div>
            <div className="Topbar-popover-list">
              {notifications.map((n) => (
                <div className="Notification-item" key={n.id}>
                  <div className={`Notification-icon-wrap ${n.type}`}>{NOTIF_ICON[n.type]}</div>
                  <div className="Notification-content">
                    <p className="Notification-title-text">{n.title}</p>
                    <p className="Notification-subtitle">{n.subtitle}</p>
                  </div>
                  <span className="Notification-time">{n.time}</span>
                </div>
              ))}
              {notifications.length === 0 && <p className="Topbar-empty">You're all caught up.</p>}
            </div>
            <div className="Topbar-popover-footer">
              <a href="#viewall" onClick={handleFooterLinkClick}>View all notifications</a>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="Topbar-popover-wrap" ref={messagesRef}>
          <button
            type="button"
            className={`Topbar-icon-btn ${messagesOpen ? 'is-active' : ''}`}
            onClick={() => (messagesOpen ? setMessagesOpen(false) : openOnly(setMessagesOpen))}
            aria-label="Messages"
            aria-expanded={messagesOpen}
          >
            <MessageSquare size={19} />
            {messages.length > 0 && <span className="Topbar-badge">{messages.length}</span>}
          </button>

          <div className={`Topbar-popover Topbar-messages ${messagesOpen ? 'is-open' : ''}`}>
            <div className="Topbar-popover-header">
              <h3>Messages</h3>
              <span className="Topbar-popover-count">{messages.length} unread</span>
            </div>
            <div className="Topbar-popover-list">
              {messages.map((m) => (
                <div className="Message-item" key={m.id}>
                  <img className="Message-avatar" src={m.avatar} alt="" />
                  <div className="Notification-content">
                    <p className="Notification-title-text">{m.name}</p>
                    <p className="Notification-subtitle">{m.preview}</p>
                  </div>
                  <span className="Notification-time">{m.time}</span>
                </div>
              ))}
              {messages.length === 0 && <p className="Topbar-empty">No new messages.</p>}
            </div>
            <div className="Topbar-popover-footer">
              <a href="#viewall" onClick={handleFooterLinkClick}>Open inbox</a>
            </div>
          </div>
        </div>

        <div className="Topbar-divider" aria-hidden="true" />

        {/* User */}
        <div className="Topbar-popover-wrap" ref={userRef}>
          <button
            type="button"
            className={`Topbar-user ${userOpen ? 'is-active' : ''}`}
            onClick={() => (userOpen ? setUserOpen(false) : openOnly(setUserOpen))}
            aria-expanded={userOpen}
            aria-label="Account menu"
          >
            <span className="Topbar-avatar-wrap">
              {avatarError ? (
                <span className="Topbar-avatar-fallback">{initials}</span>
              ) : (
                <img
                  className="Topbar-avatar"
                  src={user.avatar}
                  alt=""
                  onError={() => setAvatarError(true)}
                />
              )}
              <span className="Topbar-avatar-status" />
            </span>
            <span className="Topbar-user-info">
              <span className="Topbar-username">{user.name}</span>
              <span className="Topbar-role">{user.role}</span>
            </span>
            <ChevronDown size={16} className={`Topbar-chevron ${userOpen ? 'rotated' : ''}`} />
          </button>

          <div className={`Topbar-popover Topbar-user-menu ${userOpen ? 'is-open' : ''}`}>
            <div className="Topbar-user-menu-header">
              <span className="Topbar-username">{user.name}</span>
              <span className="Topbar-role">{user.role}</span>
            </div>
            <a href="#profile" className="Topbar-menu-item" onClick={handleMenuItemClick}>
              <User size={16} /> My Profile
            </a>
            <a href="#settings" className="Topbar-menu-item" onClick={handleMenuItemClick}>
              <Settings size={16} /> Settings
            </a>
            <a href="#security" className="Topbar-menu-item" onClick={handleMenuItemClick}>
              <Shield size={16} /> Security
            </a>
            <div className="Topbar-menu-divider" />
            <a href="#logout" className="Topbar-menu-item logout" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </a>
          </div>
        </div>
      </div>

      {/* Full-bleed overlay behind the mobile search bar so tapping
          anywhere outside it closes it, same pattern as the popovers */}
      {mobileSearchOpen && (
        <div className="Topbar-search-backdrop" onClick={closeMobileSearch} aria-hidden="true" />
      )}

      {/* Dimmed backdrop behind notification/message/user popovers on
          small screens — makes them read as an intentional modal card
          rather than a stray floating box, and doubles as a big
          tap-anywhere-to-close target */}
      {(notificationsOpen || messagesOpen || userOpen) && (
        <div className="Topbar-popover-backdrop" onClick={closeAllPopovers} aria-hidden="true" />
      )}
    </header>
  );
};

export default Topbar;