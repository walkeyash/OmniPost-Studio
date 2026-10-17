'use client';

import React, { useState } from 'react';
import { ContentMetadata, RepurposedResult } from '@/types/repurposer';

interface Props {
  metadata: ContentMetadata;
  fullData: RepurposedResult;
}

export default function SeoSummaryPreview({ metadata, fullData }: Props) {
  const [copiedAllMd, setCopiedAllMd] = useState(false);

  const handleCopyMarkdownBundle = () => {
    const md = [
      `# ${metadata.seoTitle}`,
      `> ${metadata.summary}`,
      '',
      `**Estimated Reading Time:** ${metadata.readingTimeMinutes} min`,
      `**Suggested Keywords:** ${metadata.suggestedKeywords.join(', ')}`,
      '',
      '---',
      '',
      '## 1. X / Twitter Thread',
      `**Hook:** ${fullData.twitter.hook}`,
      '',
      ...fullData.twitter.tweets.map((t) => `${t.text}\n`),
      `**Tags:** ${fullData.twitter.hashtags.join(' ')}`,
      '',
      '---',
      '',
      '## 2. LinkedIn Thought Leadership Post',
      fullData.linkedin.headlineHook,
      '',
      fullData.linkedin.body,
      '',
      `**Key Takeaway:** ${fullData.linkedin.takeaway}`,
      '',
      fullData.linkedin.callToAction,
      '',
      fullData.linkedin.hashtags.join(' '),
      '',
      '---',
      '',
      '## 3. Email Newsletter Digest',
      `**Subject:** ${fullData.newsletter.subjectLines[0]}`,
      `**TL;DR:** ${fullData.newsletter.tldr}`,
      '',
      fullData.newsletter.bodyHtmlOrMarkdown,
      '',
      '### Key Takeaways:',
      ...fullData.newsletter.keyTakeaways.map((k) => `- ${k}`),
      '',
      `**Reader Question:** ${fullData.newsletter.discussionQuestion}`,
      '',
      '---',
      '',
      '## 4. Carousel Slide Outline',
      ...fullData.carousel.map(
        (s) => `### Slide ${s.slideNumber}: ${s.title}\n${s.content}\n*Note: ${s.visualNote}*\n`
      ),
    ].join('\n');

    navigator.clipboard.writeText(md);
    setCopiedAllMd(true);
    setTimeout(() => setCopiedAllMd(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(fullData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repurposed-content-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="preview-container">
      {/* Header */}
      <div className="preview-header">
        <div className="preview-title-group">
          <div className="platform-icon-badge seo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <div>
            <h3 className="preview-title">SEO & Multi-Format Bundle Export</h3>
            <span className="preview-subtitle">Search metadata, keyword tags & universal export</span>
          </div>
        </div>

        <div className="seo-header-actions">
          <button onClick={handleDownloadJson} className="export-action-btn secondary">
            📥 Export JSON
          </button>
          <button
            onClick={handleCopyMarkdownBundle}
            className={`export-action-btn primary ${copiedAllMd ? 'copied' : ''}`}
          >
            {copiedAllMd ? '✓ Copied All Formats!' : '📋 Copy All as Markdown'}
          </button>
        </div>
      </div>

      <div className="seo-cards-grid">
        {/* SERP Search Preview Card */}
        <div className="seo-card">
          <h4 className="seo-card-title">Google SERP Snippet Preview</h4>
          <div className="serp-preview-box">
            <div className="serp-url">https://yourdomain.com/insights › article</div>
            <div className="serp-title">{metadata.seoTitle}</div>
            <div className="serp-description">{metadata.seoDescription}</div>
          </div>
          <div className="serp-limits-row">
            <span
              className={`serp-limit-tag ${
                metadata.seoTitle.length > 60 ? 'warning' : 'good'
              }`}
            >
              Title: {metadata.seoTitle.length}/60 chars
            </span>
            <span
              className={`serp-limit-tag ${
                metadata.seoDescription.length > 160 ? 'warning' : 'good'
              }`}
            >
              Description: {metadata.seoDescription.length}/160 chars
            </span>
          </div>
        </div>

        {/* Content Executive Summary */}
        <div className="seo-card">
          <h4 className="seo-card-title">Core Executive Synthesis</h4>
          <p className="seo-summary-text">{metadata.summary}</p>
          <div className="seo-read-badge">
            ⏱️ Estimated Reading Time: <strong>{metadata.readingTimeMinutes} minute(s)</strong>
          </div>
        </div>

        {/* Keywords */}
        <div className="seo-card full-width">
          <h4 className="seo-card-title">Target SEO Keywords & Tags</h4>
          <div className="seo-keywords-list">
            {metadata.suggestedKeywords.map((kw, i) => (
              <span key={i} className="seo-keyword-pill">
                #{kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
