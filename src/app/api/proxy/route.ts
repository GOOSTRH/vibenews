import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Disable static optimization

export async function GET(request: NextRequest) {
  const encodedUrl = request.nextUrl.searchParams.get('url');
  
  if (!encodedUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const url = decodeURIComponent(encodedUrl); // Decode the URL before using it
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, application/atom+xml, text/xml, */*',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    const text = await response.text();

    // Return the response with appropriate headers
    return new NextResponse(text, {
      status: response.status,
      headers: {
        'Content-Type': contentType || 'application/xml',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error(`Proxy error for ${encodedUrl}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch' },
      { status: 500 }
    );
  }
} 