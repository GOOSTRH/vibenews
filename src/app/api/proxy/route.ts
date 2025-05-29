import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Disable static optimization
export const runtime = 'edge'; // Use edge runtime for better performance

export async function GET(request: NextRequest) {
  // Add CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  });

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers });
  }

  const encodedUrl = request.nextUrl.searchParams.get('url');
  
  if (!encodedUrl) {
    console.error('[Proxy] Missing URL parameter');
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400, headers }
    );
  }

  try {
    const url = decodeURIComponent(encodedUrl);
    console.log('[Proxy] Fetching URL:', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, application/atom+xml, text/xml, */*',
      },
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    console.log('[Proxy] Response content type:', contentType);

    const text = await response.text();
    console.log('[Proxy] Response length:', text.length);

    // Validate RSS/XML content
    if (!text.includes('<rss') && !text.includes('<feed') && !text.includes('<?xml')) {
      console.error('[Proxy] Invalid feed format received');
      throw new Error('Invalid feed format');
    }

    // Merge the CORS headers with the response headers
    const responseHeaders = new Headers(headers);
    responseHeaders.set('Content-Type', contentType || 'application/xml');
    responseHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    responseHeaders.set('Pragma', 'no-cache');
    responseHeaders.set('Expires', '0');

    return new NextResponse(text, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`[Proxy] Error for ${encodedUrl}:`, error);
    
    // Return a more detailed error response
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch',
      url: decodeURIComponent(encodedUrl),
      timestamp: new Date().toISOString(),
    }, {
      status: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
} 