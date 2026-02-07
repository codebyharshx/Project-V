'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, subtotal, shipping, total } =
    useCartStore((state) => ({
      items: state.items,
      removeItem: state.removeItem,
      updateQuantity: state.updateQuantity,
      subtotal: state.subtotal(),
      shipping: state.shipping(),
      total: state.total(),
    }));

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="w-full min-h-screen bg-cream">
        <div className="px-6 lg:px-12 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="h-96 bg-warm-gray/10 rounded-lg animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm font-inter text-charcoal/60">
            <Link href="/" className="hover:text-charcoal transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-charcoal">Shopping Cart</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-border px-6 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal">
            Shopping Cart
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2">
            {items.length === 0 ? (
              // Empty Cart State
              <div className="bg-white rounded-lg border border-border p-12 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto">
                    <ArrowRight className="text-sage/40" size={32} />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-charcoal mb-3">
                  Your Cart is Empty
                </h2>
                <p className="text-charcoal/60 font-inter mb-8">
                  Discover our collection of premium intimate wellness products.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-sage hover:bg-sage-dark text-white px-8 py-4 rounded-lg font-playfair font-semibold transition-colors duration-300"
                >
                  Continue Shopping
                  <ArrowRight size={20} />
                </Link>
              </div>
            ) : (
              // Cart Items Table
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-border p-6 flex gap-6"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-cream border border-border">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-sage-light to-sage" />
                        )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/shop/${item.slug}`}
                          className="text-lg font-playfair font-bold text-charcoal hover:text-sage transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-warm-gray font-inter mt-1">
                          {item.color}
                        </p>
                      </div>
                      <p className="text-lg font-playfair font-bold text-charcoal mt-2">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="p-2 hover:bg-cream transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} className="text-charcoal" />
                        </button>
                        <span className="px-4 font-inter font-semibold text-charcoal min-w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-cream transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} className="text-charcoal" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-28">
                        <p className="text-sm text-warm-gray font-inter mb-1">
                          Subtotal
                        </p>
                        <p className="text-lg font-playfair font-bold text-charcoal">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove from cart"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary - Right Column */}
          {items.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-border p-8 sticky top-20">
                <h2 className="text-2xl font-playfair font-bold text-charcoal mb-6">
                  Order Summary
                </h2>

                {/* Summary Lines */}
                <div className="space-y-4 pb-6 border-b border-border">
                  <div className="flex justify-between font-inter text-charcoal/70">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between font-inter text-charcoal/70">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-sage font-semibold">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {shipping === 0 && (
                    <p className="text-xs text-sage font-semibold">
                      You qualify for free shipping!
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="pt-6 mb-8">
                  <div className="flex justify-between mb-4">
                    <span className="font-playfair font-bold text-charcoal text-lg">
                      Total
                    </span>
                    <span className="font-playfair font-bold text-charcoal text-2xl">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="block w-full bg-sage hover:bg-sage-dark text-white py-4 rounded-lg font-playfair font-bold text-lg text-center transition-colors duration-300 mb-3"
                >
                  Proceed to Checkout
                </Link>

                {/* Continue Shopping Link */}
                <Link
                  href="/shop"
                  className="block w-full text-center py-3 border-2 border-sage text-sage hover:bg-sage/5 rounded-lg font-inter font-semibold transition-colors duration-300"
                >
                  Continue Shopping
                </Link>

                {/* Shipping Info */}
                <div className="mt-8 pt-8 border-t border-border space-y-3 text-xs font-inter text-charcoal/60">
                  <p>
                    <span className="font-semibold">Free shipping</span> on orders
                    over $50.
                  </p>
                  <p>
                    <span className="font-semibold">30-day returns</span> on all
                    products.
                  </p>
                  <p>
                    <span className="font-semibold">Discreet packaging</span> for
                    your privacy.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
