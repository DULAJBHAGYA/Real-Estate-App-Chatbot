'use client';

import { useEffect } from 'react';

export default function HydrationSuppressor() {
  useEffect(() => {
    // Suppress hydration warnings from browser extensions
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0];
      if (
        typeof message === 'string' &&
        (message.includes('hydration') || 
         message.includes('server rendered HTML') ||
         message.includes('client properties'))
      ) {
        // Suppress hydration warnings
        return;
      }
      originalError.apply(console, args);
    };

    // Cleanup function
    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}
