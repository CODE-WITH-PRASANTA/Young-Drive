import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VehicleManagement from "./Components/Profile/VehicleManagement/VehicleManagement";
import FeatureListing from "./Components/Profile/FeatureListing/FeatureListing";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/vehicle-management" element={<VehicleManagement />} />
        <Route path="/feature-listing" element={<FeatureListing />} />


        
       

      </Routes>
    </BrowserRouter>
  );
};

export default App;