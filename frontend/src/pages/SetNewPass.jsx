import React, { useState } from "react";
import { Link,useSearchParams, useNavigate } from "react-router-dom";
import logo from "../assets/icons/uniblog.svg"; // Adjust path if needed

function SetNewPass() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCriteria, setShowCriteria] = useState(false);


const [searchParams] = useSearchParams();
const navigate = useNavigate();
const uid = searchParams.get("uid");
const token = searchParams.get("token");

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

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!uid || !token) {
    setError("Reset link is invalid or expired.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  if (unmetCriteria.length > 0) {
    setError("Please meet all password requirements.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/auth/password-reset/complete/", {
      method: "PATCH", // <-- THIS IS THE PATCH METHOD
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uidb64: uid,             // <- uid from query string
        token: token,            // <- token from query string
        password: password,      // <- new password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.detail || "Failed to reset password.");
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    }
  } catch (err) {
    setError("Network error. Please try again.");
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
            type="password"
            placeholder="Enter new password"
            value={password}
            onFocus={() => setShowCriteria(true)}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {showCriteria && unmetCriteria.length > 0 && (
            <ul>
              {unmetCriteria.map((item, index) => (
                <li key={index}>{item.label}</li>
              ))}
            </ul>
          )}

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Set Password</button>
        </form>

        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
}

export default SetNewPass;
