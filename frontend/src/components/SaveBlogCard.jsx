import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SavedBlogCard.css';

const SavedBlogCard = ({ blog, onRemove }) => {
  const navigate = useNavigate();

  // Function to strip HTML tags from description
  const stripHtmlTags = (html) => {
    if (!html) return 'No description available';
    
    // Create a temporary div element to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Get text content and clean it up
    const text = temp.textContent || temp.innerText || '';
    
    // Trim whitespace and limit length
    const cleanText = text.trim();
    return cleanText.length > 150 ? cleanText.substring(0, 150) + '...' : cleanText;
  };

  const handleTagClick = (tag, e) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to TagBrowse page with the selected tag
    navigate(`/tags/${encodeURIComponent(tag)}`);
  };

  const handleRemoveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this blog from your saved list?')) {
      onRemove();
    }
  };
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
          {blog.tags?.map((tag, index) => (
            <span 
              key={index} 
              className="tag clickable-tag"
              onClick={(e) => handleTagClick(tag, e)}
              title={`Browse blogs with tag: ${tag}`}
            >
              #{tag}
            </span>
          ))}
        </div>
        
        <h3 className="blog-title">
          <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
        </h3>
        
        <p className="blog-description">
          {stripHtmlTags(blog.description)}
        </p>
        
        <p className="blog-author">By {blog.author || 'Unknown author'}</p>
      </div>
      
      <button 
        className="remove-button"
        onClick={handleRemoveClick}
        aria-label="Remove from saved blogs"
        title="Remove from saved blogs"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
};


export default SavedBlogCard;