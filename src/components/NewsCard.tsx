'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import type { NewsArticle } from '@/lib/newsService';

interface NewsCardProps {
  article: NewsArticle;
}

const DEFAULT_IMAGE = '/images/tech-default.svg';
const FALLBACK_IMAGES = [
  '/images/tech-1.svg',
  '/images/tech-2.svg',
  '/images/tech-3.svg',
  '/images/tech-4.svg',
];

export default function NewsCard({ article }: NewsCardProps) {
  const [imageError, setImageError] = useState(false);
  const formattedDate = format(new Date(article.pubDate), 'MMM d, yyyy');
  
  // Get a deterministic fallback image based on the article ID
  const getFallbackImage = () => {
    if (!article.id) return DEFAULT_IMAGE;
    const index = article.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  };

  return (
    <Link 
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex flex-col sm:flex-row gap-3 p-3">
        <div className="w-full sm:w-40 flex-shrink-0">
          <div className="relative aspect-[16/9] sm:aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
            <Image
              src={imageError ? getFallbackImage() : (article.thumbnail || getFallbackImage())}
              alt={article.title}
              fill
              className="object-cover transition-opacity group-hover:opacity-90"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 160px"
              onError={() => setImageError(true)}
              priority={false}
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span className="font-medium">{article.source}</span>
            {article.region && (
              <>
                <span>•</span>
                <span>{article.region}</span>
              </>
            )}
            <span>•</span>
            <time>{formattedDate}</time>
          </div>
          
          <h2 className="text-base font-semibold leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
            {article.title}
          </h2>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
            {article.contentSnippet}
          </p>

          <div className="flex flex-wrap gap-1">
            {article.categories.map((category) => (
              <span
                key={category}
                className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
} 