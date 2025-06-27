import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import HeaderImageUpload from "../../pages/Writer/HeaderImageUpload";
import TagInput from "../../pages/Writer/TagInput";
import RichTextEditor from "../../pages/Writer/RichTextEditor";
import ActionButtons from "../../pages/Writer/WriteActionBtns";
import "../../styles/WriteBlog.css";
import api from "../../api";

const EditBlog = () => {
  const { id } = useParams(); // Get blog ID from URL
  const navigate = useNavigate();
  
  const [headerImage, setHeaderImage] = useState(null);             // Image preview
  const [headerImageFile, setHeaderImageFile] = useState(null);     // Actual file to upload
  const [tags, setTags] = useState([]);                              // Selected tag names
  const [tagMap, setTagMap] = useState({});                          // {name: id}
  const [tagInput, setTagInput] = useState("");
  const [title, setTitle] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  // Fetch tag list on mount and store name => id map
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get("/blogs/tags/");
        const tagMap = {};
        res.data.forEach(tag => tagMap[tag.name] = tag.id);
        setTagMap(tagMap);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };
    fetchTags();
  }, []);

  // Fetch existing blog data for editing
  useEffect(() => {
    if (id) {
      const fetchBlogData = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/blogs/blogs/${id}/`);
          const blog = response.data;
          
          // Populate form fields with existing data
          setTitle(blog.title || blog.blog_title || "");
          setIsPublished(!blog.is_draft);
          
          // Set content in rich text editor
          if (contentRef.current && blog.blog_desc) {
            contentRef.current.innerHTML = blog.blog_desc;
          }
          
          // Set image if exists
          if (blog.image || blog.blog_img) {
            const imageUrl = blog.image || blog.blog_img;
            const fullImageUrl = imageUrl.startsWith('http') 
              ? imageUrl 
              : `${import.meta.env.VITE_API_URL}${imageUrl}`;
            setHeaderImage(fullImageUrl);
          }
          
          // Set tags
          if (blog.tags && Array.isArray(blog.tags)) {
            const tagNames = blog.tags.map(tag => 
              typeof tag === 'string' ? tag : tag.name
            );
            setTags(tagNames);
          }
          
        } catch (err) {
          console.error("Failed to fetch blog data:", err);
          alert("Failed to load blog data for editing");
          navigate("/writeblogpage");
        } finally {
          setLoading(false);
        }
      };
      
      fetchBlogData();
    }
  }, [id, navigate]);

  // Handle submit logic for updating the blog
  const handleSubmit = async (publish = false) => {
    try {
      // Validation
      if (!title.trim()) {
        alert("Please enter a blog title");
        return;
      }
      
      if (!contentRef.current || !contentRef.current.innerHTML.trim()) {
        alert("Please enter blog content");
        return;
      }

      const tagIds = tags.map(tag => tagMap[tag]).filter(Boolean);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("blog_desc", contentRef.current.innerHTML);
      formData.append("is_draft", !publish);

      tagIds.forEach(id => formData.append("tag_ids", id));

      // Only append image if a new file is selected
      if (headerImageFile) {
        formData.append("image", headerImageFile);
      }

      const response = await api.patch(`/blogs/blogs/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Blog updated successfully!");
      navigate("/writeblogpage"); // Redirect to blog list
    } catch (err) {
      console.error("Error updating blog:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      }
      alert(`Failed to update blog: ${err.response?.data?.detail || err.message}`);
    }
  };

  const handleSaveDraft = () => {
    setIsPublished(false);
    handleSubmit(false);
  };

  const handlePublish = () => {
    setIsPublished(true);
    handleSubmit(true);
  };

  // Close tag dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.w-tags-input-group')) {
        setShowTagDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-write-blog-container">
      {loading ? (
        <div className="w-loading-container">
          <div className="w-loading-spinner"></div>
          <p>Loading blog data...</p>
        </div>
      ) : (
        <>
          <div className="w-write-blog-header">
            <button className="w-back-btn" onClick={() => navigate("/writeblogpage")}>
              <FaArrowLeft /> Back
            </button>
            <h2>Edit Blog</h2>
            <div className="w-header-actions">
              <span className="w-status-label">{isPublished ? "Published" : "Draft"}</span>
              <span className="w-untitled-label">
                {title ? (title.length > 12 ? `${title.slice(0, 6)}...` : title) : "Editing Blog"}
              </span>
            </div>
          </div>

          <div className="w-write-blog-form">
            <div className="w-form-section">
              <HeaderImageUpload 
                headerImage={headerImage} 
                setHeaderImage={setHeaderImage}
                setHeaderImageFile={setHeaderImageFile}
              />
              
              <div className="w-form-group">
                <input
                  type="text"
                  placeholder="Enter Blog Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-blog-title-input"
                />
              </div>

              <TagInput
                tags={tags}
                setTags={setTags}
                tagInput={tagInput}
                setTagInput={setTagInput}
                showTagDropdown={showTagDropdown}
                setShowTagDropdown={setShowTagDropdown}
              />
            </div>

            <RichTextEditor contentRef={contentRef} />
            
            <ActionButtons 
              handleSaveDraft={handleSaveDraft}
              handlePublish={handlePublish}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EditBlog;