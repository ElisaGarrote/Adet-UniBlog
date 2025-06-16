import React from 'react';
import { Link } from 'react-router-dom';
//import Navbar from '../../components/Navbar';
//import Footer from '../../components/Footer'; // Uncommented and corrected path
import BlogGrid from '../../components/BlogGrid';
import NoRecommendations from '../../components/NoRecommendation';
import "../../styles/Recommendation.css"; // Corrected path
import Footer from '../../components/Footer';
import Pagination from '../../components/Pagination';
import SamplePic from '../../assets/img/samplepic.jpg';
import SamplePic2 from '../../assets/img/samplepic2.jpg';
import SamplePic3 from '../../assets/img/samplepic3.webp';
import SamplePic4 from '../../assets/img/samplepic4.jpeg';
import SamplePic5 from '../../assets/img/samplepic5.jpg';
import SamplePic6 from '../../assets/img/samplepic6.jpeg';

// Mock data
const mockBlogs = [
  {
    id: 1,
    title: 'The Future of AI in Education',
    author: 'Jane Smith',
    tags: ['AI', 'Education', 'Technology'],
    image: SamplePic
  },
  {
    id: 2,
    title: 'Modern Web Development Trends',
    author: 'John Doe',
    tags: ['Web', 'Development', 'JavaScript'],
    image: SamplePic2
  },
  {
    id: 3,
    title: 'Sustainable Tech Solutions',
    author: 'Emma Johnson',
    tags: ['Sustainability', 'Green Tech'],
    image: SamplePic3
  },
  {
    id: 4,
    title: 'The Psychology of UX Design',
    author: 'Michael Chen',
    tags: ['UX', 'Design', 'Psychology'],
    image: SamplePic4
  },
  {
    id: 5,
    title: 'Blockchain Beyond Cryptocurrency',
    author: 'Sarah Williams',
    tags: ['Blockchain', 'Technology'],
    image: SamplePic5
  },
  {
    id: 6,
    title: 'Data Privacy in 2023',
    author: 'David Kim',
    tags: ['Privacy', 'Security', 'Data'],
    image: SamplePic6
  }
];

const Tagsblog = () => {
  return (
    <div className="recommendation-page">
      <main className="recommendation-container">
        <h1>Study Tips</h1>
        <p className="subtitle">Here are the blogs for your selected tags</p>
        
        <BlogGrid blogs={mockBlogs} />
        
        <div className="view-more-container">
          <Link to="/latest" className="view-more-button">
            View Latest Blogs
          </Link>
        </div>
        {/* Your blog content here */}
        <Pagination 
           
        />
        
      </main>
      <Footer />
    </div>
  );
};

export default Tagsblog;