import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css';

const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '', // email
    organization: '',
    department: '',
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to load user data');
        
        }

        const data = await res.json();
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          username: data.username || '',
          organization: data.organization || '',
          department: data.department || '',
        });
      } catch (err) {
        console.error(err);
        setSubmitError('Unable to fetch profile information.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setErrors({});
    try {
      const token = localStorage.getItem('access');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // handle field errors
        setErrors(data);
        setSubmitError(data.detail || 'Update failed');
      } else {
        alert('Profile updated successfully!');
        navigate(-1);
        setTimeout(() => window.location.reload(), 100); // reload after slight delay
      }
    } catch (error) {
      console.error(error);
      setSubmitError('Server error. Please try again.');
    }
  };

  if (loading) return <div className="update-profile-page">Loading...</div>;

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
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
              {errors.first_name && <span className="error-message">{errors.first_name}</span>}
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
              {errors.last_name && <span className="error-message">{errors.last_name}</span>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
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
              {errors.organization && <span className="error-message">{errors.organization}</span>}
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
              {errors.department && <span className="error-message">{errors.department}</span>}
            </div>
          </div>

          {submitError && <div className="submit-error">{submitError}</div>}

          <div className="action-buttons">
            <button type="submit" className="save-btns">Save Changes</button>
            <button type="button" className="cancel-btns" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfilePage;
