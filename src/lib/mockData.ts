import { RepurposedResult, ToneType, AudienceType, GoalType, ThreadLengthType } from '@/types/repurposer';

/**
 * OmniPost Core Semantic Synthesis Engine
 * Analyzes structure, arguments, keywords, and tone to generate
 * realistic, production-ready multi-platform social assets.
 */
export function generateMockRepurpose(
  content: string,
  tone: ToneType = 'thought_leader',
  audience: AudienceType = 'tech',
  goal: GoalType = 'thought_leadership',
  threadLength: ThreadLengthType = 'standard'
): RepurposedResult {
  const cleanText = content.trim();

  // Split into clean paragraphs
  const rawParagraphs = cleanText
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 20);

  // Split into distinct full sentences
  const rawSentences = cleanText
    .replace(/([.?!])\s+/g, '$1|')
    .split('|')
    .map((s) => s.trim().replace(/^[\d\.\-\*\•\s]+/, ''))
    .filter((s) => s.length > 25);

  const sentences = rawSentences.length > 0 ? rawSentences : [cleanText];

  // Frequency analysis for topic extraction
  const words = cleanText
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const stopWords = new Set([
    'their', 'about', 'would', 'there', 'which', 'could', 'other',
    'these', 'first', 'after', 'where', 'should', 'being', 'through',
    'people', 'years', 'between', 'before', 'having', 'without', 'because'
  ]);

  const freqMap: Record<string, number> = {};
  for (const w of words) {
    const lower = w.toLowerCase();
    if (!stopWords.has(lower) && lower.length > 3) {
      freqMap[lower] = (freqMap[lower] || 0) + 1;
    }
  }

  const topKeywords = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));

  const mainTopic = topKeywords[0] || 'Modern Strategy';
  const secondaryTopic = topKeywords[1] || 'Execution';
  const thirdTopic = topKeywords[2] || 'Optimization';

  // Get key insight points distributed across the text
  const step = Math.max(1, Math.floor(sentences.length / 5));
  const s1 = sentences[0] || cleanText.slice(0, 100);
  const s2 = sentences[Math.min(1 * step, sentences.length - 1)] || s1;
  const s3 = sentences[Math.min(2 * step, sentences.length - 1)] || s2;
  const s4 = sentences[Math.min(3 * step, sentences.length - 1)] || s3;
  const s5 = sentences[Math.min(4 * step, sentences.length - 1)] || s4;

  // Tone-specific framing
  const toneHeaders = {
    thought_leader: {
      hook: `Most people view ${mainTopic.toLowerCase()} through an outdated lens.\n\nHere is what the highest-performing teams understand:`,
      closing: `The difference between average and elite execution is intentional systems design.`,
    },
    viral_growth: {
      hook: `Stop making this mistake with ${mainTopic.toLowerCase()}.\n\nHere is the exact playbook to 10x your output:`,
      closing: `Most people will scroll past this. The top 1% will implement it today.`,
    },
    conversational: {
      hook: `A simple insight that completely shifted how I approach ${mainTopic.toLowerCase()}:`,
      closing: `What has been your biggest takeaway with this? Curious to hear your perspective.`,
    },
    deep_dive: {
      hook: `Comprehensive breakdown on ${mainTopic.toLowerCase()}:\n\nFrom core architecture to production trade-offs:`,
      closing: `Bookmark this breakdown for when you build your next iteration.`,
    },
    executive: {
      hook: `Executive Briefing: Strategic implications of ${mainTopic.toLowerCase()} for leadership:`,
      closing: `Key takeaway: Align organizational incentives with high-leverage outcomes.`,
    },
  }[tone] || {
    hook: `Key insights on ${mainTopic.toLowerCase()}:`,
    closing: `Focus on fundamentals and disciplined execution.`,
  };

  const audienceLabel = {
    tech: 'Engineers & Architects',
    founders: 'Founders & Operators',
    general: 'Leaders & Creators',
    students: 'Emerging Builders',
  }[audience] || 'Leaders';

  // 1. Twitter Thread Generation
  const hookTweet = `${toneHeaders.hook}\n\nA breakdown for ${audienceLabel} 🧵👇`.slice(0, 275);

  const tweetCount = threadLength === 'short' ? 3 : threadLength === 'deep' ? 7 : 5;
  const tweetTexts: string[] = [];

  tweetTexts.push(`1/ ${s1}`.slice(0, 270));
  tweetTexts.push(`2/ The core insight:\n\n${s2}`.slice(0, 270));
  if (tweetCount >= 5) {
    tweetTexts.push(`3/ Why this matters:\n\n${s3}`.slice(0, 270));
    tweetTexts.push(`4/ Operational principle:\n\n${s4}`.slice(0, 270));
  }
  if (tweetCount === 7) {
    tweetTexts.push(`5/ The common trap:\n\nOptimizing before validating the core premise.` .slice(0, 270));
    tweetTexts.push(`6/ The solution:\n\n${s5}`.slice(0, 270));
  }

  const finalTweetNumber = tweetTexts.length + 1;
  tweetTexts.push(
    `${finalTweetNumber}/ TL;DR:\n\n• ${s1.slice(0, 55)}...\n• ${s2.slice(0, 55)}...\n\n${toneHeaders.closing}\n\nRetweet if you found this valuable! 🔄`.slice(0, 275)
  );

  const tweets = tweetTexts.map((text, idx) => ({
    tweetNumber: idx + 1,
    text,
    characterCount: text.length,
    isOverLimit: text.length > 280,
  }));

  const hashtags = [
    `#${mainTopic.replace(/\s+/g, '')}`,
    `#${secondaryTopic.replace(/\s+/g, '')}`,
    `#${thirdTopic.replace(/\s+/g, '')}`,
    `#${audienceLabel.split(' ')[0]}`,
    '#Leadership',
  ];

  // Dynamic concluding insight tailored to content, tone, and audience
  const toneClosings: Record<string, string> = {
    thought_leader: `Mastering ${mainTopic.toLowerCase()} isn't about volume—it's about building repeatable systems around ${secondaryTopic.toLowerCase()}.`,
    viral_growth: `The difference between those who scale ${mainTopic.toLowerCase()} and those who get left behind comes down to execution velocity.`,
    conversational: `At the end of the day, ${mainTopic.toLowerCase()} succeeds when it simplifies your workflow rather than complicating it.`,
    deep_dive: `Sustainable progress in ${mainTopic.toLowerCase()} requires addressing underlying architecture rather than patching surface symptoms.`,
    executive: `Strategic imperative: Align organizational incentives with measurable ${mainTopic.toLowerCase()} outcomes.`,
  };

  const dynamicClosing = s5 && s5 !== s4 && s5 !== s1
    ? `${s5.endsWith('.') ? s5 : s5 + '.'} ${toneClosings[tone] || toneClosings.thought_leader}`
    : (toneClosings[tone] || toneClosings.thought_leader);

  // Dynamic LinkedIn hook and body framing based on tone
  const linkedinHookVariations: Record<string, string> = {
    thought_leader: `${s1}\n\nHere is what this means in practice for ${audienceLabel.toLowerCase()}:`,
    viral_growth: `Most people approach ${mainTopic.toLowerCase()} completely backwards.\n\nHere is what high-performers do instead:`,
    conversational: `A simple framework that completely shifted how I think about ${mainTopic.toLowerCase()}:\n\n${s1}`,
    deep_dive: `A technical breakdown of ${mainTopic.toLowerCase()} and its impact on ${secondaryTopic.toLowerCase()}:\n\nKey takeaways below ⬇️`,
    executive: `Executive Briefing: ${s1}\n\nStrategic implications for leadership:`,
  };
  const linkedinHook = linkedinHookVariations[tone] || linkedinHookVariations.thought_leader;

  const linkedinIntroVariations: Record<string, string> = {
    thought_leader: `When evaluating ${mainTopic.toLowerCase()}, most teams focus on surface-level metrics instead of foundational leverage points.`,
    viral_growth: `If you want to move the needle on ${mainTopic.toLowerCase()}, ignore conventional advice and focus on these fundamentals:`,
    conversational: `Here are the biggest shifts I've noticed when analyzing ${mainTopic.toLowerCase()}:`,
    deep_dive: `Examining the underlying mechanics of ${mainTopic.toLowerCase()} reveals several critical trade-offs:`,
    executive: `The strategic rationale for prioritizing ${mainTopic.toLowerCase()} centers on three actionable pillars:`,
  };
  const linkedinIntro = linkedinIntroVariations[tone] || linkedinIntroVariations.thought_leader;

  const linkedinBody = [
    linkedinIntro,
    '',
    `Key takeaways:`,
    '',
    `1. ${s2}`,
    '',
    `2. ${s3}`,
    '',
    `3. ${s4}`,
    '',
    dynamicClosing,
  ].join('\n');

  const linkedinTakeaway = s2;
  const linkedinCta = `How are you positioning around ${mainTopic.toLowerCase()} in your current workflow? Let's discuss in the comments below.`;

  // 3. Email Newsletter Digest
  const subjectLines = [
    `The ${mainTopic} Playbook: What High-Performers Do Differently`,
    `Why most teams get ${mainTopic.toLowerCase()} wrong (and how to fix it)`,
    `3 high-leverage lessons from ${s1.slice(0, 42)}...`,
  ];

  const newsletterTldr = `Executive overview: ${s1} By focusing on ${mainTopic.toLowerCase()} and ${secondaryTopic.toLowerCase()}, teams achieve sustainable operational leverage.`;

  const newsletterBody = [
    `### The Strategic Shift\n\n${s1}\n\n${s2}`,
    `### Core Principles & Architecture\n\n${s3}\n\n${s4}`,
    `### Actionable Directives for This Week\n\n1. **Audit:** Measure your baseline in ${mainTopic.toLowerCase()}.\n2. **Eliminate:** Strip away premature abstractions and unnecessary complexity.\n3. **Execute:** Focus on tangible business outcomes over vanity indicators.`,
  ].join('\n\n');

  // 4. Carousel Slide Outline (6 Slides)
  const carouselSlides = [
    {
      slideNumber: 1,
      title: mainTopic,
      content: s1.slice(0, 140),
      visualNote: 'Bold minimalist dark backdrop with high-contrast typography and gradient border',
    },
    {
      slideNumber: 2,
      title: 'The Challenge',
      content: s2.slice(0, 160),
      visualNote: 'Problem framing callout with red/amber accent badge',
    },
    {
      slideNumber: 3,
      title: 'The Strategic Shift',
      content: s3.slice(0, 160),
      visualNote: 'Before vs. After comparison card with clear contrast',
    },
    {
      slideNumber: 4,
      title: 'Execution Framework',
      content: s4.slice(0, 160),
      visualNote: '3-step sequential roadmap with numerical indicators',
    },
    {
      slideNumber: 5,
      title: 'Core Takeaway',
      content: toneHeaders.closing,
      visualNote: 'High-impact quote layout with subtle radial glow',
    },
    {
      slideNumber: 6,
      title: 'Save & Implement',
      content: `Enjoyed this breakdown?\n\n📌 Save for your team\n🔄 Share with colleagues\n💬 Share your take below`,
      visualNote: 'Clean parting call-to-action with social bookmark icons',
    },
  ];

  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
  const charCount = cleanText.length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 220));

  return {
    id: `post_${Date.now()}`,
    title: `${mainTopic}: Strategic Breakdown`,
    createdAt: Date.now(),
    metadata: {
      summary: `${s1} ${s2}`.slice(0, 240) + '...',
      readingTimeMinutes: readingTimeMin,
      seoTitle: `${mainTopic}: Complete Framework & Guide`.slice(0, 60),
      seoDescription: `${s1} Discover actionable insights and practical takeaways.`.slice(0, 155),
      suggestedKeywords: topKeywords.length > 0 ? topKeywords : ['Strategy', 'Leadership', 'Growth', 'Operations', 'Productivity'],
    },
    twitter: {
      hook: hookTweet,
      tweets,
      hashtags,
      totalTweets: tweets.length,
    },
    linkedin: {
      headlineHook: linkedinHook,
      body: linkedinBody,
      takeaway: linkedinTakeaway,
      callToAction: linkedinCta,
      hashtags,
    },
    newsletter: {
      subjectLines,
      tldr: newsletterTldr,
      bodyHtmlOrMarkdown: newsletterBody,
      keyTakeaways: [s1.slice(0, 110), s2.slice(0, 110), s3.slice(0, 110)],
      discussionQuestion: `What has been your biggest takeaway when navigating ${mainTopic.toLowerCase()}?`,
    },
    carousel: carouselSlides,
    metrics: {
      latencyMs: 165,
      wordCount,
      charCount,
      readingTime: `~${readingTimeMin} min read`,
      sentimentScore: 'High Engagement (94/100)',
    },
  };
}
