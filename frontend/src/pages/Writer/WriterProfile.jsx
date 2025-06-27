import React from 'react';
import ProfileCard from '../../components/ProfileCard.jsx';
import profilePic from '../../assets/img/profilepic.jpg';
import '../../styles/WriterProfile.css';

const WriterProfile = () => {
  const userData = {
    profilePic: profilePic,
    firstName: 'Elisa',
    lastName: 'Garrote',
    department: 'Computer Science',
    organization: 'University of Oslo',
    email: 'elisa@uniblog.com',
    createdAt: 'Joined January 2023',
    role: 'Writer'
  };

  const writerRules = [
    "All content must be original and properly cited",
    "No plagiarism or copyright infringement",
    "Posts should be well-researched and factual",
    "Maintain professional tone and language",
    "Submit drafts by the 15th of each month",
    "Maximum 3 blog posts per week",
    "Include proper references and sources",
    "No promotional or sponsored content without approval"
  ];

  return (
    <div className="writer-profile-container">
      <div className="profile-column">
        <ProfileCard user={userData} />
      </div>
      
      <div className="rules-column">
      
        <div className="rules-card">
          <h3>Rules & Regulations</h3>
          <ul>
            {writerRules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WriterProfile;