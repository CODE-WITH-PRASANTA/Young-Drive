import React from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();

  const token = localStorage.getItem("adminToken");

  const isAuthenticated =
    typeof token === "string" &&
    token.trim().length > 0;

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

  return <Outlet />;
};

export default ProtectedRoute;