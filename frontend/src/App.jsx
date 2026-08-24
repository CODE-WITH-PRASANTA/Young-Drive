import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Contact from "./Pages/Contact/Contact";
import FloatingForm from "./Components/FloatingForm/FloatingForm"; 
import FloatingIcons from "./Components/FloatingIcons/FloatingIcons";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <FloatingForm />
      <FloatingIcons />
      
      <Footer />
    </BrowserRouter>
  );
};

export default App;