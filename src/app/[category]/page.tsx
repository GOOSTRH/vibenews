import { Suspense } from 'react';
import { fetchNews } from '@/lib/newsService';
import NewsCard from '@/components/NewsCard';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

const VALID_CATEGORIES = ['world', 'politics', 'business', 'technology', 'culture'] as const;
type Category = typeof VALID_CATEGORIES[number];

const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  world: 'Global tech trends and international technology developments',
  politics: 'Tech policy, digital regulations, and government initiatives',
  business: 'Tech industry news, startups, and market developments',
  technology: 'Latest innovations, product launches, and tech breakthroughs',
  culture: 'Digital transformation and technology\'s impact on society',
};

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// Validate and normalize category
function validateCategory(category: string): Category | null {
  const normalized = category.toLowerCase() as Category;
  return VALID_CATEGORIES.includes(normalized) ? normalized : null;
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="text-center py-8">
      <div className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">
          {message}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ category }: { category: Category }) {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-2">No Articles Found</h2>
        <p className="text-gray-600 dark:text-gray-400">
          No tech-related articles found in the {category} category. Please check back later.
        </p>
      </div>
    </div>
  );
}

async function CategoryContent({ category }: { category: Category }) {
  try {
    const articles = await fetchNews();
    const filteredArticles = articles.filter(article => 
      article.categories.includes(category)
    );

    if (filteredArticles.length === 0) {
      return <EmptyState category={category} />;
    }

    return (
      <div className="grid gap-6">
        {filteredArticles.map((article) => (
          <NewsCard 
            key={article.id} 
            article={{
              ...article,
              // Ensure valid date format for SSR
              pubDate: article.pubDate || new Date().toISOString(),
            }} 
          />
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error in CategoryContent:', error);
    return (
      <ErrorMessage 
        message="Error loading articles. Please try again later." 
      />
    );
  }
}

function CategorySkeleton() {
  return (
    <div className="grid gap-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex gap-4">
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Force dynamic rendering to prevent hydration issues
  headers();
  
  const validCategory = validateCategory(params.category);
  
  if (!validCategory) {
    notFound();
  }

  const title = validCategory.charAt(0).toUpperCase() + validCategory.slice(1);

  return (
    <div className="min-h-screen">
      <div className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{title}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {CATEGORY_DESCRIPTIONS[validCategory]}
          </p>
        </div>

        <Suspense fallback={<CategorySkeleton />}>
          <CategoryContent category={validCategory} />
        </Suspense>
      </div>
    </div>
  );
} 