"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
      {/* Decorative element */}
      <div className="mb-8">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-red-300"
        >
          <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="2" />
          <path d="M30 30 L50 50" stroke="currentColor" strokeWidth="3" />
          <path d="M50 30 L30 50" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-4 text-center">
        Something Went Wrong
      </h1>

      {/* Error message (dev mode) */}
      {process.env.NODE_ENV === "development" && error.message && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mb-6 text-center">
          <p className="text-sm text-red-600 font-mono">{error.message}</p>
        </div>
      )}

      {/* Description */}
      <p className="text-lg text-charcoal/70 text-center max-w-md mb-8">
        We encountered an unexpected error. Please try again or return to the home
        page.
      </p>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-8 py-3 bg-sage text-cream font-medium rounded-lg hover:bg-sage/90 transition-colors"
        >
          Try Again
        </button>
        <a
          href="/"
          className="px-8 py-3 border-2 border-sage text-sage font-medium rounded-lg hover:bg-sage/5 transition-colors text-center"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
