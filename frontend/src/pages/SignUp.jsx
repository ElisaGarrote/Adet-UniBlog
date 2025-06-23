import React, { useState } from "react";
import { Link } from "react-router-dom";
import loginbg from "../assets/img/loginbg.png";
import uniblogo from "../assets/icons/uniblog.svg";
import "../styles/Userlogin.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);

  const criteria = [
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
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  const unmetCriteria = criteria.filter((c) => !c.test(password));

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (unmetCriteria.length > 0) {
      alert("Please meet all password requirements.");
      return;
    }

    console.log("Signup attempted with:", { email, password });
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={loginbg} alt="Login Background" className="background-image" />
      </div>
      <div className="right-content">
        <div className="logo-container">
          <img src={uniblogo} alt="UniBlog Logo" className="logo" />
          <h1 className="brand-name">UniBlog</h1>
        </div>
        <div className="login-right">
          <div className="login-form-container">
            <h2 className="login-title">Create Your Account</h2>
            
            <form onSubmit={handleSignup} className="login-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowCriteria(true)}
                  className="input-field"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>

              {showCriteria && unmetCriteria.length > 0 && (
                <div className="password-criteria">
                  <ul>
                    {unmetCriteria.map((item, index) => (
                      <li key={index}>{item.label}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="input-group password-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>

              <button type="submit" className="login-button">
                Sign Up
              </button>
            </form>

            <div className="signup-link">
              <span>Already have an account? </span>
              <Link to="/login" className="signup-button">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;