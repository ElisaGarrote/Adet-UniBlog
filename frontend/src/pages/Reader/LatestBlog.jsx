import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogGrid from '../../components/BlogGrid';
import NoRecommendations from '../../components/NoRecommendation';
import "../../styles/Recommendation.css";
import Footer from '../../components/Footer';
import Pagination from '../../components/Pagination';
import api from '../../api';

const Latestblog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 12; // Show 12 blogs per page

  useEffect(() => {
    const fetchPublishedBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all blogs from the API
        const response = await api.get("/blogs/blogs/");
        const allBlogs = response.data;

        // Filter for only published blogs (not drafts)
        const publishedBlogs = allBlogs.filter(blog => !blog.is_draft);

        // Sort by creation date (newest first)
        const sortedBlogs = publishedBlogs.sort((a, b) => 
          new Date(b.created_at || b.updatedAt || b.updated_at) - 
          new Date(a.created_at || a.updatedAt || a.updated_at)
        );

        // Fetch author details for each blog
        const blogsWithAuthors = await Promise.all(
          sortedBlogs.map(async (blog) => {
            let authorName = `User ${blog.author}`;
            
            console.log("Blog author ID:", blog.author); // Debug log
            
            try {
              // Fetch author details from users API - correct endpoint
              const authorResponse = await api.get(`/users/list/${blog.author}/`);
              const authorData = authorResponse.data;
              
              console.log("Author data received:", authorData); // Debug log
              
              // Combine first name and last name
              const firstName = authorData.first_name || '';
              const lastName = authorData.last_name || '';
              const fullName = `${firstName} ${lastName}`.trim();
              
              authorName = fullName || authorData.username || `User ${blog.author}`;
              
              console.log("Final author name:", authorName); // Debug log
            } catch (error) {
              console.error(`Failed to fetch author details for user ${blog.author}:`, error);
              // Keep default name if fetch fails
            }

            return {
              ...blog,
              authorName
            };
          })
        );

        // Format blogs for BlogGrid component
        const formattedBlogs = blogsWithAuthors.map(blog => {
          const imageUrl = blog.image || blog.blog_img;
          let fullImageUrl = null;
          
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
            id: blog.id,
            title: blog.title || blog.blog_title || 'Untitled Blog',
            author: blog.authorName || `User ${blog.author}`,
            tags: Array.isArray(blog.tags) 
              ? blog.tags.map(tag => typeof tag === 'string' ? tag : tag.name || tag)
              : [],
            image: fullImageUrl,
            description: blog.blog_desc ? blog.blog_desc.substring(0, 150) + '...' : '',
            createdAt: blog.created_at || blog.updatedAt || blog.updated_at,
            viewCount: blog.viewCount || blog.views_count || 0
          };
        });

        setBlogs(formattedBlogs);
      } catch (error) {
        console.error("Error fetching published blogs:", error);
        setError("Failed to load blogs. Please try again later.");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedBlogs();
  }, []);

  // Pagination calculations
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="recommendation-page">
      <main className="recommendation-container">
        <h1>Latest Blog</h1>
        <p className="subtitle">Here are the latest blogs for you</p>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading latest blogs...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <NoRecommendations message="No published blogs available at the moment." />
        ) : (
          <>
            <BlogGrid blogs={currentBlogs} />
            
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Latestblog;