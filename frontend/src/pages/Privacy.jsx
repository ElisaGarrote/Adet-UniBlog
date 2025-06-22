import React from 'react';
import { FaShieldAlt, FaUserLock, FaDatabase, FaCookie, FaLock, FaShareAlt } from 'react-icons/fa';
import Footer from '../components/Footer';
import '../styles/Privacy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-wrapper">
      <div className="privacy-container">
        <header className="privacy-header">
          <h1><FaShieldAlt /> Privacy Policy</h1>
          <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="privacy-content">
          <section className="intro-section card">
            <p>
              At UniBlog, we are committed to protecting your privacy. This policy explains how we collect, 
              use, and safeguard your information when you use our university blog platform.
            </p>
          </section>

          <section className="policy-section">
            <h2><FaUserLock /> Information We Collect</h2>
            <div className="info-grid">
              <div className="info-card card">
                <h3>Account Information</h3>
                <ul>
                  <li>University email address</li>
                  <li>Name and department affiliation</li>
                  <li>Profile information you provide</li>
                </ul>
              </div>
              <div className="info-card card">
                <h3>Usage Data</h3>
                <ul>
                  <li>Articles you read and interact with</li>
                  <li>Search queries within the platform</li>
                  <li>Comments and engagement metrics</li>
                </ul>
              </div>
              <div className="info-card card">
                <h3>Technical Information</h3>
                <ul>
                  <li>IP address and browser type</li>
                  <li>Device information</li>
                  <li>Cookies and similar technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2><FaDatabase /> How We Use Your Information</h2>
            <div className="usage-list card">
              <ul>
                <li>To provide and personalize our services</li>
                <li>To improve content recommendations using our AI system</li>
                <li>To communicate important platform updates</li>
                <li>To maintain academic integrity and prevent misuse</li>
                <li>For anonymized analytics to improve our services</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2><FaCookie /> Cookies and Tracking</h2>
            <div className="card">
              <h3>We use cookies to:</h3>
              <ul>
                <li>Authenticate university users</li>
                <li>Remember your preferences</li>
                <li>Analyze platform usage patterns</li>
              </ul>
              <p className="cookie-note">
                You can control cookies through your browser settings, but this may affect functionality.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2><FaLock /> Data Security</h2>
            <div className="card">
              <p>
                We implement industry-standard security measures to protect your information, including:
              </p>
              <ul>
                <li>Encryption of sensitive data</li>
                <li>Regular security audits</li>
                <li>Limited access to authorized personnel only</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2><FaShareAlt /> Third-Party Sharing</h2>
            <div className="card">
              <p>
                We do not sell your personal information. We may share data with:
              </p>
              <ul>
                <li>Your university administration for academic purposes</li>
                <li>Service providers under strict confidentiality agreements</li>
                <li>When required by law or to protect our rights</li>
              </ul>
            </div>
          </section>

          <section className="contact-section card">
            <h2>Contact Us</h2>
            <p>
              For privacy-related questions, contact our Data Protection Officer at:<br />
              <a href="mailto:privacy@uniblog.edu">privacy@uniblog.edu</a>
            </p>
            <p>
              For university-specific concerns, please contact your institution's IT department.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;