import React from 'react';
import './ArticleCard.css';

function ArticleCard({ article, onClick }) {
  const truncateContent = (content, maxLength = 150) => {
    if (!content) return 'No content available';
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="article-card" onClick={onClick}>
      <div className="article-card-header">
        <h3>{article.title || 'Untitled Article'}</h3>
        {article.is_enhanced && (
          <span className="enhanced-badge">Enhanced</span>
        )}
      </div>

      <div className="article-card-content">
        <p>{truncateContent(article.content)}</p>
      </div>

      <div className="article-card-footer">
        <div className="article-meta">
          <span className="meta-item">
            {article.is_enhanced ? '✓ Enhanced' : 'Original'}
          </span>
          {article.references && article.references.length > 0 && (
            <span className="meta-item">
              {article.references.length} reference(s)
            </span>
          )}
        </div>
        <button className="read-more-btn">Read More →</button>
      </div>
    </div>
  );
}

export default ArticleCard;

