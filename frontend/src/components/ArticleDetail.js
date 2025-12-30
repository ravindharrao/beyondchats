import React, { useState } from 'react';
import './ArticleDetail.css';

function ArticleDetail({ article, onBack }) {
  const [viewMode, setViewMode] = useState('enhanced'); // 'enhanced' or 'original'

  const hasOriginal = article.original_content && article.original_content !== article.content;

  return (
    <div className="article-detail-container">
      <div className="article-detail-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Articles
        </button>
        {hasOriginal && (
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'enhanced' ? 'active' : ''}`}
              onClick={() => setViewMode('enhanced')}
            >
              Enhanced Version
            </button>
            <button
              className={`toggle-btn ${viewMode === 'original' ? 'active' : ''}`}
              onClick={() => setViewMode('original')}
            >
              Original Version
            </button>
          </div>
        )}
      </div>

      <div className="article-detail-content">
        <div className="article-title-section">
          <h1>{article.title}</h1>
          <div className="article-tags">
            {article.is_enhanced && (
              <span className="tag enhanced-tag">✓ Enhanced</span>
            )}
            {!article.is_enhanced && (
              <span className="tag original-tag">Original</span>
            )}
            {article.references && article.references.length > 0 && (
              <span className="tag references-tag">
                {article.references.length} Reference(s)
              </span>
            )}
          </div>
        </div>

        <div className="article-body">
          <div
            className="article-text"
            dangerouslySetInnerHTML={{
              __html: viewMode === 'enhanced' 
                ? article.content 
                : (article.original_content || article.content)
            }}
          />
        </div>

        {article.references && article.references.length > 0 && (
          <div className="references-section">
            <h2>References</h2>
            <ul className="references-list">
              {article.references.map((ref, index) => (
                <li key={index}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reference-link"
                  >
                    {ref.title || ref.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="article-meta-section">
          <div className="meta-item">
            <strong>URL:</strong>{' '}
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.url}
            </a>
          </div>
          {article.created_at && (
            <div className="meta-item">
              <strong>Created:</strong> {new Date(article.created_at).toLocaleDateString()}
            </div>
          )}
          {article.updated_at && (
            <div className="meta-item">
              <strong>Updated:</strong> {new Date(article.updated_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticleDetail;

