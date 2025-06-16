import React from 'react';
import BlogCard from './BlogCard.jsx';
import '../styles/BlogGrid.css';

const BlogGrid = ({ blogs }) => {
  return (
    <div className="blog-grid-container">
      <div className="blog-grid">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default BlogGrid;