import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";
import logo from "../assets/icons/uniblog.svg";
import profilePic from "../assets/img/profilepic.jpg";

function NavBar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showBrowseDropdown, setShowBrowseDropdown] = useState(false);

  // Sample categories for navigation
const browseCategories = [
  { name: "Study Tips", path: "/tags" },
  { name: "Web Development", path: "/webdev" },
  { name: "CommITs", path: "/commits" }
];

  return (
    <nav className="navbar">
      {/* Left: Logo, Website Name, Nav Links, Search */}
      <div className="navbar-left">
        <img src={logo} alt="UniBlog Logo" className="logo" />
        <span className="brand-name">UniBlog</span>

        <Link to="/recommendation" className="nav-link">Home</Link>

        <div
          className="nav-dropdown"
          onMouseEnter={() => setShowBrowseDropdown(true)}
          onMouseLeave={() => setShowBrowseDropdown(false)}
        >
          <span className="nav-link">Browse</span>
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

        <Link to="/latestblog" className="nav-link">Latest</Link>

        <input type="text" placeholder="Search..." className="search-input" />
      </div>

      {/* Right: Profile Info */}
      <div className="navbar-right">
        <span className="username">Zaichooo</span>
        <div 
          className="profile-dropdown-container"
          onMouseEnter={() => setShowProfileDropdown(true)}
          onMouseLeave={() => setShowProfileDropdown(false)}
        >
          <img
            src={profilePic}
            alt="Profile"
            className="profile-pic"
            onClick={(e) => {
              e.stopPropagation();
              setShowProfileDropdown((prev) => !prev);
            }}
          />
          {showProfileDropdown && (
            <div className="dropdown-menu profile-dropdown">
              <Link to="/profile" className="dropdown-item">Profile</Link>
              <Link to="/logout" className="dropdown-item-logout">Logout</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;