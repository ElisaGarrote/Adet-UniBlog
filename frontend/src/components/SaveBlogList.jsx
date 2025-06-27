import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SavedBlogCard from '../components/SaveBlogCard.jsx';
import '../styles/SavedBlogList.css';
import api from '../api';

const SavedBlogList = () => {
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user's saved blogs
        const savedResponse = await api.get('/blogs/saved-blogs/');
        const savedBlogsData = savedResponse.data;

        // Fetch full blog details for each saved blog
        const blogsWithDetails = await Promise.all(
          savedBlogsData.map(async (savedBlog) => {
            try {
              // Fetch the actual blog data
              const blogResponse = await api.get(`/blogs/blogs/${savedBlog.blog}/`);
              const blogData = blogResponse.data;

              // Fetch author details
              const authorResponse = await api.get(`/users/list/${blogData.author}/`);
              const authorData = authorResponse.data;

              // Format image URL
              let fullImageUrl = null;
              const imageUrl = blogData.image || blogData.blog_img;
              if (imageUrl) {
                if (imageUrl.startsWith('http')) {
                  fullImageUrl = imageUrl;
                } else {
                  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                  fullImageUrl = imageUrl.startsWith('/') 
                    ? `${baseUrl}${imageUrl}` 
                    : `${baseUrl}/${imageUrl}`;
                }
              }

              return {
                id: blogData.id,
                savedId: savedBlog.id, // ID of the saved blog record
                title: blogData.title || blogData.blog_title || 'Untitled Blog',
                description: blogData.blog_desc || 'No description available',
                image: fullImageUrl,
                author: `${authorData.first_name || ''} ${authorData.last_name || ''}`.trim() || authorData.username || 'Unknown Author',
                tags: Array.isArray(blogData.tags) 
                  ? blogData.tags.map(tag => typeof tag === 'string' ? tag : tag.name || tag.tag_name || tag)
                  : [],
                savedAt: savedBlog.saved_at,
                viewCount: blogData.views_count || 0
              };
            } catch (error) {
              console.error(`Failed to fetch blog details for saved blog ${savedBlog.id}:`, error);
              return null;
            }
          })
        );

        // Filter out any failed requests
        const validBlogs = blogsWithDetails.filter(blog => blog !== null);
        setSavedBlogs(validBlogs);
      } catch (error) {
        console.error('Error fetching saved blogs:', error);
        setError('Failed to load saved blogs. Please try again later.');
        setSavedBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedBlogs();
  }, []);

  const handleRemoveBlog = async (blogId) => {
    try {
      // Remove from backend using the custom action
      await api.delete('/blogs/saved-blogs/remove_by_blog/', { 
        data: { blog: parseInt(blogId) } 
      });

      // Update local state to refresh the list
      setSavedBlogs(savedBlogs.filter(blog => blog.id !== blogId));
      
      // Show success message
      alert('Blog removed from saved list.');
      
    } catch (error) {
      console.error('Error removing saved blog:', error);
      alert('Failed to remove blog. Please try again.');
    }
  };
  return (
    <div className="saved-blogs-container">
      <div className="saved-blogs-header">
        <h2>Saved Blogs</h2>
        <span className="saved-count">{savedBlogs.length} saved</span>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading saved blogs...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      ) : (
        <div className="saved-blogs-list">
          {savedBlogs.length > 0 ? (
            savedBlogs.map(blog => (
              <SavedBlogCard
                key={blog.savedId}
                blog={blog}
                onRemove={() => handleRemoveBlog(blog.id)}
              />
            ))
          ) : (
            <div className="no-saved-blogs">
              <p>You haven't saved any blogs yet</p>
              <Link to="/latestblog" className="browse-link">
                Browse Latest Blogs
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedBlogList;