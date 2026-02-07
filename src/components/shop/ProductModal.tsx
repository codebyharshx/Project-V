'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Star, Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { Product } from '@/types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
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
    setQuantity(1);
    onClose();
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-charcoal/40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center px-4 md:px-6 transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-300 ${
            isOpen ? 'scale-100' : 'scale-95'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Close modal"
          >
            <X size={24} className="text-charcoal" />
          </button>

          {/* Modal Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Left: Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-cream">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-sage-light to-sage" />
              )}
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col justify-between">
              {/* Header Info */}
              <div>
                <p className="text-xs uppercase font-inter font-semibold text-warm-gray mb-3">
                  {product.category}
                </p>

                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal mb-4">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < Math.floor(product.rating)
                            ? 'fill-gold stroke-gold'
                            : 'stroke-warm-gray fill-none'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-warm-gray font-inter">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-playfair font-bold text-charcoal">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                    <span className="text-lg text-warm-gray line-through font-inter">
                      ${Number(product.originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-charcoal/70 font-inter text-base mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Features */}
                {product.benefits && product.benefits.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-playfair font-semibold text-charcoal mb-3">
                      Key Benefits
                    </h3>
                    <ul className="space-y-2">
                      {product.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-charcoal/70 font-inter text-sm"
                        >
                          <span className="text-sage font-bold mt-1">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-6 border-t border-border">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="font-inter font-semibold text-charcoal">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-2 hover:bg-cream transition-colors duration-200"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} className="text-charcoal" />
                    </button>
                    <span className="px-6 font-inter font-semibold text-charcoal">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-2 hover:bg-cream transition-colors duration-200"
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} className="text-charcoal" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-sage hover:bg-sage-dark text-white py-4 rounded-lg font-playfair font-bold text-lg transition-colors duration-300"
                >
                  Add to Cart
                </button>

                {/* View Full Details Link */}
                <Link
                  href={`/shop/${product.slug}`}
                  className="block text-center py-3 border border-sage text-sage hover:bg-sage/5 rounded-lg font-inter font-semibold transition-colors duration-300"
                  onClick={onClose}
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
