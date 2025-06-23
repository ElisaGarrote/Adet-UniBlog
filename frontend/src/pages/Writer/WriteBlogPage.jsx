import { useState, useEffect } from "react";
import BlogHeader from "../../components/BlogHeader.jsx";
import BlogListWriter from "../../components/BlogListWriter.jsx";
import Footer from "../../components/Footer.jsx";
import "../../styles/WriterBlogPage.css";
import SamplePic from "../../assets/img/samplepic.jpg";

const WriteBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

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
        },

        {
          id: 2,
          title: "How to Use React Effectively",
          tags: ["React", "Frontend"],
          image: SamplePic,
          updatedAt: "2024-05-20",
          viewCount: 1500,
          saveCount: 200,
        },
      ];
      setBlogs(mockBlogs);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  const handleAddNewBlog = () => {
    console.log("Add new blog clicked");
  };

  const handleDeleteBlog = (blogId) => {
    setBlogs(blogs.filter((blog) => blog.id !== blogId));
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
            <BlogListWriter blogs={blogs} onDeleteBlog={handleDeleteBlog} />
          )}
        </div>
      </div>
      <Footer className="writer-page-footer" />
    </div>
  );
};

export default WriteBlogPage;