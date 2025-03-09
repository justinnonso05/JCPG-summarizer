import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setSummaries([]);
    setCurrentSummary(null);
    setIsLoggedIn(false);
    alert("Logged out successfully!");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    if (token) {
      fetchSummaries(token);
    }
  }, []);

  const fetchSummaries = async (token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:8000/api/my-summaries', { headers });
      setSummaries(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching summaries:", err);
      setError("Failed to load summaries.");
      
      // If unauthorized, clear token
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    const token = localStorage.getItem("token");
    
    try {
      // Configure request based on authentication status
      const config = {
        params: { url },
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      };
      
      const response = await axios.post("http://localhost:8000/api/summarize", null, config);
      
      const newSummary = {
        id: response.data.id || Date.now(), // Use timestamp as fallback ID for unsaved summaries
        url: response.data.url,
        content: response.data.summary,
        saved: response.data.saved || false
      };
      
      // Only update stored summaries list if summary was saved
      if (newSummary.saved) {
        setSummaries([newSummary, ...summaries]);
      }
      
      setCurrentSummary(newSummary);
      setUrl("");
    } catch (error) {
      console.error("Error summarizing URL:", error);
      setError("Failed to summarize: " + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div className="app">
      <Sidebar 
        summaries={summaries} 
        setCurrentSummary={setCurrentSummary} 
        currentSummary={currentSummary} 
        handleLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />
      <main className="main-content">
        <header>
          <h1>URL <span>Summarizer</span></h1>
          {!isLoggedIn && (
            <p className="login-notice">
              You're using the app without logging in. Your summaries won't be saved.
              <a href="/auth"> Login</a> to save your summaries.
            </p>
          )}
        </header>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="url"
              placeholder="Enter a URL to summarize..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button type="submit">Summarize</button>
          </div>
        </form>

        {currentSummary && (
          <div className="summary-container">
            <h2>{currentSummary.url}</h2>
            <div className="summary-content">
              <p>{currentSummary.content}</p>
              <div className="summary-meta">
                <span className="source">
                  Source: <a href={currentSummary.url} target="_blank" rel="noopener noreferrer">{currentSummary.url}</a>
                </span>
                <span className="timestamp">Summarized on: {new Date().toLocaleDateString()}</span>
                <span className="save-status">
                  {currentSummary.saved 
                    ? "✅ Saved to your account" 
                    : "⚠️ Not saved (login to save summaries)"}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const Sidebar = ({ summaries, setCurrentSummary, currentSummary, handleLogout, isLoggedIn }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Your Summaries</h2>
      </div>
      <div className="summary-list">
        {isLoggedIn ? (
          summaries.length > 0 ? (
            summaries.map(summary => (
              <div
                key={summary.id}
                className={`summary-item ${currentSummary && currentSummary.id === summary.id ? 'active' : ''}`}
                onClick={() => setCurrentSummary(summary)}
              >
                <h3>{summary.url.substring(0, 25)}...</h3>
                <p>{summary.content.substring(0, 60)}...</p>
              </div>
            ))
          ) : (
            <p>No saved summaries available.</p>
          )
        ) : (
          <p>Login to view and save your summaries.</p>
        )}
      </div>
      {isLoggedIn ? (
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      ) : (
        <a className="login-button" href="/auth">Login</a>
      )}
    </aside>
  );
};

export default Dashboard;