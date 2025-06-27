import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';
import Footer from '../../components/Footer';
import WriterNotificationCard from '../../components/WriterNotificationCard'; // Import the writer-specific card
import '../../styles/WriterNotification.css'; // New CSS file for writer notifications

const WriterNotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'published',
      title: 'Blog Published Successfully',
      message: 'Your post "React Best Practices" is now live and visible to readers',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'report',
      title: 'Blog Content Report',
      message: 'Your post "Advanced CSS" received a community report (Reason: Copyright concern)',
      time: '1 day ago',
      read: true
    },
    {
      id: 3,
      type: 'published',
      title: 'Blog Published Successfully',
      message: 'Your draft "JavaScript Patterns" has been approved and published',
      time: '3 days ago',
      read: true
    },
    {
      id: 4,
      type: 'report',
      title: 'Report Resolved',
      message: 'The report on your post "Web Accessibility" has been reviewed and dismissed',
      time: '1 week ago',
      read: true
    }
  ]);

  const [feedback, setFeedback] = useState({
    message: '',
    visible: false
  });

  const showFeedback = (message) => {
    setFeedback({ message, visible: true });
    setTimeout(() => setFeedback(prev => ({ ...prev, visible: false }), 3000));
  };

  const handleDismiss = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    showFeedback('Notification dismissed');
  };

  const markAllAsRead = () => {
    if (notifications.some(n => !n.read)) {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      showFeedback('All notifications marked as read');
    }
  };

  const clearAll = () => {
    if (notifications.length > 0) {
      setNotifications([]);
      showFeedback('All notifications cleared');
    }
  };

  return (
    <div className="writer-notifications-wrapper">
      <div className="writer-notifications-container">
        <header className="writer-notifications-header">
          <h1><FaBell className="notification-bell" /> Writer Notifications</h1>
          <div className="writer-notification-actions">
            <button 
              className="writer-mark-all-read" 
              onClick={markAllAsRead}
              disabled={notifications.every(n => n.read)}
            >
              <FaCheck /> Mark all as read
            </button>
            <button 
              className="writer-clear-all" 
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              <FaTrash /> Clear all
            </button>
          </div>
        </header>

        <div className="writer-notifications-list">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <WriterNotificationCard
                key={notification.id}
                notification={notification}
                onDismiss={handleDismiss}
              />
            ))
          ) : (
            <div className="writer-empty-state">
              <p>No notifications to display</p>
              <small>You'll see notifications here when your blogs are published or reported</small>
            </div>
          )}
        </div>
      </div>

      <div className={`writer-action-feedback ${feedback.visible ? 'visible' : ''}`}>
        {feedback.message}
      </div>

      <Footer />
    </div>
  );
};

export default WriterNotificationsPage;