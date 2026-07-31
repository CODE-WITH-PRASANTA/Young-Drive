import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layout/MainLayout/MainLayout";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<MainLayout/>}/>
       

      </Routes>
    </BrowserRouter>
  );
};

export default App;