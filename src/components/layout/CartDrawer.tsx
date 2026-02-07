'use client';

import { useCartStore } from '@/stores/cart-store';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const subtotal = useCartStore((state) => state.subtotal());
  const shipping = useCartStore((state) => state.shipping());
  const total = useCartStore((state) => state.total());

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => toggleCart()}
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[420px] bg-cream z-50 transition-transform duration-300 transform shadow-lg ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-serif font-semibold text-charcoal">
              Your Bag ({items.length})
            </h2>
            <button
              onClick={() => toggleCart()}
              className="p-1.5 hover:bg-cream-dark rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <X size={20} className="text-charcoal" />
            </button>
          </div>

          {/* Content */}
          {items.length === 0 ? (
            // Empty State
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mb-4">
                <ShoppingBag size={32} className="text-charcoal/40" />
              </div>
              <h3 className="text-lg font-serif text-charcoal mb-2">Your bag is empty</h3>
              <p className="text-sm text-charcoal/60 mb-6">
                Discover our curated collection of premium products
              </p>
              <a
                href="/shop"
                onClick={() => toggleCart()}
                className="inline-block px-6 py-2 bg-charcoal text-cream rounded-lg text-sm font-medium hover:bg-charcoal-light transition-colors"
              >
                Start Shopping
              </a>
            </div>
          ) : (
            <>
              {/* Shipping Progress Bar */}
              <div className="px-6 py-4 border-b border-border">
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-charcoal/70">Free shipping threshold</span>
                    <span className="text-charcoal/70">€50</span>
                  </div>
                  <div className="w-full bg-cream-dark rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        subtotal >= 50 ? 'bg-sage' : 'bg-blush'
                      }`}
                      style={{
                        width: `${Math.min((subtotal / 50) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
                {subtotal >= 50 ? (
                  <p className="text-xs text-sage font-medium">
                    You qualified for free shipping!
                  </p>
                ) : (
                  <p className="text-xs text-charcoal/60">
                    Add €{(50 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-border/50 last:border-b-0"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-lg flex-shrink-0 overflow-hidden bg-gradient-to-br from-cream-dark to-cream">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-charcoal/20">
                          <ShoppingBag size={24} />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-charcoal line-clamp-2">
                          {item.name}
                        </h3>
                        {item.color && (
                          <p className="text-xs text-charcoal/60 mt-1">{item.color}</p>
                        )}
                      </div>

                      {/* Price and Controls */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-charcoal">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-cream-dark rounded-lg p-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-border rounded transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} className="text-charcoal" />
                          </button>
                          <span className="text-xs font-medium text-charcoal w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-border rounded transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} className="text-charcoal" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 hover:bg-cream-dark rounded-lg transition-colors self-start"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} className="text-charcoal/60 hover:text-charcoal" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-border p-6 space-y-4">
                {/* Pricing */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-charcoal/70">
                    <span>Subtotal</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal/70">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-sage font-medium' : ''}>
                      {shipping === 0 ? 'FREE' : `€${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-charcoal pt-2 border-t border-border">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <a
                  href="/checkout"
                  onClick={() => toggleCart()}
                  className="block w-full bg-charcoal text-cream py-3 rounded-lg font-medium text-center hover:bg-charcoal-light transition-colors"
                >
                  Proceed to Checkout
                </a>

                {/* Security Text */}
                <p className="text-xs text-center text-charcoal/60">
                  🔒 Secure checkout • SSL encrypted
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
