import React, {
  useState,
  useEffect,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  LayoutDashboard,
  Calendar,
  Car,
  Users,
  CreditCard,
  Star,
  BarChart3,
  Settings,
  ChevronDown,
  Crown,
  LogOut,
  X,
} from "lucide-react";

import "./Sidebar.css";

const MOBILE_BREAKPOINT = 768;

// =====================================================
// MENU CONFIG
// =====================================================

const menuConfig = [
  {
    type: "link",
    icon: <LayoutDashboard size={20} />,
    text: "Dashboard",
    path: "/dashboard",
  },

  {
    type: "dropdown",
    icon: <Car size={20} />,
    text: "Vehicle Management",

    children: [
      {
        text: "Vehicles Post",
        path: "/feature-listing",
      },
      {
        text: "Locations Post",
        path: "/locations",
      },
      {
        text: "Category Post",
        path: "/category",
      },
    ],
  },

  {
    type: "dropdown",
    icon: <Calendar size={20} />,
    text: "Bookings",
    badge: 12,

    children: [
      {
        text: "Booking Requests",
        path: "/bookings/requests",
        badge: 5,
      },
      {
        text: "All Bookings",
        path: "/bookings/all",
      },
      {
        text: "Calendar",
        path: "/bookings/calendar",
      },
    ],
  },

  {
    type: "link",
    icon: <Users size={20} />,
    text: "Customers Enquiry",
    path: "/enquiry",
  },

  {
    type: "link",
    icon: <CreditCard size={20} />,
    text: "Payments",
    path: "/payments",
  },

  {
    type: "link",
    icon: <Star size={20} />,
    text: "Reviews",
    path: "/reviews",
  },

  {
    type: "link",
    icon: <BarChart3 size={20} />,
    text: "Reports",
    path: "/reports",
  },

  {
    type: "link",
    icon: <Settings size={20} />,
    text: "Settings",
    path: "/settings",
  },
];

// =====================================================
// SIDEBAR
// =====================================================

const Sidebar = ({
  isCollapsed = false,
  isMobileOpen = false,
  onLogout = () => {},
  onClose = () => {},
  onToggleCollapse = null,
}) => {
  const location = useLocation();

  // ===================================================
  // ADMIN
  // ===================================================

  const [admin, setAdmin] = useState({
    username: "Admin User",
    role: "Super Admin",
  });

  const [adminLoading, setAdminLoading] =
    useState(true);

  // ===================================================
  // LOAD ADMIN FROM LOCAL STORAGE
  // ===================================================

  useEffect(() => {
    try {
      const savedAdmin =
        localStorage.getItem("adminUser");

      if (savedAdmin) {
        const parsedAdmin =
          JSON.parse(savedAdmin);

        setAdmin({
          username:
            parsedAdmin.username ||
            parsedAdmin.name ||
            "Admin User",

          role:
            parsedAdmin.role ||
            "Super Admin",
        });
      }
    } catch (error) {
      console.error(
        "ADMIN DATA ERROR:",
        error
      );
    } finally {
      setAdminLoading(false);
    }
  }, []);

  // ===================================================
  // ACTIVE PARENT
  // ===================================================

  const getActiveParent = () => {
    return menuConfig.find(
      (item) =>
        item.type === "dropdown" &&
        item.children?.some(
          (child) =>
            location.pathname ===
            child.path
        )
    );
  };

  const activeParent =
    getActiveParent();

  const [
    openSubMenu,
    setOpenSubMenu,
  ] = useState(
    activeParent
      ? activeParent.text
      : null
  );

  const [flyout, setFlyout] =
    useState(null);

  // ===================================================
  // OPEN ACTIVE SUBMENU
  // ===================================================

  useEffect(() => {
    const match =
      menuConfig.find(
        (item) =>
          item.type === "dropdown" &&
          item.children?.some(
            (child) =>
              location.pathname ===
              child.path
          )
      );

    if (match) {
      setOpenSubMenu(match.text);
    }
  }, [location.pathname]);

  // ===================================================
  // NAV CLICK
  // ===================================================

  const handleNavClick = () => {
    if (
      window.innerWidth <=
      MOBILE_BREAKPOINT
    ) {
      onClose();
    }
  };

  // ===================================================
  // ESCAPE KEY + BODY SCROLL
  // ===================================================

  useEffect(() => {
    if (!isMobileOpen) {
      return undefined;
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        "";
    };
  }, [
    isMobileOpen,
    onClose,
  ]);

  // ===================================================
  // RESIZE
  // ===================================================

  useEffect(() => {
    const handleResize = () => {
      if (
        window.innerWidth >
          MOBILE_BREAKPOINT &&
        isMobileOpen
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [
    isMobileOpen,
    onClose,
  ]);

  // ===================================================
  // CHILD ACTIVE
  // ===================================================

  const isChildActive = (item) =>
    item.children?.some(
      (child) =>
        location.pathname ===
        child.path
    );

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogoutClick = () => {
    // Remove every old authentication key
    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminAuth"
    );

    localStorage.removeItem(
      "isAdminAuthenticated"
    );

    localStorage.removeItem(
      "adminUser"
    );

    sessionStorage.removeItem(
      "isAdminAuthenticated"
    );

    // Close sidebar
    onClose();

    // Parent logout callback
    onLogout();

    // Completely leave protected admin panel
    window.location.replace("/login");
  };

  // ===================================================
  // RETURN
  // ===================================================

  return (
    <>
      {/* =================================================
          MOBILE BACKDROP
      ================================================= */}

      {isMobileOpen && (
        <div
          className="Sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`Sidebar ${
          isCollapsed
            ? "collapsed"
            : ""
        } ${
          isMobileOpen
            ? "mobile-open"
            : ""
        }`}
        aria-label="Main navigation"
      >

        {/* MOBILE CLOSE */}

        <button
          type="button"
          className="Sidebar-close-btn"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        {/* =================================================
            BRAND HEADER
        ================================================= */}

        <div className="Sidebar-header">

          <div className="Sidebar-logo-icon">

            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 17H5M19 17C20.1046 17 21 16.1046 21 15V11C21 9.89543 20.1046 9 19 9H18.2807C17.587 9 16.9472 8.64131 16.5811 8.05562L15.1182 5.71495C14.5691 4.83637 13.6095 4.3 12.5736 4.3H11.4264C10.3905 4.3 9.43093 4.83637 8.88179 5.71495L7.41886 8.05562C7.0528 8.64131 6.41298 9 5.7193 9H5C3.89543 9 3 9.89543 3 11V15C3 16.1046 3.89543 17 5 17M19 17V18C19 18.5523 18.5523 19 18 19H17C16.4477 19 16 18.5523 16 18V17M5 17V18C5 18.5523 5.44772 19 6 19H7C7.55228 19 8 18.5523 8 17"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="7.5"
                cy="13.5"
                r="1.5"
                fill="#fff"
              />

              <circle
                cx="16.5"
                cy="13.5"
                r="1.5"
                fill="#fff"
              />
            </svg>

          </div>

          {!isCollapsed && (
            <div className="Sidebar-brand-text">

              <span className="brand-name">
                Young Drive
                <span className="brand-accent">
                  S
                </span>
              </span>

              <span className="brand-sub">
                Car Rental Admin
              </span>

            </div>
          )}

        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="Sidebar-nav">

          {menuConfig.map((item) => {

            {/* =================================================
                NORMAL LINK
            ================================================= */}

            if (
              item.type === "link"
            ) {
              const isActive =
                location.pathname ===
                item.path;

              return (
                <Link
                  key={item.text}
                  to={item.path}
                  onClick={
                    handleNavClick
                  }
                  className={`Sidebar-link ${
                    isActive
                      ? "active"
                      : ""
                  }`}
                  title={
                    isCollapsed
                      ? item.text
                      : undefined
                  }
                  aria-current={
                    isActive
                      ? "page"
                      : undefined
                  }
                >

                  <span className="Sidebar-icon">
                    {item.icon}
                  </span>

                  {!isCollapsed && (
                    <span className="Sidebar-text">
                      {item.text}
                    </span>
                  )}

                </Link>
              );
            }

            {/* =================================================
                DROPDOWN
            ================================================= */}

            const isSubOpen =
              openSubMenu ===
              item.text;

            const childActive =
              isChildActive(item);

            const showFlyout =
              isCollapsed &&
              flyout ===
                item.text;

            return (
              <div
                key={item.text}
                className={`Sidebar-dropdown-wrapper ${
                  isSubOpen
                    ? "is-open"
                    : ""
                }`}
                onMouseEnter={() =>
                  isCollapsed &&
                  setFlyout(
                    item.text
                  )
                }
                onMouseLeave={() =>
                  isCollapsed &&
                  setFlyout(null)
                }
              >

                {/* PARENT BUTTON */}

                <button
                  type="button"
                  className={`Sidebar-link ${
                    childActive ||
                    isSubOpen
                      ? "parent-active"
                      : ""
                  }`}
                  onClick={() => {
                    if (!isCollapsed) {
                      setOpenSubMenu(
                        (prev) =>
                          prev ===
                          item.text
                            ? null
                            : item.text
                      );
                    }
                  }}
                  title={
                    isCollapsed
                      ? item.text
                      : undefined
                  }
                  aria-expanded={
                    isSubOpen
                  }
                >

                  <span className="Sidebar-icon">

                    {item.icon}

                    {isCollapsed &&
                    item.badge ? (
                      <span className="Sidebar-dot" />
                    ) : null}

                  </span>

                  {!isCollapsed && (
                    <>
                      <span className="Sidebar-text">
                        {item.text}
                      </span>

                      {item.badge ? (
                        <span className="Sidebar-badge">
                          {item.badge}
                        </span>
                      ) : null}

                      <ChevronDown
                        size={15}
                        className={`Sidebar-chevron ${
                          isSubOpen
                            ? "rotated"
                            : ""
                        }`}
                      />
                    </>
                  )}

                </button>

                {/* =================================================
                    NORMAL SUBMENU
                ================================================= */}

                {!isCollapsed &&
                  isSubOpen && (
                    <div className="Sidebar-submenu">

                      <div className="submenu-tree-line" />

                      {item.children.map(
                        (child) => {

                          const isSubActive =
                            location.pathname ===
                            child.path;

                          return (
                            <Link
                              key={
                                child.path
                              }
                              to={
                                child.path
                              }
                              onClick={
                                handleNavClick
                              }
                              className={`Sidebar-sublink ${
                                isSubActive
                                  ? "active"
                                  : ""
                              }`}
                              aria-current={
                                isSubActive
                                  ? "page"
                                  : undefined
                              }
                            >

                              <span className="sublink-text">
                                {
                                  child.text
                                }
                              </span>

                              {child.badge ? (
                                <span className="Sidebar-badge sub-badge">
                                  {
                                    child.badge
                                  }
                                </span>
                              ) : null}

                            </Link>
                          );
                        }
                      )}

                    </div>
                  )}

                {/* =================================================
                    COLLAPSED FLYOUT
                ================================================= */}

                {showFlyout && (
                  <div className="Sidebar-flyout">

                    <div className="Sidebar-flyout-title">
                      {item.text}
                    </div>

                    {item.children.map(
                      (child) => {

                        const isSubActive =
                          location.pathname ===
                          child.path;

                        return (
                          <Link
                            key={
                              child.path
                            }
                            to={
                              child.path
                            }
                            onClick={
                              handleNavClick
                            }
                            className={`Sidebar-flyout-link ${
                              isSubActive
                                ? "active"
                                : ""
                            }`}
                          >

                            {child.text}

                            {child.badge ? (
                              <span className="Sidebar-badge sub-badge">
                                {
                                  child.badge
                                }
                              </span>
                            ) : null}

                          </Link>
                        );
                      }
                    )}

                  </div>
                )}

              </div>
            );
          })}

        </nav>

        {/* =================================================
            PREMIUM CARD
        ================================================= */}

        {!isCollapsed && (
          <div className="Sidebar-upgrade-card">

            <div
              className="upgrade-shine"
              aria-hidden="true"
            />

            <div className="upgrade-icon-wrap">
              <Crown size={22} />
            </div>

            <h4>
              Upgrade to Premium
            </h4>

            <p>
              Unlock all features and
              get more benefits.
            </p>

            <button
              type="button"
              className="upgrade-btn"
            >
              Upgrade Now
            </button>

          </div>
        )}

        {/* =================================================
            ADMIN PROFILE FOOTER
        ================================================= */}

        <div className="Sidebar-footer">

          <div className="Sidebar-user-avatar">

            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Admin Avatar"
            />

            <span
              className="Sidebar-status-dot"
              aria-hidden="true"
            />

          </div>

          {!isCollapsed && (
            <div className="Sidebar-user-info">

              <span className="user-name">
                {adminLoading
                  ? "Loading..."
                  : admin.username}
              </span>

              <span className="user-role">
                {adminLoading
                  ? "..."
                  : admin.role}
              </span>

            </div>
          )}

          {/* LOGOUT */}

          <button
            type="button"
            className="logout-btn"
            onClick={
              handleLogoutClick
            }
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