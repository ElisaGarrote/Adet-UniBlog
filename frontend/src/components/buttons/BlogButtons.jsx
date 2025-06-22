import { useState } from 'react';
import { FaBookmark, FaFlag } from 'react-icons/fa';

const BlogButtons = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [isReported, setIsReported] = useState(false);

  const handleSaveBlog = () => {
    setIsSaved(!isSaved);
    // Add your save blog logic here
    console.log(isSaved ? 'Blog unsaved' : 'Blog saved');
  };

  const handleReportBlog = () => {
    setIsReported(true);
    // Add your report blog logic here
    alert('Blog reported. Thank you for your feedback.');
  };

  return (
    <div className="blog-actions">
      <button 
        className={`save-btn ${isSaved ? 'saved' : ''}`}
        onClick={handleSaveBlog}
        aria-label={isSaved ? 'Unsave blog' : 'Save blog'}
      >
        <FaBookmark className="icon" />
        {isSaved ? 'Saved' : 'Save Blog'}
      </button>
      
      <button 
        className={`report-btn ${isReported ? 'reported' : ''}`}
        onClick={handleReportBlog}
        disabled={isReported}
        aria-label="Report blog"
      >
        <FaFlag className="icon" />
        {isReported ? 'Reported' : 'Report'}
      </button>
    </div>
  );
};

export default BlogButtons;