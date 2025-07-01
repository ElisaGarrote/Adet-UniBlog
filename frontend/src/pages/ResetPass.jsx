import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../api"; // Import the API instance
import logo from "../assets/icons/uniblog.svg";
import "../styles/ResetPassword.css";


function ResetPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverMessage, setServerMessage] = useState("");


  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

   const handleSendEmail = async (e) => {
    e.preventDefault();

    // Reset previous messages
    setEmailError("");
    setServerMessage("");

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      const response = await api.post("/auth/password-reset/", { email });
      
      setIsSubmitted(true);
      setServerMessage("Password reset link has been sent if the account exists.");
    } catch (err) {
      if (err.response?.data) {
        if (err.response.data.email) {
          setEmailError(err.response.data.email[0]);
        } else {
          setServerMessage(err.response.data.detail || "Something went wrong. Please try again.");
        }
      } else {
        setServerMessage("Network error. Please try again later.");
      }
    }
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
            <p>{serverMessage}</p>
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

        {serverMessage && !isSubmitted && (
          <p className="server-message">{serverMessage}</p>
        )}

        <div className="alternative-link">
          <Link to="/login">Try different log in method</Link>
        </div>
      </div>
    </div>
  );
}
export default ResetPassword;