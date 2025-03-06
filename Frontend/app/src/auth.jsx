import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  
  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
    setError(""); // Clear errors on mode switch
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const url = isLoginMode
      ? "http://localhost:8000/users/login/"
      : "http://localhost:8000/users/register/";

    const requestData = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post(url, requestData, {
        withCredentials: true,
    });
      const { access_token } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", access_token);

      console.log("Authenticated successfully:", response.data);

      // Redirect user (optional)
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication failed!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <span className="logo-text">URL<span className="accent">Summarizer</span></span>
          </div>
          <h1>{isLoginMode ? "Welcome Back" : "Create Account"}</h1>
          <p className="subtitle">
            {isLoginMode
              ? "Enter your credentials to access your account"
              : "Fill in the details below to create your account"}
          </p>
        </div>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {isLoginMode && (
            <div className="forgot-password">
              <a href="#reset-password">Forgot password?</a>
            </div>
          )}

          <button type="submit" className="submit-button">
            {isLoginMode ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <button type="button" className="switch-mode-button" onClick={switchModeHandler}>
              {isLoginMode ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
