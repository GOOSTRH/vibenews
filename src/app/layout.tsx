import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "VibeNews - Tech News Aggregator",
  description: "Stay updated with the latest in technology news from around the world",
};

const NAVIGATION = [
  { name: 'World', href: '/world' },
  { name: 'Politics', href: '/politics' },
  { name: 'Business', href: '/business' },
  { name: 'Technology', href: '/technology' },
  { name: 'Culture', href: '/culture' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${inter.className} bg-[#121212] min-h-screen`}>
        <header className="bg-[#1e1e1e] border-b border-gray-800 sticky top-0 z-50">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Link href="/" className="text-xl font-bold text-white hover:text-blue-400">
                VibeNews
              </Link>
              <div className="flex flex-wrap gap-4 sm:gap-6 text-sm">
                {NAVIGATION.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </header>

        <main className="min-h-screen bg-[#121212]">
          <div className="container mx-auto px-4">
            <div className="max-w-screen-xl mx-auto bg-[#1e1e1e] min-h-screen">
              {children}
            </div>
          </div>
        </main>

        <footer className="bg-[#1e1e1e] border-t border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <p className="text-sm text-center text-gray-500">
              © {new Date().getFullYear()} VibeNews. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
