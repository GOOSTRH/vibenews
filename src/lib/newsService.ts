import Parser from 'rss-parser';
import { cache } from 'react';

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
}

interface NewsSource {
  name: string;
  url: string;
  type: 'rss' | 'api';
  category: string;
}

const NEWS_SOURCES: NewsSource[] = [
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    type: 'rss',
    category: 'tech',
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    type: 'rss',
    category: 'science',
  },
  {
    name: 'Wired',
    url: 'https://www.wired.com/feed/category/artificial-intelligence/rss',
    type: 'rss',
    category: 'tech',
  },
  {
    name: 'ArsTechnica',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    type: 'rss',
    category: 'tech',
  },
];

const TECH_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'deep learning',
  'technology', 'software', 'hardware', 'robotics', 'automation',
  'blockchain', 'cryptocurrency', 'cyber', 'digital', 'cloud',
  'programming', 'code', 'developer', 'engineering', 'computer',
  'startup', 'tech', 'innovation', 'algorithm', 'data science',
  'neural network', 'quantum', 'semiconductor', '5g', '6g',
  'processor', 'chip', 'silicon', 'mobile', 'app',
];

const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes
let lastFetch = 0;
let cachedArticles: NewsArticle[] = [];

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'thumbnail'],
    ],
  },
});

const isTechRelated = (article: NewsArticle): boolean => {
  const content = `${article.title} ${article.contentSnippet}`.toLowerCase();
  return TECH_KEYWORDS.some(keyword => content.includes(keyword));
};

export const categorizeArticle = (article: NewsArticle): string[] => {
  const keywords = {
    ai: ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'llm', 'gpt'],
    tech: ['technology', 'software', 'hardware', 'digital', 'cloud', 'mobile', 'app', 'startup'],
    science: ['research', 'quantum', 'semiconductor', 'engineering', 'innovation'],
    economics: ['market', 'startup', 'investment', 'venture capital', 'funding', 'acquisition'],
  };

  const categories = new Set<string>();
  const content = `${article.title} ${article.contentSnippet}`.toLowerCase();

  Object.entries(keywords).forEach(([category, terms]) => {
    if (terms.some(term => content.includes(term))) {
      categories.add(category);
    }
  });

  // Always include 'tech' as a base category if AI-related
  if (categories.has('ai')) {
    categories.add('tech');
  }

  return Array.from(categories);
};

export const extractThumbnail = (article: any): string | undefined => {
  if (article.mediaContent?.$?.url) {
    return article.mediaContent.$.url;
  }
  if (article.thumbnail?.$?.url) {
    return article.thumbnail.$.url;
  }
  
  // Extract first image from content if available
  const imgMatch = article.content?.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch?.[1];
};

export const fetchNews = cache(async (): Promise<NewsArticle[]> => {
  const now = Date.now();
  
  // Return cached results if within cache duration
  if (now - lastFetch < CACHE_DURATION && cachedArticles.length > 0) {
    return cachedArticles;
  }

  try {
    const articles = await Promise.all(
      NEWS_SOURCES.map(async (source) => {
        try {
          const feed = await parser.parseURL(source.url);
          return feed.items
            .map((item: any) => ({
              id: item.guid || item.link,
              title: item.title,
              link: item.link,
              pubDate: item.pubDate || item.isoDate,
              creator: item.creator || item.author,
              content: item.content,
              contentSnippet: item.contentSnippet || item.description,
              categories: [],  // Will be populated by categorizeArticle
              thumbnail: extractThumbnail(item),
              source: source.name,
            }))
            .filter(isTechRelated); // Filter out non-tech content
        } catch (error) {
          console.error(`Error fetching from ${source.name}:`, error);
          return [];
        }
      })
    );

    // Flatten, sort by date, and categorize
    const flatArticles = articles
      .flat()
      .map(article => ({
        ...article,
        categories: categorizeArticle(article),
      }))
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    // Update cache
    cachedArticles = flatArticles;
    lastFetch = now;

    return flatArticles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return cachedArticles; // Return cached articles on error
  }
}); 