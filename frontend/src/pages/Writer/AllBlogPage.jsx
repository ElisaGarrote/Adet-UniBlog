import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AllBlogCardWriter from "../../components/AllBlogCard"; // Your existing blog card component
import Pagination from "../../components/Pagination";
import Footer from "../../components/Footer";
import "../../styles/AllBlogPage.css";
import SamplePic from "../../assets/img/SamplePic.jpg";

const AllBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10; // Changed to 10 blogs per page
  const navigate = useNavigate();

  useEffect(() => {
    // Replace with your actual API call
    const fetchPublishedBlogs = async () => {
      try {
        // Mock data - replace with real API call
        const mockBlogs = Array.from({ length: 27 }, (_, i) => ({
          id: i + 1,
          title: `Published Blog ${i + 1}`,
          excerpt: "This is an example of a published blog post excerpt...",
          image: SamplePic + (i + 1),
          date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
          readTime: `${Math.floor(Math.random() * 10) + 5} min read`,
          author: "Writer Name",
          status: "published" // Only published blogs will be shown
        }));

        // Filter only published blogs
        const publishedBlogs = mockBlogs.filter(blog => blog.status === "published");
        setBlogs(publishedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
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
            <h1 className="all-blogs-title">All Published Blog</h1>
            <p className="blogs-subtitle">Here are your published Blogs</p>
            </div>
            
            {loading ? (
            <div className="loading-spinner">
                <div className="spinner"></div>
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
