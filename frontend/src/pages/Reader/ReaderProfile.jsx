import React, { useState, useEffect } from 'react';
import ProfileCard from '../../components/ProfileCard.jsx';
import SavedBlogList from '../../components/SaveBlogList.jsx';
import profilePic from '../../assets/img/profilepic.jpg'
import '../../styles/ReaderProfile.css';
import api from '../../api';

const ReaderProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current user data
        const response = await api.get('/users/me/');
        const user = response.data;

        // Format profile picture URL
        let profilePicUrl = profilePic; // Default fallback
        if (user.profilepic) {
          if (user.profilepic.startsWith('http')) {
            profilePicUrl = user.profilepic;
          } else {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            profilePicUrl = user.profilepic.startsWith('/') 
              ? `${baseUrl}${user.profilepic}` 
              : `${baseUrl}/${user.profilepic}`;
          }
        }

        setUserData({
          profilePic: profilePicUrl,
          firstName: user.first_name || 'User',
          lastName: user.last_name || '',
          department: user.department || 'Not specified',
          organization: user.organization || 'Not specified',
          email: user.email || 'Not specified',
          createdAt: user.date_joined ? `Joined ${new Date(user.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}` : 'Recently joined'
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile data');
        // Set fallback data
        setUserData({
          profilePic: profilePic,
          firstName: 'User',
          lastName: '',
          department: 'Not specified',
          organization: 'Not specified',
          email: 'Not available',
          createdAt: 'Recently joined'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="reader-profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reader-profile-page">
      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}
      
      <div className="profile-section">
        <ProfileCard user={userData} />
      </div>
      
      <div className="saved-blogs-section">
        <SavedBlogList />
      </div>
    </div>
  );
};

export default ReaderProfile;