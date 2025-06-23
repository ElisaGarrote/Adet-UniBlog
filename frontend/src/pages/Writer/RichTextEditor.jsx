import { FaBold, FaItalic, FaListUl, FaLink } from "react-icons/fa";
import "../../styles/RichTextEditor.css";

const RichTextEditor = ({ contentRef }) => {
  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  const insertLink = () => {
    const url = prompt("Enter the URL:");
    if (url) {
      document.execCommand("createLink", false, url);
    }
  };

  const handleContentInput = () => {
    const content = contentRef.current.innerText;
    if (content.length > 10000) {
      alert("Content is too long! Maximum 10,000 characters.");
    }
  };

  return (
    <div className="w-form-section">
      <div className="w-toolbar">
        <button onClick={() => formatText("bold")} className="w-toolbar-btn" title="Bold">
          <FaBold />
        </button>
        <button onClick={() => formatText("italic")} className="w-toolbar-btn" title="Italic">
          <FaItalic />
        </button>
        <button 
          onClick={() => formatText("insertUnorderedList")} 
          className="w-toolbar-btn" 
          title="Bullet List"
        >
          <FaListUl />
        </button>
        <button onClick={insertLink} className="w-toolbar-btn" title="Insert Link">
          <FaLink />
        </button>
      </div>

      <div
        ref={contentRef}
        className="w-content-editor"
        contentEditable
        onInput={handleContentInput}
        placeholder="Write your blog content here..."
      ></div>
      <div className="w-character-count">
        {contentRef.current?.innerText.length || 0}/10,000 characters
      </div>
    </div>
  );
};

export default RichTextEditor;