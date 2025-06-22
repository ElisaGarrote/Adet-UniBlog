import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import navigate hook
import profilePic from '../assets/img/profilepic.jpg';
import '../styles/ProfileCard.css';

const ProfileCard = ({ user }) => {
  const [profileImage, setProfileImage] = useState(user.profilePic || '/default-profile.png');
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // ✅ initialize navigate

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePictureClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="profile-card">
      <h2 className="profile-header">Profile Information</h2>

      <div className="profile-picture-wrapper" onClick={handlePictureClick}>
        <div className="profile-picture-container">
          <img src={profileImage} alt="Profile" className="profile-picture" />
          <div className="profile-picture-overlay">Change Picture</div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>

      <div className="profile-details">
        <div className="detail-row"><span className="detail-label">First Name:</span><span className="detail-value">{user.firstName}</span></div>
        <div className="detail-row"><span className="detail-label">Last Name:</span><span className="detail-value">{user.lastName}</span></div>
        <div className="detail-row"><span className="detail-label">Department:</span><span className="detail-value">{user.department}</span></div>
        <div className="detail-row"><span className="detail-label">Organization:</span><span className="detail-value">{user.organization}</span></div>
        <div className="detail-row"><span className="detail-label">Email:</span><span className="detail-value">{user.email}</span></div>
        <div className="detail-row"><span className="detail-label">Account Created:</span><span className="detail-value">{user.createdAt}</span></div>
      </div>

      <div className="profile-actions">
        <button className="edit-button" onClick={() => navigate('/updateprofile')}>Edit Information</button>
        <button className="change-password-button" onClick={() => navigate('/change-password')}>Change Password</button>
      </div>
    </div>
  );
};

export default ProfileCard;
