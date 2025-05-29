'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';

const CATEGORIES = [
  { id: 'all', label: 'All Tech News' },
  { id: 'ai', label: 'AI & Machine Learning' },
  { id: 'tech', label: 'Technology' },
  { id: 'science', label: 'Tech Science' },
  { id: 'economics', label: 'Tech Business' },
];

export default function NewsCategories() {
  const { selectedCategory, setSelectedCategory } = useStore();

  return (
    <aside className="sticky top-4 space-y-6">
      {/* Today in Tech Button */}
      <Link
        href="/today"
        className="block w-full px-4 py-3 text-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
      >
        Today in Tech
      </Link>

      {/* Categories */}
      <div className="card p-4">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Categories
        </h2>
        <nav className="space-y-1">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                w-full text-left px-3 py-2 rounded-lg text-sm
                transition-colors duration-200
                ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {category.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Newsletter subscription */}
      <div className="card p-4 bg-gradient-to-br from-blue-500 to-blue-600">
        <h3 className="text-sm font-bold text-white mb-2">Stay Updated</h3>
        <p className="text-blue-100 text-xs mb-3">
          Get the latest tech news delivered to your inbox
        </p>
        <form className="space-y-2">
          <input
            type="email"
            placeholder="Your email"
            className="w-full px-3 py-2 text-xs rounded-lg bg-white/10 border border-blue-400 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="w-full px-3 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs font-medium"
          >
            Subscribe
          </button>
        </form>
      </div>
    </aside>
  );
} 