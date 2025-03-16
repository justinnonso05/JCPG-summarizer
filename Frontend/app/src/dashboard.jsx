import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setSummaries([]);
    setCurrentSummary(null);
    setIsLoggedIn(false);
    setIsSidebarOpen(false);
    alert("Logged out successfully!");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    if (token) {
      fetchSummaries(token);
    }
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('.sidebar');
      const hamburger = document.querySelector('.hamburger-menu');
      
      if (isSidebarOpen && sidebar && !sidebar.contains(event.target) && 
          hamburger && !hamburger.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Add window resize listener to handle sidebar visibility on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state based on window width
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchSummaries = async (token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:8000/api/my-summaries', { headers });
      setSummaries(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching summaries:", err);
      setError("Failed to load summaries.");
      
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
  
    const token = localStorage.getItem("token");
    
    try {
      const config = {
        params: { url },
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      };
      
      const response = await axios.post("http://localhost:8000/api/summarize", null, config);
      
      const newSummary = {
        id: response.data.id || Date.now(),
        url: response.data.url,
        content: response.data.summary,
        saved: response.data.saved || false,
        date: new Date().toISOString()
      };
      
      if (newSummary.saved) {
        setSummaries([newSummary, ...summaries]);
      }
      
      setCurrentSummary(newSummary);
      setUrl("");
    } catch (error) {
      console.error("Error summarizing URL:", error);
      setError("Failed to summarize: " + (error.response?.data?.detail || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container">
      {/* Hamburger Menu for Mobile */}
      <button 
        className={`hamburger-menu ${isSidebarOpen ? 'active' : ''}`} 
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth <= 768 && (
          <motion.div 
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen || window.innerWidth > 768 ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h2>Your Summaries</h2>
            <button 
              className="close-sidebar" 
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ×
            </button>
          </div>
          
          <div className="summary-list-container">
            <div className="summary-list">
              {isLoggedIn ? (
                summaries.length > 0 ? (
                  summaries.map(summary => (
                    <motion.div
                      key={summary.id}
                      className={`summary-item ${currentSummary && currentSummary.id === summary.id ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentSummary(summary);
                        if (window.innerWidth <= 768) {
                          setIsSidebarOpen(false);
                        }
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3>{summary.url.substring(0, 25)}...</h3>
                      <p>{summary.content.substring(0, 60)}...</p>
                      <span className="summary-date">
                        {new Date(summary.date || Date.now()).toLocaleDateString()}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No saved summaries available.</p>
                    <p className="empty-tip">Enter a URL above to get started!</p>
                  </div>
                )
              ) : (
                <div className="login-prompt">
                  <p>Login to view and save your summaries.</p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="login-icon">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          <div className="sidebar-footer">
            {isLoggedIn ? (
              <motion.button 
                className="logout-button" 
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logout-icon">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </motion.button>
            ) : (
              <motion.a 
                className="login-button" 
                href="/auth"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="login-icon">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Login
              </motion.a>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>URL <span>Summarizer</span></h1>
          {!isLoggedIn && (
            <motion.div 
              className="login-notice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <p>
                You're using the app without logging in. Your summaries won't be saved.
                <a href="/auth"> Login</a> to save your summaries.
              </p>
            </motion.div>
          )}
        </motion.header>

        {error && (
          <motion.div 
            className="error-container"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p className="error">{error}</p>
          </motion.div>
        )}

        <motion.form 
          onSubmit={handleSubmit}
          className="url-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="input-container">
            <input
              type="url"
              placeholder="Enter a URL to summarize..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isLoading}
            />
            <motion.button 
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={isLoading ? 'loading' : ''}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="summarize-icon">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  Summarize
                </>
              )}
            </motion.button>
          </div>
        </motion.form>

        <AnimatePresence>
          {currentSummary && (
            <motion.div 
              className="summary-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentSummary.url}
              </motion.h2>
              <motion.div 
                className="summary-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p>{currentSummary.content}</p>
                <div className="summary-meta">
                  <span className="source">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="link-icon">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    <a href={currentSummary.url} target="_blank" rel="noopener noreferrer">
                      {currentSummary.url.substring(0, 40)}...
                    </a>
                  </span>
                  <span className="timestamp">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="calendar-icon">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {new Date(currentSummary.date || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;