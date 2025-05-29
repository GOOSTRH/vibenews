import { Suspense } from 'react';
import NewsFeed from '@/components/NewsFeed';
import NewsCategories from '@/components/NewsCategories';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Breaking news banner */}
      <div className="breaking-news">
        <div className="container">
          <div className="flex items-center justify-between">
            <span className="font-medium">Latest in Tech</span>
            <span className="animate-pulse text-xs">Live Updates</span>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Tech News & Analysis</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your curated source for the latest in technology, AI, and digital innovation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar with categories */}
          <div className="lg:col-span-1">
            <NewsCategories />
          </div>

          {/* Main content area */}
          <div className="lg:col-span-4">
            <Suspense fallback={<NewsSkeletonLoader />}>
              <NewsFeed />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsSkeletonLoader() {
  return (
    <div className="grid gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
