import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import profilePic from '../assets/img/profilepic.jpg';
import EditProfile from './EditProfile'; // Import EditProfile component
import '../styles/ProfileCard.css';

const ProfileCard = ({ user }) => { 
  const navigate = useNavigate(); // Initialize navigate
  const [profileImage, setProfileImage] = useState(user.profilePic || '/default-profile.png');
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const fileInputRef = useRef(null);

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

  const handleEditClick = () => {
     navigate('/updateprofile');
    //setIsEditing(true);
  };

  const handleSave = (updatedData) => {
    setCurrentUser(prev => ({ ...prev, ...updatedData }));
    setIsEditing(false);
    // Here you would typically also make an API call to save the changes to your backend
  };

  const handleDelete = () => {
    // Handle account deletion logic here
    console.log('Account deletion requested');
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  const handleChangePasswordClick = () => {
    navigate('/updatepassword'); // Navigate to change password page
  };

  return (
    <div className="profile-card">
      <h2 className="profile-header">Profile Information</h2>
      
      <div className="profile-picture-wrapper" onClick={handlePictureClick}>
        <div className="profile-picture-container">
          <img 
            src={profileImage} 
            alt="Profile" 
            className="profile-picture"
          />
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
        <div className="detail-row">
          <span className="detail-label">First Name:</span>
          <span className="detail-value">{currentUser.firstName}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Last Name:</span>
          <span className="detail-value">{currentUser.lastName}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Department:</span>
          <span className="detail-value">{currentUser.department}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Organization:</span>
          <span className="detail-value">{currentUser.organization}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{currentUser.email}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Account Created:</span>
          <span className="detail-value">{currentUser.createdAt}</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="edit-button" onClick={handleEditClick}>Edit Information</button>
        <button 
          className="change-password-button" 
          onClick={handleChangePasswordClick}
        >
          Change Password
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <EditProfile 
          userData={currentUser}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default ProfileCard;