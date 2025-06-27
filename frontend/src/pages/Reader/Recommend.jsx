import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogGrid from '../../components/BlogGrid';
import NoRecommendations from '../../components/NoRecommendation';
import "../../styles/Recommendation.css";
import Footer from '../../components/Footer';
import api from '../../api';

const Recommend = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch AI-powered recommendations from backend
        const response = await api.get('/blogs/blogs/recommendations/');
        
        // Transform the data to match BlogGrid expectations
        const transformedBlogs = response.data.map(blog => ({
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
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

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
          <BlogGrid blogs={recommendations} />
        ) : (
          <NoRecommendations />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Recommend;