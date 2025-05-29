'use client';

import { useEffect, useState } from 'react';
import { fetchNews } from '@/lib/newsService';
import type { NewsArticle } from '@/lib/newsService';
import { useStore } from '@/lib/store';
import NewsCard from './NewsCard';

export default function NewsFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const { selectedCategory } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('[NewsFeed] Fetching articles...');
        const fetchedArticles = await fetchNews();
        console.log(`[NewsFeed] Fetched ${fetchedArticles.length} articles`);
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('[NewsFeed] Error loading articles:', error);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    loadArticles();
  }, []);

  const filteredArticles = articles.filter(article => {
    if (selectedCategory === 'all') return true;
    return article.categories.includes(selectedCategory);
  });

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] px-4">
        <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-2 sm:p-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="w-full sm:w-32 aspect-[16/9] sm:aspect-square bg-gray-700/50 rounded-md" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700/50 rounded w-3/4" />
                  <div className="h-3 bg-gray-700/50 rounded w-full" />
                  <div className="h-3 bg-gray-700/50 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px] px-4">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No articles found in the {selectedCategory} category.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
} 