import Parser from 'rss-parser';
import { NEWS_SOURCES, type NewsSource } from '@/config/newsSources';

interface FeedError {
  sourceId: string;
  error: string;
  timestamp: string;
}

interface FeedStats {
  sourceId: string;
  articlesCount: number;
  lastFetch: string;
  status: 'success' | 'error';
  error?: string;
}

class FeedService {
  private parser: Parser;
  private errors: FeedError[] = [];
  private stats: Map<string, FeedStats> = new Map();
  private readonly MAX_ERRORS = 100;
  private readonly MAX_RETRIES = 3;
  private readonly TIMEOUT = 15000; // 15 seconds
  private readonly USE_PROXY = process.env.NODE_ENV === 'production'; // Only use proxy in production

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: [
          ['media:content', 'mediaContent'],
          ['media:thumbnail', 'thumbnail'],
          ['description', 'description'],
          ['content:encoded', 'contentEncoded'],
        ],
      },
      timeout: this.TIMEOUT,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, application/atom+xml, text/xml, */*',
      },
    });
  }

  private logError(sourceId: string, error: Error | string): void {
    const errorMessage = error instanceof Error ? error.message : error;
    const feedError: FeedError = {
      sourceId,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    };

    this.errors.unshift(feedError);
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors.pop();
    }

    console.error(`[FeedService] Error fetching ${sourceId}:`, errorMessage);
  }

  private updateStats(sourceId: string, stats: Partial<FeedStats>): void {
    const currentStats = this.stats.get(sourceId) || {
      sourceId,
      articlesCount: 0,
      lastFetch: new Date().toISOString(),
      status: 'success',
    };

    this.stats.set(sourceId, {
      ...currentStats,
      ...stats,
      lastFetch: new Date().toISOString(),
    });
  }

  private getProxyUrl(url: string): string {
    // Get the base URL from environment variables or construct it
    let baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_URL;

    // Fallback to window.location in the browser
    if (typeof window !== 'undefined' && !baseUrl) {
      baseUrl = window.location.origin;
    }

    // Final fallback
    if (!baseUrl) {
      baseUrl = 'http://localhost:3000';
    }
    
    // Encode the URL properly for the proxy
    const encodedUrl = encodeURIComponent(url);
    return `${baseUrl}/api/proxy?url=${encodedUrl}`;
  }

  private async fetchWithRetry(url: string, retries = this.MAX_RETRIES): Promise<string> {
    let lastError: Error | null = null;
    const fetchUrl = this.USE_PROXY ? this.getProxyUrl(url) : url;
    
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

        const response = await fetch(fetchUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/rss+xml, application/xml, application/atom+xml, text/xml, */*',
          },
          next: { revalidate: 300 }, // Cache for 5 minutes
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        
        // Check if we got an HTML error page instead of RSS
        if (text.includes('<!DOCTYPE html>') && !text.includes('<rss') && !text.includes('<feed')) {
          throw new Error('Received HTML instead of RSS feed');
        }

        // If using proxy and got an error response
        if (this.USE_PROXY && text.includes('"error":')) {
          try {
            const errorResponse = JSON.parse(text);
            if (errorResponse.error) {
              throw new Error(errorResponse.error);
            }
          } catch (e) {
            // If we can't parse the error, continue with the response
          }
        }

        return text;
      } catch (error) {
        lastError = error as Error;
        if (i < retries - 1) {
          // Wait before retrying, with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }

    throw lastError || new Error('Failed to fetch after retries');
  }

  private isValidFeed(content: string): boolean {
    const normalizedContent = content.toLowerCase();
    return (
      normalizedContent.includes('<rss') ||
      normalizedContent.includes('<feed') ||
      normalizedContent.includes('<?xml') ||
      normalizedContent.includes('<rdf:rdf')
    );
  }

  async fetchFeed(source: NewsSource) {
    try {
      // Fetch the feed content
      const content = await this.fetchWithRetry(source.url);

      // Validate feed content
      if (!this.isValidFeed(content)) {
        throw new Error('Invalid feed format');
      }

      // Parse the feed
      const feed = await this.parser.parseString(content);

      if (!feed.items?.length) {
        console.warn(`[FeedService] No items found in feed: ${source.id}`);
      }

      // Update stats
      this.updateStats(source.id, {
        articlesCount: feed.items?.length || 0,
        status: 'success',
      });

      return feed;
    } catch (error) {
      this.logError(source.id, error as Error);
      this.updateStats(source.id, {
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  async fetchAllFeeds() {
    const enabledSources = NEWS_SOURCES.filter(source => source.enabled)
      .sort((a, b) => b.priority - a.priority);

    const feedPromises = enabledSources.map(source => 
      this.fetchFeed(source)
        .then(feed => ({ source, feed }))
        .catch(error => {
          this.logError(source.id, error);
          return { source, feed: null };
        })
    );

    const results = await Promise.allSettled(feedPromises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<{source: NewsSource; feed: any}> => 
        result.status === 'fulfilled' && result.value.feed !== null
      )
      .map(result => ({
        source: result.value.source,
        items: result.value.feed.items || [],
      }));
  }

  getErrors(): FeedError[] {
    return [...this.errors];
  }

  getStats(): FeedStats[] {
    return Array.from(this.stats.values());
  }

  clearErrors(): void {
    this.errors = [];
  }
}

// Export a singleton instance
export const feedService = new FeedService(); 