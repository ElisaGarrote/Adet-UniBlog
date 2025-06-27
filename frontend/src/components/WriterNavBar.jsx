import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";
import logo from "../assets/icons/uniblog.svg";
import pfp from "../assets/img/default-profile.png"; // fallback image

function WriterNavbar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showBrowseDropdown, setShowBrowseDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState(pfp);
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);
  const browseRef = useRef(null);

  // Sample categories for navigation
  const browseCategories = [
    { name: "All Blog", path: "/allblog" },
    { name: "Flagged Blog", path: "/allflagblog" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access");

      // If there is no token yet, skip the call.
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/me/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // If the token is expired, log the user out
        if (res.status === 401) {
          console.warn("Access token expired or invalid");
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setUser(null);
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
        if (data.profilepic) {
          setProfileImage(
            data.profilepic.startsWith("http")
              ? data.profilepic
              : `${import.meta.env.VITE_API_URL}${data.profilepic}`
          );
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUser();
  }, []);

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

        <Link to="/writeblogpage" className="nav-link">Write Blog</Link>

        <input type="text" placeholder="Search..." className="search-input" />
      </div>

      {/* Right: Profile Info */}
      <div className="navbar-right">
        <span className="username">{user?.first_name || "Guest"}</span>
        <div 
          className="profile-dropdown-container"
          ref={profileRef}
        >
          <img
            src={profileImage}
            alt="Profile"
            className="profile-pic"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          />
          {showProfileDropdown && (
            <div className="dropdown-menu profile-dropdown">
              <Link to="/writerprofile" className="dropdown-item" onClick={() => setShowProfileDropdown(false)}>Profile</Link>
              <Link to="/writernotification" className="dropdown-item" onClick={() => setShowProfileDropdown(false)}>Notification</Link>
              <Link to="/logout" className="dropdown-item-logout" onClick={() => setShowProfileDropdown(false)}>Logout</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default WriterNavbar;