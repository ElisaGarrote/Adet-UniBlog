import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/icons/uniblog.svg";
import '../styles/Footer.css'; // We'll create this CSS file

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Logo and basic info */}
        <div className="footer-brand">
          <img src={logo} alt="UniBlog Logo" className="footer-logo" />
          <div className="footer-brand-info">
            <h3>UniBlog</h3>
            <p>Your premier destination for academic insights and research</p>
          </div>
        </div>

        {/* Footer sections */}
        <div className="footer-sections">
          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>Home</li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul>
              <li>Email: info@uniblog.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 University Ave</li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
          <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        <p>&copy; 2025 UniBlog. All rights reserved.</p>
        <p>Created with passion for sharing knowledge.</p>
      </div>
    </footer>
  );
};

export default Footer;