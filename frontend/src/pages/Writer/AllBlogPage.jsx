import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AllBlogCardWriter from "../../components/AllBlogCard"; // Your existing blog card component
import Pagination from "../../components/Pagination";
import Footer from "../../components/Footer";
import "../../styles/AllBlogPage.css";
import api from "../../api"; // Import your API instance

const AllBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10; // Changed to 10 blogs per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublishedBlogs = async () => {
      try {
        // Fetch all blogs from the API
        const response = await api.get("/blogs/blogs/");
        const allBlogs = response.data;

        // Get current user ID from token
        const token = localStorage.getItem("access");
        const userId = JSON.parse(atob(token.split(".")[1])).user_id;

        // Filter for published blogs by current writer
        const writerPublishedBlogs = allBlogs.filter(blog => 
          blog.author === userId && !blog.is_draft
        );

        // Format blogs for the component
        const formattedBlogs = writerPublishedBlogs.map(blog => {
          const imageUrl = blog.image || blog.blog_img;
          
          let fullImageUrl = null;
          if (imageUrl) {
            // Check if imageUrl already contains the full URL
            if (imageUrl.startsWith('http')) {
              fullImageUrl = imageUrl;
            } else {
              // If it's a relative path, construct the full URL
              const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
              fullImageUrl = imageUrl.startsWith('/') 
                ? `${baseUrl}${imageUrl}` 
                : `${baseUrl}/${imageUrl}`;
            }
          }
          
          return {
            id: blog.id,
            title: blog.title || blog.blog_title || 'Untitled Blog',
            tags: Array.isArray(blog.tags) 
              ? blog.tags.map(tag => typeof tag === 'string' ? tag : tag.name || tag)
              : [],
            image: fullImageUrl,
            updatedAt: (blog.updatedAt || blog.updated_at) 
              ? new Date(blog.updatedAt || blog.updated_at).toLocaleDateString()
              : new Date().toLocaleDateString(),
            viewCount: blog.viewCount || blog.views_count || 0,
            saveCount: blog.saveCount || blog.saves_count || 0,
            status: "published"
          };
        });

        setBlogs(formattedBlogs);
      } catch (error) {
        console.error("Error fetching published blogs:", error);
        setBlogs([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedBlogs();
  }, []);

  // Pagination calculations
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewBlog = (blogId) => {
    navigate(`/blog/${blogId}`); // Navigate to your existing blog view page
  };

    return (
    <div className="all-blogs-page-wrapper">
        <div className="all-blogs-page">
        <div className="all-blogs-container">
            <div className="blogs-header">
            <h1 className="all-blogs-title">My Published Blogs</h1>
            <p className="blogs-subtitle">Here are your published blogs</p>
            </div>
            
            {loading ? (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading blogs...</p>
            </div>
            ) : blogs.length === 0 ? (
            <div className="no-blogs-message">
                <p>No published blogs yet.</p>
            </div>
            ) : (
            <>
                <div className="blogs-list">
                {currentBlogs.map((blog) => (
                    <AllBlogCardWriter
                    key={blog.id}
                    blog={blog}
                    onViewBlog={handleViewBlog}
                    />
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
        </div>
        <Footer />
    </div>
    );
    };

export default AllBlogsPage;