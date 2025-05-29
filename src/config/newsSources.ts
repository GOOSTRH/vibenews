import { z } from 'zod';

export const NewsSourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
  type: z.enum(['rss', 'api']),
  category: z.string(),
  region: z.string(),
  language: z.string(),
  enabled: z.boolean(),
  priority: z.number().min(0).max(100),
});

export type NewsSource = z.infer<typeof NewsSourceSchema>;

// Korean Sources
const KOREAN_SOURCES: NewsSource[] = [
  {
    id: 'hankyung',
    name: 'Hankyung IT',
    url: 'https://www.hankyung.com/feed/it',
    type: 'rss',
    category: 'tech',
    region: 'korea',
    language: 'ko',
    enabled: true,
    priority: 85,
  },
  {
    id: 'techdaily',
    name: 'Tech Daily Korea',
    url: 'https://www.techdaily.co.kr/rss/allArticle.xml',
    type: 'rss',
    category: 'tech',
    region: 'korea',
    language: 'ko',
    enabled: true,
    priority: 80,
  },
];

// Global Tech Sources
const GLOBAL_SOURCES: NewsSource[] = [
  {
    id: 'bbc-tech',
    name: 'BBC Technology',
    url: 'https://feeds.bbci.co.uk/news/technology/rss.xml?edition=uk',
    type: 'rss',
    category: 'tech',
    region: 'global',
    language: 'en',
    enabled: true,
    priority: 95,
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    type: 'rss',
    category: 'tech',
    region: 'global',
    language: 'en',
    enabled: true,
    priority: 90,
  },
  {
    id: 'wired',
    name: 'Wired',
    url: 'https://www.wired.com/feed/rss',
    type: 'rss',
    category: 'tech',
    region: 'global',
    language: 'en',
    enabled: true,
    priority: 85,
  },
];

// AI/ML Sources
const AI_ML_SOURCES: NewsSource[] = [
  {
    id: 'ml-mastery',
    name: 'Machine Learning Mastery',
    url: 'https://machinelearningmastery.com/blog/feed/',
    type: 'rss',
    category: 'ai',
    region: 'global',
    language: 'en',
    enabled: true,
    priority: 85,
  },
  {
    id: 'bair-blog',
    name: 'BAIR Blog',
    url: 'https://bair.berkeley.edu/blog/feed.xml',
    type: 'rss',
    category: 'ai',
    region: 'global',
    language: 'en',
    enabled: true,
    priority: 90,
  },
  {
    id: 'google-research',
    name: 'Google Research',
    url: 'https://research.google/blog/rss/',
    type: 'rss',
    category: 'ai',
    region: 'global',
    language: 'en',
    enabled: true,
    priority: 95,
  },
  {
    id: 'mit-ai-news',
    name: 'MIT AI News',
    url: 'https://news.mit.edu/rss/topic/artificial-intelligence2',
    type: 'rss',
    category: 'ai',
    region: 'global',
    language: 'en',
    enabled: true,
    priority: 90,
  },
];

// Japanese Sources
const JAPANESE_SOURCES: NewsSource[] = [
  {
    id: 'itmedia',
    name: 'ITmedia',
    url: 'https://rss.itmedia.co.jp/rss/2.0/topstory.xml',
    type: 'rss',
    category: 'tech',
    region: 'japan',
    language: 'ja',
    enabled: true,
    priority: 85,
  },
];

// Chinese Sources
const CHINESE_SOURCES: NewsSource[] = [
  {
    id: 'techinasia-china',
    name: 'TechInChina',
    url: 'https://www.techinasia.com/tag/china/feed',
    type: 'rss',
    category: 'tech',
    region: 'china',
    language: 'en',
    enabled: true,
    priority: 85,
  },
];

export const NEWS_SOURCES = [
  ...GLOBAL_SOURCES,
  ...KOREAN_SOURCES,
  ...JAPANESE_SOURCES,
  ...CHINESE_SOURCES,
  ...AI_ML_SOURCES,
]; 