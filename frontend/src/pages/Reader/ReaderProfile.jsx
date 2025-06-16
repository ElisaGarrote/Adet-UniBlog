import React from 'react';
import ProfileCard from '../../components/ProfileCard.jsx';
import SavedBlogList from '../../components/SaveBlogList.jsx';
import profilePic from '../../assets/img/profilepic.jpg'
import '../../styles/ReaderProfile.css';
import SamplePic from '../../assets/img/samplepic.jpg';
import SamplePic2 from '../../assets/img/samplepic2.jpg';
import SamplePic3 from '../../assets/img/samplepic3.webp';


const ReaderProfile = () => {
  // Mock user data - replace with real data later
  const userData = {
    profilePic: profilePic,
    firstName: 'Elisa',
    lastName: 'Garrote',
    department: 'Computer Science',
    organization: 'University of Oslo',
    email: 'elisa@uniblog.com',
    createdAt: 'Joined January 2023'
  };

  // Mock saved blogs data - replace with real data later
  const savedBlogs = [
    {
      id: '1',
      image: SamplePic,
      title: 'The Future of AI in Education',
      description: 'Exploring how AI is transforming modern education systems',
      author: 'Jane Smith',
      tags: ['AI', 'Education']
    },
    {
      id: '2',
      image: SamplePic2,
      title: 'Modern Web Development Trends',
      description: 'Latest technologies and frameworks in web development',
      author: 'John Doe',
      tags: ['Web', 'JavaScript']
    },
    {
      id: '3',
      image: SamplePic3,
      title: 'Sustainable Tech Solutions',
      description: 'How technology can help build a greener future',
      author: 'Emma Johnson',
      tags: ['Sustainability', 'Tech']
    }
  ];

  const handleRemoveBlog = (blogId) => {
    console.log('Removing blog with id:', blogId);
    // Add actual removal logic later
  };

  return (
    <div className="reader-profile-page">
      <div className="profile-section">
        <ProfileCard user={userData} />
      </div>
      
      <div className="saved-blogs-section">
        <SavedBlogList 
          savedBlogs={savedBlogs} 
          onRemoveBlog={handleRemoveBlog} 
        />
      </div>
    </div>
  );
};

export default ReaderProfile;