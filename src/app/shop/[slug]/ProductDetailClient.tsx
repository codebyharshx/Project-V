'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, Minus, Plus, Star, Check, Truck, RotateCcw, Package } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import ProductGrid from '@/components/shop/ProductGrid';
import { Product, Review } from '@/types';

interface ProductDetailClientProps {
  product: Product & { reviews: Review[] };
  relatedProducts: Product[];
}

type TabType = 'description' | 'reviews' | 'shipping';

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  // State
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [reviewPage, setReviewPage] = useState(1);
  const [imageZoom, setImageZoom] = useState(false);

  // Store
  const addItem = useCartStore((state) => state.addItem);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const wishlistItems = useWishlistStore((state) => state.items);

  const isFavorited = wishlistItems.includes(Number(product.id));
  const reviewsPerPage = 5;
  const totalReviewPages = Math.ceil((product.reviews?.length || 0) / reviewsPerPage);
  const paginatedReviews = product.reviews?.slice(
    (reviewPage - 1) * reviewsPerPage,
    reviewPage * reviewsPerPage
  ) || [];

  // Handlers
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: Number(product.id),
      name: product.name,
      price: Number(product.price),
      quantity,
      imageUrl: product.imageUrl || null,
      color: product.category,
      icon: 'package',
      slug: product.slug,
    });
    setQuantity(1);
  };

  const handleWishlistToggle = () => {
    toggleItem(Number(product.id));
  };

  // Rating display
  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={20}
          className={
            i < Math.floor(rating)
              ? 'fill-gold stroke-gold'
              : 'stroke-warm-gray fill-none'
          }
        />
      ))}
    </div>
  );

  return (
    <main className="w-full bg-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm font-inter text-charcoal/60">
            <Link href="/" className="hover:text-charcoal transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-charcoal transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-charcoal">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="px-6 lg:px-12 py-12 md:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left: Product Image */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div
              className="relative aspect-square overflow-hidden rounded-lg bg-cream border border-border cursor-zoom-in"
              onMouseEnter={() => setImageZoom(true)}
              onMouseLeave={() => setImageZoom(false)}
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className={`object-cover transition-transform duration-300 ${
                    imageZoom ? 'scale-150' : 'scale-100'
                  }`}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-sage-light to-sage flex items-center justify-center">
                  <Package size={80} className="text-sage-dark/20" />
                </div>
              )}
            </div>

            {/* Thumbnail Strip - if multiple images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 rounded-lg bg-cream border border-border overflow-hidden cursor-pointer hover:border-sage transition-colors"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col justify-between">
            {/* Header Info */}
            <div>
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-sage/10 text-sage rounded-full text-xs font-semibold uppercase">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <RatingStars rating={product.rating} />
                <span className="text-sm text-warm-gray font-inter">
                  {product.rating} ({product.reviewCount}{' '}
                  {product.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-playfair font-bold text-charcoal">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                    <span className="text-lg text-warm-gray line-through font-inter">
                      ${Number(product.originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>
                {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                  <p className="text-sm text-sage font-semibold">
                    Save{' '}
                    {Math.round(
                      ((Number(product.originalPrice) - Number(product.price)) /
                        Number(product.originalPrice)) *
                        100
                    )}
                    %
                  </p>
                )}
              </div>

              {/* Short Description */}
              <p className="text-charcoal/70 font-inter text-base mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Features List */}
              {(product.benefits?.length || 0) > 0 && (
                <div className="mb-8">
                  <h3 className="font-playfair font-semibold text-charcoal mb-4 text-lg">
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {product.benefits?.map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-charcoal/70 font-inter text-sm"
                      >
                        <Check
                          size={20}
                          className="text-sage flex-shrink-0 mt-0.5"
                        />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-8">
                <p
                  className={`text-sm font-semibold ${
                    product.inStock ? 'text-sage' : 'text-red-500'
                  }`}
                >
                  {product.inStock ? '✓ In Stock' : 'Out of Stock'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-8 border-t border-border">
              {/* Quantity Selector */}
              <div className="flex items-center gap-6">
                <span className="font-inter font-semibold text-charcoal whitespace-nowrap">
                  Quantity:
                </span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-3 hover:bg-cream transition-colors duration-200"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={18} className="text-charcoal" />
                  </button>
                  <span className="px-6 font-inter font-semibold text-charcoal min-w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-3 hover:bg-cream transition-colors duration-200"
                    aria-label="Increase quantity"
                  >
                    <Plus size={18} className="text-charcoal" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-sage hover:bg-sage-dark disabled:bg-warm-gray disabled:cursor-not-allowed text-white py-4 rounded-lg font-playfair font-bold text-lg transition-colors duration-300"
              >
                Add to Cart
              </button>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className="w-full flex items-center justify-center gap-2 border-2 border-sage text-sage hover:bg-sage/5 py-3 rounded-lg font-inter font-semibold transition-colors duration-300"
              >
                <Heart
                  size={20}
                  className={`transition-colors duration-300 ${
                    isFavorited ? 'fill-sage' : ''
                  }`}
                />
                {isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 mt-8 border-t border-border">
                <div className="text-center">
                  <Truck size={24} className="text-sage mx-auto mb-2" />
                  <p className="text-xs font-inter font-semibold text-charcoal">
                    Free Shipping
                  </p>
                  <p className="text-xs text-warm-gray">Orders over $50</p>
                </div>
                <div className="text-center">
                  <RotateCcw size={24} className="text-sage mx-auto mb-2" />
                  <p className="text-xs font-inter font-semibold text-charcoal">
                    30-Day Returns
                  </p>
                  <p className="text-xs text-warm-gray">Hassle-free</p>
                </div>
                <div className="text-center">
                  <Package size={24} className="text-sage mx-auto mb-2" />
                  <p className="text-xs font-inter font-semibold text-charcoal">
                    Discreet Packaging
                  </p>
                  <p className="text-xs text-warm-gray">Private delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="px-6 lg:px-12 py-12 border-t border-border">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex gap-8 border-b border-border mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 font-inter font-semibold transition-colors duration-300 border-b-2 ${
                activeTab === 'description'
                  ? 'text-sage border-sage'
                  : 'text-charcoal/60 border-transparent hover:text-charcoal'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 font-inter font-semibold transition-colors duration-300 border-b-2 ${
                activeTab === 'reviews'
                  ? 'text-sage border-sage'
                  : 'text-charcoal/60 border-transparent hover:text-charcoal'
              }`}
            >
              Reviews ({product.reviewCount})
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 font-inter font-semibold transition-colors duration-300 border-b-2 ${
                activeTab === 'shipping'
                  ? 'text-sage border-sage'
                  : 'text-charcoal/60 border-transparent hover:text-charcoal'
              }`}
            >
              Shipping Info
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-w-3xl">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-charcoal/70 font-inter leading-relaxed whitespace-pre-wrap">
                    {product.longDescription}
                  </p>
                </div>

                {/* Ingredients */}
                {product.ingredients && product.ingredients.length > 0 && (
                  <div>
                    <h3 className="font-playfair font-semibold text-charcoal text-xl mb-4">
                      Ingredients
                    </h3>
                    <ul className="space-y-2">
                      {product.ingredients.map((ingredient, idx) => (
                        <li
                          key={idx}
                          className="text-charcoal/70 font-inter text-sm"
                        >
                          • {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Product Specs */}
                <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-lg border border-border">
                  {product.volume && (
                    <div>
                      <p className="text-xs uppercase font-semibold text-warm-gray mb-1">
                        Volume
                      </p>
                      <p className="font-inter text-charcoal">{product.volume}</p>
                    </div>
                  )}
                  {product.weight && (
                    <div>
                      <p className="text-xs uppercase font-semibold text-warm-gray mb-1">
                        Weight
                      </p>
                      <p className="font-inter text-charcoal">{product.weight}</p>
                    </div>
                  )}
                  {product.skinType && product.skinType.length > 0 && (
                    <div>
                      <p className="text-xs uppercase font-semibold text-warm-gray mb-1">
                        Skin Types
                      </p>
                      <p className="font-inter text-charcoal">
                        {product.skinType.join(', ')}
                      </p>
                    </div>
                  )}
                  {product.scent && (
                    <div>
                      <p className="text-xs uppercase font-semibold text-warm-gray mb-1">
                        Scent
                      </p>
                      <p className="font-inter text-charcoal">{product.scent}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {paginatedReviews.length > 0 ? (
                  <>
                    {paginatedReviews.map((review) => (
                      <div
                        key={review.id}
                        className="pb-6 border-b border-border last:border-b-0"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-playfair font-semibold text-charcoal">
                              {review.title}
                            </p>
                            <p className="text-sm text-warm-gray font-inter mt-1">
                              by {review.author}
                            </p>
                          </div>
                          {review.verified && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                              Verified Purchase
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < review.rating
                                    ? 'fill-gold stroke-gold'
                                    : 'stroke-warm-gray fill-none'
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm text-warm-gray font-inter">
                            {review.rating} out of 5
                          </span>
                        </div>

                        <p className="text-charcoal/70 font-inter leading-relaxed">
                          {review.content}
                        </p>

                        <p className="text-xs text-warm-gray font-inter mt-3">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}

                    {/* Review Pagination */}
                    {totalReviewPages > 1 && (
                      <div className="flex justify-center gap-2 pt-6">
                        <button
                          onClick={() =>
                            setReviewPage(Math.max(1, reviewPage - 1))
                          }
                          disabled={reviewPage === 1}
                          className="px-3 py-2 border border-border rounded text-sm font-inter disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <div className="flex items-center gap-2">
                          {Array.from({ length: totalReviewPages }).map(
                            (_, i) => (
                              <button
                                key={i + 1}
                                onClick={() => setReviewPage(i + 1)}
                                className={`w-8 h-8 rounded text-sm font-inter transition-colors ${
                                  reviewPage === i + 1
                                    ? 'bg-sage text-white'
                                    : 'border border-border hover:border-sage'
                                }`}
                              >
                                {i + 1}
                              </button>
                            )
                          )}
                        </div>
                        <button
                          onClick={() =>
                            setReviewPage(Math.min(totalReviewPages, reviewPage + 1))
                          }
                          disabled={reviewPage === totalReviewPages}
                          className="px-3 py-2 border border-border rounded text-sm font-inter disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-charcoal/60 font-inter text-center py-8">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>
            )}

            {/* Shipping Info Tab */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-playfair font-semibold text-charcoal text-lg mb-3">
                    Shipping & Delivery
                  </h3>
                  <p className="text-charcoal/70 font-inter leading-relaxed mb-4">
                    We offer fast, discreet shipping on all orders. Your package
                    will arrive in a plain, unmarked box for your privacy.
                  </p>
                  <ul className="space-y-3 text-charcoal/70 font-inter">
                    <li className="flex gap-3">
                      <span className="text-sage font-bold">•</span>
                      <span>
                        <strong>Standard Shipping:</strong> 3-5 business days
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-sage font-bold">•</span>
                      <span>
                        <strong>Express Shipping:</strong> 1-2 business days
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-sage font-bold">•</span>
                      <span>
                        <strong>Free Shipping:</strong> Orders over $50
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-cream p-6 rounded-lg border border-border">
                  <h3 className="font-playfair font-semibold text-charcoal mb-3">
                    Returns & Exchanges
                  </h3>
                  <p className="text-charcoal/70 font-inter leading-relaxed">
                    We stand behind our products. If you're not completely
                    satisfied, we offer a 30-day money-back guarantee. Items
                    must be in new, unused condition with original packaging.
                  </p>
                </div>

                <div className="bg-cream p-6 rounded-lg border border-border">
                  <h3 className="font-playfair font-semibold text-charcoal mb-3">
                    Discreet Packaging
                  </h3>
                  <p className="text-charcoal/70 font-inter leading-relaxed">
                    Your privacy is important to us. All orders are shipped in
                    plain packaging with no indication of contents on the outside
                    of the box. No company name, logos, or product descriptions
                    are visible.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="px-6 lg:px-12 py-12 md:py-20 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal mb-3">
                You Might Also Like
              </h2>
              <p className="text-charcoal/70 font-inter">
                Explore other products from the {product.category} category
              </p>
            </div>
            <ProductGrid
              products={relatedProducts}
              columns={4}
              showViewAll={false}
            />
          </div>
        </section>
      )}
    </main>
  );
}
