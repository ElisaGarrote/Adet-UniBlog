import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChangePass.css' //We'll create this CSS file
const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  setIsSubmitting(true);

  try {
    const token = localStorage.getItem('access'); // JWT access token
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-password/`, {

      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        old_password: formData.oldPassword,
        new_password: formData.newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      //console.error('Full response error:', data); // for further error only
      //setErrors({ submit: data.detail || "Failed to change password." });
       const newErrors = {};

  if (data.old_password) {
    newErrors.oldPassword = data.old_password[0];
  }

  if (data.new_password) {
    newErrors.newPassword = data.new_password[0];
  }

  if (data.detail) {
    newErrors.submit = data.detail;
  }

  // Fallback message
  if (Object.keys(newErrors).length === 0) {
    newErrors.submit = "Failed to change password.";
  }

  setErrors(newErrors);
    
    } else {
      alert('Password changed successfully!');
      navigate(-1);
    }
  } catch (error) {
    console.error('Error changing password:', error);
    setErrors({ submit: 'Server error. Please try again.' });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="change-password-page">
      <div className="password-form-container">
        <h1>Change Password</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className={errors.oldPassword ? 'error' : ''}
            />
            {errors.oldPassword && <span className="error-message">{errors.oldPassword}</span>}
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={errors.newPassword ? 'error' : ''}
            />
            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {errors.submit && <div className="submit-error">{errors.submit}</div>}

          <div className="action-buttons">
            <button 
              type="submit" 
              className="save-btnss"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Changing...' : 'Change Password'}
            </button>
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;