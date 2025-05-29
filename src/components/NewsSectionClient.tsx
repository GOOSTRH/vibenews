'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { NewsArticle } from '@/lib/newsService';

interface NewsSectionProps {
  title: string;
  articles: NewsArticle[];
}

export default function NewsSection({ title, articles }: NewsSectionProps) {
  if (!articles.length) return null;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">{title}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            {article.thumbnail && (
              <div className="relative aspect-[16/9]">
                <Image
                  src={article.thumbnail}
                  alt={article.title}
                  fill
                  className="object-cover transition-opacity group-hover:opacity-90"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 group-hover:text-blue-500">{article.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Source: {article.source} {article.region && `(${article.region})`}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {article.contentSnippet}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
} 