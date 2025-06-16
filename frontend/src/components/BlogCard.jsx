import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BlogCard.css';

const BlogCard = ({ blog }) => {
  return (
    <div className="blog-card">
      <img src={blog.image} alt={blog.title} className="blog-image" />
      <div className="blog-tags">
        {blog.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
      <h3 className="blog-title">{blog.title}</h3>
      <p className="blog-author">By {blog.author}</p>
      <Link to={`/blog/${blog.id}`} className="read-button">Read →</Link>
    </div>
  );
};

export default BlogCard;