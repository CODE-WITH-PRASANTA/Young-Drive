import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layout/MainLayout/MainLayout";
import VehicleManagement from "./Components/Profile/VehicleManagement/VehicleManagement";
import FeatureListing from "./Components/Profile/FeatureListing/FeatureListing";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/vehicle-management" element={<VehicleManagement />} />
        <Route path="/feature-listing" element={<FeatureListing />} />


        <Route path="/" element={<MainLayout/>}/>
       
 
      </Routes>
    </BrowserRouter>
  );
};

export default App;