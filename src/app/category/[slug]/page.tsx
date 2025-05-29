import { Suspense } from 'react';
import { fetchNews } from '@/lib/newsService';
import NewsCard from '@/components/NewsCard';
import { notFound } from 'next/navigation';

const VALID_CATEGORIES = ['ai', 'tech', 'science', 'economics'];

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

async function CategoryContent({ category }: { category: string }) {
  const articles = await fetchNews();
  const filteredArticles = articles.filter(article => 
    category === 'all' ? true : article.categories.includes(category)
  );

  if (filteredArticles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          No articles found in this category.
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

function CategorySkeleton() {
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

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = params.slug.toLowerCase();

  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  const categoryTitles: Record<string, string> = {
    ai: 'AI & Machine Learning',
    tech: 'Technology',
    science: 'Tech Science',
    economics: 'Tech Business',
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{categoryTitles[category]}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Latest news and updates in {categoryTitles[category].toLowerCase()}
        </p>
      </div>

      <Suspense fallback={<CategorySkeleton />}>
        <CategoryContent category={category} />
      </Suspense>
    </div>
  );
} 