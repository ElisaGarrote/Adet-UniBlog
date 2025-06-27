import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BlogCard from '../../components/BlogCard';
import Pagination from '../../components/Pagination';
import Footer from '../../components/Footer';
import api from '../../api';
import '../../styles/SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 12;

  useEffect(() => {
    const searchBlogs = async () => {
      if (!query.trim()) {
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

        // Fetch authors for each blog
        const blogsWithAuthors = await Promise.all(
          publishedBlogs.map(async (blog) => {
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

        // Search functionality
        const searchTerm = query.toLowerCase();
        const filteredBlogs = blogsWithAuthors.filter(blog => {
          // Search in title
          const titleMatch = blog.title?.toLowerCase().includes(searchTerm) || 
                           blog.blog_title?.toLowerCase().includes(searchTerm);
          
          // Search in author name
          const authorMatch = blog.authorName.toLowerCase().includes(searchTerm);
          
          // Search in tags
          const tagMatch = blog.tags?.some(tag => {
            const tagName = typeof tag === 'string' ? tag : tag.name || tag.tag_name;
            return tagName?.toLowerCase().includes(searchTerm);
          });

          return titleMatch || authorMatch || tagMatch;
        });

        // Format blogs for display
        const formattedBlogs = filteredBlogs.map(blog => {
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
        console.error('Error searching blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    searchBlogs();
  }, [query]);

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
    <div className="search-results-wrapper">
      <div className="search-results-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Searching blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="no-results">
            <h3>No results found</h3>
            {query && (
              <p>0 results found for "{query}"</p>
            )}
            <p>Try searching with different keywords or check your spelling.</p>
          </div>
        ) : (
          <>
            <div className="search-header">
              {query && (
                <h3 className="search-query">
                  {`${blogs.length} results found for "${query}"`}
                </h3>
              )}
            </div>
            
            <div className="search-results-grid">
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

export default SearchResults;
