import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import HeaderImageUpload from "../../pages/Writer/HeaderImageUpload"; //for image upload
import TagInput from "../../pages/Writer/TagInput";       //done connected to backend
import RichTextEditor from "../../pages/Writer/RichTextEditor"; //rich text editor (I think for the blog body)
import ActionButtons from "../../pages/Writer/WriteActionBtns"; //for drafting or publishing
import "../../styles/WriteBlog.css";
import api from "../../api";

const WriteBlog = () => {
  const navigate = useNavigate();
  const [headerImage, setHeaderImage] = useState(null);             // Image preview
  const [headerImageFile, setHeaderImageFile] = useState(null);     // Actual file to upload
  const [tags, setTags] = useState([]);                              // Selected tag names
  const [tagMap, setTagMap] = useState({});                          // {name: id}
  const [tagInput, setTagInput] = useState("");
  const [title, setTitle] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
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
        console.error(" Failed to fetch tags:", err);
      }
    };
    fetchTags();
  }, []);

  // Handle submit logic for both draft and publish
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

      if (headerImageFile) {
        formData.append("image", headerImageFile);
      }

      const response = await api.post("/blogs/blogs/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Blog submitted successfully!");
      console.log("Success response:", response.data);
      
      // Navigate to WriteBlogPage after successful submission
      navigate("/writeblogpage");
      
    } catch (err) {
      console.error("Error submitting blog:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      }
      alert(`Failed to submit blog: ${err.response?.data?.detail || err.message}`);
    }
  };

 const handlePublish = () => {
  setIsPublished(true);
  handleSubmit(true);
};

const handleSaveDraft = () => {
  setIsPublished(false);
  handleSubmit(false);
};

  // Close tag dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".w-tags-input-group")) {
        setShowTagDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-write-blog-container">
      <div className="w-write-blog-header">
        <button className="w-back-btn" onClick={() => window.history.back()}>
          <FaArrowLeft /> Back
        </button>
        <h2>Add New Blog</h2>
        <div className="w-header-actions">
          <span className="w-status-label">{isPublished ? "Published" : "Draft"}</span>
          <span className="w-untitled-label">
            {title ? (title.length > 12 ? `${title.slice(0, 6)}...` : title) : "Untitled Blog"}
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
    </div>
  );
};

export default WriteBlog;