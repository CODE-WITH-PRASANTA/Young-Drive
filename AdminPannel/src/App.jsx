import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import MainLayout from "./Layout/MainLayout/MainLayout";
import VehicleManagement from "./Components/Profile/VehicleManagement/VehicleManagement";
import FeatureListing from "./Components/Profile/FeatureListing/FeatureListing";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AllBookings from "./Components/AllBookings/AllBookings";
import Payments from "./Components/Payments/Payments";
import Reviews from "./Components/Reviews/Reviews";
import Locations from "./Components/Locations/Locations";
import MyProfile from "./Components/MyProfile/MyProfile";
import BookingRequest from "./Components/BookingRequest/BookingRequest";
import BookingCalender from "./Components/BookingCalender/BookingCalender";
import Login from "./Components/Login/Login";

// Protected Route Component
const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("adminAuth") === "true";
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route - Standalone Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute />}>
          {/* Main Layout Wraps All Dashboard & Admin Pages */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Vehicle Routes */}
            <Route path="vehicle-management" element={<VehicleManagement />} />
            <Route path="vehicles" element={<VehicleManagement />} />
            <Route path="feature-listing" element={<FeatureListing />} />

            {/* Booking Routes */}
            <Route path="bookings/all" element={<AllBookings />} />
            <Route path="bookings/requests" element={<BookingRequest />} />
            <Route path="bookings/calendar" element={<BookingCalender />} />

            {/* General Routes */}
            <Route path="payments" element={<Payments />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="locations" element={<Locations />} />
            <Route path="settings" element={<MyProfile />} />
          </Route>
        </Route>

        {/* Catch-all redirect to Dashboard (If logged in) or Login (If not logged in) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;