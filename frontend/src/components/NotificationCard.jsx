import React from 'react';
import { FaExclamationTriangle, FaNewspaper, FaTimes } from 'react-icons/fa';

const NotificationCard = ({ notification, onDismiss }) => {
  const { type, title, message, time, read, action } = notification;

  return (
    <div className={`notification-item ${read ? 'read' : 'unread'} ${type}`}>
      <div className="notification-icon">
        {type === 'report' ? (
          <FaExclamationTriangle className="report-icon" />
        ) : (
          <FaNewspaper className="newpost-icon" />
        )}
      </div>
      <div className="notification-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="notification-meta">
          <span className="notification-time">{time}</span>
          <button className={`action-button ${action}`}>
            {action === 'view' ? 'View' : 'Read Now'}
          </button>
        </div>
      </div>
      <button className="dismiss-button" onClick={() => onDismiss(notification.id)}>
        <FaTimes />
      </button>
    </div>
  );
};

export default NotificationCard;