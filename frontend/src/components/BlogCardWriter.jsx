import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import api from "../api"; // Axios instance with JWT
import "../styles/BlogCardWriter.css";
const BlogCardWriter = ({ blog, onDeleteBlog }) => {
  const {
    id,
    title,
    tags,
    image,
    updatedAt,
    viewCount,
    saveCount,
    status = "draft"
  } = blog;

  // Construct full image URL
  const imageUrl = image ? `${import.meta.env.VITE_API_URL}${image}` : null;

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/blogs/blogs/${id}/`); // Make sure this is your delete endpoint
      onDeleteBlog(id); // remove from UI
      
      // Show success popup
      setShowConfirm(false);
      setShowSuccess(true);
      
      // Auto reload page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Failed to delete the blog. Please try again.");
      setShowConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const handleEditClick = () => {
    navigate(`/editblog/${id}`); // Navigate to edit page with blog ID
  };

  return (
    <>
      {/* Blog Card */}
      <div className="writer-blog-card">
        <div className="writer-blog-content">
          <h3 className="writer-blog-title">{title}</h3>
          <div className="writer-blog-tags">
            {tags && tags.map((tag, index) => (
              <span key={index} className="writer-tag">
                {typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
          </div>
          <div className="writer-blog-meta">
            <span>Updated: {new Date(updatedAt).toLocaleDateString()}</span>
            <span>Views: {viewCount || 0}</span>
            <span>Saves: {saveCount || 0}</span>
          </div>
        </div>

        <div className="writer-blog-right-section">
          <span className={`writer-blog-status ${status}`}>
            {status}
          </span>
          <div className="writer-blog-actions">
            <button
              className="writer-view-button"
              onClick={handleEditClick}
            >
              Edit
            </button>
            <button
              className="writer-delete-button"
              onClick={handleDeleteClick}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm &&
        ReactDOM.createPortal(
          <div className="writer-confirm-overlay">
            <div className="writer-confirm-modal">
              <h4>Delete Confirmation</h4>
              <p>Are you sure you want to delete "{title}"?</p>
              <div className="writer-confirm-buttons">
                <button
                  className="writer-confirm-cancel"
                  onClick={cancelDelete}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="writer-confirm-delete"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Success Popup */}
      {showSuccess &&
        ReactDOM.createPortal(
          <div className="writer-success-overlay">
            <div className="writer-success-modal">
              <div className="writer-success-icon">✅</div>
              <h4>Success!</h4>
              <p>Blog deleted successfully!</p>
              <div className="writer-success-loading">
                <div className="writer-success-spinner"></div>
                <span>Refreshing page...</span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default BlogCardWriter;
