'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'featured';
}

export default function ProductCard({
  product,
  variant = 'grid',
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const wishlistItems = useWishlistStore((state) => state.items);

  const isFavorited = wishlistItems.includes(Number(product.id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const quantity = 1;
    addItem({
      id: Number(product.id),
      name: product.name,
      price: Number(product.price),
      quantity,
      imageUrl: product.image || null,
      color: product.category,
      icon: 'package',
      slug: product.slug,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(Number(product.id));
  };

  // Generate gradient as fallback when no image
  const getGradientColor = () => {
    const colorMap: { [key: string]: string } = {
      vibrators: 'from-blush-light to-blush',
      wellness: 'from-sage-light to-sage',
      intimacy: 'from-blush to-blush-dark',
      'self-care': 'from-sage to-sage-dark',
    };
    return colorMap[product.category.toLowerCase()] || 'from-cream-dark to-warm-gray';
  };

  const badgeStyles = {
    Bestseller: 'bg-green-500 text-white',
    Sale: 'bg-red-500 text-white',
    New: 'bg-blue-500 text-white',
    Popular: 'bg-gold text-charcoal',
  };

  const getBadgeLabel = () => {
    if (product.featured) return 'Bestseller';
    if (product.originalPrice && Number(product.originalPrice) > Number(product.price)) return 'Sale';
    if (product.new) return 'New';
    return null;
  };

  const badgeLabel = getBadgeLabel();

  return (
    <Link href={`/shop/${product.slug}`}>
      <div
        className={`group relative overflow-hidden rounded-lg bg-cream cursor-pointer transition-all duration-300 ${
          variant === 'featured'
            ? 'col-span-2 row-span-2'
            : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br mb-4">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${getGradientColor()}`}
            />
          )}

          {/* Badge Overlay */}
          {badgeLabel && (
            <div
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                badgeStyles[badgeLabel as keyof typeof badgeStyles] ||
                'bg-gold text-charcoal'
              }`}
            >
              {badgeLabel}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Add to wishlist"
          >
            <Heart
              size={20}
              className={`transition-colors duration-300 ${
                isFavorited
                  ? 'fill-blush stroke-blush'
                  : 'stroke-charcoal fill-none'
              }`}
            />
          </button>

          {/* Add to Cart Button - visible on hover */}
          {isHovered && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-4 left-4 right-4 bg-sage hover:bg-sage-dark text-white py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-300 animate-fadeUp"
            >
              Add to Cart
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="px-4 pb-4">
          {/* Category */}
          <p className="text-xs uppercase font-inter font-semibold text-warm-gray mb-2">
            {product.category}
          </p>

          {/* Name */}
          <h3 className="text-lg font-playfair font-bold text-charcoal mb-3 line-clamp-2 group-hover:text-sage transition-colors duration-300">
            {product.name}
          </h3>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(product.rating)
                      ? 'fill-gold stroke-gold'
                      : 'stroke-warm-gray fill-none'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-warm-gray font-inter">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-playfair font-bold text-charcoal">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <span className="text-sm text-warm-gray line-through font-inter">
                ${Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Card Lift Shadow on Hover */}
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
            isHovered ? 'shadow-xl' : ''
          }`}
        />
      </div>
    </Link>
  );
}
