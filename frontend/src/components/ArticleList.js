import React from 'react';
import './ArticleList.css';
import ArticleCard from './ArticleCard';

function ArticleList({ articles, onArticleSelect }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="article-list-container">
        <div className="empty-state">
          <h2>No articles found</h2>
          <p>Articles will appear here once they are scraped.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="article-list-container">
      <div className="article-list-header">
        <h2>Articles ({articles.length})</h2>
        <div className="filter-badges">
          <span className="badge total">Total: {articles.length}</span>
          <span className="badge enhanced">
            Enhanced: {articles.filter(a => a.is_enhanced).length}
          </span>
          <span className="badge original">
            Original: {articles.filter(a => !a.is_enhanced).length}
          </span>
        </div>
      </div>

      <div className="article-grid">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => onArticleSelect(article)}
          />
        ))}
      </div>
    </div>
  );
}

export default ArticleList;

