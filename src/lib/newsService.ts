import { cache } from 'react';
import { feedService } from './feedService';
import { type NewsSource } from '@/config/newsSources';

export interface NewsArticle {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  creator?: string;
  content: string;
  contentSnippet?: string;
  categories: string[];
  thumbnail?: string;
  source: string;
  region?: string;
  language: string;
}

interface RSSItem {
  guid?: string;
  link?: string;
  title?: string;
  pubDate?: string;
  isoDate?: string;
  creator?: string;
  author?: string;
  content?: string;
  contentEncoded?: string;
  'content:encoded'?: string;
  description?: string;
  contentSnippet?: string;
  mediaContent?: { $?: { url?: string } };
  thumbnail?: { $?: { url?: string } };
}

const TECH_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'deep learning',
  'technology', 'software', 'hardware', 'robotics', 'automation',
  'blockchain', 'cryptocurrency', 'cyber', 'digital', 'cloud',
  'programming', 'code', 'developer', 'engineering', 'computer',
  'startup', 'tech', 'innovation', 'algorithm', 'data science',
  'neural network', 'quantum', 'semiconductor', '5g', '6g',
  'processor', 'chip', 'silicon', 'mobile', 'app',
];

const CATEGORY_KEYWORDS = {
  world: ['global', 'international', 'worldwide', 'foreign', 'overseas'],
  politics: ['regulation', 'policy', 'government', 'legislation', 'compliance', 'privacy'],
  business: ['market', 'startup', 'investment', 'venture capital', 'acquisition', 'ipo'],
  technology: TECH_KEYWORDS,
  culture: ['society', 'impact', 'lifestyle', 'future', 'transformation', 'adoption'],
  science: ['research', 'breakthrough', 'discovery', 'innovation', 'study', 'development']
};

const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes
let lastFetch = 0;
let cachedArticles: NewsArticle[] = [];

const isTechRelated = (content: string): boolean => {
  const lowerContent = content.toLowerCase();
  return TECH_KEYWORDS.some(keyword => lowerContent.includes(keyword));
};

export const categorizeArticle = (content: string): string[] => {
  const categories = new Set<string>();
  const lowerContent = content.toLowerCase();

  // Check tech keywords first
  if (isTechRelated(content)) {
    categories.add('tech');
  }

  // Check other categories
  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      categories.add(category);
    }
  });

  // AI-specific categorization
  const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'neural network', 'deep learning'];
  if (aiKeywords.some(keyword => lowerContent.includes(keyword))) {
    categories.add('ai');
  }

  return Array.from(categories);
};

export const extractThumbnail = (item: RSSItem): string | undefined => {
  if (item.mediaContent?.$?.url) {
    return item.mediaContent.$.url;
  }
  if (item.thumbnail?.$?.url) {
    return item.thumbnail.$.url;
  }
  
  // Extract first image from content if available
  const imgMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
  if (imgMatch?.[1]) {
    return imgMatch[1];
  }

  // Try content:encoded for WordPress feeds
  const contentEncoded = item.contentEncoded || item['content:encoded'];
  if (contentEncoded) {
    const encodedImgMatch = contentEncoded.match(/<img[^>]+src="([^">]+)"/);
    return encodedImgMatch?.[1];
  }
};

const processArticle = (item: RSSItem, source: NewsSource): NewsArticle | null => {
  try {
    // Basic validation
    if (!item.title?.trim() || !item.link) {
      return null;
    }

    const content = `${item.title} ${item.contentSnippet || item.description || ''}`;
    
    // Only process tech-related content
    if (!isTechRelated(content)) {
      return null;
    }

    const article: NewsArticle = {
      id: item.guid || item.link || `${source.id}-${Date.now()}-${Math.random()}`,
      title: item.title.trim(),
      link: item.link,
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      creator: item.creator || item.author || source.name,
      content: item.content || item.contentEncoded || item['content:encoded'] || item.description || '',
      contentSnippet: item.contentSnippet || item.description || '',
      categories: categorizeArticle(content),
      thumbnail: extractThumbnail(item),
      source: source.name,
      region: source.region,
      language: source.language,
    };

    // Validate date
    const date = new Date(article.pubDate);
    if (isNaN(date.getTime())) {
      article.pubDate = new Date().toISOString();
    }

    return article;
  } catch (error) {
    console.error(`Error processing article from ${source.name}:`, error);
    return null;
  }
};

export const fetchNews = cache(async (): Promise<NewsArticle[]> => {
  const now = Date.now();
  
  // Return cached results if within cache duration
  if (now - lastFetch < CACHE_DURATION && cachedArticles.length > 0) {
    return cachedArticles;
  }

  try {
    const feedResults = await feedService.fetchAllFeeds();
    
    const articles = feedResults
      .flatMap(({ source, items }) => 
        items
          .map((item: RSSItem) => processArticle(item, source))
          .filter((article: NewsArticle | null): article is NewsArticle => article !== null)
      )
      .sort((a, b) => {
        const dateA = new Date(a.pubDate).getTime();
        const dateB = new Date(b.pubDate).getTime();
        return isNaN(dateA) || isNaN(dateB) ? 0 : dateB - dateA;
      });

    if (articles.length === 0 && cachedArticles.length > 0) {
      console.warn('No new articles fetched, using cached articles');
      return cachedArticles;
    }

    // Update cache
    cachedArticles = articles;
    lastFetch = now;

    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    if (cachedArticles.length > 0) {
      return cachedArticles;
    }
    return [];
  }
}); 