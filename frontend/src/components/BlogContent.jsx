import React, { useState, useEffect } from 'react';
import { FaFlag, FaBookmark, FaArrowUp } from 'react-icons/fa';
import '../styles/BlogPage.css';
import profilePic from "../assets/img/profilepic.jpg";
import Footer from '../components/Footer';


const BlogContent = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Show/hide back to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sample blog data - you can replace this with props or API data
  const blogData = {
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
    ]
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Here you would typically save to your backend or local storage
    console.log(isSaved ? 'Blog unsaved' : 'Blog saved');
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  const handleReportSubmit = (reason) => {
    // Handle report submission
    console.log('Blog reported for:', reason);
    setShowReportModal(false);
  };

  return (
    <>
      <div className="blog-container">
        {/* Header */}
        <div className="blog-header">
          <h1 className="blog-title2">
            {blogData.title}
          </h1>
          
          {/* Tags */}
          <div className="tags-container">
            {blogData.tags.map((tag, index) => (
              <span 
                key={index}
                className="tag"
              >
                #{tag}
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
            <img 
              src={blogData.author.image} 
              alt={blogData.author.name}
              className="author-image"
            />
            <div>
              <h3 className="author-name2">{blogData.author.name}</h3>
              <p className="publish-date">{blogData.author.publishDate}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              onClick={handleSave}
              className={`save-btn ${isSaved ? 'saved' : ''}`}
            >
              <FaBookmark className="btn-icon" />
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
        </div>

        {/* Blog Content */}
        <div className="blog-content">
          {blogData.content.map((paragraph, index) => (
            <p key={index} className="blog-paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Social Actions */}
        <div className="social-section">
          <div className="social-actions">
            <div className="read-time">
              5 min read
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