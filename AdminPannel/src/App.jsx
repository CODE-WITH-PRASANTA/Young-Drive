import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
         
          <Route path="bookings/all" element={<AllBookings />}/>
          
           <Route path="/payments" element={<Payments/>} />
            <Route path="/reviews" element={<Reviews/>} />
             <Route path="/locations" element={<Locations/>} />
             <Route path="/settings" element={<MyProfile/>} />
        
          <Route path="/bookings/requests" element={<BookingRequest/>} />
          <Route path="/bookings/calendar" element={<BookingCalender/>} />




        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;