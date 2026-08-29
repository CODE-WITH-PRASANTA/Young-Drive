import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

import { useNavigate } from "react-router-dom";

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
  ShoppingBag,
} from "lucide-react";

import "./Topbar.css";

// IMPORTANT:
// Change this import path only if your axios file is located elsewhere.
import API from "../../api/axios";

/* =========================================
   DEFAULT NOTIFICATIONS
========================================= */

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    type: "info",
    title: "New Delivery",
    subtitle: "Patia — Rahul Kumar",
    time: "10:30 AM",
  },
  {
    id: 2,
    type: "warning",
    title: "Low Stock Alert",
    subtitle: "Only 20 jars remaining",
    time: "10:15 AM",
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Due",
    subtitle: "Amit Rout — ₹80",
    time: "09:45 AM",
  },
  {
    id: 4,
    type: "order",
    title: "New Order Received",
    subtitle: "KIIT Square",
    time: "09:20 AM",
  },
];

/* =========================================
   DEFAULT MESSAGES
========================================= */

const DEFAULT_MESSAGES = [
  {
    id: 1,
    name: "Rahul Kumar",
    preview: "Is my order out for delivery yet?",
    time: "2m",
    avatar:
      "https://i.pravatar.cc/64?img=12",
  },
  {
    id: 2,
    name: "Priya Singh",
    preview:
      "Thanks, received it in perfect condition!",
    time: "18m",
    avatar:
      "https://i.pravatar.cc/64?img=32",
  },
  {
    id: 3,
    name: "Amit Rout",
    preview:
      "Can I reschedule to tomorrow morning?",
    time: "1h",
    avatar:
      "https://i.pravatar.cc/64?img=51",
  },
];

/* =========================================
   NOTIFICATION ICONS
========================================= */

const NOTIF_ICON = {
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
  payment: <CreditCard size={18} />,
  order: <ShoppingBag size={18} />,
};

/* =========================================
   DEFAULT ADMIN
========================================= */

const DEFAULT_ADMIN = {
  name: "Admin User",
  username: "admin",
  email: "",
  role: "Super Admin",
  avatar: null,
};

/* =========================================
   TOPBAR
========================================= */

const Topbar = ({
  toggleSidebar = () => {},
  user: userProp = null,
  notifications = DEFAULT_NOTIFICATIONS,
  messages = DEFAULT_MESSAGES,
  onSearch = () => {},
  onLogout = null,
}) => {
  const navigate = useNavigate();

  /* =========================================
     ADMIN STATE
  ========================================= */

  const [user, setUser] = useState(
    userProp || DEFAULT_ADMIN
  );

  const [loadingUser, setLoadingUser] =
    useState(false);

  /* =========================================
     STATES
  ========================================= */

  const [searchValue, setSearchValue] =
    useState("");

  const [mobileSearchOpen, setMobileSearchOpen] =
    useState(false);

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [messagesOpen, setMessagesOpen] =
    useState(false);

  const [userOpen, setUserOpen] =
    useState(false);

  const [avatarError, setAvatarError] =
    useState(false);

  /* =========================================
     REFS
  ========================================= */

  const searchRef = useRef(null);

  const searchTriggerRef =
    useRef(null);

  const notificationsRef =
    useRef(null);

  const messagesRef =
    useRef(null);

  const userRef =
    useRef(null);

  /* =========================================
     LOAD ADMIN
  ========================================= */

  const loadAdmin = useCallback(
    async () => {
      const token =
        localStorage.getItem(
          "adminToken"
        );

      /*
       * No token means user is not logged in.
       */
      if (!token) {
        setUser(DEFAULT_ADMIN);
        return;
      }

      /*
       * First load cached admin information.
       * This makes the UI appear immediately.
       */
      try {
        const storedAdmin =
          localStorage.getItem(
            "adminUser"
          );

        if (storedAdmin) {
          const parsedAdmin =
            JSON.parse(storedAdmin);

          setUser((prev) => ({
            ...prev,
            ...parsedAdmin,
          }));
        }
      } catch (error) {
        console.error(
          "ADMIN LOCAL STORAGE ERROR:",
          error
        );
      }

      /*
       * Then get the latest admin
       * information from backend.
       */
      try {
        setLoadingUser(true);

        const response =
          await API.get("/auth/me");

        const admin =
          response.data?.admin;

        if (!admin) {
          return;
        }

        const adminData = {
          id:
            admin._id ||
            admin.id,

          name:
            admin.name ||
            admin.username ||
            "Admin User",

          username:
            admin.username ||
            "",

          email:
            admin.email ||
            "",

          phone:
            admin.phone ||
            "",

          role:
            admin.role ||
            "Super Admin",

          avatar:
            admin.avatar ||
            null,
        };

        setUser(adminData);

        /*
         * Save latest admin information
         * for the rest of the application.
         */
        localStorage.setItem(
          "adminUser",
          JSON.stringify(
            adminData
          )
        );

        /*
         * Reset avatar error after
         * receiving a new avatar.
         */
        setAvatarError(false);
      } catch (error) {
        console.error(
          "ADMIN FETCH ERROR:",
          error
        );

        /*
         * Invalid/expired token.
         */
        if (
          error.response?.status ===
          401
        ) {
          localStorage.removeItem(
            "adminToken"
          );

          localStorage.removeItem(
            "adminAuth"
          );

          localStorage.removeItem(
            "adminUser"
          );

          navigate("/login", {
            replace: true,
          });
        }
      } finally {
        setLoadingUser(false);
      }
    },
    [navigate]
  );

  /* =========================================
     FETCH ADMIN WHEN TOPBAR LOADS
  ========================================= */

  useEffect(() => {
    loadAdmin();
  }, [loadAdmin]);

  /* =========================================
     UPDATE WHEN USER PROP CHANGES
  ========================================= */

  useEffect(() => {
    if (userProp) {
      setUser((prev) => ({
        ...prev,
        ...userProp,
      }));

      setAvatarError(false);
    }
  }, [userProp]);

  /* =========================================
     UPDATE AFTER PROFILE CHANGE
  ========================================= */

  useEffect(() => {
    const handleStorageChange = (
      event
    ) => {
      if (
        event.key ===
        "adminUser"
      ) {
        loadAdmin();
      }

      if (
        event.key ===
        "adminToken"
      ) {
        loadAdmin();
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    /*
     * Custom event allows MyProfile
     * in the same browser tab to
     * notify Topbar.
     */
    const handleAdminUpdated = () => {
      loadAdmin();
    };

    window.addEventListener(
      "adminProfileUpdated",
      handleAdminUpdated
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "adminProfileUpdated",
        handleAdminUpdated
      );
    };
  }, [loadAdmin]);

  /* =========================================
     CLOSE ALL POPOVERS
  ========================================= */

  const closeAllPopovers =
    useCallback(() => {
      setNotificationsOpen(false);
      setMessagesOpen(false);
      setUserOpen(false);
    }, []);

  /* =========================================
     CLOSE MOBILE SEARCH
  ========================================= */

  const closeMobileSearch =
    useCallback(() => {
      setMobileSearchOpen(false);

      setTimeout(() => {
        searchTriggerRef.current?.focus();
      }, 0);
    }, []);

  /* =========================================
     CLICK OUTSIDE
  ========================================= */

  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(
          event.target
        )
      ) {
        setNotificationsOpen(false);
      }

      if (
        messagesRef.current &&
        !messagesRef.current.contains(
          event.target
        )
      ) {
        setMessagesOpen(false);
      }

      if (
        userRef.current &&
        !userRef.current.contains(
          event.target
        )
      ) {
        setUserOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================
     KEYBOARD SHORTCUT
  ========================================= */

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isSearchShortcut =
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "k";

      if (isSearchShortcut) {
        e.preventDefault();

        closeAllPopovers();

        setMobileSearchOpen(true);

        requestAnimationFrame(() => {
          searchRef.current?.focus();
        });

        return;
      }

      if (e.key === "Escape") {
        if (
          document.activeElement ===
          searchRef.current
        ) {
          setSearchValue("");

          searchRef.current.blur();
        }

        setMobileSearchOpen(false);

        closeAllPopovers();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [closeAllPopovers]);

  /* =========================================
     RESIZE
  ========================================= */

  useEffect(() => {
    const handleResize = () => {
      if (
        window.innerWidth > 720 &&
        mobileSearchOpen
      ) {
        setMobileSearchOpen(false);
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
  }, [mobileSearchOpen]);

  /* =========================================
     SEARCH
  ========================================= */

  const handleSearchChange = (
    e
  ) => {
    const value = e.target.value;

    setSearchValue(value);

    if (
      typeof onSearch ===
      "function"
    ) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    setSearchValue("");

    if (
      typeof onSearch ===
      "function"
    ) {
      onSearch("");
    }

    searchRef.current?.focus();
  };

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = (e) => {
    e.preventDefault();

    setUserOpen(false);

    closeAllPopovers();

    /*
     * Remove ALL admin authentication data.
     */
    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminAuth"
    );

    localStorage.removeItem(
      "adminUser"
    );

    localStorage.removeItem(
      "deliveryPartner"
    );

    /*
     * Reset Topbar user.
     */
    setUser(DEFAULT_ADMIN);

    /*
     * Parent logout callback.
     */
    if (
      typeof onLogout ===
      "function"
    ) {
      onLogout();
    }

    /*
     * Redirect to login.
     */
    navigate("/login", {
      replace: true,
    });
  };

  /* =========================================
     OPEN ONLY ONE POPOVER
  ========================================= */

  const openOnly = (
    setter
  ) => {
    setNotificationsOpen(false);
    setMessagesOpen(false);
    setUserOpen(false);
    setMobileSearchOpen(false);

    setter(true);
  };

  /* =========================================
     MENU ITEM CLICK
  ========================================= */

  const handleMenuItemClick = (
    e,
    path
  ) => {
    e.preventDefault();

    setUserOpen(false);

    if (path) {
      navigate(path);
    }
  };

  const handleFooterLinkClick = (
    e
  ) => {
    e.preventDefault();
  };

  /* =========================================
     INITIALS
  ========================================= */

  const displayName =
    user?.name ||
    user?.username ||
    "Admin User";

  const displayRole =
    user?.role ||
    "Super Admin";

  const initials =
    displayName
      ?.split(" ")
      .map((name) =>
        name[0]
      )
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AU";

  /* =========================================
     JSX
  ========================================= */

  return (
    <header className="Topbar">

      {/* =====================================
          LEFT
      ====================================== */}

      <div className="Topbar-left">

        {/* SIDEBAR */}

        <button
          type="button"
          className="Topbar-icon-btn Topbar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* SEARCH */}

        <div
          className={`Topbar-search ${
            mobileSearchOpen
              ? "mobile-active"
              : ""
          }`}
        >

          <Search
            size={17}
            className="Topbar-search-icon"
          />

          <input
            ref={searchRef}
            type="text"
            className="Topbar-search-input"
            placeholder="Search here..."
            value={searchValue}
            onChange={
              handleSearchChange
            }
            onFocus={() =>
              setMobileSearchOpen(
                true
              )
            }
            aria-label="Search"
          />

          {searchValue ? (
            <button
              type="button"
              className="Topbar-search-clear"
              onClick={
                clearSearch
              }
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          ) : (
            <kbd className="Topbar-kbd">
              Ctrl + K
            </kbd>
          )}

          <button
            type="button"
            className="Topbar-search-close"
            onClick={
              closeMobileSearch
            }
            aria-label="Close search"
          >
            <X size={18} />
          </button>

        </div>

        {/* MOBILE SEARCH */}

        <button
          ref={
            searchTriggerRef
          }
          type="button"
          className={`Topbar-icon-btn Topbar-search-trigger ${
            mobileSearchOpen
              ? "is-hidden"
              : ""
          }`}
          onClick={() => {
            closeAllPopovers();

            setMobileSearchOpen(
              true
            );

            requestAnimationFrame(
              () => {
                searchRef.current?.focus();
              }
            );
          }}
          aria-label="Open search"
        >
          <Search size={19} />
        </button>

      </div>

      {/* =====================================
          RIGHT
      ====================================== */}

      <div
        className={`Topbar-right ${
          mobileSearchOpen
            ? "is-hidden"
            : ""
        }`}
      >

        {/* =================================
            NOTIFICATIONS
        ================================== */}

        <div
          className="Topbar-popover-wrap"
          ref={
            notificationsRef
          }
        >

          <button
            type="button"
            className={`Topbar-icon-btn ${
              notificationsOpen
                ? "is-active"
                : ""
            }`}
            onClick={() => {
              if (
                notificationsOpen
              ) {
                setNotificationsOpen(
                  false
                );
              } else {
                openOnly(
                  setNotificationsOpen
                );
              }
            }}
            aria-label="Notifications"
            aria-expanded={
              notificationsOpen
            }
          >
            <Bell size={19} />

            {notifications.length >
              0 && (
              <span className="Topbar-badge">
                {
                  notifications.length
                }
              </span>
            )}
          </button>

          <div
            className={`Topbar-popover Topbar-notifications ${
              notificationsOpen
                ? "is-open"
                : ""
            }`}
          >

            <div className="Topbar-popover-header">

              <h3>
                Notifications
              </h3>

              <span className="Topbar-popover-count">
                {notifications.length}{" "}
                new
              </span>

            </div>

            <div className="Topbar-popover-list">

              {notifications.map(
                (
                  notification
                ) => (
                  <div
                    className="Notification-item"
                    key={
                      notification.id
                    }
                  >

                    <div
                      className={`Notification-icon-wrap ${notification.type}`}
                    >
                      {
                        NOTIF_ICON[
                          notification.type
                        ]
                      }
                    </div>

                    <div className="Notification-content">

                      <p className="Notification-title-text">
                        {
                          notification.title
                        }
                      </p>

                      <p className="Notification-subtitle">
                        {
                          notification.subtitle
                        }
                      </p>

                    </div>

                    <span className="Notification-time">
                      {
                        notification.time
                      }
                    </span>

                  </div>
                )
              )}

              {notifications.length ===
                0 && (
                <p className="Topbar-empty">
                  You're all caught up.
                </p>
              )}

            </div>

            <div className="Topbar-popover-footer">

              <a
                href="#viewall"
                onClick={
                  handleFooterLinkClick
                }
              >
                View all notifications
              </a>

            </div>

          </div>

        </div>

        {/* =================================
            MESSAGES
        ================================== */}

        <div
          className="Topbar-popover-wrap"
          ref={messagesRef}
        >

          <button
            type="button"
            className={`Topbar-icon-btn ${
              messagesOpen
                ? "is-active"
                : ""
            }`}
            onClick={() => {
              if (messagesOpen) {
                setMessagesOpen(
                  false
                );
              } else {
                openOnly(
                  setMessagesOpen
                );
              }
            }}
            aria-label="Messages"
            aria-expanded={
              messagesOpen
            }
          >

            <MessageSquare
              size={19}
            />

            {messages.length >
              0 && (
              <span className="Topbar-badge">
                {messages.length}
              </span>
            )}

          </button>

          <div
            className={`Topbar-popover Topbar-messages ${
              messagesOpen
                ? "is-open"
                : ""
            }`}
          >

            <div className="Topbar-popover-header">

              <h3>
                Messages
              </h3>

              <span className="Topbar-popover-count">
                {messages.length}{" "}
                unread
              </span>

            </div>

            <div className="Topbar-popover-list">

              {messages.map(
                (message) => (
                  <div
                    className="Message-item"
                    key={
                      message.id
                    }
                  >

                    <img
                      className="Message-avatar"
                      src={
                        message.avatar
                      }
                      alt=""
                    />

                    <div className="Notification-content">

                      <p className="Notification-title-text">
                        {
                          message.name
                        }
                      </p>

                      <p className="Notification-subtitle">
                        {
                          message.preview
                        }
                      </p>

                    </div>

                    <span className="Notification-time">
                      {
                        message.time
                      }
                    </span>

                  </div>
                )
              )}

              {messages.length ===
                0 && (
                <p className="Topbar-empty">
                  No new messages.
                </p>
              )}

            </div>

            <div className="Topbar-popover-footer">

              <a
                href="#viewall"
                onClick={
                  handleFooterLinkClick
                }
              >
                Open inbox
              </a>

            </div>

          </div>

        </div>

        {/* DIVIDER */}

        <div
          className="Topbar-divider"
          aria-hidden="true"
        />

        {/* =================================
            USER
        ================================== */}

        <div
          className="Topbar-popover-wrap"
          ref={userRef}
        >

          <button
            type="button"
            className={`Topbar-user ${
              userOpen
                ? "is-active"
                : ""
            }`}
            onClick={() => {
              if (userOpen) {
                setUserOpen(
                  false
                );
              } else {
                openOnly(
                  setUserOpen
                );
              }
            }}
            aria-expanded={
              userOpen
            }
            aria-label="Account menu"
          >

            <span className="Topbar-avatar-wrap">

              {avatarError ||
              !user.avatar ? (

                <span className="Topbar-avatar-fallback">
                  {initials}
                </span>

              ) : (

                <img
                  className="Topbar-avatar"
                  src={
                    user.avatar
                  }
                  alt=""
                  onError={() =>
                    setAvatarError(
                      true
                    )
                  }
                />

              )}

              <span className="Topbar-avatar-status" />

            </span>

            <span className="Topbar-user-info">

              <span className="Topbar-username">
                {loadingUser
                  ? "Loading..."
                  : displayName}
              </span>

              <span className="Topbar-role">
                {displayRole}
              </span>

            </span>

            <ChevronDown
              size={16}
              className={`Topbar-chevron ${
                userOpen
                  ? "rotated"
                  : ""
              }`}
            />

          </button>

          {/* USER DROPDOWN */}

          <div
            className={`Topbar-popover Topbar-user-menu ${
              userOpen
                ? "is-open"
                : ""
            }`}
          >

            <div className="Topbar-user-menu-header">

              <span className="Topbar-username">
                {displayName}
              </span>

              <span className="Topbar-role">
                {displayRole}
              </span>

              {user.email && (
                <span
                  style={{
                    fontSize:
                      "12px",
                    opacity: 0.7,
                    marginTop:
                      "3px",
                  }}
                >
                  {user.email}
                </span>
              )}

            </div>

            {/* PROFILE */}

            {/* <a
              href="/settings"
              className="Topbar-menu-item"
              onClick={(e) =>
                handleMenuItemClick(
                  e,
                  "/settings"
                )
              }
            >
              <User size={16} />
              My Profile
            </a> */}

            {/* SETTINGS */}

            <a
              href="/settings"
              className="Topbar-menu-item"
              onClick={(e) =>
                handleMenuItemClick(
                  e,
                  "/settings"
                )
              }
            >
              <Settings size={16} />
              Settings
            </a>

            {/* SECURITY */}

            <a
              href="/settings"
              className="Topbar-menu-item"
              onClick={(e) =>
                handleMenuItemClick(
                  e,
                  "/settings"
                )
              }
            >
              <Shield size={16} />
              Security
            </a>

            <div className="Topbar-menu-divider" />

            {/* LOGOUT */}

            <button
              type="button"
              className="Topbar-menu-item logout"
              onClick={
                handleLogout
              }
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>

        </div>

      </div>

      {/* MOBILE SEARCH BACKDROP */}

      {mobileSearchOpen && (
        <div
          className="Topbar-search-backdrop"
          onClick={
            closeMobileSearch
          }
          aria-hidden="true"
        />
      )}

      {/* POPOVER BACKDROP */}

      {(notificationsOpen ||
        messagesOpen ||
        userOpen) && (
        <div
          className="Topbar-popover-backdrop"
          onClick={
            closeAllPopovers
          }
          aria-hidden="true"
        />
      )}

    </header>
  );
};

export default Topbar;