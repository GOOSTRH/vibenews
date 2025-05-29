import { Suspense } from 'react';
import { fetchNews } from '@/lib/newsService';
import { format } from 'date-fns';
import Image from 'next/image';
import type { NewsArticle } from '@/lib/newsService';
import NewsSection from '@/components/NewsSectionClient';

async function generateDailySummary(articles: NewsArticle[]) {
  // Group articles by category for analysis
  const categories = articles.reduce((acc, article) => {
    article.categories.forEach((category: string) => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(article);
    });
    return acc;
  }, {} as Record<string, NewsArticle[]>);

  // Get stories by category
  const aiStories = categories['ai'] || [];
  const techStories = categories['tech'] || [];
  const businessStories = categories['business'] || [];
  const worldStories = categories['world'] || [];
  const politicsStories = categories['politics'] || [];
  const scienceStories = categories['science'] || [];
  
  // Sort all stories by date for trending analysis
  const allStories = [...articles].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  // Get featured story (most recent AI or tech story with an image)
  const featuredStory = allStories.find(story => 
    (story.categories.includes('ai') || story.categories.includes('tech')) && story.thumbnail
  ) || allStories[0];

  // Generate regional insights
  const asianTechNews = allStories.filter(story => 
    ['korea', 'japan', 'china'].includes(story.region || '')
  ).slice(0, 4);

  return {
    date: format(new Date(), 'MMMM d, yyyy'),
    featuredStory,
    aiTrends: aiStories.slice(0, 4),
    techTrends: techStories.slice(0, 4),
    businessTrends: businessStories.slice(0, 3),
    worldTrends: worldStories.slice(0, 3),
    politicsTrends: politicsStories.slice(0, 3),
    scienceTrends: scienceStories.slice(0, 3),
    asianTechNews
  };
}

function TodaySkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6" />
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-6" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
      </div>
    </div>
  );
}

// Server Component
async function TodayContent() {
  const articles = await fetchNews();
  const summary = await generateDailySummary(articles);

  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <header className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-4xl font-bold mb-3">Tech Pulse: Daily Briefing</h1>
        <time className="text-gray-600 dark:text-gray-400 text-lg">{summary.date}</time>
      </header>

      {summary.featuredStory.thumbnail && (
        <div className="relative aspect-[2/1] mb-8 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={summary.featuredStory.thumbnail}
            alt={summary.featuredStory.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">{summary.featuredStory.title}</h2>
            <p className="text-sm opacity-90">Source: {summary.featuredStory.source}</p>
          </div>
        </div>
      )}

      <NewsSection title="AI & Machine Learning" articles={summary.aiTrends} />
      <NewsSection title="Tech Innovation" articles={summary.techTrends} />
      <NewsSection title="Asian Tech Insights" articles={summary.asianTechNews} />
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <NewsSection title="Business & Markets" articles={summary.businessTrends} />
          <NewsSection title="Global Tech Impact" articles={summary.worldTrends} />
        </div>
        <div>
          <NewsSection title="Tech Policy" articles={summary.politicsTrends} />
          <NewsSection title="Science & Research" articles={summary.scienceTrends} />
        </div>
      </div>

      <section className="mt-12 p-6 bg-blue-900/20 rounded-xl">
        <h2 className="text-2xl font-bold mb-6">Key Takeaways</h2>
        <ul className="space-y-4 text-lg">
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 mt-2 mr-3 bg-blue-400 rounded-full"></span>
            <div>
              <strong className="text-blue-200">AI Developments:</strong>
              <span className="opacity-90"> {summary.aiTrends[0]?.title}</span>
            </div>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 mt-2 mr-3 bg-blue-400 rounded-full"></span>
            <div>
              <strong className="text-blue-200">Tech Innovation:</strong>
              <span className="opacity-90"> {summary.techTrends[0]?.title}</span>
            </div>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 mt-2 mr-3 bg-blue-400 rounded-full"></span>
            <div>
              <strong className="text-blue-200">Asian Markets:</strong>
              <span className="opacity-90"> {summary.asianTechNews[0]?.title}</span>
            </div>
          </li>
        </ul>
      </section>

      <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This briefing is automatically curated from today's most significant tech news stories. 
          For detailed coverage, click through to the individual articles in our main feed.
        </p>
      </footer>
    </article>
  );
}

// Page Component
export default function TodayPage() {
  return (
    <div className="container max-w-4xl py-6">
      <Suspense fallback={<TodaySkeleton />}>
        <TodayContent />
      </Suspense>
    </div>
  );
} 