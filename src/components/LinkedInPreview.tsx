'use client';

import React, { useState, useEffect } from 'react';
import { LinkedInPost } from '@/types/repurposer';

interface Props {
  post: LinkedInPost;
}

export default function LinkedInPreview({ post }: Props) {
  const [headline, setHeadline] = useState(post.headlineHook);
  const [bodyText, setBodyText] = useState(post.body);
  const [takeawayText, setTakeawayText] = useState(post.takeaway);
  const [ctaText, setCtaText] = useState(post.callToAction);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setHeadline(post.headlineHook);
    setBodyText(post.body);
    setTakeawayText(post.takeaway);
    setCtaText(post.callToAction);
  }, [post]);

  const handleCopy = () => {
    const fullText = [
      headline,
      '',
      bodyText,
      '',
      `💡 Key Takeaway: ${takeawayText}`,
      '',
      ctaText,
      '',
      post.hashtags.join(' '),
    ].join('\n');

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="preview-container">
      {/* Header */}
      <div className="preview-header">
        <div className="preview-title-group">
          <div className="platform-icon-badge linkedin">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.95 0-1.72-.78-1.72-1.73s.77-1.72 1.72-1.72a1.72 1.72 0 0 1 1.72 1.72c0 .95-.77 1.73-1.72 1.73m1.4 9.74v-8.37H5.06v8.37h2.8z" />
            </svg>
          </div>
          <div>
            <h3 className="preview-title">LinkedIn Thought Leadership Post</h3>
            <span className="preview-subtitle">
              Algorithm-optimized whitespace formatting • {isEditing ? 'Editing Mode' : 'Feed View'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="secondary-btn"
          >
            {isEditing ? '👁️ Feed View' : '✏️ Quick Edit'}
          </button>
          <button
            onClick={handleCopy}
            className={`copy-btn ${copied ? 'copied' : ''}`}
          >
            {copied ? '✓ Copied to Clipboard!' : '📋 Copy Post'}
          </button>
        </div>
      </div>

      {/* LinkedIn Post Card */}
      <div className="linkedin-card">
        {/* Author Header */}
        <div className="linkedin-author-row">
          <div className="linkedin-avatar">OP</div>
          <div className="linkedin-author-info">
            <div className="linkedin-author-name">
              Content Strategist <span className="linkedin-degree">• 1st</span>
            </div>
            <div className="linkedin-author-title">
              Founder &amp; Systems Architect
            </div>
            <div className="linkedin-post-time">
              Just now • <span title="Public">🌐</span>
            </div>
          </div>
        </div>

        {/* Post Content Area */}
        <div className="linkedin-content-area">
          {isEditing ? (
            <div className="linkedin-editor-box">
              <label className="field-label">Opening Hook:</label>
              <textarea
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="tweet-editable-textarea"
                rows={2}
              />

              <label className="field-label" style={{ marginTop: '0.5rem' }}>Body Copy:</label>
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="tweet-editable-textarea"
                rows={8}
              />

              <label className="field-label" style={{ marginTop: '0.5rem' }}>Key Takeaway:</label>
              <input
                type="text"
                value={takeawayText}
                onChange={(e) => setTakeawayText(e.target.value)}
                className="api-key-input"
              />

              <label className="field-label" style={{ marginTop: '0.5rem' }}>Engagement Prompt / CTA:</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="api-key-input"
              />
            </div>
          ) : (
            <>
              {/* Hook */}
              <div className="linkedin-hook">{headline}</div>

              {/* Body */}
              <div className="linkedin-body">
                {bodyText.split('\n').map((paragraph, i) => (
                  <p key={i} className="linkedin-para">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Key Takeaway Highlight Box */}
              {takeawayText && (
                <div className="linkedin-takeaway-box">
                  <span className="takeaway-label">💡 Key Takeaway:</span>
                  <p className="takeaway-text">{takeawayText}</p>
                </div>
              )}

              {/* CTA / Question */}
              {ctaText && (
                <div className="linkedin-cta-box">
                  <span className="cta-icon">💬</span>
                  <span className="cta-text">{ctaText}</span>
                </div>
              )}

              {/* Hashtags */}
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="linkedin-hashtags">
                  {post.hashtags.map((tag, idx) => (
                    <span key={idx} className="linkedin-tag">
                      {tag}{' '}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Social Metrics */}
        <div className="linkedin-social-metrics">
          <div className="metrics-reactions">
            <span className="reaction-bubble blue">👍</span>
            <span className="reaction-bubble green">💡</span>
            <span className="reaction-bubble red">❤️</span>
            <span className="reaction-count">192</span>
          </div>
          <div className="metrics-comments">38 comments • 14 reposts</div>
        </div>

        <div className="linkedin-action-bar">
          <button className="linkedin-action-btn">
            <span>👍 Like</span>
          </button>
          <button className="linkedin-action-btn">
            <span>💬 Comment</span>
          </button>
          <button className="linkedin-action-btn">
            <span>🔄 Repost</span>
          </button>
          <button className="linkedin-action-btn">
            <span>✈️ Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
