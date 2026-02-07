'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ProductFilters from '@/components/shop/ProductFilters';
import ProductGrid from '@/components/shop/ProductGrid';
import ProductModal from '@/components/shop/ProductModal';
import { Product } from '@/types';

interface ShopPageClientProps {
  initialProducts: Product[];
  initialTotal: number;
  initialPage: number;
  initialCategory: string;
  initialSort: string;
  categories: string[];
}

const ITEMS_PER_PAGE = 12;

export default function ShopPageClient({
  initialProducts,
  initialTotal,
  initialPage,
  initialCategory,
  initialSort,
  categories,
}: ShopPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Update URL and fetch products
  const handleFiltersChange = async (
    newCategory?: string,
    newSort?: string,
    newPage?: number
  ) => {
    const category = newCategory ?? selectedCategory;
    const sort = newSort ?? sortBy;
    const page = newPage ?? currentPage;

    setSelectedCategory(category);
    setSortBy(sort);
    setCurrentPage(page);
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (sort !== 'featured') params.append('sort', sort);
      if (page > 1) params.append('page', page.toString());

      // Update URL
      const queryString = params.toString();
      const url = queryString ? `/shop?${queryString}` : '/shop';
      router.push(url);

      // Fetch products
      const response = await fetch(
        `/api/products?${new URLSearchParams({
          category,
          sort,
          page: page.toString(),
          limit: ITEMS_PER_PAGE.toString(),
        }).toString()}`
      );

      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      setProducts(data.products);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory !== selectedCategory) {
      handleFiltersChange(newCategory, sortBy, 1);
    }
  };

  const handleSortChange = (newSort: string) => {
    if (newSort !== sortBy) {
      handleFiltersChange(selectedCategory, newSort, 1);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage && newPage > 0 && newPage <= totalPages) {
      handleFiltersChange(selectedCategory, sortBy, newPage);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Open product modal
  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Render pagination controls
  const PaginationControls = () => {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        {/* Page Info */}
        <div className="text-center">
          <p className="text-charcoal font-inter text-sm">
            Showing page {currentPage} of {totalPages}
          </p>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-inter font-semibold text-charcoal hover:border-sage hover:text-sage disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 2 + i;
              }
              if (pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                  className={`w-10 h-10 rounded-lg font-inter font-semibold transition-colors duration-300 ${
                    pageNum === currentPage
                      ? 'bg-sage text-white'
                      : 'border border-border text-charcoal hover:border-sage hover:text-sage'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-inter font-semibold text-charcoal hover:border-sage hover:text-sage disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  // Render loading skeleton
  const SkeletonCard = () => (
    <div className="rounded-lg overflow-hidden bg-cream animate-pulse">
      <div className="aspect-square bg-warm-gray/20 mb-4" />
      <div className="px-4 pb-4 space-y-3">
        <div className="h-4 bg-warm-gray/20 rounded w-20" />
        <div className="h-5 bg-warm-gray/20 rounded w-3/4" />
        <div className="h-4 bg-warm-gray/20 rounded w-1/2" />
        <div className="h-5 bg-warm-gray/20 rounded w-1/3" />
      </div>
    </div>
  );

  return (
    <main className="w-full min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm font-inter text-charcoal/60">
            <a href="/" className="hover:text-charcoal transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-charcoal">Shop</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-cream border-b border-border px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal mb-2">
            Shop All Products
          </h1>
          <p className="text-charcoal/70 font-inter text-lg max-w-2xl">
            Discover our complete collection of premium intimate wellness
            products designed with care and backed by science.
          </p>
        </div>
      </div>

      {/* Filters */}
      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        productCount={total}
      />

      {/* Products Section */}
      <section className="px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                {products.map((product) => {
                  // Create a wrapper to add quick-view functionality
                  return (
                    <div key={product.id} className="group relative">
                      <div
                        onClick={() => openQuickView(product)}
                        className="absolute inset-0 z-10 flex items-center justify-center bg-charcoal/0 hover:bg-charcoal/20 transition-all duration-300 rounded-lg opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <button className="bg-white text-charcoal px-6 py-2 rounded-lg font-semibold hover:bg-sage hover:text-white transition-colors duration-300">
                          Quick View
                        </button>
                      </div>
                      <ProductGrid
                        products={[product]}
                        columns={1}
                        showViewAll={false}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <PaginationControls />
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-charcoal mb-4">
                No Products Found
              </h2>
              <p className="text-charcoal/60 font-inter mb-8">
                Try adjusting your filters or browse our full collection.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}
