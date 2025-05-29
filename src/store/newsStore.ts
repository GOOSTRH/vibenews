import { create } from 'zustand';
import type { NewsArticle } from '@/lib/newsService';

interface NewsStore {
  articles: NewsArticle[];
  activeCategory: string;
  setArticles: (articles: NewsArticle[]) => void;
  setActiveCategory: (category: string) => void;
  filteredArticles: () => NewsArticle[];
}

export const useNewsStore = create<NewsStore>((set, get) => ({
  articles: [],
  activeCategory: 'all',
  setArticles: (articles) => set({ articles }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  filteredArticles: () => {
    const { articles, activeCategory } = get();
    if (activeCategory === 'all') {
      return articles;
    }
    return articles.filter((article) => 
      article.categories.includes(activeCategory)
    );
  },
})); 