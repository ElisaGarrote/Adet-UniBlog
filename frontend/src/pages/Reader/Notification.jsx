import React from 'react';
import { FaBell, FaExclamationTriangle, FaNewspaper, FaTimes } from 'react-icons/fa';
import Footer from '../../components/Footer';
import '../../styles/Notification.css';

const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      type: 'report',
      title: 'Blog Report Reviewed',
      message: 'Your report on "Ethics in AI Research" has been addressed by moderators',
      time: '2 hours ago',
      read: false,
      action: 'view'
    },
    {
      id: 2,
      type: 'new-post',
      title: 'New Blog in Computer Science',
      message: 'Dr. Smith published "Quantum Computing Advances" in your department',
      time: '5 hours ago',
      read: true,
      action: 'read'
    },
    {
      id: 3,
      type: 'report',
      title: 'Report Status Update',
      message: 'Your report on "Campus Politics" is under review',
      time: '1 day ago',
      read: true,
      action: 'view'
    },
    {
      id: 4,
      type: 'new-post',
      title: 'New Blog in Engineering',
      message: 'New post available: "Sustainable Architecture in 2023"',
      time: '2 days ago',
      read: true,
      action: 'read'
    }
  ];

  return (
    <div className="notifications-wrapper">
      <div className="notifications-container">
        <header className="notifications-header">
          <h1><FaBell /> Notifications</h1>
          <div className="notification-actions">
            <button className="mark-all-read">Mark all as read</button>
            <button className="clear-all">Clear all</button>
          </div>
        </header>

        <div className="notifications-list">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
            >
              <div className="notification-icon">
                {notification.type === 'report' ? (
                  <FaExclamationTriangle className="report-icon" />
                ) : (
                  <FaNewspaper className="newpost-icon" />
                )}
              </div>
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <div className="notification-meta">
                  <span className="notification-time">{notification.time}</span>
                  <button className={`action-button ${notification.action}`}>
                    {notification.action === 'view' ? 'View' : 'Read Now'}
                  </button>
                </div>
              </div>
              <button className="dismiss-button">
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotificationsPage;