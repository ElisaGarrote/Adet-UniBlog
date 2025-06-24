import { FaTimes } from "react-icons/fa";
import "../../styles/HeaderImageUpload.css";

const HeaderImageUpload = ({ headerImage, setHeaderImage }) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setHeaderImage(URL.createObjectURL(file));
    } else {
      alert("Only JPG or PNG files are allowed.");
    }
  };

  return (
    <div className="w-form-group">
      <div className="w-image-upload-container">
        <label className="w-image-upload-label">
          Header Image (JPG/PNG)
          <input type="file" accept="image/jpeg, image/png" onChange={handleImageUpload} />
          <span className="w-upload-btn">Choose Image</span>
        </label>
        
        <div className={`w-image-preview-area ${!headerImage ? "empty" : ""}`}>
          {headerImage ? (
            <div className="w-image-preview-container">
              <img src={headerImage} alt="Preview" className="w-image-preview" />
              <button onClick={() => setHeaderImage(null)} className="w-remove-image-btn">
                <FaTimes /> Remove Image
              </button>
            </div>
          ) : (
            <span>Image preview will appear here</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderImageUpload;