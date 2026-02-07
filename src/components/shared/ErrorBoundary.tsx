"use client";

import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught:", error, errorInfo);
    }

    // Send to error tracking service in production
    if (process.env.NODE_ENV === "production") {
      // Example: sendToErrorTracking(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-cream flex items-center justify-center px-4">
            <div className="max-w-md text-center">
              <h1 className="text-4xl font-serif font-bold text-charcoal mb-4">
                Something Went Wrong
              </h1>
              <p className="text-lg text-charcoal/70 mb-6">
                We encountered an unexpected error. Please try refreshing the
                page.
              </p>
              {process.env.NODE_ENV === "development" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left text-sm text-red-600 font-mono overflow-auto max-h-48 mb-6">
                  <p className="font-bold mb-2">Error Details:</p>
                  <p>{this.state.error?.message}</p>
                </div>
              )}
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-sage text-cream font-medium rounded-lg hover:bg-sage/90 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
