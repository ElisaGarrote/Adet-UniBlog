import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BlogCard from '../../components/BlogCard';
import Pagination from '../../components/Pagination';
import Footer from '../../components/Footer';
import api from '../../api';
import '../../styles/TagBrowse.css';

const TagBrowse = () => {
  const { tagName } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 12;

  useEffect(() => {
    const fetchBlogsByTag = async () => {
      if (!tagName) {
        setBlogs([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch all published blogs
        const response = await api.get('/blogs/blogs/');
        const allBlogs = response.data;

        // Filter published blogs only
        const publishedBlogs = allBlogs.filter(blog => !blog.is_draft);

        // Filter blogs by tag
        const tagFilteredBlogs = publishedBlogs.filter(blog => {
          return blog.tags?.some(tag => {
            const tagNameToCheck = typeof tag === 'string' ? tag : tag.name || tag.tag_name;
            return tagNameToCheck?.toLowerCase() === tagName.toLowerCase();
          });
        });

        // Fetch authors for each blog
        const blogsWithAuthors = await Promise.all(
          tagFilteredBlogs.map(async (blog) => {
            try {
              const authorResponse = await api.get(`/users/list/${blog.author}/`);
              const authorData = authorResponse.data;
              
              return {
                ...blog,
                authorName: `${authorData.first_name || ''} ${authorData.last_name || ''}`.trim() || authorData.username || 'Unknown Author'
              };
            } catch (error) {
              console.warn(`Failed to fetch author for blog ${blog.id}:`, error);
              return {
                ...blog,
                authorName: 'Unknown Author'
              };
            }
          })
        );

        // Format blogs for display
        const formattedBlogs = blogsWithAuthors.map(blog => {
          const imageUrl = blog.image || blog.blog_img;
          let fullImageUrl = null;
          
          if (imageUrl) {
            if (imageUrl.startsWith('http')) {
              fullImageUrl = imageUrl;
            } else {
              const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
              fullImageUrl = imageUrl.startsWith('/') 
                ? `${baseUrl}${imageUrl}` 
                : `${baseUrl}/${imageUrl}`;
            }
          }

          return {
            id: blog.id,
            title: blog.title || blog.blog_title || 'Untitled Blog',
            author: blog.authorName,
            image: fullImageUrl,
            tags: Array.isArray(blog.tags) 
              ? blog.tags.map(tag => typeof tag === 'string' ? tag : tag.name || tag.tag_name || tag)
              : []
          };
        });

        setBlogs(formattedBlogs);
      } catch (error) {
        console.error('Error fetching blogs by tag:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogsByTag();
  }, [tagName]);

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="tag-browse-wrapper">
      <div className="tag-browse-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="no-results">
            <h3>No blogs found</h3>
            {tagName && (
              <p>0 blogs tagged with "{tagName}"</p>
            )}
            <p>No blogs are currently tagged with this tag.</p>
          </div>
        ) : (
          <>
            <div className="tag-header">
              {tagName && (
                <h3 className="tag-name">
                  {`${blogs.length} blogs tagged with "${tagName}"`}
                </h3>
              )}
            </div>
            
            <div className="tag-browse-grid">
              {currentBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination-container">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TagBrowse;
