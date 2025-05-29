"use client";

import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Fixed width container for the entire site */}
      <div className="flex flex-col min-h-screen max-w-[1920px] mx-auto w-full bg-white dark:bg-gray-800 shadow-xl dark:shadow-2xl border-x border-gray-200 dark:border-gray-700">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout; 