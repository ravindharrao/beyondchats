import React, { useState, useEffect } from 'react';
import './App.css';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import { getArticles } from './services/api';

function App() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await getArticles();
      setArticles(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch articles. Please make sure the API is running.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchArticles} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>BeyondChats Articles</h1>
        <p>View original and enhanced articles</p>
      </header>

      {selectedArticle ? (
        <ArticleDetail
          article={selectedArticle}
          onBack={handleBackToList}
        />
      ) : (
        <ArticleList
          articles={articles}
          onArticleSelect={handleArticleSelect}
        />
      )}
    </div>
  );
}

export default App;

