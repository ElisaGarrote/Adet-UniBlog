import React from 'react';
import { FaBook, FaUsers, FaRobot, FaSearch, FaNewspaper, FaComments } from 'react-icons/fa';
import Footer from '../components/Footer';
import '../styles/About.css';

const AboutPage = () => {
  return (
    <>
      <div className="about-container">
        <header className="about-header">
          <h1>About UniBlog</h1>
          <h2>Centralizing University Knowledge, Empowering Campus Communities</h2>
        </header>

        <div className="about-content">
          <section className="mission-section">
            <h3>Our Mission</h3>
            <p>
              UniBlog provides a centralized platform where all campus knowledge - from department updates to 
              student organization news - lives in one accessible place.
            </p>
            <p>
              Our AI-powered recommendation system helps students and faculty discover the most relevant content.
            </p>
          </section>

          <section className="features-section">
            <h3>Key Features</h3>
            <ul className="features-list">
              <li>
                <span className="feature-icon"><FaBook /></span>
                <span>Department-specific blogs</span>
              </li>
              <li>
                <span className="feature-icon"><FaUsers /></span>
                <span>Organization spaces</span>
              </li>
              <li>
                <span className="feature-icon"><FaRobot /></span>
                <span>AI recommendations</span>
              </li>
            </ul>
          </section>

          <section className="how-it-works">
            <h3>How It Works</h3>
            <div className="steps">
              <div className="step">
                <div className="step-icon"><FaSearch /></div>
                <h4>Discover</h4>
                <p>Find content through search or AI recommendations</p>
              </div>
              <div className="step">
                <div className="step-icon"><FaNewspaper /></div>
                <h4>Read & Engage</h4>
                <p>Access department updates and campus news</p>
              </div>
              <div className="step">
                <div className="step-icon"><FaComments /></div>
                <h4>Connect</h4>
                <p>Join relevant discussions</p>
              </div>
            </div>
          </section>

          <section className="creator-section">
            <h3>For Content Creators</h3>
            <p>
              University departments and approved organizations can publish content through our platform.
            </p>
          </section>

          <div className="cta-section">
            <h3>Join the UniBlog Community Today</h3>
            <p>Your centralized platform for university information.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;