import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./Layout/MainLayout/MainLayout";





function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<MainLayout/>}>

      

         
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;