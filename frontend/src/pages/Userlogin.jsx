import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginbg from "../assets/loginbg.jpg";
import uniblogo from "../assets/uniblog.svg"; // Adjust the file extension as needed
import "../styles/Userlogin.css";

function Userlogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log("Login attempted with:", { email, password });
  };

  const handleSignUp = () => {
    // Navigate to sign up page or add sign up logic
    console.log("Navigate to sign up");
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
      <h2 className="login-title">Log In My Account</h2>
      
      <form onSubmit={handleLogin} className="login-form">
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

        <div className="forgot-password">
          <a href="#" className="forgot-link">Forgot password?</a>
        </div>

        <button type="submit" className="login-button">
          Log in
        </button>
      </form>

      <div className="signup-link">
        <span>Don't have an account? </span>
        <button onClick={handleSignUp} className="signup-button">
          Sign up
        </button>
      </div>
    </div>
  </div>
</div>
</div>
  );
}

export default Userlogin;