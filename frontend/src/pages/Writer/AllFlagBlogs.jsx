import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FlagBlogCard from "../../components/FlagBlogCard";
import Pagination from "../../components/Pagination";
import Footer from "../../components/Footer";
import "../../styles/AllFlagBlog.css";
import SamplePic from "../../assets/img/SamplePic.jpg";

const AllFlagBlog = () => {
  const [flaggedBlogs, setFlaggedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlaggedBlogs = async () => {
      try {
        // Mock data - replace with real API call
        const mockFlaggedBlogs = Array.from({ length: 15 }, (_, i) => ({
          id: `flag-${i + 1}`,
          blogId: `blog-${i + 1}`,
          title: `Flagged Blog Post ${i + 1}`,
          author: `Author ${i + 1}`,
          image: SamplePic,
          reportId: `report-${Math.floor(1000 + Math.random() * 9000)}`,
          reportType: ["Spam", "Inappropriate", "Copyright", "Harassment"][Math.floor(Math.random() * 4)],
          reportComments: "This blog contains content that violates our community guidelines.",
          flaggedAt: new Date(Date.now() - i * 86400000).toLocaleDateString(),
          status: ["pending", "reviewed", "resolved"][Math.floor(Math.random() * 3)]
        }));

        setFlaggedBlogs(mockFlaggedBlogs);
      } catch (error) {
        console.error("Error fetching flagged blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlaggedBlogs();
  }, []);

  // Pagination calculations
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = flaggedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(flaggedBlogs.length / blogsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewBlog = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const handleResolveFlag = (reportId, action) => {
    // Implement flag resolution logic here
    console.log(`Report ${reportId} marked as ${action}`);
    };

  return (
    <div className="all-blogs-page-wrapper">
      <div className="all-blogs-page">
        <div className="all-blogs-container">
          <div className="blogs-header">
            <h1 className="all-blogs-title">Flagged Blog Posts</h1>
            <p className="blogs-subtitle">Review reported content and take action</p>
          </div>
          
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading flagged blogs...</p>
            </div>
          ) : flaggedBlogs.length === 0 ? (
            <div className="no-blogs-message">
              <p>No flagged blogs to review.</p>
            </div>
          ) : (
            <>
              <div className="filter-options">
                <select className="status-filter">
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select className="type-filter">
                  <option value="all">All Report Types</option>
                  <option value="spam">Spam</option>
                  <option value="inappropriate">Inappropriate</option>
                  <option value="copyright">Copyright</option>
                  <option value="harassment">Harassment</option>
                </select>
              </div>

              <div className="blogs-list">
                {currentBlogs.map((blog) => (
                  <FlagBlogCard
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

export default AllFlagBlog;
