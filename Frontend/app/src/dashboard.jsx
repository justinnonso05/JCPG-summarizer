import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [summaries, setSummaries] = useState([]); // Ensure it's initialized as an array
  const [currentSummary, setCurrentSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure auth token is stored
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get('http://localhost:8000/api/my-summaries', { headers });
        setSummaries(Array.isArray(response.data) ? response.data : []); // Ensure array
      } catch (err) {
        console.error("Error fetching summaries:", err);
        setError("Failed to load summaries.");
      }
    };

    fetchSummaries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post("http://localhost:8000/api/summarize", null, {
            params: { url: url }, // Send URL as a query parameter
            headers: {
                Authorization: "Bearer YOUR_ACCESS_TOKEN" // If needed
            }
        });

        const newSummary = {
            id: summaries.length + 1,
            title: `Summary for ${url.slice(0, 30)}...`,
            content: response.data.summary,
            url: url
        };

        setSummaries([newSummary, ...summaries]);
        setCurrentSummary(newSummary);
        setUrl('');
    } catch (error) {
        console.error("Error summarizing URL:", error);
    }
  };


  return (
    <div className="app">
      <Sidebar summaries={summaries} setCurrentSummary={setCurrentSummary} currentSummary={currentSummary} />
      <main className="main-content">
        <header>
          <h1>URL <span>Summarizer</span></h1>
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
                <span className="source">Source: <a href={currentSummary.url} target="_blank" rel="noopener noreferrer">{currentSummary.url}</a></span>
                <span className="timestamp">Summarized on: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const Sidebar = ({ summaries, setCurrentSummary, currentSummary }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Your Summaries</h2>
      </div>
      <div className="summary-list">
        {summaries.length > 0 ? (
          summaries.map(summary => (
            <div
              key={summary.id}
              className={`summary-item ${currentSummary && currentSummary.id === summary.id ? 'active' : ''}`}
              onClick={() => setCurrentSummary(summary)}
            >
              <h3>{summary.url}</h3>
              <p>{summary.content.substring(0, 60)}...</p>
            </div>
          ))
        ) : (
          <p>No summaries available.</p>
        )}
      </div>
    </aside>
  );
};

export default Dashboard;
