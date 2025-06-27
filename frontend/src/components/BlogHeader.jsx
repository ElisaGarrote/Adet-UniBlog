import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/BlogHeader.css";

const BlogHeader = () => {
  const navigate = useNavigate();

  const handleAddNewBlog = () => {
    navigate('/writeblog'); // Navigate to your blog creation page
  };

  return (
    <div className="writer-header-container">
      <h1 className="writer-header-title">My Blog</h1>
      <button 
        onClick={handleAddNewBlog} 
        className="writer-add-blog-button"
      >
        Add New Blog
      </button>
    </div>
  );
};

export default BlogHeader;