import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../assets/icons/uniblog.svg";
import "../styles/ResetPassword.css";


function ResetPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    console.log("Reset email sent to:", email);
    setIsSubmitted(true);
  };

  return (
    <div className="reset-container">
      <div className="reset-header">
        <img src={logo} alt="Logo" className="reset-logo" />
        <h1 className="reset-brand">UniBlog</h1>
      </div>

      <div className="reset-form-wrapper">
        <h2 className="reset-title">Reset your password</h2>
        <p className="reset-description">
          We'll email you a link to reset your password
        </p>

        {isSubmitted ? (
          <div className="reset-success">
            <p>Password reset link has been sent to your email.</p>
          </div>
        ) : (
          <form onSubmit={handleSendEmail} className="reset-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">Work Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                className={emailError ? "error" : ""}
              />
              {emailError && <span className="error-message">{emailError}</span>}
            </div>

            <button type="submit" className="reset-btn">
              Send Email
            </button>
          </form>
        )}

        <div className="alternative-link">
          <Link to="/login">Try different log in method</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;