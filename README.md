# OmniPost Studio — Multi-Platform Social Content Engine

> **Professional Content Repurposing & Multi-Channel Distribution Suite**  
> Built with Next.js 16 (App Router), TypeScript, and Modern Vanilla CSS.

---

## 📌 Product Overview

**OmniPost Studio** is an intelligent content workspace designed for creators, founders, and marketing teams. It converts any raw article, newsletter, podcast transcript, or draft notes into **3 platform-native formats** in real-time:

1. **𝕏 / Twitter Thread**: High-converting hook tweet + 3 to 7 numbered body tweets with live **280-character limit checks** and inline tweet editing.
2. **LinkedIn Thought Leadership Post**: Formatted for the LinkedIn algorithm with curiosity hooks above the fold, clean whitespace line breaks, key takeaways, and discussion prompts with live edit mode.
3. **Email Newsletter Issue**: Features **A/B subject line variant testing** (Curiosity vs. Direct Benefit vs. Story), executive TL;DR, and structured takeaways.

---

## ⚡ Key Daily Workflow Features

- **Inline Content Editing**: Edit individual tweets or LinkedIn sections directly in the UI before copying. Character limits recalculate dynamically as you type.
- **Campaign Library**: Save any repurposed output to your local library (`localStorage`) with 1 click. Access, reload, or delete past campaigns anytime from the top bar.
- **Voice & Tone Presets**: Calibrate your content for *Thought Leader (Authoritative)*, *Viral Growth (High Reach)*, *Conversational (Relatable)*, *Technical Deep Dive*, or *Executive Briefing*.
- **Configurable Thread Depth**: Choose between Quick Takes (3 Tweets), Standard (5 Tweets), or In-Depth Threads (7 Tweets).
- **🌓 Dark & Light Themes**: Refined palettes tailored for day-to-day writing in any lighting condition.

---

## 🚀 Quickstart & Local Development

### 1. Requirements
- Node.js 18+ (tested on Node v24)
- npm 9+

### 2. Installation & Running
```bash
git clone <your-repo>
cd ai-content-repurposer
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🌐 Production Deployment

### Option A: 1-Click Deploy to Vercel (Recommended)
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository. Vercel will automatically detect **Next.js**.
4. Click **"Deploy"**! Zero environment variables needed.

### Option B: Self-Hosted (Node.js / VPS)
```bash
npm run build
npm start
```
The production server will launch on port 3000 (or `PORT` environment variable).

---

## 📁 Project Architecture

```text
ai-content-repurposer/
├── src/
│   ├── app/
│   │   ├── api/repurpose/route.ts  # Next.js Route Handler for content synthesis
│   │   ├── globals.css             # Refined Dark & Light theme styling
│   │   ├── layout.tsx              # Application layout & SEO tags
│   │   └── page.tsx                # Dual-panel interactive studio workspace
│   ├── components/
│   │   ├── TwitterPreview.tsx      # X/Twitter feed card with inline editing & counters
│   │   ├── LinkedInPreview.tsx     # LinkedIn card with live edit mode & engagement bar
│   │   ├── NewsletterPreview.tsx   # Email client with A/B subject line switcher
│   │   ├── MetricsCard.tsx         # Latency, word count & reach analytics
│   │   └── HistoryDrawer.tsx       # Saved campaign drafts library drawer
│   ├── lib/
│   │   ├── prompts.ts              # System prompt & voice frameworks
│   │   └── mockData.ts             # Semantic NLP synthesis engine
│   └── types/
│       └── repurposer.ts           # Strict TypeScript interfaces
└── package.json
```

---

## 📄 License
MIT License.
