'use client';

import React, { useState, useEffect } from 'react';
import {
  ToneType,
  AudienceType,
  GoalType,
  ThreadLengthType,
  RepurposedResult,
  SavedDraft,
} from '@/types/repurposer';
import TwitterPreview from '@/components/TwitterPreview';
import LinkedInPreview from '@/components/LinkedInPreview';
import NewsletterPreview from '@/components/NewsletterPreview';
import MetricsCard from '@/components/MetricsCard';
import HistoryDrawer from '@/components/HistoryDrawer';
import OmniPostLogo from '@/components/OmniPostLogo';

export default function Home() {
  const [content, setContent] = useState<string>('');
  const [tone, setTone] = useState<ToneType>('thought_leader');
  const [audience, setAudience] = useState<AudienceType>('tech');
  const [goal, setGoal] = useState<GoalType>('thought_leadership');
  const [threadLength, setThreadLength] = useState<ThreadLengthType>('standard');

  const [selectedTab, setSelectedTab] = useState<'twitter' | 'linkedin' | 'newsletter'>('twitter');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RepurposedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Theme State (Dark / Light)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Saved Drafts Library
  const [drafts, setDrafts] = useState<SavedDraft[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Initialize theme and saved drafts from localStorage
  useEffect(() => {
    try {
      const savedTheme = (localStorage.getItem('omnipost_theme') as 'dark' | 'light') || 'dark';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);

      const storedDrafts = localStorage.getItem('omnipost_saved_drafts');
      if (storedDrafts) {
        setDrafts(JSON.parse(storedDrafts));
      }
    } catch (e) {
      console.error('Failed to load local settings', e);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('omnipost_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please paste some content to generate your posts.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          tone,
          audience,
          goal,
          threadLength,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to process content.');
      }

      setResult(json.data);
    } catch (err: any) {
      console.error('Repurpose error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (!result) return;
    const newDraft: SavedDraft = {
      id: `draft_${Date.now()}`,
      timestamp: Date.now(),
      title: result.metadata.seoTitle.slice(0, 48) || 'Campaign Draft',
      tone,
      audience,
      sourcePreview: content.slice(0, 140) + '...',
      result,
    };

    const updated = [newDraft, ...drafts].slice(0, 25);
    setDrafts(updated);
    localStorage.setItem('omnipost_saved_drafts', JSON.stringify(updated));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeleteDraft = (id: string) => {
    const updated = drafts.filter((d) => d.id !== id);
    setDrafts(updated);
    localStorage.setItem('omnipost_saved_drafts', JSON.stringify(updated));
  };

  const handleLoadDraft = (draft: SavedDraft) => {
    setResult(draft.result);
    setTone(draft.tone);
    setAudience(draft.audience);
    setError(null);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand-wrapper">
            <OmniPostLogo size={32} />
            <div className="brand-text-block">
              <span className="brand-title">OmniPost</span>
              <span className="brand-sub">Studio</span>
            </div>
          </div>

          <div className="nav-actions">
            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title="Toggle Light / Dark Theme"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>

            {result && (
              <button
                onClick={handleSaveDraft}
                className={`save-campaign-btn ${saveSuccess ? 'saved' : ''}`}
                title="Save this draft to your library"
              >
                {saveSuccess ? '✓ Saved' : '💾 Save Draft'}
              </button>
            )}

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="library-btn"
              title="Open saved library"
            >
              <span>📁 Library</span>
              <span className="library-count-pill">{drafts.length}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="main-layout">
        {/* Left Workspace: Input Controls */}
        <section className="input-workspace">
          <div className="workspace-title-row">
            <h2 className="panel-heading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Source Content</span>
            </h2>
            <span className="samples-label">Input</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Textarea */}
            <div className="content-input-group">
              <div className="textarea-header">
                <span>Article, Transcript, or Draft Notes:</span>
                <span className="char-counter">
                  {wordCount} words • {content.length} chars
                </span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your article, meeting notes, podcast transcript, or thoughts here..."
                className="source-textarea"
                required
              />
            </div>

            {/* Strategic Options */}
            <div className="options-grid">
              <div className="control-field">
                <label className="field-label">Voice &amp; Tone Profile</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as ToneType)}
                  className="custom-select"
                >
                  <option value="thought_leader">Thought Leader (Authoritative)</option>
                  <option value="viral_growth">Viral Growth (High Reach)</option>
                  <option value="conversational">Conversational &amp; Relatable</option>
                  <option value="deep_dive">Technical Deep Dive</option>
                  <option value="executive">Executive Briefing</option>
                </select>
              </div>

              <div className="control-field">
                <label className="field-label">Target Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as AudienceType)}
                  className="custom-select"
                >
                  <option value="tech">Engineers &amp; Technical Teams</option>
                  <option value="founders">Founders &amp; Operators</option>
                  <option value="general">Broad Industry Audience</option>
                  <option value="students">Emerging Professionals</option>
                </select>
              </div>

              <div className="control-field">
                <label className="field-label">Primary Objective</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as GoalType)}
                  className="custom-select"
                >
                  <option value="thought_leadership">Thought Leadership &amp; Authority</option>
                  <option value="engagement">Audience Discussion &amp; Comments</option>
                  <option value="education">Educational Depth &amp; Retention</option>
                  <option value="traffic">Traffic &amp; Conversions</option>
                </select>
              </div>

              <div className="control-field">
                <label className="field-label">Thread Depth</label>
                <select
                  value={threadLength}
                  onChange={(e) => setThreadLength(e.target.value as ThreadLengthType)}
                  className="custom-select"
                >
                  <option value="standard">Standard (5 Tweets)</option>
                  <option value="short">Quick Take (3 Tweets)</option>
                  <option value="deep">In-Depth Thread (7 Tweets)</option>
                </select>
              </div>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="error-banner">
                <span>{error}</span>
              </div>
            )}

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isLoading || !content.trim()}
              className="submit-btn"
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Formatting drafts...</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span>Format for Social Channels</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Right Workspace: Output & Previews */}
        <section className="output-workspace">
          {result ? (
            <>
              {/* Telemetry Bar */}
              <MetricsCard data={result} />

              {/* Platform Tabs Navigation: X, LinkedIn, Newsletter */}
              <nav className="platform-tabs-nav">
                <button
                  onClick={() => setSelectedTab('twitter')}
                  className={`tab-btn ${selectedTab === 'twitter' ? 'active' : ''}`}
                >
                  <span>𝕏</span>
                  <span>X / Twitter Thread ({result.twitter.tweets.length})</span>
                </button>

                <button
                  onClick={() => setSelectedTab('linkedin')}
                  className={`tab-btn ${selectedTab === 'linkedin' ? 'active' : ''}`}
                >
                  <span>in</span>
                  <span>LinkedIn Post</span>
                </button>

                <button
                  onClick={() => setSelectedTab('newsletter')}
                  className={`tab-btn ${selectedTab === 'newsletter' ? 'active' : ''}`}
                >
                  <span>✉️</span>
                  <span>Newsletter Issue</span>
                </button>
              </nav>

              {/* Active Tab Preview */}
              {selectedTab === 'twitter' && <TwitterPreview thread={result.twitter} />}
              {selectedTab === 'linkedin' && <LinkedInPreview post={result.linkedin} />}
              {selectedTab === 'newsletter' && (
                <NewsletterPreview newsletter={result.newsletter} />
              )}
            </>
          ) : (
            <div className="empty-state-card">
              <OmniPostLogo size={48} />
              <h3 className="empty-state-title">Multi-Platform Content Studio</h3>
              <p className="empty-state-desc">
                Paste your article, draft notes, or thoughts on the left, pick your voice profile and target audience, and click <strong>Format for Social Channels</strong> to generate publication-ready drafts for X, LinkedIn, and Email Newsletters.
              </p>

              <div className="feature-highlights-row">
                <span className="feature-pill">𝕏 280-Char Verified Threads</span>
                <span className="feature-pill">in LinkedIn Thought Leadership</span>
                <span className="feature-pill">✉️ Newsletter Digest</span>
                <span className="feature-pill">✏️ Real-Time Inline Editing</span>
                <span className="feature-pill">📁 Drafts Library</span>
                <span className="feature-pill">🌓 Light &amp; Dark Theme</span>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Saved Drafts History Drawer */}
      <HistoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        drafts={drafts}
        onSelectDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft}
      />
    </div>
  );
}
