import { useState, useEffect } from "react";
import BlogHeader from "../../components/BlogHeader.jsx";
import BlogListWriter from "../../components/BlogListWriter.jsx";
import Footer from "../../components/Footer.jsx";
import Pagination from "../../components/Pagination";
import api from "../../api"; // Axios instance with JWT
import "../../styles/WriterBlogPage.css";

const WriteBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem("access");
        if (!token) {
          console.warn("No access token found"); 
          setLoading(false);
          return;
        }

        const res = await api.get("/blogs/blogs/");
        const allBlogs = res.data;

        const userId = JSON.parse(atob(localStorage.getItem("access").split(".")[1])).user_id;

        // Only include blogs by the current user
        const userBlogs = allBlogs.filter(blog => blog.author === userId);

        const formattedBlogs = userBlogs.map(blog => {
          const imageUrl = blog.image || blog.blog_img;
          const fullImageUrl = imageUrl ? `${import.meta.env.VITE_API_URL}${imageUrl}` : null;
          
          return {
            id: blog.id,
            title: blog.title || blog.blog_title,
            tags: Array.isArray(blog.tags) 
              ? blog.tags.map(tag => typeof tag === 'string' ? tag : tag.name || tag)
              : [],
            image: fullImageUrl,
            updatedAt: (blog.updatedAt || blog.updated_at)?.split("T")[0] || new Date().toISOString().split("T")[0],
            viewCount: blog.viewCount || blog.views_count || 0,
            saveCount: blog.saveCount || blog.saves_count || 0,
            status: blog.status || (blog.is_draft ? "draft" : "published")
          };
        });

        setBlogs(formattedBlogs);
      } catch (err) {
        console.error(" Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNewBlog = () => {
    window.location.href = "/writer/write"; // Adjust route if different
  };

  const handleDeleteBlog = (blogId) => {
    setBlogs(blogs.filter((blog) => blog.id !== blogId));
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
