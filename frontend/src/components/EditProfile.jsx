import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css'; // We'll create this CSS file

const UpdateProfilePage = ({ userData, onSave, onDelete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    organization: userData?.organization || '',
    department: userData?.department || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    navigate(-1); // Go back after saving
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      onDelete();
      navigate('/'); // Redirect to home after deletion
    }
  };

  return (
    <div className="update-profile-page">
      <div className="profile-form-container">
        <h1>Update Your Profile</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Personal Information</h2>
            
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>University Information</h2>
            
            <div className="form-group">
              <label>Organization</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="action-buttons">
            <button type="submit" className="save-btns">Save Changes</button>
            <button type="button" className="cancel-btns" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="button" className="delete-btns" onClick={handleDelete}>
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfilePage;