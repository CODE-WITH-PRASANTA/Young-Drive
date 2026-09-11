import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "./Layout/MainLayout/MainLayout";
import VehicleManagement from "./Components/VehicleManagement/VehicleManagement";
import FeatureListing from "./Components/FeatureListing/FeatureListing";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AllBookings from "./Components/AllBookings/AllBookings";
import Payments from "./Components/Payments/Payments";
import Reviews from "./Components/Reviews/Reviews";
import Locations from "./Components/Locations/Locations";
import MyProfile from "./Components/MyProfile/MyProfile";
import BookingRequest from "./Components/BookingRequest/BookingRequest";
import BookingCalendar from "./Components/BookingCalender/BookingCalender"; // Fixed typo reference if applicable
import Login from "./Components/Login/Login";
import ProtectedRoute from "./Components/protectedRoute/protectedRoute";
import Category from "./Components/Category/Category";
import AdminEnquiry from "./Components/AdminEnquiry/AdminEnquiry";
import Reports from "./Pages/Reports/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Layout Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="vehicle-management" element={<VehicleManagement />} />
            <Route path="vehicles" element={<VehicleManagement />} />
            <Route path="feature-listing" element={<FeatureListing />} />
            <Route path="bookings/all" element={<AllBookings />} />
            <Route path="bookings/requests" element={<BookingRequest />} />
            <Route path="bookings/calendar" element={<BookingCalendar />} />
            <Route path="enquiry" element={<AdminEnquiry />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="locations" element={<Locations />} />
            <Route path="settings" element={<MyProfile />} />
            <Route path="category" element={<Category />} />
            <Route path="reports"element={<Reports/>}/>
          </Route>
        </Route>

        {/* Fallback / Catch-all Route */}
        <Route
          path="*"
          element={
            <Navigate
              to={localStorage.getItem("adminToken") ? "/dashboard" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;