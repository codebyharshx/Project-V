'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  imageUrl: string | null;
}

export default function SearchModal() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchOpen = useUIStore((state) => state.searchOpen);
  const toggleSearch = useUIStore((state) => state.toggleSearch);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        toggleSearch();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [searchOpen, toggleSearch]);

  // Search products
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.products || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleResultClick = (slug: string) => {
    toggleSearch();
    setQuery('');
    router.push(`/shop/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      toggleSearch();
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  if (!hasMounted || !searchOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => toggleSearch()}
      />

      {/* Modal */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <form onSubmit={handleSubmit} className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-12 py-4 text-lg font-inter text-charcoal placeholder-charcoal/40 border-b border-border focus:outline-none"
            />
            <button
              type="button"
              onClick={() => toggleSearch()}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-cream rounded-lg transition-colors"
            >
              <X size={20} className="text-charcoal/60" />
            </button>
          </form>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-sage" />
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleResultClick(product.slug)}
                    className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-cream transition-colors text-left"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg bg-cream overflow-hidden flex-shrink-0">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-sage-light to-sage" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-charcoal truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-charcoal/60 capitalize">
                        {product.category}
                      </p>
                    </div>

                    {/* Price */}
                    <span className="font-semibold text-charcoal">
                      ${product.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="py-8 text-center">
                <p className="text-charcoal/60 font-inter">
                  No products found for "{query}"
                </p>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-charcoal/60 font-inter">
                  Start typing to search products...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
