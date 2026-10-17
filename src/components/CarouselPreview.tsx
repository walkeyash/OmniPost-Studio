'use client';

import React, { useState } from 'react';
import { CarouselSlide } from '@/types/repurposer';

interface Props {
  slides: CarouselSlide[];
}

export default function CarouselPreview({ slides }: Props) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [copied, setCopied] = useState(false);

  const activeSlide = slides[currentSlideIndex] || slides[0];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleCopyAll = () => {
    const text = slides
      .map(
        (s) =>
          `Slide ${s.slideNumber}: ${s.title}\n${s.content}\n[Visual Note: ${s.visualNote}]`
      )
      .join('\n\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="preview-container">
      {/* Header */}
      <div className="preview-header">
        <div className="preview-title-group">
          <div className="platform-icon-badge carousel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
            </svg>
          </div>
          <div>
            <h3 className="preview-title">Social Carousel & Slide Deck</h3>
            <span className="preview-subtitle">{slides.length} slides • Formatted for Instagram & LinkedIn carousels</span>
          </div>
        </div>

        <div className="carousel-header-actions">
          <div className="view-mode-toggle">
            <button
              onClick={() => setViewMode('single')}
              className={`mode-btn ${viewMode === 'single' ? 'active' : ''}`}
            >
              Slide View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            >
              Grid View
            </button>
          </div>
          <button
            onClick={handleCopyAll}
            className={`copy-btn ${copied ? 'copied' : ''}`}
          >
            {copied ? '✓ All Slides Copied!' : '📋 Copy All Slides'}
          </button>
        </div>
      </div>

      {viewMode === 'single' ? (
        <div className="single-slide-wrapper">
          {/* Main Slide Card */}
          <div className="slide-card-presentation">
            <div className="slide-top-bar">
              <span className="slide-brand">OmniPost Carousel</span>
              <span className="slide-counter-badge">
                Slide {activeSlide.slideNumber} of {slides.length}
              </span>
            </div>

            <div className="slide-body-presentation">
              <h2 className="slide-main-title">{activeSlide.title}</h2>
              <div className="slide-main-content">
                {activeSlide.content.split('\n').map((line, i) => (
                  <p key={i} className="slide-text-line">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="slide-designer-note">
              <span className="designer-tag">🎨 Visual Direction:</span>
              <span className="designer-text">{activeSlide.visualNote}</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="slide-nav-controls">
            <button onClick={handlePrev} className="slide-nav-btn prev">
              ← Previous Slide
            </button>
            <div className="slide-dots">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`dot-indicator ${currentSlideIndex === idx ? 'active' : ''}`}
                />
              ))}
            </div>
            <button onClick={handleNext} className="slide-nav-btn next">
              Next Slide →
            </button>
          </div>
        </div>
      ) : (
        <div className="slides-grid-view">
          {slides.map((slide, idx) => (
            <div key={idx} className="grid-slide-card">
              <div className="grid-slide-header">
                <span className="grid-slide-badge">Slide {slide.slideNumber}</span>
              </div>
              <h4 className="grid-slide-title">{slide.title}</h4>
              <p className="grid-slide-content">{slide.content}</p>
              <div className="grid-slide-note">
                <small>🎨 {slide.visualNote}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
