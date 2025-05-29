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

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const fetchedArticles = await fetchNews();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error loading articles:', error);
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

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-40 aspect-[16/9] sm:aspect-square bg-gray-700 rounded-md" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-700 rounded w-full" />
                  <div className="h-3 bg-gray-700 rounded w-2/3" />
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
      <div className="text-center py-8 px-4 sm:px-6">
        <p className="text-gray-600 dark:text-gray-400">
          No articles found in the {selectedCategory} category.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6">
      <div className="grid gap-4 sm:gap-6">
        {filteredArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
} 