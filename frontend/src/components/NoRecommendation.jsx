//import React from 'react';
import { Link } from 'react-router-dom';
//import "../../styles/Recommendation.css"; // Corrected path

const NoRecommendations = () => {
  return (
    <div className="no-recommendations">
      <p>No personalized recommendations found.</p>
      <Link to="/latest" className="view-latest-button">
        View More Blogs
      </Link>
    </div>
  );
};

export default NoRecommendations;