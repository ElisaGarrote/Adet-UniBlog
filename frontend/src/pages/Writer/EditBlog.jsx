import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import HeaderImageUpload from "../../pages/Writer/HeaderImageUpload";
import TagInput from "../../pages/Writer/TagInput";
import RichTextEditor from "../../pages/Writer/RichTextEditor";
import ActionButtons from "../../pages/Writer/WriteActionBtns";
import "../../styles/WriteBlog.css";

const REGISTERED_TAGS = [
  "Technology", "Programming", "React", "JavaScript", 
  "Web Development", "CSS", "HTML", "Design", 
  "UX", "UI", "Frontend", "Backend", "Node.js"
];

const EditBlog = () => {
  const [headerImage, setHeaderImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [title, setTitle] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [filteredTags, setFilteredTags] = useState(REGISTERED_TAGS);
  const contentRef = useRef(null);

  const handleTagSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setTagInput(e.target.value);
    
    if (searchTerm === "") {
      setFilteredTags(REGISTERED_TAGS);
    } else {
      setFilteredTags(
        REGISTERED_TAGS.filter(tag => 
          tag.toLowerCase().includes(searchTerm)
        )
      );
    }
  };

  const handleSaveDraft = () => {
    console.log("Saved as draft");
    setIsPublished(false);
    alert("Blog saved as draft successfully!");
  };

  const handlePublish = () => {
    console.log("Published");
    setIsPublished(true);
    alert("Blog published successfully!");
  };

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
      <div className="w-write-blog-header">
        <button className="w-back-btn" onClick={() => window.history.back()}>
          <FaArrowLeft /> Back
        </button>
        <h2>Add New Blog</h2>
        <div className="w-header-actions">
          <span className="w-status-label">{isPublished ? "Published" : "Draft"}</span>
          <span className="w-untitled-label">{title || "Untitled Blog"}</span>
        </div>
      </div>

      <div className="w-write-blog-form">
        <div className="w-form-section">
          <HeaderImageUpload headerImage={headerImage} setHeaderImage={setHeaderImage} />
          
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
            filteredTags={filteredTags}
            registeredTags={REGISTERED_TAGS}
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

export default EditBlog;