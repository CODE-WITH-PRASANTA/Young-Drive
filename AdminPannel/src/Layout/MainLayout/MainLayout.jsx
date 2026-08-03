import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import "./MainLayout.css";

const MOBILE_BREAKPOINT = 768;

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className={`MainLayout ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      {/*
        Sidebar renders its own backdrop/overlay internally when isMobileOpen
        is true, so MainLayout does not need a second one — avoids a double
        dark overlay stacking on top of each other on mobile.
      */}
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onClose={closeMobileSidebar}
        onToggleCollapse={toggleSidebar}
      />

      <div className="MainLayout-container">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="MainLayout-content">
          <div className="MainLayout-content-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;