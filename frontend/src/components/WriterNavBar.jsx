import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";
import logo from "../assets/icons/uniblog.svg";
import profilePic from "../assets/img/profilepic.jpg";

function WriterNavbar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showBrowseDropdown, setShowBrowseDropdown] = useState(false);
  const profileRef = useRef(null);
  const browseRef = useRef(null);

  // Sample categories for navigation
  const browseCategories = [
    { name: "All Blog", path: "" },
    { name: "Flagged Blog", path: "" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (browseRef.current && !browseRef.current.contains(event.target)) {
        setShowBrowseDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* Left: Logo, Website Name, Nav Links, Search */}
      <div className="navbar-left">
        <img src={logo} alt="UniBlog Logo" className="logo" />
        <span className="brand-name">UniBlog</span>

        <Link to="/writerdashboard" className="nav-link">Dashboard</Link>

        <div
          className="nav-dropdown"
          ref={browseRef}
        >
          <span 
            className="nav-link"
            onClick={() => setShowBrowseDropdown(!showBrowseDropdown)}
          >
            Blog
          </span>
          {showBrowseDropdown && (
            <div className="dropdown-menu browse-dropdown">
              {browseCategories.map((category) => (
                <Link 
                  key={category.path} 
                  to={category.path}
                  className="dropdown-item"
                  onClick={() => setShowBrowseDropdown(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link to="/writeblog" className="nav-link">Write Blog</Link>

        <input type="text" placeholder="Search..." className="search-input" />
      </div>

      {/* Right: Profile Info */}
      <div className="navbar-right">
        <span className="username">Zaichooo</span>
        <div 
          className="profile-dropdown-container"
          ref={profileRef}
        >
          <img
            src={profilePic}
            alt="Profile"
            className="profile-pic"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          />
          {showProfileDropdown && (
            <div className="dropdown-menu profile-dropdown">
              <Link to="/profile" className="dropdown-item" onClick={() => setShowProfileDropdown(false)}>Profile</Link>
              <Link to="/notification" className="dropdown-item" onClick={() => setShowProfileDropdown(false)}>Notification</Link>
              <Link to="/logout" className="dropdown-item-logout" onClick={() => setShowProfileDropdown(false)}>Logout</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default WriterNavbar;