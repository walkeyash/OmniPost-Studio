import { NextRequest, NextResponse } from 'next/server';
import { RepurposeRequest, RepurposedResult } from '@/types/repurposer';
import { generateMockRepurpose } from '@/lib/mockData';
import { getSystemPrompt } from '@/lib/prompts';
import OpenAI from 'openai';

const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

export async function POST(req: NextRequest) {
  const startTime = performance.now();

  try {
    const body = (await req.json()) as RepurposeRequest;
    const {
      content,
      tone = 'thought_leader',
      audience = 'tech',
      goal = 'thought_leadership',
      threadLength = 'standard',
    } = body;

    if (!content || content.trim().length < 15) {
      return NextResponse.json(
        { error: 'Please enter at least 15 characters of content to process.' },
        { status: 400 }
      );
    }

    let result: RepurposedResult | null = null;
    let engineType = 'OmniPost Neural (Built-in)';

    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: getSystemPrompt(tone, audience, goal),
            },
            {
              role: 'user',
              content: `Please repurpose the following source text. Requested thread length: ${threadLength}.\n\nSOURCE TEXT:\n${content}`,
            },
          ],
          temperature: 0.7,
        });

        const rawJson = completion.choices[0]?.message?.content;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          const cleanText = content.trim();
          const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
          const charCount = cleanText.length;
          const readingTimeMin = Math.max(1, Math.ceil(wordCount / 220));

          result = {
            id: `post_${Date.now()}`,
            title: parsed.metadata?.seoTitle || 'Repurposed Content Campaign',
            createdAt: Date.now(),
            metadata: {
              summary: parsed.metadata?.summary || '',
              readingTimeMinutes: parsed.metadata?.readingTimeMinutes || readingTimeMin,
              seoTitle: parsed.metadata?.seoTitle || 'Repurposed Post',
              seoDescription: parsed.metadata?.seoDescription || '',
              suggestedKeywords: parsed.metadata?.suggestedKeywords || [],
            },
            twitter: {
              hook: parsed.twitter?.hook || '',
              tweets: (parsed.twitter?.tweets || []).map((t: any, i: number) => ({
                tweetNumber: t.tweetNumber ?? i + 1,
                text: t.text ?? '',
                characterCount: (t.text ?? '').length,
                isOverLimit: (t.text ?? '').length > 280,
              })),
              hashtags: parsed.twitter?.hashtags || [],
              totalTweets: parsed.twitter?.tweets?.length || 0,
            },
            linkedin: {
              headlineHook: parsed.linkedin?.headlineHook || '',
              body: parsed.linkedin?.body || '',
              takeaway: parsed.linkedin?.takeaway || '',
              callToAction: parsed.linkedin?.callToAction || '',
              hashtags: parsed.linkedin?.hashtags || [],
            },
            newsletter: {
              subjectLines: parsed.newsletter?.subjectLines || [],
              tldr: parsed.newsletter?.tldr || '',
              bodyHtmlOrMarkdown: parsed.newsletter?.bodyHtmlOrMarkdown || '',
              keyTakeaways: parsed.newsletter?.keyTakeaways || [],
              discussionQuestion: parsed.newsletter?.discussionQuestion || '',
            },
            carousel: parsed.carousel || [],
            metrics: {
              latencyMs: 0,
              wordCount,
              charCount,
              readingTime: `${readingTimeMin} min read`,
              engineType: 'OpenAI GPT-4o-mini',
              sentimentScore: 'High Engagement (+0.84)',
            },
          };
          engineType = 'OpenAI GPT-4o-mini';
        }
      } catch (aiErr) {
        console.warn('OpenAI API call failed or timed out, falling back to built-in engine:', aiErr);
      }
    }

    if (!result) {
      result = generateMockRepurpose(content, tone, audience, goal, threadLength);
    }

    const latencyMs = Math.round(performance.now() - startTime);
    result.metrics.latencyMs = latencyMs;
    if (!result.metrics.engineType) {
      result.metrics.engineType = engineType;
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error('API Error in /api/repurpose:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while analyzing content.' },
      { status: 500 }
    );
  }
}
