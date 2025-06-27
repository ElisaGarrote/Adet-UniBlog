import React from "react";
import BlogCardWriter from "../components/BlogCardWriter";
import "../styles/BlogCardWriter.css";

const BlogListWriter = ({ blogs, onDeleteBlog }) => {
  return (
    <div className="writer-blog-list-container">
      <h2 className="writer-blog-list-title">All Blog</h2>
      {blogs.length === 0 ? (
        <p className="writer-blog-empty-message">
          No blogs found. Create your first blog!
        </p>
      ) : (
        <div className="writer-blog-list">
          {blogs.map((blog) => (
            <BlogCardWriter 
              key={blog.id} 
              blog={blog} 
              onDeleteBlog={onDeleteBlog} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogListWriter;