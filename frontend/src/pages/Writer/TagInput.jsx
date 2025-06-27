import { useState, useEffect } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import "../../styles/TagInput.css";
import api from "../../api"; // Your axios instance

const TagInput = ({ 
  tags, 
  setTags, 
  tagInput, 
  setTagInput, 
  showTagDropdown, 
  setShowTagDropdown 
}) => {
  const [registeredTags, setRegisteredTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);

  // Fetch tags from backend when component mounts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/blogs/tags/");
        const tagNames = response.data.map(tag => tag.name);
        setRegisteredTags(tagNames);
        setFilteredTags(tagNames);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };

    fetchTags();
  }, []);

  const handleAddTag = (tag) => {
    if (tags.length < 5 && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
      setShowTagDropdown(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();
    setTagInput(e.target.value);

    if (search === "") {
      setFilteredTags(registeredTags);
    } else {
      setFilteredTags(
        registeredTags.filter(tag =>
          tag.toLowerCase().includes(search)
        )
      );
    }
  };

  return (
    <div className="w-form-group">
      <div className="w-tags-input-group">
        <div className="w-tag-input-container">
          <input
            type="text"
            value={tagInput}
            onChange={handleSearch}
            onFocus={() => setShowTagDropdown(true)}
            placeholder="Search and select tags (max 5)"
            className="w-tag-input"
          />
          <button 
            type="button" 
            className="w-tag-dropdown-toggle"
            onClick={() => setShowTagDropdown(!showTagDropdown)}
          >
            <FaChevronDown />
          </button>
        </div>

        {showTagDropdown && (
          <div className="w-tag-dropdown">
            {filteredTags.length > 0 ? (
              filteredTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className="w-tag-dropdown-item"
                  onClick={() => handleAddTag(tag)}
                  disabled={tags.includes(tag)}
                >
                  {tag}
                  {tags.includes(tag) && <span className="w-tag-selected-icon">✓</span>}
                </button>
              ))
            ) : (
              <div className="w-tag-dropdown-empty">No tags found</div>
            )}
          </div>
        )}
      </div>

      <div className="w-tag-list">
        {tags.map(tag => (
          <span key={tag} className="w-tag">
            {tag}
            <button 
              onClick={() => handleRemoveTag(tag)}
              className="w-remove-tag-btn"
            >
              <FaTimes />
            </button>
          </span>
        ))}
      </div>

      {tags.length >= 5 && <p className="w-tag-limit-message">Maximum 5 tags reached</p>}
    </div>
  );
};

export default TagInput;
