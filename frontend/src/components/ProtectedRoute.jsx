import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      setIsAuthorized(false);
      return;
    }
    
    try {
      const res = await api.post("/auth/token/refresh/", {
        refresh: refreshToken,
      });

      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        try {
          const decoded = jwtDecode(res.data.access);
          const role = decoded.user_role || decoded.role || 'reader';
          setUserRole(role);
          setIsAuthorized(true);
        } catch (error) {
          console.error("Error decoding refreshed token:", error);
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Refresh token failed:", error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        await refreshToken();
      } else {
        // Try different possible field names for user role
        const role = decoded.user_role || decoded.role || 'reader';
        setUserRole(role);
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error("Token decode error:", error);
      setIsAuthorized(false);
    }
  };

  const getRoleBasedRedirect = (role) => {
    switch(role) {
      case 'admin':
        return '/admin-dashboard';
      case 'reader':
        return '/latestblog';
      case 'writer':
        return '/allblog';
      default:
        return '/login';
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  // If specific roles are required, check if user has access
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to={getRoleBasedRedirect(userRole)} replace />;
  }

  return children;
}

export default ProtectedRoute;
