'use client';

import React from 'react';

interface Props {
  size?: number;
  className?: string;
  showBackground?: boolean;
}

export default function OmniPostLogo({
  size = 32,
  className = '',
  showBackground = true,
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
      aria-label="OmniPost Logo"
    >
      {showBackground && (
        <rect width="32" height="32" rx="8" fill="#0f172a" />
      )}
      {/* Omni Orbital Ring */}
      <path
        d="M16 6.5C10.753 6.5 6.5 10.753 6.5 16C6.5 21.247 10.753 25.5 16 25.5C21.247 25.5 25.5 21.247 25.5 16C25.5 14.85 25.29 13.75 24.91 12.74"
        stroke="#3b82f6"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Core Content Nucleus */}
      <circle cx="13" cy="19" r="2.5" fill="#38bdf8" />
      {/* Post Launch Beam */}
      <path
        d="M13 19L24.5 7.5"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Arrow Head */}
      <path
        d="M17.5 7.5H24.5V14.5"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
