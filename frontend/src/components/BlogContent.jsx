import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFlag, FaBookmark, FaArrowUp, FaEye, FaCalendarAlt, FaUser, FaRegBookmark, FaArrowLeft } from 'react-icons/fa';
import '../styles/BlogPage.css';
import profilePic from "../assets/img/profilepic.jpg";
import Footer from '../components/Footer';
import api from '../api';


const BlogContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [viewIncremented, setViewIncremented] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Fetch blog data and handle view count increment
  useEffect(() => {
    const fetchBlogAndAuthor = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user info from token
        const token = localStorage.getItem("access");
        if (token) {
          const userPayload = JSON.parse(atob(token.split(".")[1]));
          setCurrentUser({ id: userPayload.user_id, role: userPayload.user_role });
        }

        // Fetch blog details
        const blogResponse = await api.get(`/blogs/blogs/${id}/`);
        const blogData = blogResponse.data;

        // Increment view count only once per session and only for readers
        if (!viewIncremented && currentUser?.role === 'reader') {
          try {
            await api.patch(`/blogs/blogs/${id}/`, { 
              views_count: (blogData.views_count || 0) + 1 
            });
            setViewIncremented(true);
            // Update the blog data to reflect the incremented view count
            blogData.views_count = (blogData.views_count || 0) + 1;
          } catch (viewError) {
            console.warn('Failed to increment view count:', viewError);
          }
        }

        // Construct full image URL
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

        setBlog({
          ...blogData,
          image: fullImageUrl,
          title: blogData.title || blogData.blog_title,
          content: blogData.blog_desc, // Keep raw HTML content
          viewCount: blogData.views_count || 0,
          createdAt: blogData.created_at,
          updatedAt: blogData.updated_at,
          tags: Array.isArray(blogData.tags) ? blogData.tags : []
        });

        // Check if blog is saved by current user (only for readers)
        if (currentUser?.role === 'reader') {
          try {
            const savedResponse = await api.get('/blogs/saved-blogs/');
            const savedBlogs = savedResponse.data;
            const isCurrentBlogSaved = savedBlogs.some(savedBlog => 
              savedBlog.blog === parseInt(id) && savedBlog.user === currentUser.id
            );
            setIsSaved(isCurrentBlogSaved);
          } catch (savedError) {
            console.warn('Failed to check saved status:', savedError);
          }
        }

        // Fetch author details
        try {
          const authorResponse = await api.get(`/users/list/${blogData.author}/`);
          const authorData = authorResponse.data;
          
          const firstName = authorData.first_name || '';
          const lastName = authorData.last_name || '';
          const fullName = `${firstName} ${lastName}`.trim();
          
          setAuthor({
            name: fullName || authorData.username || `User ${blogData.author}`,
            profilePic: authorData.profilepic ? 
              (authorData.profilepic.startsWith('http') ? 
                authorData.profilepic : 
                `${import.meta.env.VITE_API_URL}${authorData.profilepic}`) 
              : null
          });
        } catch (authorError) {
          console.warn('Failed to fetch author details:', authorError);
          setAuthor({
            name: `User ${blogData.author}`,
            profilePic: null
          });
        }

      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogAndAuthor();
    }
  }, [id, currentUser?.role, viewIncremented]);

  // Show/hide back to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Sample blog data - you can replace this with props or API data
  const blogData = blog ? {
    title: blog.title || 'Untitled Blog',
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    blogImage: blog.image,
    author: {
      name: author?.name || "Loading...",
      image: author?.profilePic || profilePic,
      publishDate: formatDate(blog.createdAt)
    },
    content: blog.content, // Keep original HTML content
    viewCount: blog.viewCount || 0
  } : {
    title: "The Future of Web Development: Trends to Watch in 2025",
    tags: ["Web Development", "JavaScript", "React", "Technology", "Programming"],
    blogImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    author: {
      name: "Sarah Johnson",
      image: profilePic,
      publishDate: "March 15, 2025"
    },
    content: [
      "The landscape of web development continues to evolve at a breakneck pace, with new technologies and methodologies emerging constantly. As we navigate through 2025, several key trends are shaping how we build and interact with web applications.",
      
      "One of the most significant developments is the rise of AI-powered development tools. These tools are not just helping developers write code faster, but they're also improving code quality and helping catch potential issues before they become problems. From intelligent code completion to automated testing suggestions, AI is becoming an integral part of the development workflow.",
      
      "Another major trend is the continued emphasis on performance optimization. With Core Web Vitals becoming increasingly important for SEO rankings, developers are focusing more than ever on creating fast, responsive applications. This includes adopting new techniques like edge computing, advanced caching strategies, and optimized asset delivery.",
      
      "The component-based architecture that React popularized is now being adopted across different frameworks and even in vanilla JavaScript applications. This modular approach to building user interfaces has proven to be both scalable and maintainable, making it easier for teams to collaborate on large projects.",
      
      "Security remains a top priority, with new threats emerging regularly. Developers are implementing more sophisticated authentication methods, adopting zero-trust architectures, and ensuring that security is considered from the ground up rather than as an afterthought.",
      
      "Looking ahead, we can expect to see continued innovation in areas like WebAssembly, progressive web apps, and serverless architectures. The key for developers is to stay curious, keep learning, and adapt to these changing technologies while maintaining focus on creating great user experiences."
    ],
    viewCount: 0
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSave = async () => {
    if (!currentUser || currentUser.role !== 'reader') {
      alert('Only readers can save blogs.');
      return;
    }

    try {
      if (isSaved) {
        // Unsave the blog using the custom action endpoint
        await api.delete(`/blogs/saved-blogs/remove_by_blog/`, { 
          data: { blog: parseInt(id) } 
        });
        setIsSaved(false);
        alert('Blog removed from saved list.');
      } else {
        // Save the blog
        await api.post('/blogs/saved-blogs/', { blog: parseInt(id) });
        setIsSaved(true);
        alert('Blog saved successfully!');
      }
    } catch (error) {
      console.error('Error saving/unsaving blog:', error);
      if (error.response?.status === 400) {
        alert('This blog is already in your saved list or an error occurred.');
      } else {
        alert('Failed to save/unsave blog. Please try again.');
      }
    }
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  const handleReportSubmit = async (reason) => {
    if (!currentUser || currentUser.role !== 'reader') {
      alert('Only readers can report blogs.');
      return;
    }

    try {
      await api.post('/blogs/reported-blogs/', {
        blog: parseInt(id),
        reason: reason
      });
      alert('Blog reported successfully. Thank you for your feedback.');
      setShowReportModal(false);
    } catch (error) {
      console.error('Error reporting blog:', error);
      if (error.response?.status === 400) {
        alert('You have already reported this blog.');
      } else {
        alert('Failed to report blog. Please try again.');
      }
      setShowReportModal(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading blog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!blog && !loading) {
    return (
      <div className="error-container">
        <h2>Blog Not Found</h2>
        <p>The blog post you're looking for doesn't exist.</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="blog-container">
        {/* Back Button */}
        <div className="back-button-container">
          <button onClick={() => navigate(-1)} className="back-button">
            <FaArrowLeft className="back-button-icon" />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="blog-header">
          <h1 className="blog-title2">
            {blogData.title}
          </h1>
          
          {/* Tags */}
          <div className="tags-container">
            {blogData.tags && blogData.tags.length > 0 && blogData.tags.map((tag, index) => (
              <span 
                key={index}
                className="tag"
              >
                #{typeof tag === 'object' ? tag.name || tag.tag_name || tag : tag}
              </span>
            ))}
          </div>
        </div>

        {/* Blog Image */}
        <div className="blog-image-container">
          <img 
            src={blogData.blogImage} 
            alt="Blog cover"
            className="blog-image"
          />
        </div>

        {/* Author Info and Action Buttons */}
        <div className="author-section">
          <div className="author-info">
            {author?.profilePic ? (
              <img 
                src={blogData.author.image} 
                alt={blogData.author.name}
                className="author-image"
                onError={(e) => {
                  e.target.src = profilePic;
                }}
              />
            ) : (
              <div className="author-image-placeholder">
                <FaUser />
              </div>
            )}
            <div>
              <h3 className="author-name2">{blogData.author.name}</h3>
              <p className="publish-date">
                <FaCalendarAlt className="date-icon" />
                {blogData.author.publishDate}
              </p>
              {blog && (
                <p className="view-count">
                  <FaEye className="view-icon" />
                  {blogData.viewCount} views
                </p>
              )}
            </div>
          </div>
          
          {/* Action Buttons - Only show for readers */}
          {currentUser?.role === 'reader' && (
            <div className="action-buttons">
              <button 
                onClick={handleSave}
                className={`save-btn ${isSaved ? 'saved' : ''}`}
              >
                {isSaved ? <FaBookmark className="btn-icon" /> : <FaRegBookmark className="btn-icon" />}
                {isSaved ? 'Saved' : 'Save Blog'}
              </button>
              
              <button 
                onClick={handleReport}
                className="report-btn"
              >
                <FaFlag className="btn-icon" />
                Report Blog
              </button>
            </div>
          )}
        </div>

        {/* Blog Content */}
        <div className="blog-content">
          {blogData.content ? (
            <div 
              className="blog-html-content"
              dangerouslySetInnerHTML={{ __html: blogData.content }}
            />
          ) : (
            <p className="blog-paragraph">No content available.</p>
          )}
        </div>

        {/* Social Actions */}
        <div className="social-section">
          <div className="social-actions">
            <div className="read-time">
              {blog ? Math.ceil((blog.content?.replace(/<[^>]*>/g, '').length || 0) / 1000) : 5} min read
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button 
            onClick={handleBackToTop}
            className="back-to-top"
            aria-label="Back to top"
          >
            <FaArrowUp />
          </button>
        )}

        {/* Report Modal */}
        {showReportModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="modal-title">Report this blog post</h3>
              <p className="modal-description">Why are you reporting this content?</p>
              
              <div className="report-options">
                {['Spam', 'Inappropriate content', 'Harassment', 'False information', 'Copyright violation'].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => handleReportSubmit(reason)}
                    className="report-option"
                  >
                    {reason}
                  </button>
                ))}
              </div>
              
              <div className="modal-actions">
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer outside of blog-container for full width */}
      <Footer />
    </>
  );
};

export default BlogContent;