import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import api from "../api";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const auth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      const decoded = jwtDecode(token);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;

      if (tokenExpiration < now) {
        await refreshToken();
      } else {
        setIsAuthorized(true);
      }
    };

    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
