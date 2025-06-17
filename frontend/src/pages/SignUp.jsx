import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginbg from "../assets/img/loginbg.png";
import uniblogo from "../assets/icons/uniblog.svg";
import "../styles/Userlogin.css";
import api from "../api";                      // << use the same axios instance
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const criteria = [
    { label: "≥ 8 characters",                test: (p) => p.length >= 8 },
    { label: "1 uppercase letter",            test: (p) => /[A-Z]/.test(p) },
    { label: "1 number",                      test: (p) => /\d/.test(p) },
    { label: "1 special character",           test: (p) => /[!@#$%^&*(),.?\":{}|<>]/.test(p) },
  ];
  const unmet = criteria.filter((c) => !c.test(password));


  const unmetCriteria = criteria.filter((c) => !c.test(password));

  const handleSignup = async (e) => {
    e.preventDefault();

    /* quick client‑side checks */
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (unmet.length) {
      alert("Please meet all password requirements.");
      return;
    }

    setLoading(true);
    try {
      /* 1️⃣  create the user */
      await api.post("/auth/register/", {
        username: email,        // your backend treats email as username
        password: password,
      });

      /* 2️⃣  immediately log the user in (same endpoint your login page hits) */
      const { data } = await api.post("/auth/token/", {
        username: email,
        password,
      });

      localStorage.setItem(ACCESS_TOKEN, data.access);
      localStorage.setItem(REFRESH_TOKEN, data.refresh);

      /* 3️⃣  go somewhere protected  */
      navigate("/recommendation");
    } catch (err) {
      console.error("Signup failed:", err);
      const msg =
        err.response?.data?.username?.[0] ||
        err.response?.data?.detail ||
        "Signup failed – please try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
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
                  <i className={`fa-solid ${showPassword ? "fa-light fa-eye-slash" : "fa-light fa-eye"}`}></i>
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

              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  required
                />
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