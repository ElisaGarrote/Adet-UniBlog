import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import ReactDOM from "react-dom";
import "../styles/BlogCardWriter.css";

const BlogCardWriter = ({ blog, onDeleteBlog }) => {
  const { id, title, tags, image, updatedAt, viewCount, saveCount } = blog;
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    onDeleteBlog(id);
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const handleEditClick = () => {
    navigate("/updateblog"); // Simple navigation without data
  };

  return (
    <>
      {/* Blog Card */}
      <div className="writer-blog-card">
        <img src={image} alt={title} className="writer-blog-image" />

        <div className="writer-blog-content">
          <h3 className="writer-blog-title">{title}</h3>
          <div className="writer-blog-tags">
            {tags.map((tag, index) => (
              <span key={index} className="writer-tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="writer-blog-meta">
            <span>Updated: {updatedAt}</span>
            <span>Views: {viewCount}</span>
            <span>Saves: {saveCount}</span>
          </div>
        </div>

        <div className="writer-blog-actions">
          <button
            className="writer-view-button"
            onClick={handleEditClick}
          >
            Edit
          </button>
          <button className="writer-delete-button" onClick={handleDeleteClick}>
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal via React Portal */}
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
                >
                  Cancel
                </button>
                <button
                  className="writer-confirm-delete"
                  onClick={confirmDelete}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default BlogCardWriter;
