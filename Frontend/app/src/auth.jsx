import React, { useState } from 'react';
import './Auth.css';

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  
  const switchModeHandler = () => {
    setIsLoginMode(prevMode => !prevMode);
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would connect to your authentication API
    console.log('Form submitted:', formData);
    console.log('Mode:', isLoginMode ? 'Login' : 'Signup');
    
    // For demo purposes, you could redirect to the main app after authentication
    // window.location.href = "/dashboard";
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <span className="logo-text">URL<span className="accent">Summarizer</span></span>
          </div>
          <h1>{isLoginMode ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="subtitle">
            {isLoginMode 
              ? 'Enter your credentials to access your account' 
              : 'Fill in the details below to create your account'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required={!isLoginMode}
              />
            </div>
          )}
          
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
                required={!isLoginMode}
              />
            </div>
          )}
          
          {isLoginMode && (
            <div className="forgot-password">
              <a href="#reset-password">Forgot password?</a>
            </div>
          )}
          
          <button type="submit" className="submit-button">
            {isLoginMode ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            {isLoginMode 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <button 
              type="button" 
              className="switch-mode-button" 
              onClick={switchModeHandler}
            >
              {isLoginMode ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
        
        <div className="social-auth">
          <div className="divider">
            <span>Or continue with</span>
          </div>
          <div className="social-buttons">
            <button className="social-button">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              <span>Google</span>
            </button>
            <button className="social-button">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;