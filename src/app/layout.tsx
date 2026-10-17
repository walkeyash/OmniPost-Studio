import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OmniPost Studio — Intelligent Multi-Platform Social Content Engine',
  description: 'Transform long-form articles, newsletters, and notes into high-converting Twitter threads, LinkedIn thought leadership, email digests, and social carousels.',
  keywords: ['Content Strategy', 'Social Media Publisher', 'Content Repurposing', 'LinkedIn Growth', 'Twitter Threads'],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
