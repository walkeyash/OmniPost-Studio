'use client';

import React from 'react';
import { RepurposedResult } from '@/types/repurposer';

interface Props {
  data: RepurposedResult;
}

export default function MetricsCard({ data }: Props) {
  const { metrics, metadata } = data;

  return (
    <div className="metrics-dashboard-bar">
      <div className="metric-chip-group">
        {/* Status Indicator */}
        <div className="status-pill live">
          <span className="status-dot"></span>
          <span>Drafts Ready</span>
        </div>

        {/* Word & Char Count */}
        <div className="metric-stat-box">
          <span className="stat-label">Source:</span>
          <span className="stat-val">
            {metrics.wordCount.toLocaleString()} words <span className="token-sub">({metrics.charCount.toLocaleString()} chars)</span>
          </span>
        </div>

        {/* Read Time */}
        <div className="metric-stat-box">
          <span className="stat-label">Reading Time:</span>
          <span className="stat-val">{metrics.readingTime || `~${metadata.readingTimeMinutes} min`}</span>
        </div>

        {/* Channels Formatted */}
        <div className="metric-stat-box">
          <span className="stat-label">Output:</span>
          <span className="stat-val channel-count-val">3 Channels (𝕏, LinkedIn, Newsletter)</span>
        </div>
      </div>
    </div>
  );
}
