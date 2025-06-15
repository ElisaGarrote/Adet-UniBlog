import React from "react";
import { Link } from "react-router-dom";
import uniblogo from "../assets/uniblog.svg";

function Navbar() {
  return (
    <nav className="navbar" style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img src={uniblogo} alt="Logo" style={styles.logo} />
      </div>
      <ul style={styles.navList}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/browse">Browse</Link></li>
        <li><Link to="/latest">Latest</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
      <div style={styles.rightSection}>
        <input type="text" placeholder="Search..." style={styles.searchBar} />
        <span style={styles.username}>Username</span>
        <img
          src={uniblogo}
          alt="Profile"
          style={styles.profilePic}
        />
      </div>
    </nav>
  );
}


export default Navbar;