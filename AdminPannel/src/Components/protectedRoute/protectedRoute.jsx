import React from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();

  const isAuthenticated =
    localStorage.getItem("adminAuth") === "true";

  // User is NOT logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // User is logged in
  return <Outlet />;
};

export default ProtectedRoute;