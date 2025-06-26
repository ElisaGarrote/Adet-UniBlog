import React from 'react';
import { FaExclamationTriangle, FaNewspaper, FaTimes, FaEye, FaPenAlt } from 'react-icons/fa';
import "../styles/WriterNotificationCard.css";

const WriterNotificationCard = ({ notification, onDismiss }) => {
  const { type, title, message, time, read } = notification;

  return (
    <div className={`w-notification-card ${read ? 'w-read' : 'w-unread'} w-${type}`}>
      <div className="w-notification-icon">
        {type === 'report' ? (
          <FaExclamationTriangle className="w-report-icon" />
        ) : type === 'published' ? (
          <FaNewspaper className="w-published-icon" />
        ) : (
          <FaPenAlt className="w-draft-icon" />
        )}
      </div>
      
      <div className="w-notification-content">
        <h3 className="w-notification-title">{title}</h3>
        <p className="w-notification-message">{message}</p>
        <div className="w-notification-footer">
          <span className="w-notification-time">{time}</span>
          <button className={`w-action-button w-${type}-action`}>
            {type === 'report' ? (
              <>
                <FaEye /> View Report
              </>
            ) : (
              'View Details'
            )}
          </button>
        </div>
      </div>
      
      <button 
        className="w-dismiss-button" 
        onClick={() => onDismiss(notification.id)}
        aria-label="Dismiss notification"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default WriterNotificationCard;