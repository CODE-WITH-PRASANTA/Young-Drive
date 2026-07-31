import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="main-layout">
      <Sidebar isCollapsed={isCollapsed} isMobileOpen={isMobileOpen} />
      <div className="main-content-wrapper">
        <Topbar toggleSidebar={toggleSidebar} currentPath="Dashboard" />
        <main className="main-content">
          {children || <p>Welcome to your admin control center dashboard.</p>}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;