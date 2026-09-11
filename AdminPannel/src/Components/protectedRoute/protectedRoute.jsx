import React from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();

  const sessionAuth =
    sessionStorage.getItem(
      "isAdminAuthenticated"
    ) === "true";

  const localAuth =
    localStorage.getItem(
      "isAdminAuthenticated"
    ) === "true";

  const adminAuth =
    localStorage.getItem("adminAuth") === "true";

  const adminToken =
    localStorage.getItem("adminToken");

  const isAuthenticated =
    sessionAuth ||
    localAuth ||
    adminAuth ||
    Boolean(adminToken);

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