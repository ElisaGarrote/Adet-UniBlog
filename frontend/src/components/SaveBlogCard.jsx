import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SavedBlogCard.css';

const SavedBlogCard = ({ blog, onRemove }) => {
  return (
    <div className="saved-blog-card">
      <div className="blog-image-container">
        <img 
          src={blog.image || '/default-blog.jpg'} 
          alt={blog.title} 
          className="save-blog-image"
        />
      </div>
      
      <div className="blog-content">
        <div className="blog-tags">
          {blog.tags?.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        
        <h3 className="blog-title">
          <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
        </h3>
        
        <p className="blog-description">
          {blog.description || 'No description available'}
        </p>
        
        <p className="blog-author">By {blog.author || 'Unknown author'}</p>
      </div>
      
      <button 
        className="remove-button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        aria-label="Remove from saved blogs"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
};


export default SavedBlogCard;