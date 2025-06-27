import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/BlogCard.css"

const BlogCard = ({ blog }) => {
  // Function to truncate title if it exceeds 28 characters
  const truncateTitle = (title, maxLength = 28) => {
    if (title.length <= maxLength) {
      return title;
    }
    return title.substring(0, maxLength) + '..';
  };

  return (
    <div className="bc-blog-card">
      <img src={blog.image} alt={blog.title} className="bc-blog-image" />
      <div className="bc-blog-tags">
        {blog.tags.map((tag) => (
          <span key={tag} className="bc-tag">{tag}</span>
        ))}
      </div>
      <h3 className="bc-blog-title">{truncateTitle(blog.title)}</h3>
      <p className="bc-blog-author">By {blog.author}</p>
      <Link to={`/viewblog/${blog.id}`} className="bc-read-button">Read →</Link>
    </div>
  );
};

export default BlogCard;