'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DevNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
    { name: 'Chatbot', path: '/chatbot' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Floating Dev Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow-lg transition-all duration-200"
        title="Dev Navigation"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Floating Dev Panel */}
      {isOpen && (
        <div className="fixed top-16 left-4 z-40 bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-48">
          <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Dev Navigation</div>
          <div className="space-y-1">
            {pages.map((page) => (
              <Link
                key={page.path}
                href={page.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded text-sm font-medium transition-colors ${
                  pathname === page.path
                    ? 'bg-emerald-100 text-emerald-700 border-l-2 border-emerald-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page.name}
              </Link>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Current: {pathname}</div>
            <button
              onClick={() => {
                localStorage.clear();
                console.log('Dev: Local storage cleared');
              }}
              className="w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
            >
              Clear Storage
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
