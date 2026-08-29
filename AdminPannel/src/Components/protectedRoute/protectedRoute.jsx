import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("adminToken");
  const auth = localStorage.getItem("adminAuth");

  const isAuthenticated =
    (typeof token === "string" && token.trim().length > 0) ||
    auth === "true";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;