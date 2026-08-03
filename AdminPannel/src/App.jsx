import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./Layout/MainLayout/MainLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layout/MainLayout/MainLayout";
import VehicleManagement from "./Components/Profile/VehicleManagement/VehicleManagement";
import FeatureListing from "./Components/Profile/FeatureListing/FeatureListing";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/vehicle-management" element={<VehicleManagement />} />
        <Route path="/feature-listing" element={<FeatureListing />} />

        <Route path="/" element={<MainLayout/>}>

      

         
        </Route>


        <Route path="/" element={<MainLayout/>}/>
       
 
      </Routes>
    </BrowserRouter>
  );
}

export default App;