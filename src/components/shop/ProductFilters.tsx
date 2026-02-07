'use client';

import { useEffect, useState } from 'react';

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  productCount: number;
}

const categoryLabels: { [key: string]: string } = {
  all: 'All',
  vibrators: 'Vibrators',
  wellness: 'Wellness',
  intimacy: 'Intimacy',
  'self-care': 'Self-Care',
};

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductFilters({
  categories,
  selectedCategory,
  sortBy,
  onCategoryChange,
  onSortChange,
  productCount,
}: ProductFiltersProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const filterElement = document.getElementById('product-filters');
      if (filterElement) {
        const offset = window.scrollY > 100;
        setIsSticky(offset);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const allCategories = ['all', ...categories];

  return (
    <div
      id="product-filters"
      className={`transition-all duration-300 ${
        isSticky
          ? 'sticky top-0 z-40 shadow-md'
          : ''
      }`}
    >
      <div className="w-full bg-cream border-b border-border px-6 lg:px-12 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Category Pills */}
          <div className="mb-6 md:mb-0 md:flex md:items-center md:justify-between gap-6 flex-wrap">
            {/* Categories */}
            <div className="flex flex-wrap gap-3 items-center">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`px-4 py-2 rounded-full font-inter font-semibold text-sm transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-sage text-white shadow-md'
                      : 'bg-white text-charcoal border border-border hover:border-sage hover:bg-sage-light/20'
                  }`}
                >
                  {categoryLabels[category] || category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="sort-select"
                className="text-sm font-inter font-semibold text-charcoal whitespace-nowrap"
              >
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="px-4 py-2 bg-white border border-border rounded-lg font-inter text-sm text-charcoal focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors duration-300 cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Count */}
          <div className="text-sm text-warm-gray font-inter mt-4 md:mt-0">
            Showing {productCount} {productCount === 1 ? 'product' : 'products'}
          </div>
        </div>
      </div>
    </div>
  );
}
