'use client';

import { useState } from 'react';

export default function DevQuickActions() {
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const quickActions = [
    {
      name: 'Test Login',
      action: () => {
        // Simulate login
        console.log('Dev: Simulating login...');
        window.location.href = '/chatbot';
      }
    },
    {
      name: 'Clear Local Storage',
      action: () => {
        localStorage.clear();
        console.log('Dev: Local storage cleared');
        alert('Local storage cleared!');
      }
    },
    {
      name: 'Toggle Dark Mode',
      action: () => {
        document.documentElement.classList.toggle('dark');
        console.log('Dev: Dark mode toggled');
      }
    },
    {
      name: 'Show Console Info',
      action: () => {
        console.log('=== DEV INFO ===');
        console.log('Current URL:', window.location.href);
        console.log('User Agent:', navigator.userAgent);
        console.log('Screen Size:', `${window.innerWidth}x${window.innerHeight}`);
        console.log('Local Storage Keys:', Object.keys(localStorage));
        console.log('================');
      }
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow-lg transition-all duration-200"
        title="Dev Quick Actions"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-48">
          <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Quick Actions</div>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.action();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              {action.name}
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
