import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogGrid from '../../components/BlogGrid';
import NoRecommendations from '../../components/NoRecommendation';
import Pagination from '../../components/Pagination';
import "../../styles/Recommendation.css";
import Footer from '../../components/Footer';
import api from '../../api';

const Recommend = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  
  const blogsPerPage = 12; // Adjust this number as needed

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch AI-powered recommendations from backend with pagination
        const response = await api.get(`/blogs/blogs/recommendations/?page=${currentPage}&page_size=${blogsPerPage}`);
        
        // Handle paginated response
        const data = response.data;
        const blogsList = data.results || data; // Handle both paginated and non-paginated responses
        
        // Update pagination info if response includes pagination data
        if (data.count !== undefined) {
          setTotalBlogs(data.count);
          setTotalPages(Math.ceil(data.count / blogsPerPage));
        } else {
          // If no pagination info, calculate based on current data
          setTotalBlogs(Array.isArray(blogsList) ? blogsList.length : 0);
          setTotalPages(1);
        }
        
        // Transform the data to match BlogGrid expectations
        const transformedBlogs = (Array.isArray(blogsList) ? blogsList : []).map(blog => ({
          id: blog.id,
          title: blog.title || blog.blog_title || 'Untitled Blog',
          author: blog.author_name || 'Unknown Author',
          tags: Array.isArray(blog.tags) 
            ? blog.tags.map(tag => typeof tag === 'string' ? tag : tag.name || tag.tag_name || tag)
            : [],
          image: blog.image ? 
            (blog.image.startsWith('http') ? blog.image : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${blog.image}`) 
            : '/default-blog.jpg',
          viewCount: blog.views_count || 0,
          description: blog.blog_desc || 'No description available'
        }));

        setRecommendations(transformedBlogs);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError('Failed to load recommendations. Please try again later.');
        setRecommendations([]);
        setTotalPages(1);
        setTotalBlogs(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentPage]); // Re-fetch when page changes

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="recommendation-page">
        <main className="recommendation-container">
          <h1>Blog Recommendation</h1>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading personalized recommendations...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendation-page">
        <main className="recommendation-container">
          <h1>Blog Recommendation</h1>
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="recommendation-page">
      <main className="recommendation-container">
        <h1>Blog Recommendation</h1>
        <p className="subtitle">
          {recommendations.length > 0 
            ? "Based on your reading history and interests" 
            : "Start reading some blogs to get personalized recommendations!"
          }
        </p>
        
        {recommendations.length > 0 ? (
          <>
            <BlogGrid blogs={recommendations} />
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <NoRecommendations />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Recommend;