import React, { useState } from 'react';
import './App.css';

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [summaries, setSummaries] = useState([
    { id: 1, title: 'Wikipedia - React', content: 'React is a free and open-source front-end JavaScript library for building user interfaces based on components...' },
    { id: 2, title: 'MDN Web Docs', content: 'MDN Web Docs is an open-source, collaborative project documenting web platform technologies...' },
    { id: 3, title: 'GitHub - Introduction', content: 'GitHub is a provider of Internet hosting for software development and version control using Git...' },
  ]);
  const [currentSummary, setCurrentSummary] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // This would be replaced with your actual API call
    // const response = await fetchSummaryFromUrl(url);
    
    // Simulating a response
    const newSummary = {
      id: summaries.length + 1,
      title: `Summary for ${url.slice(0, 30)}...`,
      content: 'This is a placeholder for the summary content that would be returned from your API. The summary would contain the key points from the webpage, making it easier for users to get the gist without reading the entire page.',
      url: url
    };
    
    setSummaries([newSummary, ...summaries]);
    setCurrentSummary(newSummary);
    setUrl('');
  };

  return (
    <div className="app">
      <Sidebar summaries={summaries} setCurrentSummary={setCurrentSummary} currentSummary={currentSummary} />
      <main className="main-content">
        <header>
          <h1>URL <span>Summarizer</span></h1>
        </header>
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
            <h2>{currentSummary.title}</h2>
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
        {summaries.map(summary => (
          <div 
            key={summary.id} 
            className={`summary-item ${currentSummary && currentSummary.id === summary.id ? 'active' : ''}`}
            onClick={() => setCurrentSummary(summary)}
          >
            <h3>{summary.title}</h3>
            <p>{summary.content.substring(0, 60)}...</p>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Dashboard;