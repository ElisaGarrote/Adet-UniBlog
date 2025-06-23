import "../../styles/WriteActionBtns.css";

const WriteActionButtons = ({ handleSaveDraft, handlePublish }) => {
  return (
    <div className="w-action-buttons">
      <button onClick={handleSaveDraft} className="w-save-draft-btn">
        Save Draft
      </button>
      <button onClick={handlePublish} className="w-publish-btn">
        Publish
      </button>
    </div>
  );
};

export default WriteActionButtons;