'use client';

import React, { useState, useEffect } from 'react';
import { TwitterThread } from '@/types/repurposer';

interface Props {
  thread: TwitterThread;
}

export default function TwitterPreview({ thread }: Props) {
  const [hookText, setHookText] = useState(thread.hook);
  const [tweetsList, setTweetsList] = useState(thread.tweets);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  useEffect(() => {
    setHookText(thread.hook);
    setTweetsList(thread.tweets);
  }, [thread]);

  const handleTweetChange = (idx: number, newText: string) => {
    setTweetsList((prev) =>
      prev.map((t, i) =>
        i === idx
          ? {
              ...t,
              text: newText,
              characterCount: newText.length,
              isOverLimit: newText.length > 280,
            }
          : t
      )
    );
  };

  const handleCopyTweet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyThread = () => {
    const fullText = [
      hookText,
      '',
      ...tweetsList.map((t) => t.text),
      '',
      thread.hashtags.join(' '),
    ].join('\n\n');
    navigator.clipboard.writeText(fullText);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div className="preview-container">
      {/* Header Actions */}
      <div className="preview-header">
        <div className="preview-title-group">
          <div className="platform-icon-badge twitter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <div>
            <h3 className="preview-title">X / Twitter Thread</h3>
            <span className="preview-subtitle">
              {tweetsList.length} tweets • Inline editable with live character limit tracking
            </span>
          </div>
        </div>
        <button
          onClick={handleCopyThread}
          className={`copy-btn ${allCopied ? 'copied' : ''}`}
        >
          {allCopied ? '✓ Thread Copied!' : '📋 Copy Entire Thread'}
        </button>
      </div>

      {/* Feed Thread Container */}
      <div className="twitter-feed">
        {/* Hook Tweet */}
        <div className="tweet-card is-hook">
          <div className="tweet-avatar-col">
            <div className="tweet-avatar">OP</div>
            <div className="thread-connector-line"></div>
          </div>
          <div className="tweet-body-col">
            <div className="tweet-meta">
              <span className="tweet-author-name">Publisher</span>
              <span className="verified-badge" title="Verified Creator">✓</span>
              <span className="tweet-handle">@content</span>
              <span className="tweet-time">· Hook Tweet</span>
            </div>

            <textarea
              value={hookText}
              onChange={(e) => setHookText(e.target.value)}
              className="tweet-editable-textarea hook-textarea"
              rows={3}
            />

            <div className="tweet-footer">
              <div className="tweet-stats">
                <span
                  className={`char-badge ${
                    hookText.length > 280 ? 'danger' : 'safe'
                  }`}
                >
                  {hookText.length}/280 chars {hookText.length > 280 && '⚠️ Over Limit'}
                </span>
              </div>
              <button
                onClick={() => handleCopyTweet(hookText, -1)}
                className="tweet-action-copy"
              >
                {copiedIndex === -1 ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Numbered Body Tweets */}
        {tweetsList.map((tweet, idx) => {
          const isLast = idx === tweetsList.length - 1;
          const isOver = tweet.characterCount > 280;

          return (
            <div key={idx} className="tweet-card">
              <div className="tweet-avatar-col">
                <div className="tweet-avatar sub">OP</div>
                {!isLast && <div className="thread-connector-line"></div>}
              </div>
              <div className="tweet-body-col">
                <div className="tweet-meta">
                  <span className="tweet-author-name">Publisher</span>
                  <span className="tweet-handle">@content</span>
                  <span className="tweet-time">
                    · Tweet {tweet.tweetNumber} of {tweetsList.length}
                  </span>
                </div>

                <textarea
                  value={tweet.text}
                  onChange={(e) => handleTweetChange(idx, e.target.value)}
                  className="tweet-editable-textarea"
                  rows={3}
                />

                <div className="tweet-footer">
                  <div className="tweet-stats">
                    <span className={`char-badge ${isOver ? 'danger' : 'safe'}`}>
                      {tweet.characterCount}/280 chars {isOver && '⚠️ Over Limit'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyTweet(tweet.text, idx)}
                    className="tweet-action-copy"
                  >
                    {copiedIndex === idx ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Concluding Hashtags */}
        {thread.hashtags && thread.hashtags.length > 0 && (
          <div className="hashtags-pill-container">
            <span className="hashtags-label">Target Hashtags:</span>
            {thread.hashtags.map((tag, i) => (
              <span key={i} className="hashtag-chip">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
