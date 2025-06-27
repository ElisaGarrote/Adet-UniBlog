import React from 'react';
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";
import NavBar from './Navbar';
import WriterNavBar from './WriterNavBar';
import AdminNavBar from './AdminNavBar';

const DynamicNavBar = () => {
  const getUserRole = () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) return null;
      
      const decoded = jwtDecode(token);
      return decoded.user_role || decoded.role;
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  };

  const userRole = getUserRole();

  // Return the appropriate navbar based on user role
  switch(userRole) {
    case 'admin':
      return <AdminNavBar />;
    case 'writer':
      return <WriterNavBar />;
    case 'reader':
      return <NavBar />;
    default:
      return <NavBar />; // Default to reader navbar
  }
};

export default DynamicNavBar;
