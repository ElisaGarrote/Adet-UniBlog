import React from 'react';
import SavedBlogCard from '../components/SaveBlogCard.jsx';
import '../styles/SavedBlogList.css';

const SavedBlogList = ({ savedBlogs, onRemoveBlog }) => {
  return (
    <div className="saved-blogs-container">
      <div className="saved-blogs-header">
        <h2>Saved Blogs</h2>
        <span className="saved-count">{savedBlogs.length} saved</span>
      </div>

      <div className="saved-blogs-list">
        {savedBlogs.length > 0 ? (
          savedBlogs.map(blog => (
            <SavedBlogCard
              key={blog.id}
              blog={blog}
              onRemove={() => onRemoveBlog(blog.id)}
            />
          ))
        ) : (
          <div className="no-saved-blogs">
            <p>You haven't saved any blogs yet</p>
            <Link to="/blogs" className="browse-link">
              Browse Blogs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Default props for the component
SavedBlogList.defaultProps = {
  savedBlogs: [
    {
      id: '1',
      image: '/sample-blog1.jpg',
      title: 'The Future of AI in Education',
      description: 'How artificial intelligence is transforming learning experiences',
      author: 'Jane Smith',
      tags: ['AI', 'Education']
    },
    {
      id: '2',
      image: '/sample-blog2.jpg',
      title: 'Modern Web Development Trends',
      description: 'Exploring the latest technologies in web development',
      author: 'John Doe',
      tags: ['Web', 'Development']
    }
  ],
  onRemoveBlog: (id) => console.log(`Removing blog with id: ${id}`)
};

export default SavedBlogList;