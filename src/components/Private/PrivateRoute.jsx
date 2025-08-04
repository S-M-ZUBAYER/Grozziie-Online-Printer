import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { decodeJwt } from "jose";

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.user.accountUser);
  const location = useLocation();

  if (!user) {
    const userDetails = localStorage.getItem("printerUser");

    if (userDetails) {
      try {
        if (userDetails) {
          return children; // Assume 'sub' represents the user object or identifier
        } else {
          return <Navigate to="/login" state={{ from: location }} replace />;
        }
      } catch (error) {
        console.error("Invalid token:", error);
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
    } else {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }
  return children;
};

export default PrivateRoute;
