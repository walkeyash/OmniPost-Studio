'use client';

import React, { useState } from 'react';
import { NewsletterDigest } from '@/types/repurposer';

interface Props {
  newsletter: NewsletterDigest;
}

export default function NewsletterPreview({ newsletter }: Props) {
  const [selectedSubjectIdx, setSelectedSubjectIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentSubject = newsletter.subjectLines[selectedSubjectIdx] || newsletter.subjectLines[0] || 'Weekly Briefing';

  const handleCopyNewsletter = () => {
    const fullText = [
      `Subject: ${currentSubject}`,
      '',
      `TL;DR:`,
      newsletter.tldr,
      '',
      newsletter.bodyHtmlOrMarkdown,
      '',
      'Key Takeaways:',
      ...newsletter.keyTakeaways.map((t) => `• ${t}`),
      '',
      `Discussion Prompt: ${newsletter.discussionQuestion}`,
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
          <div className="platform-icon-badge newsletter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>
          <div>
            <h3 className="preview-title">Email Newsletter Issue</h3>
            <span className="preview-subtitle">Ready-to-send digest with A/B subject line variants</span>
          </div>
        </div>
        <button
          onClick={handleCopyNewsletter}
          className={`copy-btn ${copied ? 'copied' : ''}`}
        >
          {copied ? '✓ Newsletter Copied!' : '📋 Copy Full Issue'}
        </button>
      </div>

      {/* Email Client Mockup */}
      <div className="email-client-mockup">
        {/* Email Header Chrome */}
        <div className="email-chrome-header">
          <div className="window-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <div className="email-meta-fields">
            <div className="email-field-row">
              <span className="field-name">From:</span>
              <span className="field-value">OmniPost Dispatch &lt;newsletter@omnipost.ai&gt;</span>
            </div>
            <div className="email-field-row">
              <span className="field-name">Subject Options:</span>
              <div className="subject-options-pills">
                {newsletter.subjectLines.map((subj, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSubjectIdx(idx)}
                    className={`subject-pill ${selectedSubjectIdx === idx ? 'active' : ''}`}
                  >
                    Variant {String.fromCharCode(65 + idx)}: &ldquo;{subj}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Email Content Body */}
        <div className="email-body-content">
          <h2 className="email-headline">{currentSubject}</h2>

          {/* Executive TL;DR Banner */}
          <div className="email-tldr-card">
            <div className="tldr-badge">⚡ 60-Second Executive Summary</div>
            <p className="tldr-text">{newsletter.tldr}</p>
          </div>

          {/* Main Story Body */}
          <div className="email-main-body">
            {newsletter.bodyHtmlOrMarkdown.split('\n\n').map((block, i) => {
              if (block.startsWith('### ')) {
                return (
                  <h3 key={i} className="email-subheading">
                    {block.replace('### ', '')}
                  </h3>
                );
              }
              return (
                <p key={i} className="email-paragraph">
                  {block}
                </p>
              );
            })}
          </div>

          {/* Key Takeaways Card */}
          <div className="email-takeaways-card">
            <h4 className="takeaways-header">📌 Key Takeaways</h4>
            <ul className="takeaways-list">
              {newsletter.keyTakeaways.map((item, idx) => (
                <li key={idx} className="takeaway-list-item">
                  <span className="checkmark">✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Discussion Question */}
          {newsletter.discussionQuestion && (
            <div className="email-poll-card">
              <span className="poll-badge">💬 Reader Discussion</span>
              <p className="poll-prompt">{newsletter.discussionQuestion}</p>
              <span className="poll-hint">Hit reply to share your take — we read every single response.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
