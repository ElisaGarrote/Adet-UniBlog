import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import Footer from '../../components/Footer';
import NotificationCard from '../../components/NotificationCard';
import '../../styles/Notification.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
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
      id: 2,
      type: 'new-post',
      title: 'New Blog in Computer Science',
      message: 'Dr. Smith published "Quantum Computing Advances" in your department',
      time: '5 hours ago',
      read: true,
      action: 'read'
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
      id: 2,
      type: 'new-post',
      title: 'New Blog in Computer Science',
      message: 'Dr. Smith published "Quantum Computing Advances" in your department',
      time: '5 hours ago',
      read: true,
      action: 'read'
    },
    // Add more notifications as needed
  ]);

  const [feedback, setFeedback] = useState({
    message: '',
    visible: false
  });

  const showFeedback = (message) => {
    setFeedback({ message, visible: true });
    setTimeout(() => {
      setFeedback(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleDismiss = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    showFeedback('Notification dismissed');
  };

  const markAllAsRead = () => {
    if (notifications.some(n => !n.read)) {
      setNotifications(notifications.map(notification => ({
        ...notification,
        read: true
      })));
      showFeedback('All notifications marked as read');
    } else {
      showFeedback('All notifications are already read');
    }
  };

  const clearAll = () => {
    if (notifications.length > 0) {
      setNotifications([]);
      showFeedback('All notifications cleared');
    } else {
      showFeedback('No notifications to clear');
    }
  };

  return (
    <div className="notifications-wrapper">
      <div className="notifications-container">
        <header className="notifications-header">
          <h1><FaBell /> Notifications</h1>
          <div className="notification-actions">
            <button className="mark-all-read" onClick={markAllAsRead}>
              Mark all as read
            </button>
            <button className="clear-all" onClick={clearAll}>
              Clear all
            </button>
          </div>
        </header>

        <div className="notifications-list">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onDismiss={handleDismiss}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No notifications to display</p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback message */}
      <div className={`action-feedback ${feedback.visible ? 'visible' : ''}`}>
        {feedback.message}
      </div>

      <Footer />
    </div>
  );
};

export default NotificationsPage;