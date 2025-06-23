import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import logo from "../assets/icons/uniblog.svg";
import "../styles/SetNewPass.css";

function SetNewPass() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCriteria, setShowCriteria] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");
  const navigate = useNavigate();


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
      test: (pwd) => /[!@#$%^&*(),.?\":{}|<>]/.test(pwd),
    },
  ];

  const unmetCriteria = criteria.filter((c) => !c.test(password));

const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (unmetCriteria.length > 0) {
    alert("Please meet all password requirements.");
    return;
  }

  if (!uid || !token) {
    alert("Invalid or expired reset link.");
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/users/password-reset-confirm/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid,
        token,
        new_password: password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Something went wrong. Please try again.");
    } else {
      alert("Password updated successfully. You can now log in.");
      navigate("/login"); // redirect to login page
    }
  } catch (err) {
    alert("Network error. Please try again.");
  }
};

  return (
    <div className="set-password-container">
      <div className="set-password-header">
        <img src={logo} alt="Logo" className="set-password-logo" />
        <h1 className="set-password-brand">UniBlog</h1>
      </div>

      <div className="set-password-form-wrapper">
        <h2 className="set-password-title">Set New Password</h2>

        <form onSubmit={handleSubmit} className="set-password-form">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onFocus={() => setShowCriteria(true)}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {showCriteria && unmetCriteria.length > 0 && (
            <ul className="password-criteria">
              {unmetCriteria.map((item, index) => (
                <li key={index}>{item.label}</li>
              ))}
            </ul>
          )}

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="show-password-toggle">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>

          <button type="submit" className="submit-btn">
            Set Password
          </button>
        </form>

        <Link to="/login" className="back-to-login">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default SetNewPass;
