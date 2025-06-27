import React from "react";
import "../styles/AllBlogCardWriter.css";
import SamplePic from "../assets/img/samplepic.jpg";

const AllBlogCardWriter = ({ blog = {}, onViewBlog }) => {
  const { 
    id = '', 
    title = 'Untitled Blog', 
    tags = [], 
    image, 
    updatedAt = '', 
    viewCount = 0, 
    saveCount = 0 
  } = blog;

  if (!blog || Object.keys(blog).length === 0) return null;

  return (
    <div className="all-writer-blog-card">
      <img 
        src={image || SamplePic} 
        alt={title} 
        className="all-writer-blog-image" 
        onError={(e) => {
          e.target.src = SamplePic;
        }}
      />
      
      <div className="all-writer-blog-content">
        <h3 className="all-writer-blog-title">{title}</h3>
        {tags.length > 0 && (
          <div className="all-writer-blog-tags">
            {tags.map((tag, i) => (
              <span key={i} className="all-writer-tag">{tag}</span>
            ))}
          </div>
        )}
        <div className="all-writer-blog-meta">
          {updatedAt && <span>Updated: {updatedAt}</span>}
          <span>Views: {viewCount}</span>
          <span>Saves: {saveCount}</span>
        </div>
      </div>

      <div className="all-writer-blog-actions">
        <button 
          className="all-writer-view-button"
          onClick={() => onViewBlog(id)}
          disabled={!id}
        >
          View
        </button>
      </div>
    </div>
  );
};

export default AllBlogCardWriter;