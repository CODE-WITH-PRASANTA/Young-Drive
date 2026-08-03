import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./Layout/MainLayout/MainLayout";
import VehicleManagement from "./Components/Profile/VehicleManagement/VehicleManagement";
import FeatureListing from "./Components/Profile/FeatureListing/FeatureListing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* MainLayout wraps nested routes so Topbar & Sidebar stay visible */}
        <Route path="/" element={<MainLayout />}>
          <Route path="vehicle-management" element={<VehicleManagement />} />
          <Route path="feature-listing" element={<FeatureListing />} />
        </Route>

        {/* Fallback redirect for unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;