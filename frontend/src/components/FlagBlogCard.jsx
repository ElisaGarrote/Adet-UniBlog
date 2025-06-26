import React, { useState } from 'react';
import "../styles/FlagBlogCard.css";
import SamplePic from "../assets/img/SamplePic.jpg";

const FlagBlogCard = ({ blog = {}, onViewReport }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    id = '',
    title = 'Untitled Blog',
    image = SamplePic,
    reportId = '',
    reportType = 'Spam',
    reportComments = 'No comments provided',
    flaggedAt = '',
    reviewedBy = null,  // null when not assigned
    status = 'pending'  // pending/reviewed/resolved
  } = blog;

  if (!blog || Object.keys(blog).length === 0) return null;

  const handleViewReport = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getReviewerStatus = () => {
    if (status === 'resolved') {
      return `Resolved by ${reviewedBy || 'admin'}`;
    }
    return reviewedBy ? reviewedBy : 'Not Set';
  };

  return (
    <>
      <div className="flagged-blog-card">
        <div className="flagged-blog-image-container">
          {image && <img src={image} alt={title} className="flagged-blog-image" />}
          <span className={`flagged-status-badge ${status}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        
        <div className="flagged-blog-content">
          <h3 className="flagged-blog-title">{title}</h3>
          
          <div className="flagged-review-status">
            <span>Review By: </span>
            <strong>{getReviewerStatus()}</strong>
            {status === 'pending' && !reviewedBy && (
              <span className="status-note"> (Not Reviewed)</span>
            )}
          </div>
          
          <div className="flagged-blog-meta">
            <span>Flagged: {flaggedAt}</span>
            <span>Report Type: {reportType}</span>
          </div>
        </div>
        
        <div className="flagged-blog-actions">
          <button 
            className="flagged-view-button"
            onClick={handleViewReport}
          >
            View Report
          </button>
        </div>
      </div>

      {/* Report Details Modal */}
      {isModalOpen && (
        <div className="flagged-report-modal">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>×</button>
            <h3>Report Details</h3>
            
            <div className="report-details">
              <div className="detail-row">
                <span className="detail-label">Report ID:</span>
                <span className="detail-value">{reportId}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Blog Title:</span>
                <span className="detail-value">{title}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Report Type:</span>
                <span className="detail-value">{reportType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">{status}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date Flagged:</span>
                <span className="detail-value">{flaggedAt}</span>
              </div>
              <div className="detail-row full-width">
                <span className="detail-label">Reporter Comments:</span>
                <p className="detail-value">{reportComments}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="modal-action-button remove">Remove Blog</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlagBlogCard;
