import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/icons/uniblog.svg";
import pfp from "../assets/img/default-profile.png"; // fallback image
import api from "../api";
function NavBar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showBrowseDropdown, setShowBrowseDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState(pfp);
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const dropdownRef = useRef(null);

useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("access");

    // 1.  If there is no token yet, skip the call.
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

      // 2.  If the token is expired you can try to refresh here,
      //     or just log the user out:
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

  const fetchTags = async () => {
    setLoadingTags(true);
    try {
      const response = await api.get("/blogs/tags/");
      setTags(response.data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
      setTags([]);
    } finally {
      setLoadingTags(false);
    }
  };

  fetchUser();
  fetchTags();
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
            <div className={`dropdown-menu browse-dropdown ${tags.length > 10 ? 'scrollable' : ''}`}>
              {loadingTags ? (
                <div className="dropdown-item loading">Loading tags...</div>
              ) : tags.length === 0 ? (
                <div className="dropdown-item">No tags available</div>
              ) : (
                tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/tags/${tag.name}`}
                    className="dropdown-item"
                    onClick={() => setShowBrowseDropdown(false)}
                  >
                    {tag.name}
                  </Link>
                ))
              )}
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
