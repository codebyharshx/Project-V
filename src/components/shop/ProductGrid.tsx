'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  columns?: 1 | 2 | 3 | 4;
  showViewAll?: boolean;
  title?: string;
  subtitle?: string;
}

export default function ProductGrid({
  products,
  columns = 3,
  showViewAll = true,
  title,
  subtitle,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <section className="w-full bg-cream py-12 md:py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-charcoal mb-4">
              No Products Found
            </h2>
            <p className="text-charcoal/60 font-inter mb-8">
              Try adjusting your filters or browse our full collection.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-sage hover:bg-sage-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              View All Products
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="w-full bg-cream py-12 md:py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {title && (
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-charcoal mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-charcoal/70 font-inter text-lg">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className={`grid ${gridCols[columns]} gap-6 md:gap-8 mb-12`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Link */}
        {showViewAll && (
          <div className="flex justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-sage hover:bg-sage-dark text-white px-8 py-4 rounded-lg font-playfair font-semibold text-lg transition-all duration-300 hover:gap-5"
            >
              View All Products
              <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
