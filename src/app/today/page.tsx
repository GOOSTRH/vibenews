import { Suspense } from 'react';
import { fetchNews } from '@/lib/newsService';
import { format } from 'date-fns';
import Image from 'next/image';
import type { NewsArticle } from '@/lib/newsService';

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

  // Get top stories by category
  const aiStories = categories['ai'] || [];
  const techStories = categories['tech'] || [];
  const scienceStories = categories['science'] || [];
  
  // Sort all stories by date for trending analysis
  const allStories = [...articles].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  // Get featured story (most recent AI or tech story with an image)
  const featuredStory = allStories.find(story => 
    (story.categories.includes('ai') || story.categories.includes('tech')) && story.thumbnail
  ) || allStories[0];

  // Generate the main trends
  const mainTrends = allStories.slice(0, 3).map(story => ({
    title: story.title,
    source: story.source,
    link: story.link,
    image: story.thumbnail
  }));
  
  // Generate AI/ML focus
  const aiTrends = aiStories.slice(0, 2).map(story => ({
    title: story.title,
    source: story.source,
    link: story.link,
    image: story.thumbnail
  }));

  // Generate emerging tech
  const techTrends = techStories.slice(0, 2).map(story => ({
    title: story.title,
    source: story.source,
    link: story.link,
    image: story.thumbnail
  }));

  return {
    date: format(new Date(), 'MMMM d, yyyy'),
    featuredStory,
    mainTrends,
    aiTrends,
    techTrends
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

async function TodayContent() {
  const articles = await fetchNews();
  const summary = await generateDailySummary(articles);

  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tech Pulse: Daily Briefing</h1>
        <time className="text-gray-600 dark:text-gray-400">{summary.date}</time>
      </header>

      {summary.featuredStory.thumbnail && (
        <div className="relative aspect-[2/1] mb-8 rounded-lg overflow-hidden">
          <Image
            src={summary.featuredStory.thumbnail}
            alt={summary.featuredStory.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Today's Tech Landscape</h2>
        <p className="mb-4">
          In today's rapidly evolving tech landscape, several key developments are shaping the industry. 
          <strong>{
            summary.mainTrends[0]?.title.toLowerCase().startsWith('the') ? 
            summary.mainTrends[0].title : 'The ' + summary.mainTrends[0].title
          }</strong>. Meanwhile, <strong>{
            summary.mainTrends[1]?.title.toLowerCase().startsWith('the') ? 
            summary.mainTrends[1].title : 'the ' + summary.mainTrends[1].title
          }</strong>, highlighting the dynamic nature of technological advancement.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">AI and Innovation Spotlight</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          {summary.aiTrends.map((trend, i) => (
            <div key={i} className="relative">
              {trend.image && (
                <div className="relative aspect-[16/9] mb-3 rounded-lg overflow-hidden">
                  <Image
                    src={trend.image}
                    alt={trend.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h3 className="font-semibold mb-2">{trend.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Source: {trend.source}
              </p>
            </div>
          ))}
        </div>
        <p>
          The artificial intelligence sector continues to evolve, with notable developments in 
          <strong> {summary.aiTrends[0]?.title}</strong>. These advancements signal significant 
          progress in the field of AI and its practical applications.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Emerging Technologies</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          {summary.techTrends.map((trend, i) => (
            <div key={i} className="relative">
              {trend.image && (
                <div className="relative aspect-[16/9] mb-3 rounded-lg overflow-hidden">
                  <Image
                    src={trend.image}
                    alt={trend.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h3 className="font-semibold mb-2">{trend.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Source: {trend.source}
              </p>
            </div>
          ))}
        </div>
        <p>
          In the broader technology sector, <strong>{summary.techTrends[0]?.title}</strong>. 
          This development comes as tech companies continue to push boundaries and innovate 
          across multiple domains.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Key Takeaways</h2>
        <ul className="list-none pl-0 space-y-2">
          <li>
            <strong>AI and Machine Learning:</strong> Continued innovation across industries
          </li>
          <li>
            <strong>Emerging Tech:</strong> Reshaping market dynamics and business processes
          </li>
          <li>
            <strong>Industry Impact:</strong> Significant developments in {
              summary.mainTrends[2]?.title || 'technology adoption'
            }
          </li>
        </ul>
      </section>

      <footer className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This briefing is automatically curated from today's most significant tech news stories. 
          For detailed coverage, click through to the individual articles in our main feed.
        </p>
      </footer>
    </article>
  );
}

export default function TodayPage() {
  return (
    <div className="container max-w-3xl py-6">
      <Suspense fallback={<TodaySkeleton />}>
        <TodayContent />
      </Suspense>
    </div>
  );
} 