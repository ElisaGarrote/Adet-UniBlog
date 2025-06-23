import React from 'react';
import "../styles/BlogHeader.css";

const BlogHeader = ({ onAddNewBlog }) => {
  return (
    <div className="writer-header-container">
      <h1 className="writer-header-title">My Blog</h1>
      <button 
        onClick={onAddNewBlog} 
        className="writer-add-blog-button"
      >
        Add New Blog
      </button>
    </div>
  );
};

export default BlogHeader;