'use client';

import { useEffect, useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { Product } from '@/types';

const SUGGESTIONS = ['Vibrators', 'Self-Care', 'Wellness Guide', 'Intimacy', 'Gift Sets'];

export function SearchOverlay() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { searchOpen, toggleSearch } = useUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus search input when overlay opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [searchOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        toggleSearch();
        setSearchQuery('');
        setResults([]);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [searchOpen, toggleSearch]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.products || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const handleClose = () => {
    toggleSearch();
    setSearchQuery('');
    setResults([]);
  };

  if (!mounted || !searchOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-cream/95 backdrop-blur-md">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute right-6 top-6 rounded-full p-2 hover:bg-cream-dark transition-colors"
        aria-label="Close search"
      >
        <X className="h-6 w-6 text-charcoal" />
      </button>

      {/* Search Container */}
      <div className="flex flex-col h-full max-w-3xl mx-auto px-4 pt-20 pb-10">
        {/* Heading and Input */}
        <div className="mb-8">
          <h2 className="text-4xl font-serif font-bold text-charcoal mb-8 text-center">
            What are you looking for?
          </h2>

          {/* Search Input */}
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-lg border-2 border-charcoal/20 bg-white px-6 py-4 pl-12 text-lg text-charcoal placeholder-charcoal/50 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal/50" />
          </div>
        </div>

        {/* Suggestions or Results */}
        <div className="flex-1 overflow-y-auto">
          {!searchQuery.trim() ? (
            // Suggestions
            <div>
              <p className="text-sm font-medium text-charcoal/60 mb-4">
                Popular searches
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="inline-block rounded-full border border-charcoal/30 px-4 py-2 text-sm text-charcoal transition-all hover:bg-sage hover:text-cream hover:border-sage"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : isLoading ? (
            // Loading
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-4 h-8 w-8 border-4 border-sage/30 border-t-sage rounded-full animate-spin mx-auto" />
                <p className="text-charcoal/60">Searching...</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            // Results Grid
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((product) => (
                <a
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  onClick={handleClose}
                  className="group rounded-lg border border-charcoal/10 bg-white p-4 transition-all hover:border-sage hover:shadow-lg"
                >
                  <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-cream-dark">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-medium text-charcoal group-hover:text-sage transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-charcoal/60 mb-2">{product.category}</p>
                  <p className="font-semibold text-sage">${Number(product.price).toFixed(2)}</p>
                </a>
              ))}
            </div>
          ) : (
            // No Results
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="mb-4 h-12 w-12 text-charcoal/20" />
              <p className="text-lg font-medium text-charcoal mb-1">
                No products found
              </p>
              <p className="text-sm text-charcoal/60">
                Try searching for something else
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
