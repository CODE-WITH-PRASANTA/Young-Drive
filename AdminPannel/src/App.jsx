import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./Layout/MainLayout/MainLayout";
import VehicleManagement from "./Components/Profile/VehicleManagement/VehicleManagement";
import FeatureListing from "./Components/Profile/FeatureListing/FeatureListing";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AllBookings from "./Components/AllBookings/AllBookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Parent layout wraps all pages */}
        <Route path="/" element={<MainLayout />}>
          {/* Default view when landing on '/' */}
          <Route index element={<Dashboard />} />

          {/* Clean, relative nested paths (NO leading slashes) */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicle-management" element={<VehicleManagement />} />
          <Route path="feature-listing" element={<FeatureListing />} />
          



          {/* Bookings Submenu Routes */}
          
          {/* Direct Route Aliases mapped to your sidebar menu */}
          <Route path="vehicles" element={<VehicleManagement />} />
          <Route path="bookings/requests" element={<div>Booking Requests Page</div>} />
          <Route path="bookings/all" element={<AllBookings />}/>
          <Route path="bookings/calendar" element={<div>Calendar Page</div>} />
          <Route path="customers" element={<div>Customers Page</div>} />
          <Route path="drivers" element={<div>Drivers Page</div>} />
          <Route path="payments" element={<div>Payments Page</div>} />
          <Route path="reviews" element={<div>Reviews Page</div>} />
          <Route path="coupons" element={<div>Coupons Page</div>} />
          <Route path="locations" element={<div>Locations Page</div>} />
          <Route path="reports" element={<div>Reports Page</div>} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;