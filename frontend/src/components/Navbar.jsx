import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";
import logo from "../assets/icons/uniblog.svg";
import pfp from "../assets/img/default-profile.png"; // fallback image

function NavBar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showBrowseDropdown, setShowBrowseDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState(pfp);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  const browseCategories = [
    { name: "Study Tips", path: "/tags" },
    { name: "Web Development", path: "/webdev" },
    { name: "CommITs", path: "/commits" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);

        if (data.profilepic) {
          const imageUrl = data.profilepic.startsWith("http")
            ? data.profilepic
            : `${import.meta.env.VITE_API_URL}${data.profilepic}`;
          setProfileImage(imageUrl);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUser();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="navbar-right" ref={dropdownRef}>
        <span className="username">{user?.first_name || "Guest"}</span>
        <div className="profile-dropdown-container">
          <img
            src={profileImage}
            alt="Profile"
            className="profile-pic"
            onClick={() => setShowProfileDropdown((prev) => !prev)}
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

export default NavBar;
