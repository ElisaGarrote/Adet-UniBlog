import { useState, useEffect } from "react";
import BlogHeader from "../../components/BlogHeader.jsx";
import BlogListWriter from "../../components/BlogListWriter.jsx";
import Footer from "../../components/Footer.jsx";
import Pagination from "../../components/Pagination"; // Import Pagination
import "../../styles/WriterBlogPage.css";
import SamplePic from "../../assets/img/samplepic.jpg";

const WriteBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10; // Show 1 blog per page for demo (change to 10 for production)

  useEffect(() => {
    const fetchBlogs = async () => {
      const mockBlogs = [
        {
          id: 1,
          title: "How to Use React Effectively",
          tags: ["React", "Frontend"],
          image: SamplePic,
          updatedAt: "2024-05-20",
          viewCount: 1500,
          saveCount: 200,
          status: "published" // Added status
        },

        {
          id: 2,
          title: "Advanced JavaScript Patterns",
          tags: ["JavaScript", "Programming"],
          image: SamplePic,
          updatedAt: "2024-05-18",
          viewCount: 1200,
          saveCount: 150,
          status: "draft" // Added status
        },
        // Add more mock blogs as needed...
      ];
      setBlogs(mockBlogs);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  // Get current blogs for pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNewBlog = () => {
    console.log("Add new blog clicked");
  };

  const handleDeleteBlog = (blogId) => {
    setBlogs(blogs.filter((blog) => blog.id !== blogId));
    // Reset to first page if we deleted the last item on current page
    if (currentBlogs.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="writer-page-wrapper">
      <div className="writer-page-container">
        <BlogHeader onAddNewBlog={handleAddNewBlog} />
        <div className="writer-content-wrapper">
          {loading ? (
            <div className="writer-loading-state">
              <div className="writer-loading-spinner"></div>
              <p>Loading your blogs...</p>
            </div>
          ) : (
            <>
              <BlogListWriter 
                blogs={currentBlogs} 
                onDeleteBlog={handleDeleteBlog} 
              />
              {blogs.length > blogsPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
      <Footer className="writer-page-footer" />
    </div>
  );
};

export default WriteBlogPage;