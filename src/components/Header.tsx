"use client";
import Link from 'next/link'
import React, { useState } from 'react';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  const mainCategories = [
    { name: 'World', href: '/category/world' },
    { name: 'Politics', href: '/category/politics' },
    { name: 'Business', href: '/category/business' },
    { name: 'Technology', href: '/category/technology' },
    { name: 'Science', href: '/category/science' },
    { name: 'Culture', href: '/category/culture' },
  ]

  const topicCategories = [
    { name: 'Climate', href: '/topic/climate' },
    { name: 'AI & Tech', href: '/topic/ai-tech' },
    { name: 'Healthcare', href: '/topic/healthcare' },
    { name: 'Education', href: '/topic/education' },
    { name: 'Economics', href: '/topic/economics' },
  ]

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white">
        <div className="container py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <Link href="/subscribe" className="hover:text-blue-400 transition-colors">
                Subscribe
              </Link>
              <Link href="/signin" className="hover:text-blue-400 transition-colors">
                Sign In
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hover:text-blue-400 transition-colors flex items-center space-x-1"
              >
                <SearchIcon />
                <span>Search</span>
              </button>
              <select className="bg-transparent border-none text-sm hover:text-blue-400 cursor-pointer focus:outline-none">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar - Shown when search is open */}
      {isSearchOpen && (
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="container py-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search articles..."
                className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="container py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-4xl font-bold">
              <span className="text-blue-600">Vibe</span>
              <span>News</span>
            </h1>
          </Link>
          <div className="hidden lg:flex items-center space-x-6">
            <Link 
              href="/subscribe" 
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Subscribe Now
            </Link>
            <Link 
              href="/newsletter" 
              className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Newsletters
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="border-t border-gray-200 dark:border-gray-800">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {mainCategories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="py-4 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors relative group"
                >
                  {category.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform" />
                </Link>
              ))}
            </div>
            <button className="lg:hidden">
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* Topics Bar */}
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container">
          <div className="flex items-center space-x-6 text-sm py-2 overflow-x-auto">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Topics:</span>
            {topicCategories.map((topic) => (
              <Link
                key={topic.name}
                href={topic.href}
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 whitespace-nowrap transition-colors"
              >
                {topic.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

const SearchIcon = ({ className = "w-4 h-4" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
)

const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
)

export default Header 