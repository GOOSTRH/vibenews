'use client';

import { useEffect, useState } from 'react';
import { fetchNews } from '@/lib/newsService';
import type { NewsArticle } from '@/lib/newsService';
import { useStore } from '@/lib/store';
import NewsCard from './NewsCard';

export default function NewsFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const { selectedCategory } = useStore();

  useEffect(() => {
    const loadArticles = async () => {
      const fetchedArticles = await fetchNews();
      setArticles(fetchedArticles);
    };
    loadArticles();
  }, []);

  const filteredArticles = articles.filter(article => {
    if (selectedCategory === 'all') return true;
    return article.categories.includes(selectedCategory);
  });

  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading articles...</p>
      </div>
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          No articles found in the {selectedCategory} category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {filteredArticles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
} 