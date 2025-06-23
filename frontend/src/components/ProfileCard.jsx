import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfileCard.css';
import pfp from '../assets/img/default-profile.png';

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) throw new Error('Failed to fetch user');

        setUser(data);
        setProfileImage(
          data.profilepic
            ? data.profilepic.startsWith('http')
              ? data.profilepic
              : `${import.meta.env.VITE_API_URL}${data.profilepic}`
            : pfp
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handlePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('profilepic', file);
      const token = localStorage.getItem('access');

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error('Upload failed:', errorData);
        } else {
          const updated = await res.json();
          setUser(updated);
          setProfileImage(
            updated.profilepic
              ? updated.profilepic.startsWith('http')
                ? updated.profilepic
                : `${import.meta.env.VITE_API_URL}${updated.profilepic}`
              : pfp
          );
          alert('Profile Picture updated successfully!');
          window.location.reload();
        }
      } catch (err) {
        console.error('Image upload error:', err);
      }
    }
  };

  if (loading) return <div className="profile-card">Loading...</div>;
  if (!user) return <div className="profile-card">No user data found.</div>;

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
        <div className="detail-row"><span className="detail-label">First Name:</span><span className="detail-value">{user.first_name}</span></div>
        <div className="detail-row"><span className="detail-label">Last Name:</span><span className="detail-value">{user.last_name}</span></div>
        <div className="detail-row"><span className="detail-label">Department:</span><span className="detail-value">{user.department}</span></div>
        <div className="detail-row"><span className="detail-label">Organization:</span><span className="detail-value">{user.organization}</span></div>
        <div className="detail-row"><span className="detail-label">Email:</span><span className="detail-value">{user.username}</span></div>
        <div className="detail-row"><span className="detail-label">Account Created:</span><span className="detail-value">{new Date(user.created_at).toLocaleDateString()}</span></div>
      </div>

      <div className="profile-actions">
        <button className="edit-button" onClick={() => navigate('/updateprofile')}>Edit Information</button>
        <button className="change-password-button" onClick={() => navigate('/change-password')}>Change Password</button>
      </div>
    </div>
  );
};

export default ProfileCard;
