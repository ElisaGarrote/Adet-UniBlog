import React from 'react';
import { Navigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  
  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode JWT token to get user role
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const userRole = tokenPayload.user_role;
    
    // Check if user role is allowed
    if (!allowedRoles.includes(userRole)) {
      // Redirect based on user role if they don't have access
      switch(userRole) {
        case 'admin':
          return <Navigate to="/admin-dashboard" replace />;
        case 'reader':
          return <Navigate to="/latestblog" replace />;
        case 'writer':
          return <Navigate to="/allblog" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
    
    return children;
  } catch (error) {
    // If token is invalid, redirect to login
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem('refresh');
    return <Navigate to="/login" replace />;
  }
};

export default RoleProtectedRoute;
