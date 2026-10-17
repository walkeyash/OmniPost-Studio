import { NextRequest, NextResponse } from 'next/server';
import { RepurposeRequest } from '@/types/repurposer';
import { generateMockRepurpose } from '@/lib/mockData';

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

    const result = generateMockRepurpose(content, tone, audience, goal, threadLength);
    const latencyMs = Math.round(performance.now() - startTime);
    result.metrics.latencyMs = latencyMs;

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
