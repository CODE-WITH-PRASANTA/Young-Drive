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
import BookingCalender from "./Components/BookingCalender/BookingCalender";

import Login from "./Components/Login/Login";
import ProtectedRoute from "./Components/protectedRoute/protectedRoute";
import Category from "./Components/Category/Category";
import AdminEnquiry from "./Components/AdminEnquiry/AdminEnquiry";

/* =========================================
    APP
========================================= */

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================
            PUBLIC LOGIN PAGE
        ================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =================================
            PROTECTED ADMIN ROUTES
        ================================== */}

        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={<MainLayout />}
          >

            {/* DASHBOARD */}

            <Route
              index
              element={<Dashboard />}
            />

            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            {/* =================================
                VEHICLE MANAGEMENT
            ================================== */}

            <Route
              path="vehicle-management"
              element={
                <VehicleManagement />
              }
            />

            <Route
              path="vehicles"
              element={
                <VehicleManagement />
              }
            />

            <Route
              path="feature-listing"
              element={
                <FeatureListing />
              }
            />

            {/* =================================
                BOOKINGS
            ================================== */}

            <Route
              path="bookings/all"
              element={<AllBookings />}
            />

            <Route
              path="bookings/requests"
              element={
                <BookingRequest />
              }
            />

            <Route
              path="bookings/calendar"
              element={
                <BookingCalender />
              }
            />
            <Route
              path="enquiry"
              element={
                <AdminEnquiry />
              }
            />

            {/* =================================
                GENERAL
            ================================== */}

            <Route
              path="payments"
              element={<Payments />}
            />

            <Route
              path="reviews"
              element={<Reviews />}
            />

            <Route
              path="locations"
              element={<Locations />}
            />

            <Route
              path="settings"
              element={<MyProfile />}
            />
            <Route
              path="category"
              element={<Category />}
            />

          </Route>
        </Route>

        {/* =================================
            CATCH ALL
        ================================== */}

        <Route
          path="*"
          element={
            localStorage.getItem(
              "adminAuth"
            ) === "true" ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;