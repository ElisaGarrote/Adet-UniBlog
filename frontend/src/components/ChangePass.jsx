import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChangePass.css';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordCriteria = [
    {
      label: "Password must be at least 8 characters long",
      test: (pwd) => pwd.length >= 8,
    },
    {
      label: "Password must contain at least one uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      label: "Password must contain at least one number",
      test: (pwd) => /\d/.test(pwd),
    },
    {
      label: "Password must contain at least one special character",
      test: (pwd) => /[!@#$%^&*(),.?\":{}|<>]/.test(pwd),
    },
  ];

  const unmetCriteria = passwordCriteria.filter(c => !c.test(formData.newPassword));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

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
    } else if (unmetCriteria.length > 0) {
      newErrors.newPassword = 'Please meet all password requirements.';
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
      const token = localStorage.getItem('access');
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
        const newErrors = {};
        if (data.old_password) newErrors.oldPassword = data.old_password[0];
        if (data.new_password) newErrors.newPassword = data.new_password[0];
        if (data.detail) newErrors.submit = data.detail;
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
    <div className="set-password-container">
      <div className="set-password-header">
        <h1 className="set-password-brand">UniBlog</h1>
      </div>

      <div className="set-password-form-wrapper">
        <h2 className="set-password-title">Change Password</h2>

        <form onSubmit={handleSubmit} className="set-password-form">
          <input
            type={showPassword ? "text" : "password"}
            name="oldPassword"
            placeholder="Current password"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
          {errors.oldPassword && <span className="error-message">{errors.oldPassword}</span>}

          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            placeholder="New password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}

          {unmetCriteria.length > 0 && (
            <ul className="password-criteria">
              {unmetCriteria.map((item, index) => (
                <li key={index}>{item.label}</li>
              ))}
            </ul>
          )}

          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}

          <div className="show-password-toggle">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>

          {errors.submit && <div className="submit-error">{errors.submit}</div>}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
