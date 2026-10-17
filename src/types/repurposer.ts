export type ToneType = 'thought_leader' | 'viral_growth' | 'conversational' | 'deep_dive' | 'executive';
export type AudienceType = 'tech' | 'founders' | 'general' | 'students';
export type GoalType = 'engagement' | 'education' | 'traffic' | 'thought_leadership';
export type ThreadLengthType = 'short' | 'standard' | 'deep';

export interface RepurposeRequest {
  content: string;
  tone: ToneType;
  audience: AudienceType;
  goal: GoalType;
  threadLength?: ThreadLengthType;
}

export interface TweetItem {
  tweetNumber: number;
  text: string;
  characterCount: number;
  isOverLimit: boolean;
}

export interface TwitterThread {
  hook: string;
  tweets: TweetItem[];
  hashtags: string[];
  totalTweets: number;
}

export interface LinkedInPost {
  headlineHook: string;
  body: string;
  takeaway: string;
  callToAction: string;
  hashtags: string[];
}

export interface NewsletterDigest {
  subjectLines: string[];
  tldr: string;
  bodyHtmlOrMarkdown: string;
  keyTakeaways: string[];
  discussionQuestion: string;
}

export interface CarouselSlide {
  slideNumber: number;
  title: string;
  content: string;
  visualNote: string;
}

export interface ContentMetadata {
  summary: string;
  readingTimeMinutes: number;
  seoTitle: string;
  seoDescription: string;
  suggestedKeywords: string[];
}

export interface RepurposedResult {
  id?: string;
  title?: string;
  createdAt?: number;
  metadata: ContentMetadata;
  twitter: TwitterThread;
  linkedin: LinkedInPost;
  newsletter: NewsletterDigest;
  carousel: CarouselSlide[];
  metrics: {
    latencyMs: number;
    wordCount: number;
    charCount: number;
    readingTime: string;
    engineType?: string;
    sentimentScore?: string;
  };
}

export interface SavedDraft {
  id: string;
  timestamp: number;
  title: string;
  tone: ToneType;
  audience: AudienceType;
  sourcePreview: string;
  result: RepurposedResult;
}

export interface SampleArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  recommendedTone: ToneType;
  recommendedAudience: AudienceType;
}
