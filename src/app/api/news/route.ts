import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/newsService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const articles = await fetchNews();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
} 